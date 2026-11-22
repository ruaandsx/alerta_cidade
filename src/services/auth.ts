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
  dataCriacao?: string;
  token?: string;
};

export type RespostaLogin = {
  token: string;
  tipo?: string;
  id: number;
  nome: string;
  email: string;
  role: string;
};

function normalizarRespostaAuth(data: any, tokenRecebido?: string): UsuarioLogado {
  const token = tokenRecebido || data?.token;
  const base = data?.usuario ? data.usuario : data;

  return {
    id: base?.id,
    nome: base?.nome || 'Usuário',
    email: base?.email || '',
    role: base?.role || 'USER',
    telefone: base?.telefone ?? null,
    nascimento: base?.nascimento ?? null,
    cidade: base?.cidade ?? null,
    dataCriacao: base?.dataCriacao,
    token,
  };
}

async function salvarSessao(data: any, tokenRecebido?: string) {
  const usuario = normalizarRespostaAuth(data, tokenRecebido);
  const token = usuario.token;

  if (!token) {
    throw new Error('Token não recebido pelo backend.');
  }

  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

  return usuario;
}

export async function cadastrar(
  nome: string,
  email: string,
  senha: string,
  telefone?: string,
  cidade?: string,
): Promise<UsuarioLogado> {
  const data = await apiRequest<RespostaLogin>('/auth/cadastro', {
    method: 'POST',
    auth: false,
    body: { nome, email, senha, telefone, cidade },
  });

  return await salvarSessao(data);
}

export async function login(email: string, senha: string): Promise<UsuarioLogado> {
  const data = await apiRequest<RespostaLogin>('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, senha },
  });

  return await salvarSessao(data);
}

export async function getUsuarioLogado(): Promise<UsuarioLogado | null> {
  try {
    const raw = await AsyncStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function carregarUsuarioDoBackend(): Promise<UsuarioLogado> {
  const data = await apiRequest<any>('/auth/me');
  const token = (await AsyncStorage.getItem('token')) || undefined;

  const usuario = normalizarRespostaAuth(data, token);
  await AsyncStorage.setItem('usuario', JSON.stringify({ ...data, ...usuario, token }));

  return { ...usuario, ...data, token };
}

export async function atualizarUsuarioLogado(dados: {
  nome: string;
  telefone?: string;
  nascimento?: string;
  cidade?: string;
}): Promise<UsuarioLogado> {
  const data = await apiRequest<any>('/auth/me', {
    method: 'PUT',
    body: dados,
  });

  const token = (await AsyncStorage.getItem('token')) || undefined;
  const usuario = normalizarRespostaAuth(data, token);

  await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

  return usuario;
}

export async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
  await apiRequest('/auth/me/senha', {
    method: 'PUT',
    body: { senhaAtual, novaSenha },
  });
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('usuario');
}

export async function estaLogado(): Promise<boolean> {
  const token = await AsyncStorage.getItem('token');
  return !!token;
}
