import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";

type Props = { navigation?: any };

export default function AdminProfileScreen({ navigation }: Props) {
  const admin = {
    nome: "Admin ObervaCidade",
    cargo: "Administrador",
    email: "admin@observacidade.com",
    telefone: "(81) 99999-9999",
    cargoCompleto: "Super Administrador",
    departamento: "Tecnologia da Informação",
    permissoes: "Acesso ao sistema",
    status: "Ativo",
  };

  const stats = [
    { valor: "35", label: "Ações\nrealizadas", icon: "✅", cor: "#22c55e" },
    { valor: "15", label: "Usuários\ngerenciados", icon: "👥", cor: "#5bb8d4" },
    { valor: "80", label: "Denúncias\ngestadas", icon: "⚙️", cor: "#64748b" },
  ];

  const acoes = [
    { icon: "🔒", label: "Alterar senha", cor: "#5bb8d4" },
    { icon: "⚙️", label: "Configuração da conta", cor: "#5bb8d4" },
    { icon: "🚪", label: "Sair da conta", cor: "#ef4444" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Meu perfil</Text>
          <Text style={styles.headerSubtitle}>Admnistrador</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Card perfil */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>🦸</Text>
              </View>
              <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                <Text style={styles.cameraEmoji}>📷</Text>
              </TouchableOpacity>
            </View>

            {/* Info direita */}
            <View style={styles.profileInfo}>
              <Text style={styles.profileNome}>{admin.nome}</Text>
              <View style={styles.badgeWrapper}>
                <Text style={styles.badgeText}>{admin.cargo}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileIcon}>✉️</Text>
                <Text style={styles.profileText}>{admin.email}</Text>
              </View>
              <View style={styles.profileRow}>
                <Text style={styles.profileIcon}>📞</Text>
                <Text style={styles.profileText}>{admin.telefone}</Text>
              </View>
            </View>
          </View>

          {/* Campos */}
          {[
            {
              icon: "👤",
              label: "Nome completo",
              value: "Administrador do sistema",
              editavel: true,
            },
            {
              icon: "💼",
              label: "Cargo",
              value: admin.cargoCompleto,
              editavel: false,
            },
            {
              icon: "🏢",
              label: "Departamento",
              value: admin.departamento,
              editavel: false,
            },
            {
              icon: "📍",
              label: "Permissões",
              value: admin.permissoes,
              editavel: false,
            },
          ].map((campo, i) => (
            <View key={i} style={styles.campoRow}>
              <Text style={styles.campoIcon}>{campo.icon}</Text>
              <View style={styles.campoContent}>
                <Text style={styles.campoLabel}>{campo.label}</Text>
                <Text style={styles.campoValue}>{campo.value}</Text>
              </View>
              {campo.editavel && (
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Status da conta */}
          <View style={styles.statusRow}>
            <Text style={styles.campoIcon}>✔️</Text>
            <View style={styles.campoContent}>
              <Text style={styles.campoLabel}>Status da conta</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{admin.status}</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Suas estatísticas</Text>
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

        {/* Ações rápidas */}
        <View style={styles.acoesCard}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
          {acoes.map((acao, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.acaoRow,
                i < acoes.length - 1 && styles.acaoRowBorder,
              ]}
              activeOpacity={0.7}
              onPress={() =>
                acao.label === "Sair da conta" &&
                navigation?.navigate("Welcome")
              }
            >
              <View
                style={[
                  styles.acaoIcon,
                  {
                    backgroundColor:
                      acao.cor === "#ef4444" ? "#fef2f2" : "#e0f2fe",
                  },
                ]}
              >
                <Text style={styles.acaoEmoji}>{acao.icon}</Text>
              </View>
              <Text
                style={[
                  styles.acaoLabel,
                  acao.cor === "#ef4444" && styles.acaoLabelRed,
                ]}
              >
                {acao.label}
              </Text>
              <Text style={styles.acaoArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Admin */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate("Home")}
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
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#7ec8e3" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  backArrow: { fontSize: 22, color: "#1a1a2e", marginTop: 2 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a2e" },
  headerSubtitle: { fontSize: 13, color: "#1a3a5c" },

  scroll: { paddingHorizontal: 14, paddingBottom: 24, gap: 12 },

  /* Profile card */
  profileCard: { backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  profileTop: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  avatarWrapper: { position: "relative" },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e8e0f7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 38 },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cameraEmoji: { fontSize: 11 },
  profileInfo: { flex: 1, gap: 4 },
  profileNome: { fontSize: 15, fontWeight: "700", color: "#1a1a2e" },
  badgeWrapper: {
    alignSelf: "flex-start",
    backgroundColor: "#5bb8d4",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 2,
  },
  badgeText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  profileIcon: { fontSize: 13 },
  profileText: { fontSize: 12, color: "#334155" },

  /* Campos */
  campoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  campoIcon: { fontSize: 18, width: 24, textAlign: "center" },
  campoContent: { flex: 1 },
  campoLabel: { fontSize: 11, color: "#94a3b8", marginBottom: 1 },
  campoValue: { fontSize: 13, fontWeight: "500", color: "#1a1a2e" },
  editIcon: { fontSize: 16 },

  /* Status */
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
  statusText: { fontSize: 13, fontWeight: "600", color: "#22c55e" },

  /* Stats */
  statsCard: { backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 14,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center", gap: 4 },
  statIcon: { fontSize: 24 },
  statValor: { fontSize: 22, fontWeight: "800", color: "#1a1a2e" },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 16,
  },

  /* Ações */
  acoesCard: { backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  acaoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  acaoRowBorder: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  acaoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  acaoEmoji: { fontSize: 18 },
  acaoLabel: { flex: 1, fontSize: 14, fontWeight: "500", color: "#1a1a2e" },
  acaoLabelRed: { color: "#ef4444" },
  acaoArrow: { fontSize: 22, color: "#94a3b8", fontWeight: "300" },

  /* Bottom Nav */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#7ec8e3",
    paddingVertical: 10,
    paddingHorizontal: 16,
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
