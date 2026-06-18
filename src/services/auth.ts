import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone?: string | null;
  nascimento?: string | null;
  cidade?: string | null;
  token?: string;
};

function normalizarRespostaAuth(data: any): UsuarioLogado {
  const token = data?.token;
  const base = data?.usuario ? data.usuario : data;

  return {
    id: base?.id,
    nome: base?.nome || 'Usuário',
    email: base?.email || '',
    role: base?.role || 'USER',
    telefone: base?.telefone ?? null,
    nascimento: base?.nascimento ?? null,
    cidade: base?.cidade ?? null,
    token,
  };
}

async function salvarSessao(data: any) {
  const usuario = normalizarRespostaAuth(data);

  if (!usuario.token) {
    throw new Error('Token não recebido pelo backend.');
  }

  await AsyncStorage.setItem('token', usuario.token);
  await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

  return usuario;
}

export async function cadastrar(nome: string, email: string, senha: string) {
  const data = await apiRequest('/auth/cadastro', {
    method: 'POST',
    auth: false,
    body: { nome, email, senha },
  });

  return await salvarSessao(data);
}

export async function login(email: string, senha: string) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, senha },
  });

  return await salvarSessao(data);
}

export async function getUsuarioLogado(): Promise<UsuarioLogado | null> {
  const raw = await AsyncStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
}

export async function carregarUsuarioDoBackend() {
  const data = await apiRequest('/auth/me');
  const token = await AsyncStorage.getItem('token');

  const usuario = {
    ...data,
    role: data?.role || 'USER',
    token: token || undefined,
  };

  await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
  return usuario;
}

export async function atualizarUsuarioLogado(dados: {
  nome: string;
  telefone?: string;
  nascimento?: string;
  cidade?: string;
}) {
  const data = await apiRequest('/auth/me', {
    method: 'PUT',
    body: dados,
  });

  const token = await AsyncStorage.getItem('token');

  const usuario = {
    ...data,
    role: data?.role || 'USER',
    token: token || undefined,
  };

  await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
  return usuario;
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('usuario');
}

export async function estaLogado() {
  const token = await AsyncStorage.getItem('token');
  return !!token;
}