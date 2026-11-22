import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  listarMinhasOcorrencias,
  obterMinhasEstatisticas,
  Ocorrencia,
  tituloCategoria,
  emojiCategoria,
  enderecoOcorrencia,
  rotuloStatus,
  corStatus,
  rotuloUrgencia,
  corUrgencia,
} from '../services/ocorrenciaService';
import { fonteImagem, FonteImagem } from '../services/api';

type Props = { navigation?: any };


export default function HistoricoScreen({ navigation }: Props) {
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [imagens, setImagens] = useState<Record<number, FonteImagem | null>>({});
  const [resumo, setResumo] = useState<{ total: number; resolvidas: number; abertas: number }>({
    total: 0,
    resolvidas: 0,
    abertas: 0,
  });
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

      const [data, estatisticas] = await Promise.all([
        listarMinhasOcorrencias({ size: 100 }),
        obterMinhasEstatisticas().catch(() => null),
      ]);

      const formatadas = data.map((item: Ocorrencia) => ({
        id: item.id,
        titulo: tituloCategoria(item.categoria),
        endereco: enderecoOcorrencia(item),
        status: rotuloStatus(item.status),
        statusCor: corStatus(item.status),
        grau: rotuloUrgencia(item.urgencia),
        grauCor: corUrgencia(item.urgencia),
        data: item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString('pt-BR') : '',
        emoji: emojiCategoria(item.categoria),
        temImagem: item.temImagem,
        original: item,
      }));

      setOcorrencias(formatadas);

      if (estatisticas) {
        setResumo({
          total: estatisticas.total || 0,
          resolvidas: estatisticas.porStatus?.RESOLVIDO || 0,
          abertas:
            (estatisticas.porStatus?.RECEBIDO || 0) + (estatisticas.porStatus?.EM_ANALISE || 0),
        });
      }

      const entradas = await Promise.all(
        data
          .filter((item) => item.id && item.temImagem)
          .map(async (item) => [item.id as number, await fonteImagem(item.id, true)] as const),
      );

      setImagens(Object.fromEntries(entradas));
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
      setOcorrencias([]);
    } finally {
      setCarregando(false);
    }
  }

  function formatarTitulo(categoria?: string) {
    return tituloCategoria(categoria);
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

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

        {!carregando && ocorrencias.length > 0 && (
          <View style={styles.resumoRow}>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{resumo.total}</Text>
              <Text style={styles.resumoLabel}>Total</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{resumo.abertas}</Text>
              <Text style={styles.resumoLabel}>Em aberto</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={[styles.resumoValor, { color: '#16a34a' }]}>{resumo.resolvidas}</Text>
              <Text style={styles.resumoLabel}>Resolvidas</Text>
            </View>
          </View>
        )}

        {/* Lista de ocorrências */}
        {carregando && (
          <Text style={{ textAlign: 'center', color: '#64748b', marginVertical: 20 }}>
            Carregando histórico...
          </Text>
        )}

        {!carregando && ocorrencias.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#64748b', marginVertical: 20 }}>
            Você ainda não registrou nenhuma ocorrência.
          </Text>
        )}

        {ocorrencias.map((item, index) => {
          const imagem = item.id ? imagens[item.id] : null;

          return (
            <TouchableOpacity
              key={item.id || index}
              style={styles.card}
              onPress={() => navigation?.navigate('ReportDetail', { item: item.original || item })}
              activeOpacity={0.8}
            >
              {/* Imagem/thumbnail */}
              <View style={styles.thumbnail}>
                {imagem ? (
                  <Image source={imagem} style={styles.thumbnailImage} />
                ) : (
                  <Text style={styles.thumbnailEmoji}>{item.emoji}</Text>
                )}
              </View>

              {/* Info */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardEndereco}>{item.endereco}</Text>
                <Text style={[styles.cardStatus, { color: item.statusCor }]}>
                  Status: {item.status}
                </Text>
                <View style={styles.cardBottom}>
                  <View style={styles.grauRow}>
                    <View style={[styles.grauDot, { backgroundColor: item.grauCor }]} />
                    <Text style={styles.grauText}>{item.grau}</Text>
                  </View>
                  <Text style={styles.cardData}>{item.data}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

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

  resumoRow:       { flexDirection: 'row', gap: 10, marginBottom: 16 },
  resumoItem:      { flex: 1, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  resumoValor:     { fontSize: 20, fontWeight: '800', color: '#1565c0' },
  resumoLabel:     { fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 2 },

  /* Card ocorrência */
  card:            { flexDirection: 'row', borderRadius: 14, borderWidth: 1.5, borderColor: '#5bb8d4', padding: 12, marginBottom: 12, gap: 12, alignItems: 'flex-start' },
  thumbnail:       { width: 80, height: 80, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', backgroundColor: '#d6eef8' },
  thumbnailImage:  { width: '100%', height: '100%' },
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
