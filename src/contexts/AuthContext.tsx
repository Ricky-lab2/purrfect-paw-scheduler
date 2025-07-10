
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthUser, Pet } from '@/types/auth';
import { getUserAppointmentsFromSupabase } from '@/utils/supabaseAppointments';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<void>;
  getUserPets: () => Pet[];
  addPet: (petData: Omit<Pet, 'id' | 'ownerId'>) => Promise<void>;
  updatePet: (petId: string, petData: Partial<Pet>) => Promise<void>;
  deletePet: (petId: string) => Promise<boolean>;
  calculatePetAge: (birthDate: string) => string;
  refreshUserData: () => Promise<void>;
  getUserAppointments: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Memoize computed values to prevent unnecessary recalculations
  const isAuthenticated = useMemo(() => !!user, [user]);
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  // Memoize pet age calculation function
  const calculatePetAge = useCallback((birthDate: string): string => {
    if (!birthDate) return 'Unknown';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      }
      return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting login process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log('Login successful, user:', data.user);
        // Don't call fetchUserProfile here as it will be handled by onAuthStateChange
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login catch error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const signup = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'customer',
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Signup successful!",
          description: "You have successfully signed up. Welcome!",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateProfile = useCallback(async (profileData: Partial<AuthUser>) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      // Optimistically update the local state
      setUser(prevUser => ({ ...prevUser!, ...profileData }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const addPet = useCallback(async (petData: Omit<Pet, 'id' | 'ownerId'>) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from('pets')
        .insert([{ 
          name: petData.name,
          type: petData.type,
          species: petData.species,
          breed: petData.breed || '',
          weight: petData.weight || '',
          gender: petData.gender,
          birth_date: petData.birthDate,
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const newPet: Pet = {
        id: data.id,
        name: data.name,
        type: data.type,
        species: data.species,
        breed: data.breed || '',
        weight: data.weight || '',
        gender: data.gender as "male" | "female",
        birthDate: data.birth_date,
        ownerId: user.id
      };

      setUser(prevUser => ({
        ...prevUser!,
        pets: [...(prevUser?.pets || []), newPet],
      }));

      toast({
        title: "Pet added",
        description: `${petData.name} has been added to your profile.`,
      });
    } catch (error: any) {
      console.error('Add pet error:', error);
      toast({
        title: "Failed to add pet",
        description: error.message || "Could not add pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const updatePet = useCallback(async (petId: string, petData: Partial<Pet>) => {
    try {
      setIsLoading(true);
      const updateData: any = { ...petData };
      if (petData.birthDate) {
        updateData.birth_date = petData.birthDate;
        delete updateData.birthDate;
      }

      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', petId)
        .select()
        .single();

      if (error) throw error;

      setUser(prevUser => {
        if (!prevUser) return prevUser;
        const updatedPets = prevUser.pets.map(pet =>
          pet.id === petId ? { ...pet, ...petData } : pet
        );
        return { ...prevUser, pets: updatedPets };
      });

      toast({
        title: "Pet updated",
        description: "Pet details have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Update pet error:', error);
      toast({
        title: "Failed to update pet",
        description: error.message || "Could not update pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deletePet = useCallback(async (petId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      setUser(prevUser => {
        if (!prevUser) return prevUser;
        const updatedPets = prevUser.pets.filter(pet => pet.id !== petId);
        return { ...prevUser, pets: updatedPets };
      });

      return true;
    } catch (error: any) {
      console.error('Delete pet error:', error);
      toast({
        title: "Failed to delete pet",
        description: error.message || "Could not delete pet. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getUserAppointments = useCallback(async () => {
    try {
      const appointments = await getUserAppointmentsFromSupabase();
      return appointments.map(apt => ({
        id: apt.id,
        petName: apt.pet_name,
        service: apt.service,
        date: apt.appointment_date,
        timeSlot: apt.time_slot,
        ownerName: apt.owner_name,
        ownerId: apt.owner_id,
        status: apt.status
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }, []);

  const fetchUserProfile = useCallback(async (authUser: User) => {
    try {
      console.log('Fetching profile for user:', authUser.id);
      
      // First try to get the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      console.log('Profile data:', profile);

      // Fetch pets
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', authUser.id);

      if (petsError) {
        console.error('Error fetching pets:', petsError);
      }

      // Fetch appointments
      let appointments = [];
      try {
        appointments = await getUserAppointmentsFromSupabase();
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }

      const userData: AuthUser = {
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.name || authUser.user_metadata?.name || 'User',
        role: (profile?.role as 'customer' | 'admin') || 'customer',
        phone: profile?.phone || '',
        address: profile?.address || '',
        pets: pets?.map(pet => ({
          id: pet.id,
          name: pet.name,
          type: pet.type,
          species: pet.species,
          breed: pet.breed || '',
          weight: pet.weight || '',
          gender: pet.gender as "male" | "female",
          birthDate: pet.birth_date,
          ownerId: pet.owner_id
        })) || [],
        appointments: appointments || []
      };

      console.log('Setting user data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Set minimal user data even if profile fetch fails
      const userData: AuthUser = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || 'User',
        role: 'customer',
        phone: '',
        address: '',
        pets: [],
        appointments: []
      };
      setUser(userData);
    }
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await fetchUserProfile(authUser);
      }
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        
        if (session?.user && mounted) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    getUserPets: () => user?.pets || [],
    addPet,
    updatePet,
    deletePet,
    calculatePetAge,
    refreshUserData,
    getUserAppointments
  }), [user, isAuthenticated, isAdmin, isLoading, login, signup, logout, updateProfile, addPet, updatePet, deletePet, calculatePetAge, refreshUserData, getUserAppointments]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
