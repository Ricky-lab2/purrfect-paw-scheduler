
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { User, Pet, Appointment } from "@/types/auth";
import { usePetManagement } from "@/hooks/usePetManagement";

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

  const petManagement = usePetManagement(user);

  // Initialize auth state
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          console.log("User session found, creating user profile");
          
          // Create user profile immediately from session data
          const userProfile: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'customer',
          };

          // Check if this is an admin user (based on email)
          if (session.user.email === 'admin@example.com') {
            userProfile.role = 'admin';
          }

          console.log("Setting user profile:", userProfile);
          setUser(userProfile);

          // Try to fetch/create profile in database asynchronously (don't block login)
          setTimeout(async () => {
            try {
              console.log("Attempting to fetch profile from database");
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profile && !error) {
                console.log("Profile found in database, updating user:", profile);
                setUser({
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as "admin" | "customer",
                  phone: profile.phone,
                  address: profile.address,
                });
              } else {
                console.log("Profile not found, creating new profile");
                // Create profile in database
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: userProfile.id,
                    name: userProfile.name,
                    email: userProfile.email,
                    role: userProfile.role
                  });
                
                if (insertError) {
                  console.log("Profile creation error (may already exist):", insertError);
                } else {
                  console.log("Profile created successfully");
                }
              }
            } catch (error) {
              console.log("Profile fetch/create error:", error);
              // Don't block login for profile errors
            }
          }, 100);
        } else {
          console.log("No user session, clearing user state");
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }
        console.log("Initial session:", session?.user?.email);
        setSession(session);
        if (!session) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt for:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { user: data.user?.email, error: error?.message });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        console.log("Login successful for:", data.user.email);
        return true;
      }

      return false;
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

  const isAuthenticated = !!session && !!user;
  const isAdmin = user?.role === "admin";

  console.log("Auth context state:", { 
    isAuthenticated, 
    isAdmin, 
    isLoading, 
    userEmail: user?.email,
    sessionExists: !!session 
  });

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        signup, 
        logout,
        updateUserProfile,
        ...petManagement,
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
