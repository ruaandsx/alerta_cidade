import { apiRequest, extrairLista } from './api';

export type CategoriaOcorrencia =
  | 'ILUMINACAO'
  | 'SAUDE_PUBLICA'
  | 'TRANSITO'
  | 'INFRAESTRUTURA'
  | 'LIMPEZA'
  | 'OUTROS';

export type UrgenciaOcorrencia = 'BAIXA' | 'MEDIA' | 'ALTA';

export type StatusOcorrencia = 'RECEBIDO' | 'EM_ANALISE' | 'EM_ANDAMENTO' | 'RESOLVIDO';

export type UsuarioResumo = {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone?: string | null;
  cidade?: string | null;
};

export type HistoricoOcorrencia = {
  id: number;
  statusAnterior?: StatusOcorrencia | null;
  statusNovo?: StatusOcorrencia | null;
  statusAnteriorLabel?: string | null;
  statusNovoLabel?: string | null;
  observacao?: string | null;
  usuarioId?: number | null;
  usuarioNome?: string | null;
  dataCriacao?: string;
};

export type Ocorrencia = {
  id?: number;
  protocolo?: string;
  categoria: CategoriaOcorrencia;
  categoriaLabel?: string;
  descricao: string;
  rua?: string;
  bairro?: string;
  referencia?: string;
  latitude?: number | null;
  longitude?: number | null;
  urgencia: UrgenciaOcorrencia;
  urgenciaLabel?: string;
  status?: StatusOcorrencia;
  statusLabel?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
  usuario?: UsuarioResumo;
  usuarioId?: number;
  usuarioNome?: string;
  temImagem?: boolean;
  imagemUrl?: string | null;
  imagemBase64?: string | null;
  imagemContentType?: string;
  totalComentarios?: number;
  historico?: HistoricoOcorrencia[];
};

export type OcorrenciaPayload = {
  categoria: CategoriaOcorrencia;
  descricao: string;
  rua?: string;
  bairro?: string;
  referencia?: string;
  latitude?: number;
  longitude?: number;
  urgencia: UrgenciaOcorrencia;
  imagemBase64?: string;
};

export type FiltroOcorrencias = {
  status?: StatusOcorrencia;
  categoria?: CategoriaOcorrencia;
  urgencia?: UrgenciaOcorrencia;
  bairro?: string;
  busca?: string;
  page?: number;
  size?: number;
};

export type Comentario = {
  id?: number;
  texto: string;
  dataCriacao?: string;
  ocorrenciaId?: number;
  usuario?: UsuarioResumo;
};

export type Notificacao = {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  dataCriacao?: string;
  ocorrenciaId?: number | null;
  lida?: boolean;
};

export type Estatisticas = {
  total: number;
  porStatus: Record<string, number>;
  porCategoria: Record<string, number>;
  porUrgencia: Record<string, number>;
};

function queryString(filtros?: FiltroOcorrencias): string {
  if (!filtros) return '';

  const partes: string[] = [];

  (Object.keys(filtros) as (keyof FiltroOcorrencias)[]).forEach((chave) => {
    const valor = filtros[chave];

    if (valor === undefined || valor === null || valor === '') return;

    partes.push(`${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`);
  });

  return partes.length ? `?${partes.join('&')}` : '';
}

export async function listarOcorrencias(filtros?: FiltroOcorrencias): Promise<Ocorrencia[]> {
  const dados = await apiRequest(`/ocorrencias${queryString(filtros)}`);
  return extrairLista<Ocorrencia>(dados);
}

export async function listarMinhasOcorrencias(
  filtros?: FiltroOcorrencias,
): Promise<Ocorrencia[]> {
  const dados = await apiRequest(`/ocorrencias/minhas${queryString(filtros)}`);
  return extrairLista<Ocorrencia>(dados);
}

export async function buscarOcorrencia(
  id: number,
  incluirImagem = false,
): Promise<Ocorrencia> {
  return await apiRequest(`/ocorrencias/${id}?incluirImagem=${incluirImagem}`);
}

export async function criarOcorrencia(payload: OcorrenciaPayload): Promise<Ocorrencia> {
  return await apiRequest('/ocorrencias', { method: 'POST', body: payload });
}

export async function atualizarOcorrencia(
  id: number,
  payload: OcorrenciaPayload,
): Promise<Ocorrencia> {
  return await apiRequest(`/ocorrencias/${id}`, { method: 'PUT', body: payload });
}

export async function deletarOcorrencia(id: number): Promise<void> {
  await apiRequest(`/ocorrencias/${id}`, { method: 'DELETE' });
}

export async function atualizarStatusOcorrencia(
  id: number,
  status: StatusOcorrencia,
  observacao?: string,
): Promise<Ocorrencia> {
  return await apiRequest(`/ocorrencias/${id}/status`, {
    method: 'PUT',
    body: { status, observacao: observacao?.trim() || undefined },
  });
}

