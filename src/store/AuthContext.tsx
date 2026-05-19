import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../services/auth';
import { User } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, city: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, city: string) => {
    const { user } = await authService.register(name, email, password, city);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
