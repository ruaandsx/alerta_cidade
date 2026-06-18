import { useEffect, useState } from 'react';
import { carregarUsuarioDoBackend, getUsuarioLogado, UsuarioLogado } from '../services/authService';

export function useUsuarioLogado() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    try {
      const local = await getUsuarioLogado();
      if (local) setUsuario(local);
      const remoto = await carregarUsuarioDoBackend();
      setUsuario(remoto);
    } catch {
      const local = await getUsuarioLogado();
      setUsuario(local);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);
  return { usuario, carregando, recarregarUsuario: carregar };
}
