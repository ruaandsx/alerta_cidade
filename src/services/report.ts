import api from './api';
export const reportService = {
  async getAll() {
    const { data } = await api.get('/reports');
    return data.data;
  },
  async getOne(id: number) {
    const { data } = await api.get(`/reports/${id}`);
    return data.data;
  },
  async create(form: FormData) {
    const { data } = await api.post('/reports', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return data.data;
  },
};
