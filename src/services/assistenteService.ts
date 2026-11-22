import { apiRequest, extrairLista } from './api';

export type RespostaAssistente = {
  resposta: string;
  /** LLM = respondida pela IA; FAQ = base de conhecimento; SEM_RESPOSTA = não encontrada. */
  origem: 'LLM' | 'FAQ' | 'SEM_RESPOSTA' | string;
  pontuacao?: number;
  faqRelacionada?: string | null;
  sugestoes?: string[];
  dataHora?: string;
};

export type InteracaoAssistente = {
  pergunta: string;
  resposta: string;
  origem: string;
  dataHora?: string;
};

export type StatusAssistente = {
  iaDisponivel: boolean;
  motor: string;
};

export type EstatisticasAssistente = {
  totalPerguntas: number;
  porOrigem: Record<string, number>;
  semRespostaRecentes: string[];
};

export async function statusAssistente(): Promise<StatusAssistente> {
  return await apiRequest('/assistente/status');
}

export async function sugestoesAssistente(): Promise<string[]> {
  const dados = await apiRequest('/assistente/sugestoes');
  return extrairLista<string>(dados);
}

export async function perguntarAssistente(pergunta: string): Promise<RespostaAssistente> {
  return await apiRequest('/assistente/perguntas', {
    method: 'POST',
    body: { pergunta },
  });
}

export async function historicoAssistente(): Promise<InteracaoAssistente[]> {
  const dados = await apiRequest('/assistente/historico');
  return extrairLista<InteracaoAssistente>(dados);
}

export async function estatisticasAssistente(): Promise<EstatisticasAssistente> {
  return await apiRequest('/assistente/estatisticas');
}
