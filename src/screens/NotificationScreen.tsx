import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  listarNotificacoes,
  marcarNotificacoesComoLidas,
} from '../services/ocorrenciaService';

export default function NotificationScreen({ navigation }: any) {
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregar();

    const unsubscribe = navigation?.addListener?.('focus', carregar);

    return unsubscribe;
  }, [navigation]);

  async function carregar() {
    try {
      setCarregando(true);

      const data = await listarNotificacoes(true);
      setNotificacoes(data || []);

      if ((data || []).some((n) => n.lida === false)) {
        setTimeout(() => {
          marcarNotificacoesComoLidas().catch(() => {});
        }, 1500);
      }
    } catch (error) {
      console.log('Erro ao carregar notificações:', error);
      setNotificacoes([]);
    } finally {
      setCarregando(false);
    }
  }

  function cor(tipo: string) {
    if (tipo === 'RESOLVIDO') return '#dcfce7';
    if (tipo === 'COMENTARIO') return '#d6eef8';
    if (tipo === 'EM_ANALISE') return '#fef3c7';
    if (tipo === 'EM_ANDAMENTO') return '#ede9fe';
    return '#f8f4e8';
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Notificações</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {carregando && (
          <Text style={styles.empty}>Carregando notificações...</Text>
        )}

        {!carregando && notificacoes.length === 0 && (
          <Text style={styles.empty}>Nenhuma notificação no momento.</Text>
        )}

        {notificacoes.map((n, i) => (
          <TouchableOpacity
            key={n.id || i}
            activeOpacity={0.8}
            onPress={() => {
              if (n.ocorrenciaId) {
                navigation?.navigate('ReportDetail', { item: { id: n.ocorrenciaId } });
              }
            }}
            style={[styles.card, { backgroundColor: cor(n.tipo) }]}
          >
            <View style={styles.cardTopo}>
              <Text style={styles.cardTitle}>
                {n.titulo || 'Atualização da ocorrência'}
              </Text>
              {n.lida === false && <View style={styles.naoLida} />}
            </View>

            <Text style={styles.text}>
              {n.mensagem || 'Você recebeu uma nova atualização.'}
            </Text>

            <Text style={styles.date}>
              {n.dataCriacao ? new Date(n.dataCriacao).toLocaleString('pt-BR') : ''}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.supportCard}>
          <Text style={styles.cardTitle}>Suporte</Text>
          <Text style={styles.text}>
            Precisa de ajuda? Acesse Ajuda e suporte no seu perfil.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },

  back: {
    fontSize: 24,
    color: '#1a1a2e',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  scroll: {
    padding: 16,
  },

  empty: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 24,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  cardTopo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  naoLida: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },

  supportCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    backgroundColor: '#d6eef8',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },

  text: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },

  date: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
  },
});