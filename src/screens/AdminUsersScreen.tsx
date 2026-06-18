import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, TextInput, Alert,
} from 'react-native';

import { listarUsuarios, deletarUsuario, tornarAdmin, UsuarioAdmin } from '../services/adminService';

type Props = { navigation?: any };

export default function AdminUsersScreen({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregar();

    const unsubscribe = navigation?.addListener?.('focus', carregar);
    return unsubscribe;
  }, [navigation]);

  async function carregar() {
    try {
      setCarregando(true);
      const data = await listarUsuarios();
      setUsuarios(data || []);
    } catch (e) {
      console.log('Erro ao carregar usuários:', e);
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  }

  function confirmarExcluir(usuario: UsuarioAdmin) {
    Alert.alert('Excluir usuário', `Deseja excluir ${usuario.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarUsuario(usuario.id);
            carregar();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o usuário. Ele pode possuir ocorrências vinculadas.');
          }
        },
      },
    ]);
  }

  async function promover(usuario: UsuarioAdmin) {
    try {
      await tornarAdmin(usuario.id);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível alterar o usuário para admin.');
    }
  }

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      (u.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(busca.toLowerCase())
  );

  const admins = usuarios.filter(u => u.role === 'ADMIN').length;
  const comuns = usuarios.filter(u => u.role !== 'ADMIN').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
          <View style={styles.admBadge}><Text style={styles.admBadgeText}>ADM</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.usersCard}>
          <View style={styles.usersCardHeader}>
            <Text style={styles.usersCardTitle}>Usuários</Text>
            <TouchableOpacity style={styles.addBtn} onPress={carregar}>
              <Text style={styles.addBtnText}>↻ Atualizar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👥</Text>
              <Text style={styles.statValor}>{usuarios.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🛡️</Text>
              <Text style={styles.statValor}>{admins}</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👤</Text>
              <Text style={styles.statValor}>{comuns}</Text>
              <Text style={styles.statLabel}>Usuários</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuário..."
            placeholderTextColor="#94a3b8"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.listaCard}>
          {carregando && <Text style={styles.empty}>Carregando usuários...</Text>}
          {!carregando && usuariosFiltrados.length === 0 && <Text style={styles.empty}>Nenhum usuário encontrado.</Text>}

          {usuariosFiltrados.map((usuario, index) => (
            <TouchableOpacity
              key={usuario.id}
              style={[styles.usuarioRow, index < usuariosFiltrados.length - 1 && styles.usuarioRowBorder]}
              activeOpacity={0.7}
              onLongPress={() => confirmarExcluir(usuario)}
            >
              <View style={[styles.avatar, { backgroundColor: usuario.role === 'ADMIN' ? '#1565c0' : '#5bb8d4' }]}>
                <Text style={styles.avatarText}>{(usuario.nome || 'U').substring(0, 2).toUpperCase()}</Text>
              </View>

              <View style={styles.usuarioInfo}>
                <Text style={styles.usuarioNome}>{usuario.nome || 'Usuário'}</Text>
                <Text style={styles.usuarioEmail}>{usuario.email}</Text>
              </View>

              <View style={styles.usuarioRight}>
                <View style={[styles.statusBadge, usuario.role === 'ADMIN' && styles.statusAdmin]}>
                  <Text style={styles.statusText}>{usuario.role}</Text>
                </View>

                {usuario.role !== 'ADMIN' && (
                  <TouchableOpacity style={styles.promoverBtn} onPress={() => promover(usuario)}>
                    <Text style={styles.promoverText}>Tornar ADM</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminHome')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Usuários</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appNameBlue: { fontSize: 24, fontWeight: '700', color: '#1565c0' },
  appNameGold: { fontSize: 24, fontWeight: '700', color: '#c8860a' },
  admBadge: { backgroundColor: '#5bb8d4', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  admBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  scroll: { paddingHorizontal: 14, paddingBottom: 24, gap: 12 },
  usersCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  usersCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  usersCardTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  addBtn: { backgroundColor: '#5bb8d4', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statEmoji: { fontSize: 28 },
  statValor: { fontSize: 22, fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: 10, color: '#64748b', textAlign: 'center' },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 16, height: 46, gap: 8 },
  searchIcon: { fontSize: 18 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a2e' },
  listaCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  empty: { textAlign: 'center', color: '#64748b', padding: 20 },
  usuarioRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  usuarioRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  usuarioInfo: { flex: 1 },
  usuarioNome: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  usuarioEmail: { fontSize: 11, color: '#64748b' },
  usuarioRight: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { backgroundColor: '#22c55e', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  statusAdmin: { backgroundColor: '#1565c0' },
  statusText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  promoverBtn: { backgroundColor: '#f1f5f9', borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4 },
  promoverText: { fontSize: 10, color: '#1565c0', fontWeight: '700' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem: { alignItems: 'center', gap: 2 },
  navItemActive: {},
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#1a3a5c' },
  navLabelActive: { fontWeight: '700', color: '#1a1a2e' },
});
