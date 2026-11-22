import { apiRequest, extrairLista } from './api';

export type Suporte = {
  id: number;
  assunto: string;
  mensagem: string;
  status: string;
  dataCriacao?: string;
  resposta?: string | null;
  dataResposta?: string | null;
  respondidoPor?: string | null;
  usuario?: { id: number; nome: string; email: string };
};

export async function enviarSuporte(assunto: string, mensagem: string): Promise<Suporte> {
  return await apiRequest('/suporte', { method: 'POST', body: { assunto, mensagem } });
}

export async function listarMeusSuportes(): Promise<Suporte[]> {
  const dados = await apiRequest('/suporte/meus');
  return extrairLista<Suporte>(dados);
}

export async function listarSuportes(status?: string): Promise<Suporte[]> {
  const filtro = status ? `?status=${encodeURIComponent(status)}` : '';
  const dados = await apiRequest(`/suporte${filtro}`);
  return extrairLista<Suporte>(dados);
}

export async function responderSuporte(
  id: number,
  resposta: string,
  status = 'RESPONDIDO',
): Promise<Suporte> {
  return await apiRequest(`/suporte/${id}`, {
    method: 'PUT',
    body: { resposta, status },
  });
}
