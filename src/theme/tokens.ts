import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Tokens do Observa Cidade.
 *
 * Regra: nenhum hexadecimal, tamanho de fonte, raio ou espaçamento solto
 * fora deste arquivo. As telas importam daqui.
 *
 * Contraste calculado pela fórmula do WCAG 2.1:
 *   (L1 + 0,05) / (L2 + 0,05), L = 0,2126R + 0,7152G + 0,0722B (linearizado)
 */

// ── Cores ─────────────────────────────────────────────────────────────────────

export const cores = {
  marca: {
    /** #1565c0 — 5,75:1 sobre superficie. Botão primário, links, item ativo. */
    azul: '#1565c0',
    /** #0d47a1 — 8,63:1 sobre superficie. Texto sobre superficie-azul, pressed. */
    azulEscuro: '#0d47a1',
    /** #c8860a — 3,06:1. Só texto grande (>= 24 px) ou decorativo. */
    dourado: '#c8860a',
    /** #8a5a00 — 5,93:1. Dourado para texto pequeno. */
    douradoTexto: '#8a5a00',
    /** #7ec8e3 — fundo do splash, do ícone e da abertura. */
    agua: '#7ec8e3',
  },

  superficie: {
    /** #ffffff — fundo padrão de tela e card. */
    base: '#ffffff',
    /** #f8fafc — pressed de card, fundo de linha. */
    suave: '#f8fafc',
    /** #f1f5f9 — chip não selecionado, botão de ícone, fundo de campo de chat. */
    media: '#f1f5f9',
    /** #e0f2fe — selecionado, destaque informativo, botão de mapa. */
    azul: '#e0f2fe',
    /** #f5f0dc — creme da abertura e das telas de sucesso. */
    destaque: '#f5f0dc',
  },

  texto: {
    /** #1a1a2e — 17,06:1. Texto principal e títulos. */
    principal: '#1a1a2e',
    /** #475569 — 7,58:1. Texto secundário, rótulo de campo. */
    secundario: '#475569',
    /** #64748b — 4,76:1. Placeholder e texto auxiliar. */
    placeholder: '#64748b',
    /** #ffffff — texto sobre marca-azul e sobre erro. */
    inverso: '#ffffff',
    /** #1a3a5c — 6,24:1 sobre marca-agua. Texto sobre o fundo da abertura. */
    sobreAgua: '#1a3a5c',
  },

  borda: {
    /** #e2e8f0 — 1,23:1. Divisória decorativa; nunca é a única indicação de campo. */
    suave: '#e2e8f0',
    /** #7a8798 — 3,65:1. Borda de campo e de card clicável (passa como gráfico). */
    forte: '#7a8798',
    /** #e8dfc0 — borda do creme, para o botão de destaque não sumir no branco. */
    destaque: '#e8dfc0',
  },

  /** Par de cores de cada status: fundo suave, texto 4,5:1+ e cor gráfica. */
  status: {
    recebido: { fundo: '#dbeafe', texto: '#1e3a8a', grafico: '#2563eb' },
    analise: { fundo: '#fef3c7', texto: '#78350f', grafico: '#d97706' },
    andamento: { fundo: '#ede9fe', texto: '#4c1d95', grafico: '#7c3aed' },
    resolvido: { fundo: '#dcfce7', texto: '#14532d', grafico: '#16a34a' },
  },

  /** Urgência usa texto e ícone nesta cor; o fundo é sempre superficie. */
  urgencia: {
    baixa: '#15803d',
    media: '#b45309',
    alta: '#b91c1c',
  },

  estado: {
    erroFundo: '#fee2e2',
    erroBorda: '#b91c1c',
    erroTexto: '#991b1b',
    sucessoFundo: '#dcfce7',
    sucessoTexto: '#14532d',
    sucessoGrafico: '#16a34a',
    avisoFundo: '#fef3c7',
    avisoTexto: '#78350f',
    avisoGrafico: '#d97706',
    desabilitadoFundo: '#e2e8f0',
    desabilitadoTexto: '#475569',
    desabilitadoBorda: '#cbd5e1',
  },
} as const;

// ── Contraste documentado (calculado, não estimado) ──────────────────────────

export const contraste = {
  'texto-principal/superficie': '17,1:1',
  'texto-secundario/superficie': '7,6:1',
  'texto-placeholder/superficie': '4,8:1',
  'texto-inverso/marca-azul': '5,8:1',
  'texto-inverso/marca-azul-escuro': '8,6:1',
  'marca-azul/superficie': '5,8:1',
  'marca-azul-escuro/superficie-azul': '7,5:1',
  'marca-dourado/superficie (só texto grande)': '3,1:1',
  'marca-dourado-texto/superficie': '5,9:1',
  'borda-forte/superficie': '3,7:1',
  'desabilitado-texto/desabilitado-fundo': '6,2:1',
  'erro-texto/erro-fundo': '6,8:1',
  'sucesso-texto/sucesso-fundo': '8,3:1',
  'aviso-texto/aviso-fundo': '8,2:1',
  'status-recebido': '8,5:1',
  'status-analise': '8,2:1',
  'status-andamento': '9,2:1',
  'status-resolvido': '8,3:1',
  'urgencia-baixa/superficie': '5,0:1',
  'urgencia-media/superficie': '5,0:1',
  'urgencia-alta/superficie': '6,5:1',
} as const;

