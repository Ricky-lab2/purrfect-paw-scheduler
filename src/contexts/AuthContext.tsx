import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

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
  species: string; // This will store the full species info like "dog", "reptile:snake", "other:ferret"
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
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  getUserPets: () => Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'ownerId'>) => Pet;
  updatePet: (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>) => boolean;
  deletePet: (id: string) => boolean;
  getPetById: (id: string) => Pet | null;
  calculatePetAge: (birthDate: string) => string;
  getUserAppointments: () => Appointment[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user from localStorage on initial render and check for auto-login
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const rememberLogin = localStorage.getItem("rememberLogin");
        
        if (storedUser && rememberLogin === "true") {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("rememberLogin");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, remember: boolean = true): Promise<boolean> => {
    // This is a mock authentication
    // In a real app, you would validate against a backend
    
    // Simple validation
    if (!email || !password) {
      return false;
    }
    
    // Mock users - in a real app, this would come from a backend
    const mockAdminCredentials = { email: "admin@example.com", password: "admin123" };
    const mockCustomerCredentials = { email: "customer@example.com", password: "customer123" };
    
    let isValid = false;
    let userData: User | null = null;
    
    if (email === mockAdminCredentials.email && password === mockAdminCredentials.password) {
      isValid = true;
      userData = {
        id: "admin-1",
        name: "Admin User",
        email: mockAdminCredentials.email,
        role: "admin"
      };
    } else if (email === mockCustomerCredentials.email && password === mockCustomerCredentials.password) {
      isValid = true;
      userData = {
        id: "customer-1",
        name: "John Doe",
        email: mockCustomerCredentials.email,
        role: "customer",
        phone: "555-123-4567",
        address: "123 Main St, Anytown, USA"
      };
    }
    
    // Also check registered users in localStorage
    if (!isValid) {
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const foundUser = registeredUsers.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        isValid = true;
        userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: "customer" // All registered users are customers
        };
      }
    }
    
    if (isValid && userData) {
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Store remember preference
      if (remember) {
        localStorage.setItem("rememberLogin", "true");
      } else {
        localStorage.removeItem("rememberLogin");
      }
      
      setUser(userData);
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simple validation
    if (!name || !email || !password) {
      return false;
    }
    
    // Check if email already exists in the predefined accounts
    if (
      email === "admin@example.com" || 
      email === "customer@example.com"
    ) {
      return false;
    }
    
    // Get existing registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    
    // Check if email already exists in registered users
    if (registeredUsers.some((user: any) => user.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: `customer-${Date.now()}`,
      name,
      email,
      password, // In a real app, this should be hashed
      role: "customer"
    };
    
    // Add to registered users
    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberLogin");
    setUser(null);
  };

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // If this is a registered user (not a mock user), update in registeredUsers as well
    if (user.id.startsWith('customer-') && user.id !== 'customer-1') {
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userIndex = registeredUsers.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        registeredUsers[userIndex] = { 
          ...registeredUsers[userIndex], 
          ...updates,
          // Don't override the password if it's not provided in the updates
          password: registeredUsers[userIndex].password 
        };
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      }
    }
    
    setUser(updatedUser);
  };

  // Memoize pet management functions
  const getUserPets = useCallback((): Pet[] => {
    if (!user) return [];
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    return allPets.filter((pet: Pet) => pet.ownerId === user.id);
  }, [user?.id]);

  const addPet = useCallback((pet: Omit<Pet, 'id' | 'ownerId'>): Pet => {
    if (!user) throw new Error("User not authenticated");
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    const newPet: Pet = {
      ...pet,
      id: `pet-${Date.now()}`,
      ownerId: user.id,
    };
    
    allPets.push(newPet);
    localStorage.setItem("pets", JSON.stringify(allPets));
    
    return newPet;
  }, [user?.id]);

  const updatePet = useCallback((id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>): boolean => {
    if (!user) return false;
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    const petIndex = allPets.findIndex((p: Pet) => p.id === id && p.ownerId === user.id);
    
    if (petIndex !== -1) {
      allPets[petIndex] = { ...allPets[petIndex], ...updates };
      localStorage.setItem("pets", JSON.stringify(allPets));
      return true;
    }
    
    return false;
  }, [user?.id]);

  const deletePet = useCallback((id: string): boolean => {
    if (!user) return false;
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    const filteredPets = allPets.filter((p: Pet) => !(p.id === id && p.ownerId === user.id));
    
    if (filteredPets.length !== allPets.length) {
      localStorage.setItem("pets", JSON.stringify(filteredPets));
      return true;
    }
    
    return false;
  }, [user?.id]);
  
  // Get pet by ID
  const getPetById = useCallback((id: string): Pet | null => {
    if (!user) return null;
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    return allPets.find((pet: Pet) => pet.id === id && pet.ownerId === user.id) || null;
  }, [user?.id]);
  
  // Calculate pet age from birthDate
  const calculatePetAge = useCallback((birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    // Adjust years if the current month is before the birth month
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    // Calculate remaining months
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

  // Memoize appointment management functions
  const getUserAppointments = useCallback((): Appointment[] => {
    if (!user) return [];
    
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    return allAppointments.filter((appointment: Appointment) => appointment.ownerId === user.id);
  }, [user?.id]);

  const isAuthenticated = user !== null;
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
