import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView,
} from 'react-native';

import { useUsuarioLogado } from '../hooks/useUsuarioLogado';
import { logout } from '../services/authService';

type Props = { navigation?: any };

export default function AdminProfileScreen({ navigation }: Props) {
  const { usuario } = useUsuarioLogado();

  async function sair() {
    await logout();
    navigation?.reset?.({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const stats = [
    { valor: 'ADM', label: 'Tipo de\nconta', icon: '🛡️' },
    { valor: usuario?.id || '-', label: 'ID do\nusuário', icon: '👤' },
    { valor: 'Ativo', label: 'Status da\nconta', icon: '✅' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Meu perfil</Text>
          <Text style={styles.headerSubtitle}>Administrador</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🛡️</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileNome}>{usuario?.nome || 'Administrador'}</Text>
              <View style={styles.badgeWrapper}>
                <Text style={styles.badgeText}>{usuario?.role || 'ADMIN'}</Text>
              </View>
              <Text style={styles.profileText}>✉️ {usuario?.email || 'email não informado'}</Text>
              <Text style={styles.profileText}>📞 {usuario?.telefone || 'telefone não informado'}</Text>
            </View>
          </View>

          {[
            { icon: '👤', label: 'Nome completo', value: usuario?.nome || 'Administrador' },
            { icon: '💼', label: 'Cargo', value: 'Administrador do sistema' },
            { icon: '🏢', label: 'Departamento', value: 'Gestão de ocorrências' },
            { icon: '📍', label: 'Permissões', value: 'Acesso administrativo' },
          ].map((campo, i) => (
            <View key={i} style={styles.campoRow}>
              <Text style={styles.campoIcon}>{campo.icon}</Text>
              <View style={styles.campoContent}>
                <Text style={styles.campoLabel}>{campo.label}</Text>
                <Text style={styles.campoValue}>{campo.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Resumo da conta</Text>
          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statValor}>{s.valor}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.acoesCard}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>

          <TouchableOpacity style={styles.acaoRow} onPress={() => navigation?.navigate('AdminUsers')}>
            <Text style={styles.acaoEmoji}>👥</Text>
            <Text style={styles.acaoLabel}>Gerenciar usuários</Text>
            <Text style={styles.acaoArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acaoRow} onPress={() => navigation?.navigate('AdminHome')}>
            <Text style={styles.acaoEmoji}>📋</Text>
            <Text style={styles.acaoLabel}>Gerenciar ocorrências</Text>
            <Text style={styles.acaoArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acaoRow} onPress={sair}>
            <Text style={styles.acaoEmoji}>🚪</Text>
            <Text style={[styles.acaoLabel, styles.acaoLabelRed]}>Sair da conta</Text>
            <Text style={styles.acaoArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminHome')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminUsers')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7ec8e3' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 },
  backArrow: { fontSize: 22, color: '#1a1a2e', marginTop: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  headerSubtitle: { fontSize: 13, color: '#1a3a5c' },
  scroll: { paddingHorizontal: 14, paddingBottom: 24, gap: 12 },
  profileCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  profileTop: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 38 },
  profileInfo: { flex: 1, gap: 4 },
  profileNome: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  badgeWrapper: { alignSelf: 'flex-start', backgroundColor: '#1565c0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 2 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  profileText: { fontSize: 12, color: '#334155' },
  campoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  campoIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  campoContent: { flex: 1 },
  campoLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 1 },
  campoValue: { fontSize: 13, fontWeight: '500', color: '#1a1a2e' },
  statsCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 24 },
  statValor: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 16 },
  acoesCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  acaoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  acaoEmoji: { fontSize: 18 },
  acaoLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1a1a2e' },
  acaoLabelRed: { color: '#ef4444' },
  acaoArrow: { fontSize: 22, color: '#94a3b8', fontWeight: '300' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem: { alignItems: 'center', gap: 2 },
  navItemActive: {},
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#1a3a5c' },
  navLabelActive: { fontWeight: '700', color: '#1a1a2e' },
});