export async function listarComentarios(ocorrenciaId: number): Promise<Comentario[]> {
  const dados = await apiRequest(`/ocorrencias/${ocorrenciaId}/comentarios`);
  return extrairLista<Comentario>(dados);
}

export async function criarComentario(
  ocorrenciaId: number,
  texto: string,
): Promise<Comentario> {
  return await apiRequest(`/ocorrencias/${ocorrenciaId}/comentarios`, {
    method: 'POST',
    body: { texto },
  });
}

export async function deletarComentario(
  ocorrenciaId: number,
  comentarioId: number,
): Promise<void> {
  await apiRequest(`/ocorrencias/${ocorrenciaId}/comentarios/${comentarioId}`, {
    method: 'DELETE',
  });
}

export async function listarNotificacoes(todas = false): Promise<Notificacao[]> {
  const dados = await apiRequest(todas ? '/notificacoes/todas' : '/notificacoes');
  return extrairLista<Notificacao>(dados);
}

export async function contarNotificacoesNaoLidas(): Promise<number> {
  const dados = await apiRequest<{ naoLidas: number }>('/notificacoes/contador');
  return dados?.naoLidas ?? 0;
}

export async function marcarNotificacaoComoLida(id: number): Promise<Notificacao> {
  return await apiRequest(`/notificacoes/${id}/lida`, { method: 'PUT' });
}

export async function marcarNotificacoesComoLidas(): Promise<number> {
  const dados = await apiRequest<{ marcadas: number }>('/notificacoes/marcar-lidas', {
    method: 'PUT',
  });
  return dados?.marcadas ?? 0;
}

export async function deletarNotificacao(id: number): Promise<void> {
  await apiRequest(`/notificacoes/${id}`, { method: 'DELETE' });
}

export async function obterEstatisticas(): Promise<Estatisticas> {
  return await apiRequest('/ocorrencias/estatisticas');
}

export async function obterMinhasEstatisticas(): Promise<Estatisticas> {
  return await apiRequest('/ocorrencias/minhas/estatisticas');
}

/* -------------------------------------------------------------------------- */
/* Rótulos auxiliares                                                         */
/* -------------------------------------------------------------------------- */

export const ROTULO_CATEGORIA: Record<string, string> = {
  ILUMINACAO: 'Iluminação pública',
  SAUDE_PUBLICA: 'Saúde pública',
  TRANSITO: 'Trânsito',
  INFRAESTRUTURA: 'Infraestrutura',
  LIMPEZA: 'Limpeza urbana',
  OUTROS: 'Outros',
};

export const EMOJI_CATEGORIA: Record<string, string> = {
  ILUMINACAO: '💡',
  SAUDE_PUBLICA: '🏥',
  TRANSITO: '🚦',
  INFRAESTRUTURA: '🛣️',
  LIMPEZA: '🗑️',
  OUTROS: '📍',
};

export const ROTULO_STATUS: Record<string, string> = {
  RECEBIDO: 'Recebida',
  EM_ANALISE: 'Em análise',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDO: 'Resolvida',
};

export const ROTULO_URGENCIA: Record<string, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
};

export const COR_STATUS: Record<string, string> = {
  RECEBIDO: '#2563eb',
  EM_ANALISE: '#d97706',
  EM_ANDAMENTO: '#7c3aed',
  RESOLVIDO: '#16a34a',
};

export const COR_URGENCIA: Record<string, string> = {
  BAIXA: '#22c55e',
  MEDIA: '#f59e0b',
  ALTA: '#ef4444',
};

export function tituloCategoria(categoria?: string): string {
  return ROTULO_CATEGORIA[categoria || ''] || 'Ocorrência';
}

export function emojiCategoria(categoria?: string): string {
  return EMOJI_CATEGORIA[categoria || ''] || '📍';
}

export function rotuloStatus(status?: string): string {
  return ROTULO_STATUS[status || ''] || 'Recebida';
}

export function rotuloUrgencia(urgencia?: string): string {
  return ROTULO_URGENCIA[urgencia || ''] || 'Baixa';
}

export function corStatus(status?: string): string {
  return COR_STATUS[status || ''] || '#2563eb';
}

export function corUrgencia(urgencia?: string): string {
  return COR_URGENCIA[urgencia || ''] || '#22c55e';
}

export function enderecoOcorrencia(item: Ocorrencia): string {
  const rua = item.rua?.trim() || '';
  const bairro = item.bairro && item.bairro !== 'Não informado' ? item.bairro.trim() : '';

  if (rua && bairro) return `${rua}, ${bairro}`;
  return rua || bairro || 'Endereço não informado';
}
