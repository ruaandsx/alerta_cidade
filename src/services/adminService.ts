import { apiRequest } from './api';

export type UsuarioAdmin = {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone?: string;
  nascimento?: string;
  cidade?: string;
};

export async function listarUsuarios(): Promise<UsuarioAdmin[]> {
  return await apiRequest('/usuarios');
}

export async function buscarUsuario(id: number): Promise<UsuarioAdmin> {
  return await apiRequest(`/usuarios/${id}`);
}

export async function deletarUsuario(id: number) {
  return await apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  });
}

export async function tornarAdmin(id: number) {
  return await apiRequest(`/usuarios/${id}/admin`, {
    method: 'PUT',
  });
}
