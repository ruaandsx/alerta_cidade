import { apiRequest, extrairLista } from './api';

export const categoryService = {
  async getAll() {
    const dados = await apiRequest<{ categorias: { valor: string; rotulo: string }[] }>('/dominios');
    return dados?.categorias ?? [];
  },
};
