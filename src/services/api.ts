import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Endereço da API.
 *
 * Ordem de prioridade:
 *  1. Endereço salvo pelo usuário (tela de login → "Servidor")
 *  2. Variável de ambiente EXPO_PUBLIC_API_URL
 *  3. IP da máquina que está servindo o Expo (funciona automático no Expo Go)
 *  4. localhost:8080
 */

const CHAVE_URL = 'apiUrl';
const CHAVE_TOKEN = 'token';

/**
 * Porta padrão da API. A 8080 é a oficial, mas em algumas máquinas de
 * desenvolvimento ela já está ocupada por outro programa (foi o que impedia
 * o cadastro: o app batia em outro servidor e recebia 404). Por isso o app
 * testa também a 8082 e escolhe a que responde com o /health da API.
 */
const PORTA_API = 8080;
const PORTA_API_ALT = 8082;

export type FonteImagem = { uri: string; headers?: Record<string, string> };

export class ApiError extends Error {
  status?: number;
  campos?: Record<string, string> | null;

  constructor(mensagem: string, status?: number, campos?: Record<string, string> | null) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos ?? null;
  }
}

let urlEmCache: string | null = null;

function normalizarUrl(valor: string): string {
  let url = valor.trim();

  if (!url) return url;
  if (!/^https?:\/\//i.test(url)) url = `http://${url}`;
  url = url.replace(/\/+$/, '');

  const semProtocolo = url.replace(/^https?:\/\//i, '');
  const temPorta = /:\d+($|\/)/.test(semProtocolo.split('/')[0]);

  if (!temPorta && /^http:\/\//i.test(url)) {
    url = `${url}:${PORTA_API}`;
  }

  return url;
}

function hostDoExpo(): string | null {
  const qualquer = Constants as any;

  const hostUri: string | undefined =
    qualquer?.expoConfig?.hostUri ||
    qualquer?.expoGoConfig?.debuggerHost ||
    qualquer?.manifest2?.extra?.expoGo?.debuggerHost ||
    qualquer?.manifest?.debuggerHost;

  if (!hostUri) return null;

  const host = String(hostUri).split('/')[0].split('?')[0].split(':')[0];
  return host || null;
}

function urlPadrao(): string {
  const host = hostDoExpo();

  if (host) {
    const normalizado =
      Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')
        ? '10.0.2.2'
        : host;

    return `http://${normalizado}:${PORTA_API}`;
  }

  // Build próprio (APK): usa o endereço embutido no app.json em extra.apiUrl.
  const embutida = (Constants.expoConfig?.extra as any)?.apiUrl;

  if (typeof embutida === 'string' && embutida.trim()) {
    return normalizarUrl(embutida);
  }

  if (Platform.OS === 'android') return `http://10.0.2.2:${PORTA_API}`;
  return `http://localhost:${PORTA_API}`;
}

/** Mesmo host da URL padrão, na porta alternativa. */
function urlPadraoAlternativa(): string {
  return urlPadrao().replace(new RegExp(`:${PORTA_API}$`), `:${PORTA_API_ALT}`);
}

/** Testa se o servidor responde em /health (usado para escolher o melhor endereço). */
async function servidorResponde(url: string, limiteMs = 3000): Promise<boolean> {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), limiteMs);

  try {
    const resposta = await fetch(`${url}/health`, { signal: controlador.signal });
    if (!resposta.ok) return false;
    const corpo = await resposta.text();
    return /"status"\s*:\s*"UP"/i.test(corpo);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Endereços possíveis, em ordem de preferência:
 *  1. IP da máquina do Expo na porta alternativa (8082), onde esta API costuma subir
 *  2. IP da máquina do Expo na porta oficial (8080)
 *  3. extra.apiUrl / extra.apiUrlAlternativa (endereço embutido no app)
 *
 * A ordem é decidida pelo /health: quem responder com {"status":"UP"} vence.
 */
function candidatosDeUrl(): string[] {
  const extra = (Constants.expoConfig?.extra ?? {}) as any;
  const lista = [
    urlPadraoAlternativa(),
    extra.apiUrl,
    urlPadrao(),
    extra.apiUrlAlternativa,
    extra.apiUrlRemota,
  ]
    .filter((valor): valor is string => typeof valor === 'string' && !!valor.trim())
    .map(normalizarUrl);

  return lista.filter((url, indice) => lista.indexOf(url) === indice);
}

/** Escolhe o primeiro endereço que responde; se nenhum responder, mantém o preferido. */
async function descobrirUrl(): Promise<string> {
  const candidatos = candidatosDeUrl();
  if (candidatos.length <= 1) return candidatos[0];

  const testes = await Promise.all(
    candidatos.map(async (url, indice) => ({ url, indice, ok: await servidorResponde(url) })),
  );

  const aprovados = testes.filter((t) => t.ok).sort((a, b) => a.indice - b.indice);
  return aprovados[0]?.url ?? candidatos[0];
}

export async function obterApiUrl(forcar = false): Promise<string> {
  if (!forcar && urlEmCache) return urlEmCache;

  try {
    const salva = await AsyncStorage.getItem(CHAVE_URL);
    if (salva) {
      const normalizada = normalizarUrl(salva);

      // Endereço salvo que não responde mais (mudou de rede, servidor subiu em
      // outra porta) é descartado em vez de quebrar todo o app.
      if (await servidorResponde(normalizada)) {
        urlEmCache = normalizada;
        return urlEmCache;
      }

      await AsyncStorage.removeItem(CHAVE_URL);
    }
  } catch {
    // segue para o padrão
  }

  const ambiente = (globalThis as any)?.process?.env?.EXPO_PUBLIC_API_URL as string | undefined;

  if (ambiente) {
    urlEmCache = normalizarUrl(ambiente);
    return urlEmCache;
  }

  urlEmCache = await descobrirUrl();
  return urlEmCache;
}

/** Esquece a escolha automática (usado após trocar de rede). */
export function esquecerUrlDetectada(): void {
  urlEmCache = null;
}

export async function definirApiUrl(valor: string): Promise<string> {
  const url = normalizarUrl(valor);
  await AsyncStorage.setItem(CHAVE_URL, url);
  urlEmCache = url;
  return url;
}

export async function restaurarApiUrlPadrao(): Promise<string> {
  await AsyncStorage.removeItem(CHAVE_URL);
  urlEmCache = null;
  return await obterApiUrl();
}

export async function obterToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export async function limparToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CHAVE_TOKEN);
  } catch {
    // ignora
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  /** Desliga o envio do token (login, cadastro...). */
  auth?: boolean;
  /** Quando true, body já é FormData. */
  form?: boolean;
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const base = await obterApiUrl();
  const token = options.auth === false ? null : await obterToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.body !== undefined && !options.form) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${base}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body:
        options.body === undefined
          ? undefined
          : options.form
            ? options.body
            : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(
      `Não foi possível conectar em ${base}. Confira se o servidor está ligado e se o celular está na mesma rede.`,
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  const texto = await response.text();
  let dados: any = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && options.auth !== false) {
      await limparToken();
    }

    const mensagem =
      (dados && typeof dados === 'object' && (dados.mensagem || dados.message || dados.erro)) ||
      (typeof dados === 'string' && dados) ||
      `Erro ${response.status} ao acessar o servidor.`;

    throw new ApiError(String(mensagem), response.status, dados?.campos ?? null);
  }

  return dados as T;
}

/** A API devolve páginas em `{ content: [...] }`; aqui já sai a lista pronta. */
export function extrairLista<T>(dados: any): T[] {
  if (!dados) return [];
  if (Array.isArray(dados)) return dados as T[];
  if (Array.isArray(dados.content)) return dados.content as T[];
  return [];
}

export async function fonteImagem(
  ocorrenciaId?: number,
  temImagem?: boolean,
): Promise<FonteImagem | null> {
  if (!ocorrenciaId || temImagem === false) return null;

  const [base, token] = await Promise.all([obterApiUrl(), obterToken()]);

  const url = `${base}/ocorrencias/${ocorrenciaId}/imagem`;

  // O token vai na query porque o <Image> do React Native não envia headers do
  // jeito confiável em todas as plataformas/versões. O backend aceita os dois.
  return {
    uri: token ? `${url}?token=${encodeURIComponent(token)}` : url,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };
}

/** URL absoluta para endpoints que ainda não existem no helper. */
export async function urlAbsoluta(caminho: string): Promise<string> {
  const base = await obterApiUrl();
  return `${base}${caminho.startsWith('/') ? caminho : `/${caminho}`}`;
}
