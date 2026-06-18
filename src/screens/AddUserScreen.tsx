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

const permissoesOpcoes = [
  { label: "Visualizar ocorrências", ativo: true },
  { label: "Criar / responder ocorrências", ativo: true },
  { label: "Editar status das ocorrências", ativo: true },
  { label: "Gerenciar usuários", ativo: false },
  { label: "Gerenciar categorias", ativo: false },
  { label: "Acessar relatórios", ativo: true },
  { label: "Configurações do sistema", ativo: false },
];

// ─── Header ADM reutilizável ─────────────────────────────────────────────────
function AdminHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.appNameBlue}>Observa</Text>
      <Text style={styles.appNameGold}>Cidade</Text>
      <View style={styles.admBadge}>
        <Text style={styles.admBadgeText}>ADM</Text>
      </View>
    </View>
  );
}

// ─── Stepper ─────────────────────────────────────────────────────────────────
function Stepper({ step }: { step: number }) {
  const steps = ["Dados pessoais", "Permissões", "Confirmar"];
  return (
    <View style={styles.stepperRow}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                i + 1 <= step && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[styles.stepNum, i + 1 <= step && styles.stepNumActive]}
              >
                {i + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                i + 1 === step && styles.stepLabelActive,
              ]}
            >
              {s}
            </Text>
          </View>
          {i < steps.length - 1 && (
            <View
              style={[styles.stepLine, i + 1 < step && styles.stepLineActive]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────────────────
function BottomNav({ navigation }: { navigation?: any }) {
  return (
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
        <Text style={styles.navLabel}>Ocorrências</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemCenter} activeOpacity={0.7}>
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
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Dados pessoais
// ═══════════════════════════════════════════════════════════════════════════════
export function AddUserStep1({ navigation }: Props) {
  const campos = [
    {
      label: "E-mail *",
      placeholder: "exemplo@email.com",
      keyboard: "email-address" as const,
    },
    {
      label: "Telefone *",
      placeholder: "(81) 99999-9999",
      keyboard: "phone-pad" as const,
    },
    {
      label: "CPF *",
      placeholder: "000.000.000-00",
      keyboard: "numeric" as const,
    },
    {
      label: "Data de nascimento *",
      placeholder: "dd/mm/aaaa",
      keyboard: "numeric" as const,
    },
    {
      label: "Endereço *",
      placeholder: "Digite o endereço completo",
      keyboard: "default" as const,
    },
    {
      label: "Bairro *",
      placeholder: "Digite o bairro",
      keyboard: "default" as const,
    },
  ];
  const [valores, setValores] = useState<{ [k: string]: string }>({});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />
      <AdminHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Adicionar usuário</Text>
            <Text style={styles.pageSubtitle}>
              Preencha os dados para criar um novo usuário no sistema.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>
        </View>

        <Stepper step={1} />

        {/* Seção dados pessoais */}
        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        {/* Avatar upload */}
        <View style={styles.avatarUpload}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarCameraIcon}>📷</Text>
          </View>
          {/* Nome completo */}
          <View style={styles.nomeField}>
            <Text style={styles.fieldLabel}>Nome completo *</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Digite o nome completo"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Outros campos */}
        {campos.map((c, i) => (
          <View key={i} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{c.label}</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder={c.placeholder}
              placeholderTextColor="#94a3b8"
              keyboardType={c.keyboard}
              value={valores[c.label] || ""}
              onChangeText={(t) => setValores((v) => ({ ...v, [c.label]: t }))}
            />
          </View>
        ))}

        {/* Cidade + CEP */}
        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Cidade *</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Digite a cidade"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>CEP *</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="00000-000"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Botões */}
        <View style={styles.botoesRow}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation?.navigate("AddUserStep2")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Permissões
// ═══════════════════════════════════════════════════════════════════════════════
export function AddUserStep2({ navigation }: Props) {
  const [tipoSelecionado, setTipoSelecionado] = useState<
    "funcionario" | "superadmin"
  >("funcionario");
  const [permissoes, setPermissoes] = useState(
    permissoesOpcoes.map((p) => p.ativo),
  );

  const togglePermissao = (i: number) => {
    setPermissoes((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />
      <AdminHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Definir tipo de usuário</Text>
            <Text style={styles.pageSubtitle}>
              Escolha o tipo de usuário e as permissões que ele terá.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation?.navigate("AdminUsers")}
            activeOpacity={0.7}
          >
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>
        </View>

        <Stepper step={2} />

        {/* Tipo Funcionário */}
        <TouchableOpacity
          style={[
            styles.tipoCard,
            tipoSelecionado === "funcionario" && styles.tipoCardActive,
          ]}
          onPress={() => setTipoSelecionado("funcionario")}
          activeOpacity={0.85}
        >
          <View style={[styles.tipoIconBox, { backgroundColor: "#fef9c3" }]}>
            <Text style={styles.tipoEmoji}>👷</Text>
          </View>
          <View style={styles.tipoInfo}>
            <Text style={styles.tipoNome}>Funcionário</Text>
            <Text style={styles.tipoDesc}>
              Pode analisar, responder e atualizar o status das ocorrências.
            </Text>
            <View style={styles.acessoBadge}>
              <Text style={styles.acessoBadgeText}>Acesso moderado</Text>
            </View>
          </View>
          <View
            style={[
              styles.radioOuter,
              tipoSelecionado === "funcionario" && styles.radioOuterActive,
            ]}
          >
            {tipoSelecionado === "funcionario" && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>

        {/* Tipo Super Admin */}
        <TouchableOpacity
          style={[
            styles.tipoCard,
            tipoSelecionado === "superadmin" && styles.tipoCardActive,
          ]}
          onPress={() => setTipoSelecionado("superadmin")}
          activeOpacity={0.85}
        >
          <View style={[styles.tipoIconBox, { backgroundColor: "#fee2e2" }]}>
            <Text style={styles.tipoEmoji}>🛡️</Text>
          </View>
          <View style={styles.tipoInfo}>
            <Text style={styles.tipoNome}>Super Administrador</Text>
            <Text style={styles.tipoDesc}>
              Acesso total ao sistema, com todas as permissões e configuração.
            </Text>
            <View style={[styles.acessoBadge, styles.acessoBadgeTotal]}>
              <Text style={styles.acessoBadgeText}>Acesso total</Text>
            </View>
          </View>
          <View
            style={[
              styles.radioOuter,
              tipoSelecionado === "superadmin" && styles.radioOuterActive,
            ]}
          >
            {tipoSelecionado === "superadmin" && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>

        {/* Permissões específicas */}
        <Text style={styles.sectionTitle}>Permissões específicas</Text>
        <View style={styles.permissoesCard}>
          {permissoesOpcoes.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={styles.permissaoRow}
              onPress={() => togglePermissao(i)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  permissoes[i] && styles.checkboxActive,
                ]}
              >
                {permissoes[i] && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.permissaoLabel}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.botoesRow}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation?.navigate("AddUserStep3")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Próximo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Confirmar
// ═══════════════════════════════════════════════════════════════════════════════
export function AddUserStep3({ navigation }: Props) {
  const permissoesConfirmadas = [
    { icon: "📋", label: "Criar / responder ocorrência" },
    { icon: "👁️", label: "Visualizar ocorrências" },
    { icon: "✏️", label: "Editar status de ocorrência" },
    { icon: "📊", label: "Acessar relatórios" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />
      <AdminHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Confirmar informações</Text>
            <Text style={styles.pageSubtitle}>
              Revise os dados abaixo antes de finalizar seu cadastro.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation?.navigate("AdminUsers")}
            activeOpacity={0.7}
          >
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>
        </View>

        <Stepper step={3} />

        {/* Resumo cadastro */}
        <View style={styles.resumoCard}>
          <Text style={styles.sectionTitle}>Resumo do cadastro</Text>

          <View style={styles.resumoTop}>
            <View style={styles.resumoAvatar}>
              <Text style={styles.resumoAvatarEmoji}>👤</Text>
            </View>
            <View style={styles.resumoInfo}>
              <Text style={styles.resumoInfoLabel}>Nome completo</Text>
              <Text style={styles.resumoInfoValue}>Paulo Henrique</Text>
              <Text style={styles.resumoInfoLabel}>E-mail</Text>
              <Text style={styles.resumoInfoValue}>paulohr@gmail.com</Text>
            </View>
            <View style={styles.resumoInfoRight}>
              <Text style={styles.resumoInfoLabel}>Telefone</Text>
              <Text style={styles.resumoInfoValue}>(81) 99999-9999</Text>
              <Text style={styles.resumoInfoLabel}>CPF</Text>
              <Text style={styles.resumoInfoValue}>123.456.789-00</Text>
            </View>
          </View>

          <View style={styles.resumoGrid}>
            <View style={styles.resumoGridItem}>
              <Text style={styles.resumoGridLabel}>Data de nascimento</Text>
              <Text style={styles.resumoGridValue}>20/05/1999</Text>
            </View>
            <View style={styles.resumoGridItem}>
              <Text style={styles.resumoGridLabel}>Endereço</Text>
              <Text style={styles.resumoGridValue}>
                Rua Matias da Silva, 22
              </Text>
            </View>
            <View style={styles.resumoGridItem}>
              <Text style={styles.resumoGridLabel}>Cidade / CEP</Text>
              <Text style={styles.resumoGridValue}>
                Surubim / PE - 55750-000
              </Text>
            </View>
            <View style={styles.resumoGridItem}>
              <Text style={styles.resumoGridLabel}>Status da conta</Text>
              <View style={styles.statusAtivo}>
                <View style={styles.statusDot} />
                <Text style={styles.statusAtivoText}>Ativo</Text>
              </View>
            </View>
            <View style={styles.resumoGridItem}>
              <Text style={styles.resumoGridLabel}>Tipo de usuário</Text>
              <View style={styles.tipoBadge}>
                <Text style={styles.tipoBadgeText}>Funcionário</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Permissões concedidas */}
        <View style={styles.permissoesCardConfirm}>
          <Text style={styles.sectionTitle}>Permissões concedidas</Text>
          {permissoesConfirmadas.map((p, i) => (
            <View key={i} style={styles.permissaoConfirmRow}>
              <Text style={styles.permissaoConfirmIcon}>{p.icon}</Text>
              <Text style={styles.permissaoConfirmLabel}>{p.label}</Text>
              <Text style={styles.permissaoCheck}>✅</Text>
            </View>
          ))}
        </View>

        <View style={styles.botoesRow}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation?.navigate("AdminUsers")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#7ec8e3" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  appNameBlue: { fontSize: 22, fontWeight: "700", color: "#1565c0" },
  appNameGold: { fontSize: 22, fontWeight: "700", color: "#c8860a" },
  admBadge: {
    backgroundColor: "#5bb8d4",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  admBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  scroll: { paddingHorizontal: 14, paddingBottom: 24 },

  /* Título */
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 17,
    maxWidth: 260,
  },
  closeX: { fontSize: 20, color: "#ef4444", fontWeight: "700" },

  /* Stepper */
  stepperRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  stepItem: { alignItems: "center", gap: 4 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: { backgroundColor: "#1565c0" },
  stepNum: { fontSize: 13, fontWeight: "700", color: "#94a3b8" },
  stepNumActive: { color: "#fff" },
  stepLabel: { fontSize: 9, color: "#94a3b8", textAlign: "center" },
  stepLabelActive: { color: "#1565c0", fontWeight: "700" },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e2e8f0",
    marginBottom: 12,
  },
  stepLineActive: { backgroundColor: "#1565c0" },

  /* Seção */
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 12,
  },

  /* Avatar upload */
  avatarUpload: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5bb8d4",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarCameraIcon: { fontSize: 28 },
  nomeField: { flex: 1 },

  /* Campos */
  fieldGroup: { marginBottom: 10 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  rowFields: { flexDirection: "row", gap: 10, marginBottom: 10 },

  /* Botões */
  botoesRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  btnSecondary: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  btnSecondaryText: { fontSize: 15, fontWeight: "600", color: "#1a1a2e" },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#5bb8d4",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnPrimaryText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  /* Tipo card */
  tipoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tipoCardActive: { borderColor: "#5bb8d4" },
  tipoIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipoEmoji: { fontSize: 28 },
  tipoInfo: { flex: 1 },
  tipoNome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  tipoDesc: { fontSize: 12, color: "#64748b", lineHeight: 17, marginBottom: 8 },
  acessoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fef9c3",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  acessoBadgeTotal: { backgroundColor: "#fee2e2" },
  acessoBadgeText: { fontSize: 11, fontWeight: "600", color: "#1a1a2e" },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioOuterActive: { borderColor: "#1565c0" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1565c0",
  },

  /* Permissões */
  permissoesCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  permissaoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: "#1565c0", borderColor: "#1565c0" },
  checkboxCheck: { fontSize: 12, color: "#fff", fontWeight: "700" },
  permissaoLabel: { fontSize: 13, color: "#1a1a2e" },

  /* Resumo */
  resumoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  resumoTop: { flexDirection: "row", gap: 10, marginBottom: 14 },
  resumoAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e8e0f7",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  resumoAvatarEmoji: { fontSize: 28 },
  resumoInfo: { flex: 1 },
  resumoInfoRight: { flex: 1 },
  resumoInfoLabel: { fontSize: 10, color: "#94a3b8", marginBottom: 1 },
  resumoInfoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 6,
  },
  resumoGrid: { gap: 8 },
  resumoGridItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumoGridLabel: { fontSize: 11, color: "#94a3b8" },
  resumoGridValue: { fontSize: 12, fontWeight: "600", color: "#1a1a2e" },
  statusAtivo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#dcfce7",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  statusAtivoText: { fontSize: 11, fontWeight: "600", color: "#16a34a" },
  tipoBadge: {
    backgroundColor: "#e0f2fe",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tipoBadgeText: { fontSize: 11, fontWeight: "600", color: "#0284c7" },

  /* Permissões confirm */
  permissoesCardConfirm: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  permissaoConfirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  permissaoConfirmIcon: { fontSize: 18, width: 24, textAlign: "center" },
  permissaoConfirmLabel: { flex: 1, fontSize: 13, color: "#1a1a2e" },
  permissaoCheck: { fontSize: 16 },

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
