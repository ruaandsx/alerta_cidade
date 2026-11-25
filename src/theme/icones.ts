import Ionicons from '@expo/vector-icons/Ionicons';

import type {
  CategoriaOcorrencia,
  StatusOcorrencia,
  UrgenciaOcorrencia,
} from '../services/ocorrenciaService';

/**
 * Uma única família de ícones: Ionicons (@expo/vector-icons).
 *
 * Escolha: já vem com o Expo, tem versão de contorno e preenchida (o que
 * resolve o estado ativo/inativo da barra inferior) e cobre todas as ações
 * do app sem carregar fonte extra.
 *
 * Regra: a cor nunca é a única informação. Todo selo tem ícone + texto.
 */
export type NomeIcone = keyof typeof Ionicons.glyphMap;

/** Categoria da ocorrência. */
export const ICONE_CATEGORIA: Record<CategoriaOcorrencia, NomeIcone> = {
  ILUMINACAO: 'bulb-outline',
  SAUDE_PUBLICA: 'medkit-outline',
  TRANSITO: 'car-outline',
  INFRAESTRUTURA: 'construct-outline',
  LIMPEZA: 'trash-outline',
  /** "Outros" usa alerta. O pino fica reservado para localização. */
  OUTROS: 'alert-circle-outline',
};

/** Status da ocorrência. */
export const ICONE_STATUS: Record<StatusOcorrencia, NomeIcone> = {
  RECEBIDO: 'mail-unread-outline',
  EM_ANALISE: 'search-outline',
  EM_ANDAMENTO: 'hammer-outline',
  RESOLVIDO: 'checkmark-circle-outline',
};

/** Urgência: nunca aparece sozinha, sempre com o rótulo. */
export const ICONE_URGENCIA: Record<UrgenciaOcorrencia, NomeIcone> = {
  BAIXA: 'chevron-down-circle-outline',
  MEDIA: 'remove-circle-outline',
  ALTA: 'alert-circle-outline',
};

/** Ícones fixos de navegação e de ações. */
export const ICONE = {
  assistente: 'chatbubble-ellipses-outline',
  assistenteAtivo: 'chatbubble-ellipses',
  notificacoes: 'notifications-outline',
  notificacoesAtivo: 'notifications',
  inicio: 'home-outline',
  inicioAtivo: 'home',
  ocorrencias: 'list-outline',
  ocorrenciasAtivo: 'list',
  usuarios: 'people-outline',
  usuariosAtivo: 'people',
  perfil: 'person-outline',
  perfilAtivo: 'person',
  adicionar: 'add',
  voltar: 'arrow-back',
  avancar: 'chevron-forward',
  menu: 'ellipsis-vertical',
  localizacao: 'location-outline',
  referencia: 'flag-outline',
  mapa: 'map-outline',
  enviar: 'send',
  busca: 'search-outline',
  atualizar: 'refresh-outline',
  excluir: 'trash-outline',
  editar: 'pencil-outline',
  sair: 'log-out-outline',
  escudo: 'shield-checkmark-outline',
  escudoAtivo: 'shield-checkmark',
  email: 'mail-outline',
  telefone: 'call-outline',
  cargo: 'briefcase-outline',
  departamento: 'business-outline',
  permissoes: 'key-outline',
  dados: 'person-circle-outline',
  historico: 'time-outline',
  ajuda: 'help-circle-outline',
  sobre: 'information-circle-outline',
  documento: 'document-text-outline',
  usuariosCard: 'people-outline',
  ocorrenciasCard: 'document-text-outline',
  resolvido: 'checkmark-done-outline',
  pendente: 'alert-circle-outline',
  vazio: 'file-tray-outline',
  erro: 'cloud-offline-outline',
  camera: 'camera-outline',
  fechar: 'close',
} as const satisfies Record<string, NomeIcone>;

/** Fallback seguro para categoria/status/urgência desconhecidos. */
export function iconeCategoria(categoria?: string): NomeIcone {
  return ICONE_CATEGORIA[categoria as CategoriaOcorrencia] || 'alert-circle-outline';
}

export function iconeStatus(status?: string): NomeIcone {
  return ICONE_STATUS[status as StatusOcorrencia] || 'mail-unread-outline';
}

export function iconeUrgencia(urgencia?: string): NomeIcone {
  return ICONE_URGENCIA[urgencia as UrgenciaOcorrencia] || 'remove-circle-outline';
}
