import { apiRequest } from './api';

export type Ocorrencia = {
  id?: number;
  categoria: 'ILUMINACAO' | 'SAUDE_PUBLICA' | 'TRANSITO' | 'INFRAESTRUTURA' | 'LIMPEZA' | 'OUTROS';
  descricao: string;
  rua: string;
  bairro: string;
  referencia?: string;
  urgencia: 'BAIXA' | 'MEDIA' | 'ALTA';
  status?: 'RECEBIDO' | 'EM_ANALISE' | 'RESOLVIDO';
  dataCriacao?: string;
  imagemBase64?: string;
  usuario?: { id: number; nome: string; email: string; role: string };
};

export type Comentario = {
  id?: number;
  texto: string;
  dataCriacao?: string;
  usuario?: { id: number; nome: string; email: string; role: string };
};

export async function listarOcorrencias(): Promise<Ocorrencia[]> { return await apiRequest('/ocorrencias'); }
export async function buscarOcorrencia(id: number): Promise<Ocorrencia> { return await apiRequest(`/ocorrencias/${id}`); }
export async function criarOcorrencia(ocorrencia: Ocorrencia): Promise<Ocorrencia> { return await apiRequest('/ocorrencias', { method: 'POST', body: ocorrencia }); }
export async function atualizarOcorrencia(id: number, ocorrencia: Ocorrencia): Promise<Ocorrencia> { return await apiRequest(`/ocorrencias/${id}`, { method: 'PUT', body: ocorrencia }); }
export async function deletarOcorrencia(id: number) { return await apiRequest(`/ocorrencias/${id}`, { method: 'DELETE' }); }
export async function atualizarStatusOcorrencia(id: number, status: 'RECEBIDO' | 'EM_ANALISE' | 'RESOLVIDO') { return await apiRequest(`/ocorrencias/${id}/status`, { method: 'PUT', body: { status } }); }
export async function listarComentarios(ocorrenciaId: number): Promise<Comentario[]> { return await apiRequest(`/ocorrencias/${ocorrenciaId}/comentarios`); }
export async function criarComentario(ocorrenciaId: number, texto: string): Promise<Comentario> { return await apiRequest(`/ocorrencias/${ocorrenciaId}/comentarios`, { method: 'POST', body: { texto } }); }
export async function listarNotificacoes() { return await apiRequest('/notificacoes'); }

export async function marcarNotificacoesComoLidas() {
  return await apiRequest('/notificacoes/marcar-lidas', {
    method: 'PUT',
  });
}