import { createContext, useContext, useState, useEffect } from 'react';

// Data types based on our analysis of the Blood Donor Companion records
export interface User {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  area: string;
  isAvailable: boolean;
  joinDate: string;
}

export interface DonationRecord {
  id: string;
  userId: string;
  date: string;
  location: string;
  volumeAmount: number; // in ml
  type: string; // Whole Blood, Platelets, Plasma
  isScheduled: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bdc_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bdc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bdc_user');
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
