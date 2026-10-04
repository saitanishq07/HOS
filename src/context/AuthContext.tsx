import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const defaultAdminUser: User = {
  id: "user-1",
  name: "House of Seetah Admin",
  displayName: "House of Seetah Admin",
  email: "admin@houseofseetah.com",
  role: "Admin",
  mobile: "+91 98765 43210",
  status: "Active"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('hos_auth_user');
      return saved ? JSON.parse(saved) : defaultAdminUser;
    } catch {
      return defaultAdminUser;
    }
  });

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      if ((email === 'admin@houseofseetah.com' || email === 'billing@houseofseetah.com' || email === 'admin') && (pass === 'admin123' || pass === 'admin' || pass === 'seetah123' || pass === 'seetah2026')) {
        const loggedUser: User = {
          id: "user-1",
          name: "House of Seetah Admin",
          displayName: "House of Seetah Admin",
          email: "admin@houseofseetah.com",
          role: "Admin",
          mobile: "+91 98765 43210",
          status: "Active"
        };
        setUser(loggedUser);
        localStorage.setItem('hos_auth_user', JSON.stringify(loggedUser));
        return true;
      } else if (email === 'staff@houseofseetah.com' && (pass === 'staff123' || pass === 'staff')) {
        const loggedUser: User = {
          id: "user-2",
          name: "House of Seetah Staff",
          displayName: "House of Seetah Staff",
          email: "staff@houseofseetah.com",
          role: "Staff",
          mobile: "+91 98765 43210",
          status: "Active"
        };
        setUser(loggedUser);
        localStorage.setItem('hos_auth_user', JSON.stringify(loggedUser));
        return true;
      }
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hos_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
