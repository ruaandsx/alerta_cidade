import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, Image,
} from 'react-native';

import { listarOcorrencias, Ocorrencia } from '../services/ocorrenciaService';
import { listarUsuarios } from '../services/adminService';
import { useUsuarioLogado } from '../hooks/useUsuarioLogado';

type Props = { navigation?: any };

const filtros = ['Todas', 'Em andamento', 'Pendentes', 'Resolvidas'];

export default function AdminHomeScreen({ navigation }: Props) {
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const { usuario } = useUsuarioLogado();

  useEffect(() => {
    carregarTudo();

    const interval = setInterval(carregarTudo, 5000);

    const unsubscribe = navigation?.addListener?.('focus', carregarTudo);

    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, [navigation]);

  async function carregarTudo() {
    try {
      const [ocorrenciasData, usuariosData] = await Promise.all([
        listarOcorrencias(),
        listarUsuarios().catch(() => []),
      ]);

      setOcorrencias(ocorrenciasData || []);
      setTotalUsuarios(usuariosData.length || 0);
    } catch (e) {
      console.log('Erro ao carregar dashboard admin:', e);
    }
  }

  function traduzirStatus(status?: string) {
    if (status === 'RECEBIDO') return 'Pendente';
    if (status === 'EM_ANALISE') return 'Em andamento';
    if (status === 'RESOLVIDO') return 'Resolvido';
    return 'Pendente';
  }

  function corStatus(status?: string) {
    if (status === 'RESOLVIDO') return '#22c55e';
    if (status === 'EM_ANALISE') return '#f59e0b';
    return '#ef4444';
  }

  function tituloOcorrencia(item: Ocorrencia) {
    if (item.categoria === 'ILUMINACAO') return 'Iluminação pública';
    if (item.categoria === 'SAUDE_PUBLICA') return 'Saúde pública';
    if (item.categoria === 'TRANSITO') return 'Trânsito';
    if (item.categoria === 'INFRAESTRUTURA') return 'Infraestrutura';
    if (item.categoria === 'LIMPEZA') return 'Limpeza urbana';
    return 'Ocorrência';
  }

  function enderecoOcorrencia(item: Ocorrencia) {
    return `${item.rua || ''}${item.bairro && item.bairro !== 'Não informado' ? ', ' + item.bairro : ''}`;
  }

  function dataOcorrencia(item: Ocorrencia) {
    if (!item.dataCriacao) return '';
    return new Date(item.dataCriacao).toLocaleString('pt-BR');
  }

  const ocorrenciasFiltradas = ocorrencias.filter((o) => {
    if (filtroAtivo === 'Todas') return true;
    if (filtroAtivo === 'Em andamento') return traduzirStatus(o.status) === 'Em andamento';
    if (filtroAtivo === 'Pendentes') return traduzirStatus(o.status) === 'Pendente';
    if (filtroAtivo === 'Resolvidas') return traduzirStatus(o.status) === 'Resolvido';
    return true;
  });

  const pendentes = ocorrencias.filter(o => o.status === 'RECEBIDO').length;
  const andamento = ocorrencias.filter(o => o.status === 'EM_ANALISE').length;
  const resolvidas = ocorrencias.filter(o => o.status === 'RESOLVIDO').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      <View style={styles.header}>
        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
          <View style={styles.admBadge}><Text style={styles.admBadgeText}>ADM</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeTitle}>Olá, {usuario?.nome || 'administrador'}!</Text>
            <Text style={styles.welcomeDesc}>Acompanhe as ocorrências reais em tempo quase real.</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={carregarTudo}>
            <Text style={styles.refreshText}>↻ Atualizar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Visão geral</Text>
        <View style={styles.statsRow}>
          {[
            { valor: ocorrencias.length, label: 'Ocorrências\nrecebidas', icon: '📋', bg: '#e0f2fe' },
            { valor: andamento, label: 'Em\nandamento', icon: '🔎', bg: '#fef9c3' },
            { valor: resolvidas, label: 'Resolvidas', icon: '✅', bg: '#dcfce7' },
            { valor: pendentes, label: 'Pendentes', icon: '⚠️', bg: '#fee2e2' },
            { valor: totalUsuarios, label: 'Usuários', icon: '👥', bg: '#f3e8ff' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: s.bg }]}>
                <Text style={styles.statEmoji}>{s.icon}</Text>
              </View>
              <Text style={styles.statValor}>{s.valor}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Acompanhamento</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosScroll}>
          <View style={styles.filtrosRow}>
            {filtros.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filtroBtn, filtroAtivo === f && styles.filtroBtnActive]}
                onPress={() => setFiltroAtivo(f)}
              >
                <Text style={[styles.filtroText, filtroAtivo === f && styles.filtroTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {ocorrenciasFiltradas.length === 0 && (
          <Text style={styles.emptyText}>Nenhuma ocorrência encontrada.</Text>
        )}

        {ocorrenciasFiltradas.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.ocorrenciaCard}
            onPress={() => navigation?.navigate('AdminReportDetail', { item })}
            activeOpacity={0.8}
          >
            <View style={[styles.thumbnail, { backgroundColor: '#92a0a8' }]}>
              {item.imagemBase64 ? (
                <Image source={{ uri: item.imagemBase64 }} style={styles.thumbnailImage} />
              ) : (
                <Text style={styles.thumbnailEmoji}>📍</Text>
              )}
            </View>
            <View style={styles.ocorrenciaInfo}>
              <Text style={styles.ocorrenciaTitulo}>{tituloOcorrencia(item)}</Text>
              <Text style={styles.ocorrenciaEndereco}>{enderecoOcorrencia(item)}</Text>
              <Text style={styles.ocorrenciaHora}>{dataOcorrencia(item)}</Text>
            </View>
            <View style={styles.ocorrenciaRight}>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: corStatus(item.status) }]} />
                <Text style={[styles.statusText, { color: corStatus(item.status) }]}>
                  {traduzirStatus(item.status)}
                </Text>
              </View>
              <Text style={styles.ocorrenciaArrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminHome')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Ocorrências</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminUsers')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminProfile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7ec8e3' },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  appNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appNameBlue: { fontSize: 24, fontWeight: '700', color: '#1565c0' },
  appNameGold: { fontSize: 24, fontWeight: '700', color: '#c8860a' },
  admBadge: { backgroundColor: '#1565c0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  admBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  scroll: { paddingHorizontal: 14, paddingBottom: 24 },
  welcomeBanner: { backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeLeft: { flex: 1 },
  welcomeTitle: { fontSize: 15, fontWeight: '800', color: '#1a1a2e', marginBottom: 4 },
  welcomeDesc: { fontSize: 11, color: '#64748b', lineHeight: 17 },
  refreshBtn: { backgroundColor: '#d6eef8', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  refreshText: { fontSize: 12, color: '#1565c0', fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statCard: { width: '31%', backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center', gap: 4 },
  statIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statEmoji: { fontSize: 16 },
  statValor: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: 9, color: '#64748b', textAlign: 'center', lineHeight: 13 },
  filtrosScroll: { marginBottom: 12 },
  filtrosRow: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  filtroBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff' },
  filtroBtnActive: { backgroundColor: '#1565c0' },
  filtroText: { fontSize: 12, fontWeight: '500', color: '#64748b' },
  filtroTextActive: { color: '#fff', fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#64748b', marginVertical: 20 },
  ocorrenciaCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  thumbnail: { width: 60, height: 60, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  thumbnailImage: { width: '100%', height: '100%' },
  thumbnailEmoji: { fontSize: 28 },
  ocorrenciaInfo: { flex: 1 },
  ocorrenciaTitulo: { fontSize: 13, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  ocorrenciaEndereco: { fontSize: 11, color: '#64748b', marginBottom: 2 },
  ocorrenciaHora: { fontSize: 10, color: '#94a3b8' },
  ocorrenciaRight: { alignItems: 'flex-end', gap: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  ocorrenciaArrow: { fontSize: 20, color: '#94a3b8' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem: { alignItems: 'center', gap: 2 },
  navItemActive: {},
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#1a3a5c' },
  navLabelActive: { fontWeight: '700', color: '#1a1a2e' },
});
