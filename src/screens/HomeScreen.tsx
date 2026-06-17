import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, TextInput,
} from 'react-native';

type Props = { navigation?: any };

const feed = [
  {
    id: 1,
    titulo: 'Esgoto na rua',
    endereco: 'Rua das flores, 55',
    grau: 'Grau médio',
    grauCor: '#f59e0b',
    data: '03/04/2026',
    emoji: '🚧',
    bg: '#d4a373',
    comentario: {
      iniciais: 'MC',
      corBg: '#7c5cbf',
      nome: 'Maria Clara',
      tempo: '2h',
      texto: 'Esse esgoto está transbordando sempre que chove!',
      totalComentarios: 2,
    },
  },
  {
    id: 2,
    titulo: 'Lixo acumulado',
    endereco: 'Avenida Magalhães, 128',
    grau: 'Grau alto',
    grauCor: '#ef4444',
    data: '10/04/2026',
    emoji: '🗑️',
    bg: '#6b7280',
    comentario: {
      iniciais: 'PS',
      corBg: '#0284c7',
      nome: 'Paulo Santos',
      tempo: '5h',
      texto: 'Esse lixo está atraindo muitos animais e mau cheiro.',
      totalComentarios: 3,
    },
  },
  {
    id: 3,
    titulo: 'Buraco na via',
    endereco: 'BR232',
    grau: 'Grau médio',
    grauCor: '#f59e0b',
    data: '13/04/2026',
    emoji: '🛣️',
    bg: '#92a0a8',
    comentario: {
      iniciais: 'AF',
      corBg: '#16a34a',
      nome: 'Ana Flávia',
      tempo: '1d',
      texto: 'Já vi vários carros desviando de última hora.',
      totalComentarios: 5,
    },
  },
];

