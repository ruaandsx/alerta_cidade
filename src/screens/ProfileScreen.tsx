import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView,
} from 'react-native';
import { useUsuarioLogado } from '../hooks/useUsuarioLogado';
import { logout } from '../services/authService';

type Props = { navigation?: any };

export default function ProfileScreen({ navigation }: Props) {
  const { usuario } = useUsuarioLogado();

  async function handleLogout() {
    await logout();
    navigation?.reset?.({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const menuItems = [
    { icon: '👤', label: 'Meus dados',              rota: 'MeusDados' },
    { icon: '🕐', label: 'Historico de ocorrência', rota: 'Historico' },
    { icon: '❓', label: 'Ajuda e suporte',          rota: 'Ajuda' },
    { icon: 'ℹ️', label: 'Sobre o ObservaCidade',    rota: 'SobreObservaCidade' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>← </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            {/* Ícone de pessoa desenhado com Views */}
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
        </View>

        {/* Nome e e-mail */}
        <Text style={styles.nome}>{usuario?.nome || 'Usuário'}</Text>
<Text style={styles.email}>{usuario?.email || ''}</Text>  

        {/* Menu */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation?.navigate(item.rota)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          style={styles.sairButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.sairText}>Sair</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('Home')} activeOpacity={0.7}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter} onPress={() => navigation?.navigate('NewReport')} activeOpacity={0.7}>
          <Text style={styles.navPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} activeOpacity={0.7}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#fff' },

  /* Header */
  header:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backArrow:      { fontSize: 22, color: '#1a1a2e', marginRight: 4 },
  headerTitle:    { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },

  scroll:         { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },

  /* Avatar */
  avatarWrapper:  { marginTop: 8, marginBottom: 16, alignItems: 'center' },
  avatarCircle:   { width: 110, height: 110, borderRadius: 55, backgroundColor: '#e8e0f7', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarHead:     { width: 38, height: 38, borderRadius: 19, backgroundColor: '#7c5cbf', marginBottom: -4 },
  avatarBody:     { width: 70, height: 40, borderRadius: 35, backgroundColor: '#7c5cbf', marginTop: 4 },

  /* Nome e e-mail */
  nome:           { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  email:          { fontSize: 13, color: '#64748b', marginBottom: 28 },

  /* Menu */
  menuList:       { width: '100%', gap: 0, marginBottom: 32 },
  menuItem:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuLeft:       { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon:       { fontSize: 20, width: 26, textAlign: 'center' },
  menuLabel:      { fontSize: 15, fontWeight: '500', color: '#1a1a2e' },
  menuArrow:      { fontSize: 18, color: '#1a1a2e', fontWeight: '600' },

  /* Botão Sair */
  sairButton:     { width: '100%', backgroundColor: '#f5f0dc', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  sairText:       { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },

  /* Bottom Nav */
  bottomNav:      { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 0 },
  navItem:        { alignItems: 'center', gap: 2 },
  navItemActive:  {},
  navItemCenter:  { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: -24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 },
  navPlus:        { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon:        { fontSize: 22 },
  navLabel:       { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
  navLabelActive: { color: '#1a1a2e', fontWeight: '700' },
});
