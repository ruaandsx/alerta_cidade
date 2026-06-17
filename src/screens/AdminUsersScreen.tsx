import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";

type Props = { navigation?: any };

const usuarios = [
  {
    nome: "Joana Silva",
    email: "joana34@gmail.com",
    status: "Ativo",
    data: "Hoje, 07:10",
    emoji: "👩‍🦰",
    bg: "#e8b4b8",
  },
  {
    nome: "Paulo Henrique",
    email: "paulohr@gmail.com",
    status: "Ativo",
    data: "Hoje, 10:00",
    emoji: "👨‍🦲",
    bg: "#f4a460",
  },
  {
    nome: "Dyon Cleber",
    email: "dyon171@gmail.com",
    status: "Ativo",
    data: "Hoje, 13:40",
    emoji: "👷",
    bg: "#87ceeb",
  },
  {
    nome: "Mariana Maria",
    email: "mari98@gmail.com",
    status: "Ativo",
    data: "Ontem, 09:30",
    emoji: "👩",
    bg: "#dda0dd",
  },
  {
    nome: "Samuel",
    email: "sumucak7@gmail.com",
    status: "Ativo",
    data: "Ontem, 06:56",
    emoji: "🧑",
    bg: "#98fb98",
  },
  {
    nome: "Juliana Santos",
    email: "jusantos@gmail.com",
    status: "Ativo",
    data: "Ontem, 05:45",
    emoji: "👩‍💼",
    bg: "#ffd700",
  },
];

export default function AdminUsersScreen({ navigation }: Props) {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
          <View style={styles.admBadge}>
            <Text style={styles.admBadgeText}>ADM</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Card usuários */}
        <View style={styles.usersCard}>
          <View style={styles.usersCardHeader}>
            <Text style={styles.usersCardTitle}>Usuários</Text>
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
              <Text style={styles.addBtnText}>+ Adicionar funcionário</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👥</Text>
              <Text style={styles.statValor}>100</Text>
              <Text style={styles.statLabel}>Total de usuários</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValor}>71</Text>
              <Text style={styles.statLabel}>Usuários ativos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👤</Text>
              <Text style={styles.statValor}>35</Text>
              <Text style={styles.statLabel}>Novos este mês</Text>
            </View>
          </View>
        </View>

        {/* Campo de busca */}
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

        {/* Lista de usuários */}
        <View style={styles.listaCard}>
          {usuariosFiltrados.map((usuario, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.usuarioRow,
                index < usuariosFiltrados.length - 1 && styles.usuarioRowBorder,
              ]}
              activeOpacity={0.7}
            >
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: usuario.bg }]}>
                <Text style={styles.avatarEmoji}>{usuario.emoji}</Text>
              </View>

              {/* Info */}
              <View style={styles.usuarioInfo}>
                <Text style={styles.usuarioNome}>{usuario.nome}</Text>
                <Text style={styles.usuarioEmail}>{usuario.email}</Text>
              </View>

              {/* Status e data */}
              <View style={styles.usuarioRight}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{usuario.status}</Text>
                </View>
                <Text style={styles.usuarioData}>{usuario.data}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Paginação */}
        <View style={styles.paginacaoRow}>
          <TouchableOpacity
            style={[
              styles.pageBtn,
              paginaAtual === 1 && styles.pageBtnDisabled,
            ]}
            onPress={() => setPaginaAtual((p) => Math.max(1, p - 1))}
            activeOpacity={0.7}
          >
            <Text style={styles.pageBtnText}>‹</Text>
          </TouchableOpacity>

          {[1, 2, 3].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.pageNum,
                paginaAtual === p && styles.pageNumActive,
              ]}
              onPress={() => setPaginaAtual(p)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.pageNumText,
                  paginaAtual === p && styles.pageNumTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.pageDots}>...</Text>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => setPaginaAtual((p) => p + 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.nextBtnText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav Admin */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate("AdminHome")}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate("Historico")}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Denúncias</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItemCenter}
          onPress={() => navigation?.navigate("NewReport")}
          activeOpacity={0.7}
        >
          <Text style={styles.navPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>👥</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate("AdminProfile")}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#7ec8e3" },

  /* Header */
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  appNameBlue: { fontSize: 24, fontWeight: "700", color: "#1565c0" },
  appNameGold: { fontSize: 24, fontWeight: "700", color: "#c8860a" },
  admBadge: {
    backgroundColor: "#5bb8d4",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  admBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },

  scroll: { paddingHorizontal: 14, paddingBottom: 24, gap: 12 },

  /* Card usuários */
  usersCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  usersCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  usersCardTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a2e" },
  addBtn: {
    backgroundColor: "#5bb8d4",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center", gap: 4 },
  statEmoji: { fontSize: 28 },
  statValor: { fontSize: 22, fontWeight: "800", color: "#1a1a2e" },
  statLabel: { fontSize: 10, color: "#64748b", textAlign: "center" },

  /* Busca */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 46,
    gap: 8,
  },
  searchIcon: { fontSize: 18 },
  searchInput: { flex: 1, fontSize: 14, color: "#1a1a2e" },

  /* Lista */
  listaCard: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  usuarioRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  usuarioRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 26 },
  usuarioInfo: { flex: 1 },
  usuarioNome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 2,
  },
  usuarioEmail: { fontSize: 11, color: "#64748b" },
  usuarioRight: { alignItems: "flex-end", gap: 4 },
  statusBadge: {
    backgroundColor: "#22c55e",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  usuarioData: { fontSize: 10, color: "#94a3b8" },

  /* Paginação */
  paginacaoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pageBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { fontSize: 18, color: "#64748b" },
  pageNum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumActive: { backgroundColor: "#1565c0" },
  pageNumText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  pageNumTextActive: { color: "#fff" },
  pageDots: { fontSize: 16, color: "#64748b" },
  nextBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  nextBtnText: { fontSize: 13, fontWeight: "600", color: "#1565c0" },

  /* Bottom Nav */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#7ec8e3",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  navItem: { alignItems: "center", gap: 2 },
  navItemActive: {},
  navItemCenter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
    elevation: 4,
  },
  navPlus: { fontSize: 28, color: "#1a1a2e", lineHeight: 32 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: "500", color: "#1a3a5c" },
  navLabelActive: { fontWeight: "700", color: "#1a1a2e" },
});
