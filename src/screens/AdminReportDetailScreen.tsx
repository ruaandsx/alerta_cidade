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

export default function AdminReportDetailScreen({ navigation }: Props) {
  const [status, setStatus] = useState("Em análise");

  const comentarios = [
    {
      iniciais: "MC",
      cor: "#7c5cbf",
      nome: "Maria Clara",
      data: "03/04 às 11:15",
      texto: "Esse buraco está aumentando cada vez mais!",
      likes: 2,
    },
    {
      iniciais: "PS",
      cor: "#0284c7",
      nome: "Paulo Santos",
      data: "03/04 às 12:40",
      texto: "A prefeitura precisa resolver isso urgente.",
      likes: 1,
    },
    {
      iniciais: "AF",
      cor: "#16a34a",
      nome: "Ana Flávia",
      data: "04/04 às 09:22",
      texto: "Concordo, já vi vários carros desviando de última hora.",
      likes: 0,
    },
  ];

  const historico = [
    {
      icon: "✅",
      cor: "#22c55e",
      titulo: "Ocorrência criada",
      data: "03/04 às 10:23",
      desc: "Ocorrência enviada pelo usuário João Silva",
    },
    {
      icon: "🔍",
      cor: "#f59e0b",
      titulo: "Em análise",
      data: "03/04 às 11:02",
      desc: "Ocorrência recebida e está sob análise da equipe",
    },
    {
      icon: "👥",
      cor: "#5bb8d4",
      titulo: "Equipe acionada",
      data: "04/04 às 14:30",
      desc: "Equipe de manutenção foi designada para vistoria",
    },
    {
      icon: "⏳",
      cor: "#94a3b8",
      titulo: "Aguardando atualização",
      data: "",
      desc: "Aguardando retorno da equipe responsável",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Detalhes da ocorrência</Text>
          <Text style={styles.headerSubtitle}>ID: #O-2026-00124</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagem principal */}
        <View style={styles.imagemWrapper}>
          <View style={styles.imagemPrincipal}>
            <Text style={styles.imagemEmoji}>🛣️</Text>
            <View style={styles.imagemCounter}>
              <Text style={styles.imagemCounterText}>1/3</Text>
            </View>
          </View>

          {/* Info lateral */}
          <View style={styles.infoLateral}>
            {/* Status */}
            <TouchableOpacity style={styles.statusBtn} activeOpacity={0.8}>
              <Text style={styles.statusBtnText}>{status} 🔽</Text>
            </TouchableOpacity>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValue}>Buraco na via</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.prioRow}>
                <View
                  style={[styles.prioDot, { backgroundColor: "#f59e0b" }]}
                />
                <View>
                  <Text style={styles.infoLabel}>Prioridade</Text>
                  <Text style={styles.infoValue}>Média</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Data da criação</Text>
                <Text style={styles.infoValue}>03/04/2026 às 10:23</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👤</Text>
              <View>
                <Text style={styles.infoLabel}>Ocorrência enviada por</Text>
                <Text style={styles.infoValue}>João Silva</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📞</Text>
              <View>
                <Text style={styles.infoLabel}>Contato</Text>
                <Text style={styles.infoValue}>(81) 99876-5432</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Thumbnails */}
        <View style={styles.thumbsRow}>
          {["🛣️", "🚧", "🏚️"].map((e, i) => (
            <View key={i} style={styles.thumb}>
              <Text style={styles.thumbEmoji}>{e}</Text>
            </View>
          ))}
          <View style={[styles.thumb, styles.thumbMore]}>
            <Text style={styles.thumbMoreText}>+1</Text>
          </View>
        </View>

        {/* Ações administrativas */}
        <Text style={styles.sectionTitle}>Ações administrativas</Text>
        <View style={styles.acoesRow}>
          <TouchableOpacity
            style={[styles.acaoBtn, { backgroundColor: "#5bb8d4" }]}
            activeOpacity={0.8}
          >
            <Text style={styles.acaoBtnIcon}>🔄</Text>
            <Text style={styles.acaoBtnText}>Atualizar{"\n"}status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acaoBtn, { backgroundColor: "#22c55e" }]}
            activeOpacity={0.8}
          >
            <Text style={styles.acaoBtnIcon}>✅</Text>
            <Text style={styles.acaoBtnText}>Marcar como{"\n"}resolvida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acaoBtn, { backgroundColor: "#f59e0b" }]}
            activeOpacity={0.8}
          >
            <Text style={styles.acaoBtnIcon}>💬</Text>
            <Text style={styles.acaoBtnText}>Responder ao{"\n"}usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acaoBtn, { backgroundColor: "#ef4444" }]}
            activeOpacity={0.8}
          >
            <Text style={styles.acaoBtnIcon}>🚫</Text>
            <Text style={styles.acaoBtnText}>Rejeitar{"\n"}ocorrência</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acaoBtn, { backgroundColor: "#64748b" }]}
            activeOpacity={0.8}
          >
            <Text style={styles.acaoBtnIcon}>🗑️</Text>
            <Text style={styles.acaoBtnText}>Excluir</Text>
          </TouchableOpacity>
        </View>

        {/* Descrição */}
        <Text style={styles.sectionTitle}>Descrição da ocorrência</Text>
        <View style={styles.descricaoCard}>
          <Text style={styles.descricaoText}>
            Existe um buraco grande na rua que está acumulando água quando
            chove. Já tem muitos dias assim e está causando transtornos para
            motoristas e pedestres.
          </Text>
        </View>

        {/* Comentários */}
        <View style={styles.comentariosHeader}>
          <Text style={styles.sectionTitle}>Comentários dos usuários (3)</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {comentarios.map((c, i) => (
          <View key={i} style={styles.comentarioCard}>
            <View style={[styles.avatar, { backgroundColor: c.cor }]}>
              <Text style={styles.avatarText}>{c.iniciais}</Text>
            </View>
            <View style={styles.comentarioContent}>
              <View style={styles.comentarioTop}>
                <Text style={styles.comentarioNome}>{c.nome}</Text>
                <Text style={styles.comentarioData}>{c.data}</Text>
                <View style={styles.likeRow}>
                  <Text style={styles.likeIcon}>👍</Text>
                  <Text style={styles.likeCount}>{c.likes}</Text>
                </View>
              </View>
              <Text style={styles.comentarioTexto}>{c.texto}</Text>
            </View>
          </View>
        ))}

        {/* Histórico + Resposta lado a lado */}
        <View style={styles.duasColunasRow}>
          {/* Histórico */}
          <View style={[styles.colunaCard, { flex: 1 }]}>
            <Text style={styles.colunaTitle}>Histórico da ocorrência</Text>
            {historico.map((h, i) => (
              <View key={i} style={styles.historicoItem}>
                <View
                  style={[styles.historicoIconBox, { backgroundColor: h.cor }]}
                >
                  <Text style={styles.historicoIcon}>{h.icon}</Text>
                </View>
                <View style={styles.historicoInfo}>
                  <Text style={styles.historicoTitulo}>{h.titulo}</Text>
                  {h.data ? (
                    <Text style={styles.historicoData}>{h.data}</Text>
                  ) : null}
                  <Text style={styles.historicoDesc}>{h.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Resposta */}
          <View style={[styles.colunaCard, { flex: 1 }]}>
            <Text style={styles.colunaTitle}>Resposta da administração</Text>
            <View style={styles.respostaCard}>
              <View style={[styles.avatar, { backgroundColor: "#1565c0" }]}>
                <Text style={styles.avatarText}>🏛️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.respostaNome}>Admin ObservaCidade</Text>
                <Text style={styles.respostaData}>04/04 às 14:30</Text>
              </View>
            </View>
            <Text style={styles.respostaTexto}>
              Olá, João! Nossa equipe foi acionada e irá realizar uma vistoria
              no local ainda hoje. Agradecemos seu contato!
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.verRespostas}>Ver todas as respostas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Anexos */}
        <Text style={styles.sectionTitle}>Anexos da ocorrência</Text>
        <View style={styles.anexosRow}>
          {["🛣️", "🚧", "🏚️"].map((e, i) => (
            <View key={i} style={styles.anexoThumb}>
              <Text style={styles.anexoEmoji}>{e}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.anexoAdd} activeOpacity={0.7}>
            <Text style={styles.anexoAddText}>+</Text>
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
          style={[styles.navItem, styles.navItemActive]}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📋</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>
            Ocorrências
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter} activeOpacity={0.7}>
          <Text style={styles.navPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate("AdminUsers")}
          activeOpacity={0.7}
        >
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backArrow: { fontSize: 22, color: "#1a1a2e" },
  headerCenter: { alignItems: "center", flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a2e" },
  headerSubtitle: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  menuDots: { fontSize: 22, color: "#64748b" },
  scroll: { paddingHorizontal: 14, paddingBottom: 24 },

  /* Imagem + info */
  imagemWrapper: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    marginBottom: 10,
  },
  imagemPrincipal: {
    width: 160,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#92a0a8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  imagemEmoji: { fontSize: 48 },
  imagemCounter: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  imagemCounterText: { fontSize: 11, color: "#fff", fontWeight: "600" },
  infoLateral: { flex: 1, gap: 6 },
  statusBtn: {
    backgroundColor: "#fef9c3",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  statusBtnText: { fontSize: 11, fontWeight: "700", color: "#b45309" },
  infoItem: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  infoIcon: { fontSize: 13, marginTop: 1 },
  infoLabel: { fontSize: 9, color: "#94a3b8" },
  infoValue: { fontSize: 11, fontWeight: "600", color: "#1a1a2e" },
  prioRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  prioDot: { width: 8, height: 8, borderRadius: 4, marginTop: 10 },

  /* Thumbnails */
  thumbsRow: { flexDirection: "row", gap: 6, marginBottom: 14 },
  thumb: {
    width: 52,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbEmoji: { fontSize: 22 },
  thumbMore: { backgroundColor: "#cbd5e1" },
  thumbMoreText: { fontSize: 13, fontWeight: "700", color: "#475569" },

  /* Ações */
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  acoesRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  acaoBtn: { borderRadius: 10, padding: 8, alignItems: "center", minWidth: 58 },
  acaoBtnIcon: { fontSize: 18, marginBottom: 2 },
  acaoBtnText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    lineHeight: 13,
  },

  /* Descrição */
  descricaoCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  descricaoText: { fontSize: 13, color: "#334155", lineHeight: 20 },

  /* Comentários */
  comentariosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  verTodos: { fontSize: 12, fontWeight: "600", color: "#1565c0" },
  comentarioCard: { flexDirection: "row", gap: 8, marginBottom: 12 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  comentarioContent: { flex: 1 },
  comentarioTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  comentarioNome: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a1a2e",
    flex: 1,
  },
  comentarioData: { fontSize: 10, color: "#94a3b8" },
  likeRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  likeIcon: { fontSize: 12 },
  likeCount: { fontSize: 11, color: "#64748b" },
  comentarioTexto: { fontSize: 12, color: "#334155", lineHeight: 17 },

  /* Duas colunas */
  duasColunasRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  colunaCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  colunaTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 10,
  },

  /* Histórico */
  historicoItem: { flexDirection: "row", gap: 8, marginBottom: 10 },
  historicoIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  historicoIcon: { fontSize: 12 },
  historicoInfo: { flex: 1 },
  historicoTitulo: { fontSize: 11, fontWeight: "700", color: "#1a1a2e" },
  historicoData: { fontSize: 9, color: "#94a3b8", marginBottom: 1 },
  historicoDesc: { fontSize: 10, color: "#64748b", lineHeight: 14 },

  /* Resposta */
  respostaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  respostaNome: { fontSize: 11, fontWeight: "700", color: "#1a1a2e" },
  respostaData: { fontSize: 9, color: "#94a3b8" },
  respostaTexto: {
    fontSize: 11,
    color: "#334155",
    lineHeight: 16,
    marginBottom: 8,
  },
  verRespostas: { fontSize: 11, color: "#1565c0", fontWeight: "600" },

  /* Anexos */
  anexosRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  anexoThumb: {
    width: 70,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  anexoEmoji: { fontSize: 26 },
  anexoAdd: {
    width: 70,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  anexoAddText: { fontSize: 28, color: "#94a3b8", fontWeight: "300" },

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
