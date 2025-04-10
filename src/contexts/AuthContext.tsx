
import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: "admin" | "customer") => Promise<boolean>;
  logout: () => void;
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

  const login = async (email: string, password: string, role: "admin" | "customer"): Promise<boolean> => {
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
    
    if (role === "admin" && email === mockAdminCredentials.email && password === mockAdminCredentials.password) {
      isValid = true;
      userData = {
        id: "admin-1",
        name: "Admin User",
        email: mockAdminCredentials.email,
        role: "admin"
      };
    } else if (role === "customer" && email === mockCustomerCredentials.email && password === mockCustomerCredentials.password) {
      isValid = true;
      userData = {
        id: "customer-1",
        name: "John Doe",
        email: mockCustomerCredentials.email,
        role: "customer"
      };
    }
    
    if (isValid && userData) {
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
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