export default function HomeScreen({ navigation }: Props) {
  const [comentarios, setComentarios] = useState<{ [key: number]: string }>({});

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Banner hero */}
        <View style={styles.heroBanner}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Faça sua parte por{'\n'}uma cidade melhor!</Text>
            <Text style={styles.heroDesc}>Reporte problemas e ajude{'\n'}a construir soluções.</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => navigation?.navigate('NewReport')} activeOpacity={0.85}>
              <Text style={styles.heroBtnText}>Nova ocorrência</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroIllustration}>
            <View style={styles.agentCircle}>
              <Text style={styles.agentEmoji}>👩‍💻</Text>
            </View>
            <View style={styles.bubble}>
              <Text style={styles.bubbleDots}>···</Text>
            </View>
          </View>
        </View>

        {/* Título feed */}
        <Text style={styles.feedTitle}>Ocorrências ativa da população:</Text>

        {/* Feed de ocorrências */}
        {feed.map((item) => (
          <View key={item.id} style={styles.feedCard}>

            {/* Ocorrência */}
            <View style={styles.ocorrenciaRow}>
              <View style={[styles.thumbnail, { backgroundColor: item.bg }]}>
                <Text style={styles.thumbnailEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.ocorrenciaInfo}>
                <Text style={styles.ocorrenciaTitulo}>{item.titulo}</Text>
                <Text style={styles.ocorrenciaEndereco}>{item.endereco}</Text>
                <View style={styles.ocorrenciaBottom}>
                  <View style={styles.grauRow}>
                    <View style={[styles.grauDot, { backgroundColor: item.grauCor }]} />
                    <Text style={styles.grauText}>{item.grau}</Text>
                  </View>
                  <Text style={styles.ocorrenciaData}>{item.data}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.menuDots} activeOpacity={0.7}>
                <Text style={styles.menuDotsText}>⋮</Text>
              </TouchableOpacity>
            </View>

            {/* Divisor */}
            <View style={styles.divider} />

            {/* Comentário */}
            <View style={styles.comentarioRow}>
              <View style={[styles.avatar, { backgroundColor: item.comentario.corBg }]}>
                <Text style={styles.avatarText}>{item.comentario.iniciais}</Text>
              </View>
              <View style={styles.comentarioContent}>
                <View style={styles.comentarioHeader}>
                  <Text style={styles.comentarioNome}>{item.comentario.nome}</Text>
                  <Text style={styles.comentarioTempo}>{item.comentario.tempo}</Text>
                </View>
                <Text style={styles.comentarioTexto}>{item.comentario.texto}</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.verComentarios}>Ver todos os {item.comentario.totalComentarios} comentários</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Input comentário */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escreva um comentário..."
                placeholderTextColor="#94a3b8"
                value={comentarios[item.id] || ''}
                onChangeText={(text) => setComentarios(prev => ({ ...prev, [item.id]: text }))}
              />
              <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7}>
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>

          </View>
        ))}

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} activeOpacity={0.7}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Início</Text>
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
  container:          { flex: 1, backgroundColor: '#fff' },

  /* Header */
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  appNameRow:         { flexDirection: 'row', alignItems: 'baseline' },
  appNameBlue:        { fontSize: 26, fontWeight: '700', color: '#1565c0' },
  appNameGold:        { fontSize: 26, fontWeight: '700', color: '#c8860a' },
  notifBtn:           { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  notifIcon:          { fontSize: 22 },

  scroll:             { paddingBottom: 24 },

  /* Hero Banner */
  heroBanner:         { backgroundColor: '#d6eef8', marginHorizontal: 16, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  heroText:           { flex: 1 },
  heroTitle:          { fontSize: 16, fontWeight: '800', color: '#1a1a2e', lineHeight: 22, marginBottom: 6 },
  heroDesc:           { fontSize: 12, color: '#334155', lineHeight: 18, marginBottom: 12 },
  heroBtn:            { backgroundColor: '#f5f0c8', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#e8dfc0' },
  heroBtnText:        { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  heroIllustration:   { position: 'relative', alignItems: 'center' },
  agentCircle:        { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  agentEmoji:         { fontSize: 42 },
  bubble:             { position: 'absolute', top: -8, right: -4, backgroundColor: '#5bb8d4', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 3 },
  bubbleDots:         { fontSize: 12, color: '#fff', fontWeight: '700', letterSpacing: 1 },

  /* Feed título */
  feedTitle:          { fontSize: 15, fontWeight: '700', color: '#1a1a2e', paddingHorizontal: 16, marginBottom: 12 },

  /* Feed card */
  feedCard:           { marginHorizontal: 16, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 12 },

  /* Ocorrência */
  ocorrenciaRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  thumbnail:          { width: 72, height: 72, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  thumbnailEmoji:     { fontSize: 32 },
  ocorrenciaInfo:     { flex: 1 },
  ocorrenciaTitulo:   { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  ocorrenciaEndereco: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  ocorrenciaBottom:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grauRow:            { flexDirection: 'row', alignItems: 'center', gap: 5 },
  grauDot:            { width: 10, height: 10, borderRadius: 5 },
  grauText:           { fontSize: 12, fontWeight: '500', color: '#1a1a2e' },
  ocorrenciaData:     { fontSize: 11, color: '#94a3b8' },
  menuDots:           { padding: 4 },
  menuDotsText:       { fontSize: 20, color: '#64748b', lineHeight: 22 },

  divider:            { height: 1, backgroundColor: '#f1f5f9', marginBottom: 10 },

  /* Comentário */
  comentarioRow:      { flexDirection: 'row', gap: 10, marginBottom: 10 },
  avatar:             { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText:         { fontSize: 12, fontWeight: '700', color: '#fff' },
  comentarioContent:  { flex: 1 },
  comentarioHeader:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  comentarioNome:     { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  comentarioTempo:    { fontSize: 11, color: '#94a3b8' },
  comentarioTexto:    { fontSize: 12, color: '#334155', lineHeight: 18, marginBottom: 4 },
  verComentarios:     { fontSize: 12, color: '#1565c0', fontWeight: '600' },

  /* Input */
  inputRow:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentInput:       { flex: 1, height: 38, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14, fontSize: 13, color: '#1a1a2e' },
  sendBtn:            { width: 36, height: 36, borderRadius: 18, backgroundColor: '#5bb8d4', alignItems: 'center', justifyContent: 'center' },
  sendIcon:           { fontSize: 14, color: '#fff' },

  /* Bottom Nav */
  bottomNav:          { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem:            { alignItems: 'center', gap: 2 },
  navItemActive:      {},
  navItemCenter:      { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: -24, elevation: 4 },
  navPlus:            { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon:            { fontSize: 22 },
  navLabel:           { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
  navLabelActive:     { fontWeight: '700', color: '#1a1a2e' },
});
