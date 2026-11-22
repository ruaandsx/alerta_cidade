import { apiRequest, extrairLista } from './api';
import { Ocorrencia, OcorrenciaPayload } from './ocorrenciaService';

export const reportService = {
  async getAll(): Promise<Ocorrencia[]> {
    return extrairLista<Ocorrencia>(await apiRequest('/ocorrencias'));
  },

  async getOne(id: number): Promise<Ocorrencia> {
    return await apiRequest(`/ocorrencias/${id}`);
  },

  async create(payload: OcorrenciaPayload): Promise<Ocorrencia> {
    return await apiRequest('/ocorrencias', { method: 'POST', body: payload });
  },
};
