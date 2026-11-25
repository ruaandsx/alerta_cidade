import { apiRequest, extrairLista } from './api';

export type UsuarioAdmin = {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone?: string | null;
  nascimento?: string | null;
  cidade?: string | null;
  dataCriacao?: string;
};

/**
 * A API pagina os usuários. Como o app exibe a lista completa, buscamos
 * todas as páginas (com um teto de segurança).
 */
export async function listarUsuarios(): Promise<UsuarioAdmin[]> {
  const tamanho = 100;
  const todos: UsuarioAdmin[] = [];
  let pagina = 0;

  while (pagina < 20) {
    const dados = await apiRequest(`/usuarios?page=${pagina}&size=${tamanho}&sort=nome,asc`);
    const conteudo = extrairLista<UsuarioAdmin>(dados);
    todos.push(...conteudo);

    if (!dados || Array.isArray(dados) || dados.last === true || conteudo.length < tamanho) break;

    pagina += 1;
  }

  return todos;
}

export async function buscarUsuario(id: number): Promise<UsuarioAdmin> {
  return await apiRequest(`/usuarios/${id}`);
}

export async function deletarUsuario(id: number): Promise<void> {
  await apiRequest(`/usuarios/${id}`, { method: 'DELETE' });
}

export async function tornarAdmin(id: number): Promise<UsuarioAdmin> {
  return await apiRequest(`/usuarios/${id}/admin`, { method: 'PUT' });
}

export async function tornarUsuario(id: number): Promise<UsuarioAdmin> {
  return await apiRequest(`/usuarios/${id}/user`, { method: 'PUT' });
}

export type NovoUsuario = {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cidade?: string;
};

/**
 * Cria a conta pelo endpoint público de cadastro e, quando o admin escolhe
 * "Administrador", promove o usuário recém-criado. A chamada de cadastro é
 * feita sem salvar sessão, então o admin continua logado.
 */
export async function criarUsuario(dados: NovoUsuario, admin = false): Promise<UsuarioAdmin> {
  const criado = await apiRequest<any>('/auth/cadastro', {
    method: 'POST',
    auth: false,
    body: dados,
  });

  const id = criado?.id ?? criado?.usuario?.id;

  if (admin && id) {
    return await tornarAdmin(id);
  }

  return (criado?.usuario ?? criado) as UsuarioAdmin;
}
