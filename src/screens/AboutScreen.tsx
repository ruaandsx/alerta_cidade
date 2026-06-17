import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, Image,
} from 'react-native';

type Props = { navigation?: any };

const features = [
  {
    icon: '📢',
    title: 'Participe da sua cidade',
    desc: 'Envie ocorrências de problemas no seu bairro e ajude a tornar sua cidade melhor para todos.',
  },
  {
    icon: '✅',
    title: 'Acompanhamento fácil',
    desc: 'Acompanhe as suas ocorrências, e também veja as da população.',
  },
  {
    icon: '👥',
    title: 'Transparência e confiança',
    desc: 'Promovemos a transparência e confiança com as suas ocorrências e damos voz aos cidadões.',
  },
];

export default function AboutScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre o ObservaCidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Nome app */}
        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
        </View>

        <Text style={styles.slogan}>sua cidade melhor começa com você.</Text>

        {/* Card O que é */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que é o ObservaCidade?</Text>
          <Text style={styles.cardDesc}>
            O ObservaCidade é um aplicativo criado para aproximar a população da gestão pública, permitindo que você informe problemas urbanos de forma simples e rápida.
          </Text>

          {/* Features */}
          <View style={styles.featuresWrapper}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>{f.icon}</Text>
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Card compromisso */}
        <View style={styles.compromissoCard}>
          <Text style={styles.compromissoTitle}>Nosso compromisso</Text>
          <Text style={styles.compromissoDesc}>
            Trabalhamos todos os dias para construir cidades mais limpas, seguras e organizadas, com a colaboração de cada cidadão.
          </Text>

          <View style={styles.participacaoRow}>
            <View style={styles.participacaoIcon}>
              <Text style={styles.participacaoEmoji}>🤍</Text>
            </View>
            <View style={styles.participacaoText}>
              <Text style={styles.participacaoTitle}>Sua participação faz a diferença!</Text>
              <Text style={styles.participacaoDesc}>Juntos, podemos construir uma cidade melhor para todos.</Text>
            </View>
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
  container:           { flex: 1, backgroundColor: '#fff' },

  /* Header */
  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backArrow:           { fontSize: 22, color: '#1a1a2e' },
  headerTitle:         { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },

  scroll:              { paddingHorizontal: 16, paddingBottom: 24, alignItems: 'center' },

  /* Logo */
  logoWrapper:         { marginTop: 8, marginBottom: 8 },
  logoImage:           { width: 130, height: 130 },

  /* Nome */
  appNameRow:          { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  appNameBlue:         { fontSize: 34, fontWeight: '700', color: '#1565c0', letterSpacing: -0.3 },
  appNameGold:         { fontSize: 34, fontWeight: '700', color: '#c8860a', letterSpacing: -0.3 },

  /* Slogan */
  slogan:              { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 20, textAlign: 'center' },

  /* Card o que é */
  card:                { width: '100%', backgroundColor: '#d6eef8', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitle:           { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  cardDesc:            { fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 14 },

  /* Features */
  featuresWrapper:     { gap: 14 },
  featureRow:          { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureIcon:         { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureEmoji:        { fontSize: 18 },
  featureText:         { flex: 1 },
  featureTitle:        { fontSize: 14, fontWeight: '700', color: '#1565c0', marginBottom: 3 },
  featureDesc:         { fontSize: 12, color: '#334155', lineHeight: 18 },

  /* Card compromisso */
  compromissoCard:     { width: '100%', backgroundColor: '#f8f4e8', borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#e8dfc0' },
  compromissoTitle:    { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  compromissoDesc:     { fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 14 },
  participacaoRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  participacaoIcon:    { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderWidth: 1, borderColor: '#e8dfc0' },
  participacaoEmoji:   { fontSize: 18 },
  participacaoText:    { flex: 1 },
  participacaoTitle:   { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 3 },
  participacaoDesc:    { fontSize: 12, color: '#64748b', lineHeight: 18 },

  /* Bottom Nav */
  bottomNav:           { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem:             { alignItems: 'center', gap: 2 },
  navItemCenter:       { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: -24, elevation: 4 },
  navPlus:             { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon:             { fontSize: 22 },
  navLabel:            { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
});
