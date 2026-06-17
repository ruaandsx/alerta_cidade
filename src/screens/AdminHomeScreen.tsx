import React, { useState } from "react";
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

const ocorrencias = [
  {
    titulo: "Esgoto na rua",
    endereco: "Avenida Magalhães, 128",
    hora: "Hoje,09:40",
    status: "Em andamento",
    statusCor: "#f59e0b",
    emoji: "🚧",
    bg: "#d4a373",
  },
  {
    titulo: "Buraco na via",
    endereco: "BR, 232",
    hora: "Hoje,08:20",
    status: "Em andamento",
    statusCor: "#f59e0b",
    emoji: "🛣️",
    bg: "#92a0a8",
  },
  {
    titulo: "Poste queimado",
    endereco: "Rua da paz, 78",
    hora: "Hoje,19:30",
    status: "Resolvido",
    statusCor: "#22c55e",
    emoji: "💡",
    bg: "#1a1a2e",
  },
  {
    titulo: "Lixo acumulado",
    endereco: "Rua das flores, 55",
    hora: "Ontem,14:15",
    status: "Pendente",
    statusCor: "#ef4444",
    emoji: "🗑️",
    bg: "#6b7280",
  },
  {
    titulo: "Calçada quebrada",
    endereco: "Rua dos Palmares, 55",
    hora: "Ontem,16:20",
    status: "Pendente",
    statusCor: "#ef4444",
    emoji: "🚶",
    bg: "#a3b5c0",
  },
];

const filtros = ["Todas", "Em andamento", "Pendentes", "Resolvidas"];

export default function AdminHomeScreen({ navigation }: Props) {
  const [filtroAtivo, setFiltroAtivo] = useState("Todas");

  const ocorrenciasFiltradas = ocorrencias.filter((o) => {
    if (filtroAtivo === "Todas") return true;
    if (filtroAtivo === "Em andamento") return o.status === "Em andamento";
    if (filtroAtivo === "Pendentes") return o.status === "Pendente";
    if (filtroAtivo === "Resolvidas") return o.status === "Resolvido";
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner boas-vindas */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeTitle}>Olá, administrador!</Text>
            <Text style={styles.welcomeDesc}>
              Acompanhe tudo o que acontece{"\n"}na sua cidade em tempo real.
            </Text>
          </View>
          <View style={styles.welcomeRight}>
            <TouchableOpacity style={styles.dateBtn} activeOpacity={0.8}>
              <Text style={styles.dateBtnText}>📅 Hoje,16 de maio 🔽</Text>
            </TouchableOpacity>
            {/* Cidade ilustrada */}
            <View style={styles.cityIllustration}>
              {[40, 60, 35, 70, 45, 30, 55].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.building,
                    { height: h, width: i === 3 ? 16 : 12 },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Visão geral */}
        <Text style={styles.sectionTitle}>Visão geral</Text>
        <View style={styles.statsRow}>
          {[
            {
              valor: "256",
              label: "Ocorrências\nrecebidas",
              icon: "📋",
              iconBg: "#e0f2fe",
              iconCor: "#0284c7",
            },
            {
              valor: "86",
              label: "Em\nandamento",
              icon: "✅",
              iconBg: "#fef9c3",
              iconCor: "#ca8a04",
            },
            {
              valor: "132",
              label: "Resolvidas",
              icon: "✅",
              iconBg: "#dcfce7",
              iconCor: "#16a34a",
            },
            {
              valor: "67",
              label: "Pendentes",
              icon: "⚠️",
              iconBg: "#fee2e2",
              iconCor: "#dc2626",
            },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: s.iconBg }]}>
                <Text style={styles.statEmoji}>{s.icon}</Text>
              </View>
              <Text style={styles.statValor}>{s.valor}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Acompanhamento */}
        <Text style={styles.sectionTitle}>Acompanhamento</Text>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosScroll}
        >
          <View style={styles.filtrosRow}>
            {filtros.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filtroBtn,
                  filtroAtivo === f && styles.filtroBtnActive,
                ]}
                onPress={() => setFiltroAtivo(f)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filtroText,
                    filtroAtivo === f && styles.filtroTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Lista ocorrências */}
        {ocorrenciasFiltradas.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.ocorrenciaCard}
            onPress={() => navigation?.navigate("ReportDetail", { item })}
            activeOpacity={0.8}
          >
            <View style={[styles.thumbnail, { backgroundColor: item.bg }]}>
              <Text style={styles.thumbnailEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.ocorrenciaInfo}>
              <Text style={styles.ocorrenciaTitulo}>{item.titulo}</Text>
              <Text style={styles.ocorrenciaEndereco}>{item.endereco}</Text>
              <Text style={styles.ocorrenciaHora}>{item.hora}</Text>
            </View>
            <View style={styles.ocorrenciaRight}>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.statusCor },
                  ]}
                />
                <Text style={[styles.statusText, { color: item.statusCor }]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.ocorrenciaArrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Nav Admin */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Início</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  appNameRow: { flexDirection: "row", alignItems: "baseline" },
  appNameBlue: { fontSize: 24, fontWeight: "700", color: "#1565c0" },
  appNameGold: { fontSize: 24, fontWeight: "700", color: "#c8860a" },

  scroll: { paddingHorizontal: 14, paddingBottom: 24 },

  /* Welcome banner */
  welcomeBanner: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  welcomeLeft: { flex: 1, justifyContent: "center" },
  welcomeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  welcomeDesc: { fontSize: 11, color: "#64748b", lineHeight: 17 },
  welcomeRight: { alignItems: "flex-end", gap: 8 },
  dateBtn: {
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dateBtnText: { fontSize: 11, color: "#334155", fontWeight: "500" },
  cityIllustration: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    marginTop: 4,
  },
  building: {
    backgroundColor: "#5bb8d4",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    opacity: 0.6,
  },

  /* Visão geral */
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 4,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statEmoji: { fontSize: 16 },
  statValor: { fontSize: 18, fontWeight: "800", color: "#1a1a2e" },
  statLabel: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 13,
  },

  /* Filtros */
  filtrosScroll: { marginBottom: 12 },
  filtrosRow: { flexDirection: "row", gap: 8, paddingRight: 8 },
  filtroBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  filtroBtnActive: { backgroundColor: "#1565c0" },
  filtroText: { fontSize: 12, fontWeight: "500", color: "#64748b" },
  filtroTextActive: { color: "#fff", fontWeight: "700" },

  /* Ocorrência card */
  ocorrenciaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  thumbnailEmoji: { fontSize: 28 },
  ocorrenciaInfo: { flex: 1 },
  ocorrenciaTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 2,
  },
  ocorrenciaEndereco: { fontSize: 11, color: "#64748b", marginBottom: 2 },
  ocorrenciaHora: { fontSize: 10, color: "#94a3b8" },
  ocorrenciaRight: { alignItems: "flex-end", gap: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: "600" },
  ocorrenciaArrow: { fontSize: 20, color: "#94a3b8" },

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
