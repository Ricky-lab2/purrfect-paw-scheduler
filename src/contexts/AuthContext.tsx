
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { getUserAppointmentsFromSupabase } from '@/utils/supabaseAppointments';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
}

interface Pet {
  id: string;
  name: string;
  type: string;
  species: string;
  breed?: string;
  weight?: string;
  birthDate: string;
  gender: 'male' | 'female';
  ownerId: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  updateUserProfile: (updates: Partial<AuthUser>) => Promise<void>;
  getUserPets: () => Promise<Pet[]>;
  addPet: (pet: Omit<Pet, 'id' | 'ownerId'>) => Promise<Pet>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<boolean>;
  getUserAppointments: () => Promise<any[]>;
  calculatePetAge: (birthDate: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      console.log('Attempting to fetch profile from database');
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (profile) {
        console.log('Profile exists in database');
        const userData: AuthUser = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          role: profile.role as 'customer' | 'admin'
        };
        console.log('Full profile loaded:', userData);
        setUser(userData);
      } else {
        console.log('Profile not found, creating new profile');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            name: 'User',
            email: userEmail,
            role: 'customer'
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        if (newProfile) {
          const userData: AuthUser = {
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            phone: newProfile.phone,
            address: newProfile.address,
            role: newProfile.role as 'customer' | 'admin'
          };
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      const fallbackUser: AuthUser = {
        id: userId,
        name: 'User',
        email: userEmail,
        role: 'customer'
      };
      setUser(fallbackUser);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email!);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email!);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    setUser({ ...user, ...updates });
  };

  const updateUserProfile = async (updates: Partial<AuthUser>) => {
    await updateProfile(updates);
  };

  const getUserPets = async (): Promise<Pet[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pets:', error);
        throw error;
      }

      return data?.map(pet => ({
        id: pet.id,
        name: pet.name,
        type: pet.type,
        species: pet.species,
        breed: pet.breed || undefined,
        weight: pet.weight || undefined,
        birthDate: pet.birth_date,
        gender: pet.gender as 'male' | 'female',
        ownerId: pet.owner_id
      })) || [];
    } catch (error) {
      console.error('Error in getUserPets:', error);
      return [];
    }
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'ownerId'>): Promise<Pet> => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('pets')
      .insert([{
        owner_id: user.id,
        name: petData.name,
        type: petData.type,
        species: petData.species,
        breed: petData.breed || null,
        weight: petData.weight || null,
        birth_date: petData.birthDate,
        gender: petData.gender
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      species: data.species,
      breed: data.breed || undefined,
      weight: data.weight || undefined,
      birthDate: data.birth_date,
      gender: data.gender as 'male' | 'female',
      ownerId: data.owner_id
    };
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    if (!user) throw new Error('No user logged in');

    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.type) updateData.type = updates.type;
    if (updates.species) updateData.species = updates.species;
    if (updates.breed !== undefined) updateData.breed = updates.breed || null;
    if (updates.weight !== undefined) updateData.weight = updates.weight || null;
    if (updates.birthDate) updateData.birth_date = updates.birthDate;
    if (updates.gender) updateData.gender = updates.gender;

    const { error } = await supabase
      .from('pets')
      .update(updateData)
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) throw error;
  };

  const deletePet = async (id: string): Promise<boolean> => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting pet:', error);
      return false;
    }
  };

  const getUserAppointments = async () => {
    try {
      return await getUserAppointmentsFromSupabase();
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return [];
    }
  };

  const calculatePetAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMilliseconds = today.getTime() - birth.getTime();
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    const ageInMonths = Math.floor((ageInMilliseconds % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageInYears > 0) {
      return `${ageInYears} year${ageInYears > 1 ? 's' : ''}`;
    } else {
      return `${ageInMonths} month${ageInMonths > 1 ? 's' : ''}`;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          console.log('Auth state change: SIGNED_IN', initialSession.user.email);
          console.log('User session found, creating user profile');
          
          const tempUser: AuthUser = {
            id: initialSession.user.id,
            name: initialSession.user.user_metadata?.name || 'customer',
            email: initialSession.user.email!,
            role: 'customer'
          };
          
          console.log('Setting user profile:', tempUser);
          setUser(tempUser);
          setSession(initialSession);
          
          const authState = {
            isAuthenticated: true,
            isAdmin: tempUser.role === 'admin',
            isLoading: false,
            userEmail: tempUser.email,
            sessionExists: true
          };
          console.log('Auth context state:', authState);
          
          await fetchUserProfile(initialSession.user.id, initialSession.user.email!);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User session found, creating user profile');
        
        const tempUser: AuthUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'customer',
          email: session.user.email!,
          role: 'customer'
        };
        
        console.log('Setting user profile:', tempUser);
        setUser(tempUser);
        setSession(session);
        
        const authState = {
          isAuthenticated: true,
          isAdmin: tempUser.role === 'admin',
          isLoading: false,
          userEmail: tempUser.email,
          sessionExists: true
        };
        console.log('Auth context state:', authState);
        
        await fetchUserProfile(session.user.id, session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    updateUserProfile,
    getUserPets,
    addPet,
    updatePet,
    deletePet,
    getUserAppointments,
    calculatePetAge,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
