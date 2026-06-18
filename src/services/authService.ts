import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone?: string;
  nascimento?: string;
  cidade?: string;
  token?: string;
};

export async function cadastrar(nome: string, email: string, senha: string) {
  const data = await apiRequest('/auth/cadastro', { method: 'POST', auth: false, body: { nome, email, senha } });
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('usuario', JSON.stringify(data));
  return data;
}

export async function login(email: string, senha: string) {
  const data = await apiRequest('/auth/login', { method: 'POST', auth: false, body: { email, senha } });
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('usuario', JSON.stringify(data));
  return data;
}

export async function getUsuarioLogado(): Promise<UsuarioLogado | null> {
  const raw = await AsyncStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
}

export async function carregarUsuarioDoBackend() {
  const data = await apiRequest('/auth/me');
  const token = await AsyncStorage.getItem('token');
  await AsyncStorage.setItem('usuario', JSON.stringify({ ...data, token }));
  return data;
}

export async function atualizarUsuarioLogado(dados: { nome: string; telefone?: string; nascimento?: string; cidade?: string; }) {
  const data = await apiRequest('/auth/me', { method: 'PUT', body: dados });
  const token = await AsyncStorage.getItem('token');
  await AsyncStorage.setItem('usuario', JSON.stringify({ ...data, token }));
  return data;
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('usuario');
}
