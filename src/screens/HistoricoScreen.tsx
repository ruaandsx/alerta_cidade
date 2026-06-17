import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView,
} from 'react-native';

type Props = { navigation?: any };

const ocorrencias = [
  {
    titulo: 'Esgoto na rua',
    endereco: 'Rua das flores, 55',
    status: 'Publicado',
    grau: 'Grau médio',
    grauCor: '#f59e0b',
    data: '03/04/2026',
    emoji: '🚧',
    bg: '#d4a373',
  },
  {
    titulo: 'Lixo acumulado',
    endereco: 'Avenida Magalhães, 128',
    status: 'Publicado',
    grau: 'Grau alto',
    grauCor: '#ef4444',
    data: '10/04/2026',
    emoji: '🗑️',
    bg: '#6b7280',
  },
  {
    titulo: 'Buraco na via',
    endereco: 'BR232',
    status: 'Publicado',
    grau: 'Grau médio',
    grauCor: '#f59e0b',
    data: '13/04/2026',
    emoji: '🛣️',
    bg: '#92a0a8',
  },
  {
    titulo: 'Poste queimado',
    endereco: 'Rua da paz, 78',
    status: 'Publicado',
    grau: 'Grau baixo',
    grauCor: '#22c55e',
    data: '15/04/2026',
    emoji: '💡',
    bg: '#1a1a2e',
  },
];

export default function HistoricoScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de ocorrência</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Minhas ocorrências</Text>

        {/* Lista de ocorrências */}
        {ocorrencias.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation?.navigate('ReportDetail', { item })}
            activeOpacity={0.8}
          >
            {/* Imagem/thumbnail */}
            <View style={[styles.thumbnail, { backgroundColor: item.bg }]}>
              <Text style={styles.thumbnailEmoji}>{item.emoji}</Text>
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{item.titulo}</Text>
              <Text style={styles.cardEndereco}>{item.endereco}</Text>
              <Text style={styles.cardStatus}>Status: {item.status}</Text>
              <View style={styles.cardBottom}>
                <View style={styles.grauRow}>
                  <View style={[styles.grauDot, { backgroundColor: item.grauCor }]} />
                  <Text style={styles.grauText}>{item.grau}</Text>
                </View>
                <Text style={styles.cardData}>{item.data}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Banner fique por dentro */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIcon}>
            <Text style={styles.bannerEmoji}>🔔</Text>
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Fique por dentro!</Text>
            <Text style={styles.bannerDesc}>Acompanhe suas ocorrência.</Text>
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
  container:       { flex: 1, backgroundColor: '#fff' },

  /* Header */
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backArrow:       { fontSize: 22, color: '#1a1a2e' },
  headerTitle:     { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },

  scroll:          { paddingHorizontal: 16, paddingBottom: 24 },
  sectionTitle:    { fontSize: 18, fontWeight: '700', color: '#1a1a2e', textAlign: 'center', marginBottom: 16, marginTop: 4 },

  /* Card ocorrência */
  card:            { flexDirection: 'row', borderRadius: 14, borderWidth: 1.5, borderColor: '#5bb8d4', padding: 12, marginBottom: 12, gap: 12, alignItems: 'flex-start' },
  thumbnail:       { width: 80, height: 80, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  thumbnailEmoji:  { fontSize: 36 },
  cardInfo:        { flex: 1 },
  cardTitulo:      { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  cardEndereco:    { fontSize: 12, color: '#64748b', marginBottom: 2 },
  cardStatus:      { fontSize: 12, color: '#64748b', marginBottom: 6 },
  cardBottom:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grauRow:         { flexDirection: 'row', alignItems: 'center', gap: 5 },
  grauDot:         { width: 10, height: 10, borderRadius: 5 },
  grauText:        { fontSize: 12, fontWeight: '500', color: '#1a1a2e' },
  cardData:        { fontSize: 11, color: '#94a3b8' },

  /* Banner */
  bannerCard:      { backgroundColor: '#7ec8e3', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  bannerIcon:      { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  bannerEmoji:     { fontSize: 24 },
  bannerText:      { flex: 1 },
  bannerTitle:     { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  bannerDesc:      { fontSize: 13, color: '#1a3a5c' },

  /* Bottom Nav */
  bottomNav:       { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem:         { alignItems: 'center', gap: 2 },
  navItemCenter:   { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: -24, elevation: 4 },
  navPlus:         { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon:         { fontSize: 22 },
  navLabel:        { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
});