// ── Espaçamento (base 4) ─────────────────────────────────────────────────────

export const espaco = {
  /** 4 — separação entre ícone e texto dentro de selo. */
  '1': 4,
  /** 8 — entre elementos irmãos, gap padrão. */
  '2': 8,
  /** 12 — dentro de card pequeno, entre rótulo e campo. */
  '3': 12,
  /** 16 — padding padrão de tela e de card. */
  '4': 16,
  /** 20 — entre blocos. */
  '5': 20,
  /** 24 — entre seções. */
  '6': 24,
  /** 32 — respiro de estado vazio. */
  '8': 32,
  /** 40 — topo de tela de entrada. */
  '10': 40,
  /** 48 — alvo de toque. */
  '12': 48,
  /** 64 — altura da barra inferior. */
  '16': 64,
} as const;

// ── Raios ────────────────────────────────────────────────────────────────────

export const raio = {
  /** 8 — campo pequeno, miniatura, canto de balão. */
  '1': 8,
  /** 12 — botão, campo, bloco de erro. */
  '2': 12,
  /** 16 — card, seletor, imagem. */
  '3': 16,
  /** 999 — selo, chip, botão redondo, avatar. */
  pill: 999,
} as const;

// ── Tipografia ───────────────────────────────────────────────────────────────

export type Peso = '400' | '600' | '700';

export type EstiloTexto = Pick<
  TextStyle,
  'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'
>;

const estilo = (
  fontSize: number,
  lineHeight: number,
  fontWeight: Peso,
  letterSpacing?: number,
): EstiloTexto => ({ fontSize, lineHeight, fontWeight, ...(letterSpacing ? { letterSpacing } : {}) });

export const tipografia = {
  /** 32/40/700 — número de destaque e marca grande. */
  display: estilo(32, 40, '700', -0.5),
  /** 28/34/700 — marca nas telas de entrada. */
  marca: estilo(28, 34, '700', -0.3),
  /** 24/32/700 — título de tela e valor de estatística. */
  tituloTela: estilo(24, 32, '700'),
  /** 20/28/600 — subtítulo de tela de entrada. */
  subtitulo: estilo(20, 28, '600'),
  /** 18/24/700 — título de seção e do header. */
  tituloSecao: estilo(18, 24, '700'),
  /** 16/24/400 — corpo de texto. */
  corpo: estilo(16, 24, '400'),
  /** 16/24/600 — corpo com ênfase, título de card. */
  corpoForte: estilo(16, 24, '600'),
  /** 16/20/600 — rótulo de botão. */
  botao: estilo(16, 20, '600'),
  /** 14/20/400 — texto auxiliar. */
  corpoPequeno: estilo(14, 20, '400'),
  /** 14/18/600 — rótulo de campo, chip, categoria. */
  rotulo: estilo(14, 18, '600'),
  /** 12/16/600 — selo, data, rótulo da barra inferior. */
  legenda: estilo(12, 16, '600'),
  /** 12/16/400 — data e texto fraco. */
  legendaNormal: estilo(12, 16, '400'),
} as const;

/** Fonte do sistema ampliada até 1,3x sem cortar: usar em todo Text. */
export const FONTE_MAXIMA = 1.3;

// ── Elevação (3 níveis) ──────────────────────────────────────────────────────

export const elevacao: Record<0 | 1 | 2, ViewStyle> = {
  0: { elevation: 0 },
  1: {
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  2: {
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
};

// ── Estados ──────────────────────────────────────────────────────────────────

export const estados = {
  /** Pressed de superfície sólida. 4,63:1 no botão primário, ainda passa. */
  pressedOpacidade: 0.85,
  /** Borda de campo em foco e de item selecionado. */
  focoBorda: 2,
  /** Borda de campo padrão. */
  bordaPadrao: 2,
  /** Duração máxima de feedback visual. */
  toqueMs: 120,
} as const;

// ── Alvos de toque ───────────────────────────────────────────────────────────

export const toque = {
  /** 48 x 48 dp mínimo. */
  minimo: 48,
  /** 8 dp entre alvos. */
  espaco: 8,
  /** HitSlop quando o desenho é menor que 48. */
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;

// ── Layout ───────────────────────────────────────────────────────────────────

export const layout = {
  headerAltura: 56,
  barraAltura: 64,
  botaoAltura: 48,
  campoAltura: 52,
  botaoCentral: 56,
  icone: { '1': 16, '2': 20, '3': 24, '4': 32 },
} as const;
