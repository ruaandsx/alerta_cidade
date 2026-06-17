import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, TextInput,
} from 'react-native';

type Props = { navigation?: any };

const assuntos = [
  { icon: '📄', label: 'Dúvidas sobre\nocorrência' },
  { icon: '⚙️', label: 'Problemas no\naplicativo' },
  { icon: '👤', label: 'Contas e\ncadastro' },
  { icon: '🔔', label: 'Notificações' },
  { icon: '🔒', label: 'Privacidade e\nsegurança' },
  { icon: '•••', label: 'Outros\nassuntos' },
];

export default function SupportScreen({ navigation }: Props) {
  const [mensagem, setMensagem] = useState('');
  const [assuntoSelecionado, setAssuntoSelecionado] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Falar com suporte</Text>
          <Text style={styles.headerSubtitle}>Estamos aqui para ajudar!</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.helpIcon}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Card boas vindas */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Olá, como{'\n'}podemos ajudar?</Text>
            <Text style={styles.welcomeDesc}>Escolha um dos assuntos{'\n'}abaixo ou envie sua mensagem.</Text>
          </View>
          <View style={styles.welcomeIllustration}>
            {/* Atendente estilizada */}
            <View style={styles.agentCircle}>
              <Text style={styles.agentEmoji}>👩‍💻</Text>
            </View>
            <View style={styles.bubbleChat}>
              <Text style={styles.bubbleDots}>···</Text>
            </View>
          </View>
        </View>

        {/* Assuntos rápidos */}
        <Text style={styles.sectionTitle}>Assuntos rápidos</Text>
        <View style={styles.assuntosGrid}>
          {assuntos.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.assuntoCard, assuntoSelecionado === index && styles.assuntoCardActive]}
              onPress={() => setAssuntoSelecionado(index)}
              activeOpacity={0.8}
            >
              <Text style={styles.assuntoIcon}>{item.icon}</Text>
              <Text style={styles.assuntoLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enviar mensagem */}
        <Text style={styles.sectionTitle}>Envie sua mensagem</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textArea}
            placeholder="Descreva sua dúvida ou problema..."
            placeholderTextColor="#94a3b8"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{mensagem.length}/500</Text>
          <TouchableOpacity style={styles.anexoBtn} activeOpacity={0.7}>
            <Text style={styles.anexoIcon}>📎</Text>
            <Text style={styles.anexoText}>Adicionar anexo (opcional)</Text>
          </TouchableOpacity>
        </View>

        {/* Botão enviar */}
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.85}>
          <Text style={styles.sendIcon}>➤</Text>
          <Text style={styles.sendText}>Enviar mensagem</Text>
        </TouchableOpacity>

        {/* Card atendimento */}
        <View style={styles.atendimentoCard}>
          <View style={styles.atendimentoIcon}>
            <Text style={styles.headphoneEmoji}>🎧</Text>
          </View>
          <View style={styles.atendimentoText}>
            <Text style={styles.atendimentoTitle}>Atendimento</Text>
            <Text style={styles.atendimentoDesc}>Segunda a sexta, das 08h às 18h{'\n'}Resposta em até 24h úteis</Text>
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
  container:          { flex: 1, backgroundColor: '#7ec8e3' },

  /* Header */
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  backArrow:          { fontSize: 24, color: '#1a1a2e', fontWeight: '400', width: 32 },
  headerCenter:       { alignItems: 'center', flex: 1 },
  headerTitle:        { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  headerSubtitle:     { fontSize: 12, color: '#1a3a5c', marginTop: 2 },
  helpIcon:           { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#1a1a2e', textAlign: 'center', lineHeight: 24, fontSize: 14, fontWeight: '700', color: '#1a1a2e' },

  scroll:             { paddingHorizontal: 16, paddingBottom: 24 },

  /* Welcome Card */
  welcomeCard:        { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  welcomeText:        { flex: 1 },
  welcomeTitle:       { fontSize: 18, fontWeight: '800', color: '#1a1a2e', lineHeight: 24, marginBottom: 6 },
  welcomeDesc:        { fontSize: 12, color: '#64748b', lineHeight: 18 },
  welcomeIllustration:{ alignItems: 'center', position: 'relative' },
  agentCircle:        { width: 70, height: 70, borderRadius: 35, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  agentEmoji:         { fontSize: 40 },
  bubbleChat:         { position: 'absolute', top: -8, right: -4, backgroundColor: '#5bb8d4', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3 },
  bubbleDots:         { fontSize: 12, color: '#fff', fontWeight: '700', letterSpacing: 1 },

  /* Assuntos */
  sectionTitle:       { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  assuntosGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  assuntoCard:        { width: '30%', backgroundColor: '#5bb8d4', borderRadius: 14, padding: 12, alignItems: 'center', gap: 8, minHeight: 90, justifyContent: 'center' },
  assuntoCardActive:  { backgroundColor: '#1565c0' },
  assuntoIcon:        { fontSize: 26 },
  assuntoLabel:       { fontSize: 11, fontWeight: '600', color: '#fff', textAlign: 'center', lineHeight: 15 },

  /* Input mensagem */
  inputCard:          { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12 },
  textArea:           { height: 100, fontSize: 13, color: '#1a1a2e', marginBottom: 4 },
  charCount:          { fontSize: 11, color: '#94a3b8', textAlign: 'right', marginBottom: 10 },
  anexoBtn:           { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  anexoIcon:          { fontSize: 16 },
  anexoText:          { fontSize: 13, color: '#64748b' },

  /* Botão enviar */
  sendButton:         { backgroundColor: '#1565c0', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 },
  sendIcon:           { fontSize: 18, color: '#fff' },
  sendText:           { fontSize: 16, fontWeight: '700', color: '#fff' },

  /* Atendimento */
  atendimentoCard:    { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  atendimentoIcon:    { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  headphoneEmoji:     { fontSize: 24 },
  atendimentoText:    { flex: 1 },
  atendimentoTitle:   { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  atendimentoDesc:    { fontSize: 12, color: '#64748b', lineHeight: 18 },

  /* Bottom Nav */
  bottomNav:          { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem:            { alignItems: 'center', gap: 2 },
  navItemCenter:      { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: -24, elevation: 4 },
  navPlus:            { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon:            { fontSize: 22 },
  navLabel:           { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
});
