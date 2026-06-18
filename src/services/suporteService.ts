import { apiRequest } from './api';

export async function enviarSuporte(assunto: string, mensagem: string) {
  return await apiRequest('/suporte', { method: 'POST', body: { assunto, mensagem } });
}

export async function listarMeusSuportes() {
  return await apiRequest('/suporte/meus');
}
