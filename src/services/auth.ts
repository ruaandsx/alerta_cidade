import api from './api';
import * as SecureStore from 'expo-secure-store';
export const authService = {
  async register(name: string, email: string, password: string, city: string) {
    const { data } = await api.post('/auth/register', { name, email, password, city });
    await SecureStore.setItemAsync('token', data.data.token);
    return data.data;
  },
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    await SecureStore.setItemAsync('token', data.data.token);
    return data.data;
  },
  async logout() {
    await SecureStore.deleteItemAsync('token');
  },
};
