import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView,
} from 'react-native';

import { listarOcorrencias, Ocorrencia } from '../services/ocorrenciaService';

type Props = { navigation?: any };


export default function HistoricoScreen({ navigation }: Props) {
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarHistorico();

    const unsubscribe = navigation?.addListener?.('focus', () => {
      carregarHistorico();
    });

    return unsubscribe;
  }, [navigation]);

  async function carregarHistorico() {
    try {
      setCarregando(true);
      const data = await listarOcorrencias();

      const formatadas = data.map((item: Ocorrencia) => ({
        id: item.id,
        titulo: formatarTitulo(item.categoria),
        endereco: `${item.rua || ''}${item.bairro ? ', ' + item.bairro : ''}`,
        status: formatarStatus(item.status),
        grau: formatarUrgencia(item.urgencia),
        grauCor: corUrgencia(item.urgencia),
        data: item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString('pt-BR') : '',
        emoji: emojiCategoria(item.categoria),
        bg: bgCategoria(item.categoria),
        original: item,
      }));

      setOcorrencias(formatadas);
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
      setOcorrencias([]);
    } finally {
      setCarregando(false);
    }
  }

  function formatarTitulo(categoria?: string) {
    if (categoria === 'ILUMINACAO') return 'Iluminação pública';
    if (categoria === 'SAUDE_PUBLICA') return 'Saúde pública';
    if (categoria === 'TRANSITO') return 'Trânsito';
    if (categoria === 'INFRAESTRUTURA') return 'Infraestrutura';
    if (categoria === 'LIMPEZA') return 'Limpeza urbana';
    return 'Ocorrência';
  }

  function formatarStatus(status?: string) {
    if (status === 'RECEBIDO') return 'Recebido';
    if (status === 'EM_ANALISE') return 'Em análise';
    if (status === 'RESOLVIDO') return 'Resolvido';
    return 'Recebido';
  }

  function formatarUrgencia(urgencia?: string) {
    if (urgencia === 'ALTA') return 'Grau alto';
    if (urgencia === 'MEDIA') return 'Grau médio';
    return 'Grau baixo';
  }

  function corUrgencia(urgencia?: string) {
    if (urgencia === 'ALTA') return '#ef4444';
    if (urgencia === 'MEDIA') return '#f59e0b';
    return '#22c55e';
  }

  function emojiCategoria(categoria?: string) {
    if (categoria === 'ILUMINACAO') return '💡';
    if (categoria === 'SAUDE_PUBLICA') return '🏥';
    if (categoria === 'TRANSITO') return '🚦';
    if (categoria === 'INFRAESTRUTURA') return '🛣️';
    if (categoria === 'LIMPEZA') return '🗑️';
    return '📍';
  }

  function bgCategoria(categoria?: string) {
    if (categoria === 'ILUMINACAO') return '#1a1a2e';
    if (categoria === 'SAUDE_PUBLICA') return '#ef4444';
    if (categoria === 'TRANSITO') return '#f59e0b';
    if (categoria === 'INFRAESTRUTURA') return '#92a0a8';
    if (categoria === 'LIMPEZA') return '#6b7280';
    return '#7ec8e3';
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de ocorrência</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Minhas ocorrências</Text>

        {/* Lista de ocorrências */}
        {carregando && (
          <Text style={{ textAlign: 'center', color: '#64748b', marginVertical: 20 }}>
            Carregando histórico...
          </Text>
        )}

        {!carregando && ocorrencias.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#64748b', marginVertical: 20 }}>
            Nenhuma ocorrência encontrada.
          </Text>
        )}

        {ocorrencias.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation?.navigate('ReportDetail', { item: item.original || item })}
            activeOpacity={0.8}
          >
            {/* Imagem/thumbnail */}
            <View style={[styles.thumbnail, { backgroundColor: item.bg }]}>
              <Text style={styles.thumbnailEmoji}>{item.emoji}</Text>
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{item.titulo}</Text>
              <Text style={styles.cardEndereco}>{item.endereco}</Text>
              <Text style={styles.cardStatus}>Status: {item.status}</Text>
              <View style={styles.cardBottom}>
                <View style={styles.grauRow}>
                  <View style={[styles.grauDot, { backgroundColor: item.grauCor }]} />
                  <Text style={styles.grauText}>{item.grau}</Text>
                </View>
                <Text style={styles.cardData}>{item.data}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Banner fique por dentro */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIcon}>
            <Text style={styles.bannerEmoji}>🔔</Text>
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Fique por dentro!</Text>
            <Text style={styles.bannerDesc}>Acompanhe suas ocorrência.</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('Home')} activeOpacity={0.7}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter} onPress={() => navigation?.navigate('NewReport')} activeOpacity={0.7}>
          <Text style={styles.navPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('Profile')} activeOpacity={0.7}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#fff' },

  /* Header */
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backArrow:       { fontSize: 22, color: '#1a1a2e' },
  headerTitle:     { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },

  scroll:          { paddingHorizontal: 16, paddingBottom: 24 },
  sectionTitle:    { fontSize: 18, fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, marginTop: 4 },

  /* Card ocorrência */
  card:            { flexDirection: 'row', borderRadius: 14, borderWidth: 1.5, borderColor: '#5bb8d4', padding: 12, marginBottom: 12, gap: 12, alignItems: 'flex-start' },
  thumbnail:       { width: 80, height: 80, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  thumbnailEmoji:  { fontSize: 36 },
  cardInfo:        { flex: 1 },
  cardTitulo:      { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  cardEndereco:    { fontSize: 12, color: '#64748b', marginBottom: 2 },
  cardStatus:      { fontSize: 12, color: '#64748b', marginBottom: 6 },
  cardBottom:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grauRow:         { flexDirection: 'row', alignItems: 'center', gap: 5 },
  grauDot:         { width: 10, height: 10, borderRadius: 5 },
  grauText:        { fontSize: 12, fontWeight: '500', color: '#1a1a2e' },
  cardData:        { fontSize: 11, color: '#94a3b8' },

  /* Banner */
  bannerCard:      { backgroundColor: '#7ec8e3', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  bannerIcon:      { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  bannerEmoji:     { fontSize: 24 },
  bannerText:      { flex: 1 },
  bannerTitle:     { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  bannerDesc:      { fontSize: 13, color: '#1a3a5c' },

  /* Bottom Nav */
  bottomNav:       { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem:         { alignItems: 'center', gap: 2 },
  navItemCenter:   { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: -24, elevation: 4 },
  navPlus:         { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon:         { fontSize: 22 },
  navLabel:        { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
});
