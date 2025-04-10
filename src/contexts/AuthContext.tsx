
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Define the pet type
interface Pet {
  name: string;
  gender: "male" | "female";
  birthDate?: string;
  age?: string;
  type: "dog" | "cat" | "bird" | "other";
}

// Define the user types
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  pets?: Pet[];
}

interface User {
  id: string;
  email: string;
  role: "admin" | "customer";
  userInfo: UserInfo;
  // Add this property to fix the type errors
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string, role: "admin" | "customer") => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  addPet: (pet: Pet) => void;
  updatePet: (index: number, pet: Partial<Pet>) => void;
}

// Mock users for demonstration
const mockUsers = [
  {
    id: "admin1",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
    userInfo: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "09123456789",
    },
    // Add name property to match User interface
    name: "Admin User"
  },
  {
    id: "customer1",
    email: "customer@example.com",
    password: "customer123",
    role: "customer" as const,
    userInfo: {
      name: "Customer User",
      email: "customer@example.com",
      phone: "09987654321",
      pets: [
        {
          name: "Buddy",
          gender: "male" as const,
          birthDate: "2022-03-15",
          type: "dog" as const
        }
      ]
    },
    // Add name property to match User interface
    name: "Customer User"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // On initial load, check for stored user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Save user to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  
  const login = async (email: string, password: string, role: "admin" | "customer"): Promise<boolean> => {
    // Find user with matching email and password
    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && 
             u.password === password &&
             u.role === role
    );
    
    if (foundUser) {
      // Create a copy without the password
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setUser(null);
  };
  
  const updateUserInfo = (info: Partial<UserInfo>) => {
    if (!user) return;
    
    // Update both userInfo and the top-level name property
    const updatedUser = {
      ...user,
      userInfo: {
        ...user.userInfo,
        ...info
      }
    };
    
    // If name is being updated in userInfo, update the top-level name property as well
    if (info.name) {
      updatedUser.name = info.name;
    }
    
    setUser(updatedUser);
  };
  
  const addPet = (pet: Pet) => {
    if (!user) return;
    
    const updatedPets = user.userInfo.pets ? [...user.userInfo.pets, pet] : [pet];
    
    setUser({
      ...user,
      userInfo: {
        ...user.userInfo,
        pets: updatedPets
      }
    });
  };
  
  const updatePet = (index: number, pet: Partial<Pet>) => {
    if (!user || !user.userInfo.pets) return;
    
    const updatedPets = [...user.userInfo.pets];
    updatedPets[index] = {
      ...updatedPets[index],
      ...pet
    };
    
    setUser({
      ...user,
      userInfo: {
        ...user.userInfo,
        pets: updatedPets
      }
    });
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!user, 
        isAdmin: user?.role === 'admin',
        user,
        login,
        logout,
        updateUserInfo,
        addPet,
        updatePet
      }}
    >
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
