
import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};

type Pet = {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "other";
  breed?: string;
  birthDate: string;
  gender: "male" | "female";
  ownerId: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  getUserPets: () => Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'ownerId'>) => Pet;
  updatePet: (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>) => boolean;
  deletePet: (id: string) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
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
        role: "customer"
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

  // Pet management functions
  const getUserPets = (): Pet[] => {
    if (!user) return [];
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    return allPets.filter((pet: Pet) => pet.ownerId === user.id);
  };

  const addPet = (pet: Omit<Pet, 'id' | 'ownerId'>): Pet => {
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
  };

  const updatePet = (id: string, updates: Partial<Omit<Pet, 'id' | 'ownerId'>>): boolean => {
    if (!user) return false;
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    const petIndex = allPets.findIndex((p: Pet) => p.id === id && p.ownerId === user.id);
    
    if (petIndex !== -1) {
      allPets[petIndex] = { ...allPets[petIndex], ...updates };
      localStorage.setItem("pets", JSON.stringify(allPets));
      return true;
    }
    
    return false;
  };

  const deletePet = (id: string): boolean => {
    if (!user) return false;
    
    const allPets = JSON.parse(localStorage.getItem("pets") || "[]");
    const filteredPets = allPets.filter((p: Pet) => !(p.id === id && p.ownerId === user.id));
    
    if (filteredPets.length !== allPets.length) {
      localStorage.setItem("pets", JSON.stringify(filteredPets));
      return true;
    }
    
    return false;
  };

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
        isAuthenticated, 
        isAdmin 
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
