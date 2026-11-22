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
