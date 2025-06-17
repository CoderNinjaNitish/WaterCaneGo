import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { storage } from '../utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = storage.get('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    storage.set('currentUser', user);
  };

  const logout = () => {
    setCurrentUser(null);
    storage.remove('currentUser');
  };

  const updateLocation = (location: User['location']) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, location };
      setCurrentUser(updatedUser);
      storage.set('currentUser', updatedUser);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    updateLocation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};