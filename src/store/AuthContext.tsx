import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  login as loginApi,
  cadastrar,
  logout as logoutApi,
  UsuarioLogado,
} from '../services/auth';

interface AuthContextData {
  user: UsuarioLogado | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<UsuarioLogado>;
  register: (nome: string, email: string, senha: string, cidade?: string) => Promise<UsuarioLogado>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioLogado | null>(null);
  const [loading] = useState(false);

  const login = async (email: string, senha: string) => {
    const usuario = await loginApi(email, senha);
    setUser(usuario);
    return usuario;
  };

  const register = async (nome: string, email: string, senha: string, cidade?: string) => {
    const usuario = await cadastrar(nome, email, senha, undefined, cidade);
    setUser(usuario);
    return usuario;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
