
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone?: string;
  address?: string;
};

type Pet = {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "hamster" | "fish" | "reptile" | "other";
  species: string;
  breed?: string;
  weight?: string;
  birthDate: string;
  gender: "male" | "female";
  ownerId: string;
};

type Appointment = {
  id: string;
  petName: string;
  service: string;
  date: string;
  timeSlot: string;
  ownerName: string;
  ownerId: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  getUserPets: () => Promise<Pet[]>;
  addPet: (pet: Omit<Pet, 'id' | 'ownerId'>) => Promise<Pet>;
  updatePet: (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>) => Promise<boolean>;
  deletePet: (id: string) => Promise<boolean>;
  getPetById: (id: string) => Promise<Pet | null>;
  calculatePetAge: (birthDate: string) => string;
  getUserAppointments: () => Promise<Appointment[]>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile && !error) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as "admin" | "customer",
              phone: profile.phone,
              address: profile.address,
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Signup error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  // Pet management functions
  const getUserPets = useCallback(async (): Promise<Pet[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching pets:', error);
        return [];
      }

      return (data || []).map(pet => ({
        id: pet.id,
        name: pet.name,
        type: pet.type as Pet['type'],
        species: pet.species,
        breed: pet.breed,
        weight: pet.weight,
        birthDate: pet.birth_date,
        gender: pet.gender as Pet['gender'],
        ownerId: pet.owner_id
      }));
    } catch (error) {
      console.error('Error fetching pets:', error);
      return [];
    }
  }, [user?.id]);

  const addPet = useCallback(async (pet: Omit<Pet, 'id' | 'ownerId'>): Promise<Pet> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('pets')
      .insert({
        owner_id: user.id,
        name: pet.name,
        type: pet.type,
        species: pet.species,
        breed: pet.breed,
        weight: pet.weight,
        birth_date: pet.birthDate,
        gender: pet.gender,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding pet:', error);
      throw new Error("Failed to add pet");
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      species: data.species,
      breed: data.breed,
      weight: data.weight,
      birthDate: data.birth_date,
      gender: data.gender,
      ownerId: data.owner_id
    };
  }, [user?.id]);

  const updatePet = useCallback(async (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>): Promise<boolean> => {
    if (!user) return false;

    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.species) dbUpdates.species = updates.species;
    if (updates.breed !== undefined) dbUpdates.breed = updates.breed;
    if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
    if (updates.birthDate) dbUpdates.birth_date = updates.birthDate;
    if (updates.gender) dbUpdates.gender = updates.gender;

    const { error } = await supabase
      .from('pets')
      .update(dbUpdates)
      .eq('id', id)
      .eq('owner_id', user.id);

    return !error;
  }, [user?.id]);

  const deletePet = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    return !error;
  }, [user?.id]);

  const getPetById = useCallback(async (id: string): Promise<Pet | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      species: data.species,
      breed: data.breed,
      weight: data.weight,
      birthDate: data.birth_date,
      gender: data.gender,
      ownerId: data.owner_id
    };
  }, [user?.id]);

  const calculatePetAge = useCallback((birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    let remainingMonths = months;
    if (remainingMonths < 0) {
      remainingMonths += 12;
    }
    
    if (years < 1) {
      return remainingMonths === 1 ? "1 month" : `${remainingMonths} months`;
    } else if (remainingMonths === 0) {
      return years === 1 ? "1 year" : `${years} years`;
    } else {
      return `${years} ${years === 1 ? "year" : "years"} and ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
    }
  }, []);

  const getUserAppointments = useCallback(async (): Promise<Appointment[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }

      return (data || []).map(apt => ({
        id: apt.id,
        petName: apt.pet_name,
        service: apt.service,
        date: apt.appointment_date,
        timeSlot: apt.time_slot,
        ownerName: apt.owner_name,
        ownerId: apt.owner_id
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }, [user?.id]);

  const isAuthenticated = !!session && !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        signup, 
        logout,
        updateUserProfile,
        getUserPets,
        addPet,
        updatePet,
        deletePet,
        getPetById,
        calculatePetAge,
        getUserAppointments,
        isAuthenticated, 
        isAdmin,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
