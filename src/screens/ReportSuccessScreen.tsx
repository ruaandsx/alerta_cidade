import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView,
} from 'react-native';

type Props = { navigation?: any };

export default function ReportSuccessScreen({ navigation }: Props) {
  const dataEnvio = '12 de maio de 2026 às 14:30';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Botão fechar */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation?.navigate('Home')} activeOpacity={0.7}>
        <Text style={styles.closeX}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Título */}
        <Text style={styles.title}>Ocorrência enviada!</Text>
        <Text style={styles.subtitle}>Sua mensagem foi enviada com sucesso</Text>

        {/* Ilustração cidade + check */}
        <View style={styles.illustrationWrapper}>
          {/* Cidade estilizada */}
          <View style={styles.cityRow}>
            <View style={[styles.building, { height: 50, width: 28 }]} />
            <View style={[styles.building, { height: 70, width: 36 }]} />
            <View style={[styles.building, { height: 45, width: 24 }]} />
            <View style={[styles.building, { height: 80, width: 40 }]} />
            <View style={[styles.building, { height: 55, width: 30 }]} />
            <View style={[styles.building, { height: 40, width: 22 }]} />
          </View>
          {/* Check verde grande */}
          <View style={styles.checkWrapper}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>
        </View>

        {/* Card info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoMessage}>
            Agradecemos por ajudar a melhorar nossa cidade.{'\n'}
            Sua ocorrência foi registrada e já está em análise.
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Text style={styles.infoEmoji}>📅</Text></View>
            <View>
              <Text style={styles.infoLabel}>Data de envio</Text>
              <Text style={styles.infoValue}>{dataEnvio}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}><Text style={styles.infoEmoji}>🕐</Text></View>
            <View>
              <Text style={styles.infoLabel}>Previsão de resposta</Text>
              <Text style={styles.infoValue}>Até 5 dias úteis</Text>
            </View>
          </View>
        </View>

        {/* Card acompanhar */}
        <View style={styles.acompanharCard}>
          <View style={styles.acompanharIcon}>
            <Text style={styles.acompanharEmoji}>🛡️</Text>
          </View>
          <View style={styles.acompanharText}>
            <Text style={styles.acompanharTitle}>Acompanhe sua ocorrência</Text>
            <Text style={styles.acompanharDesc}>
              Você pode acompanhar o atendimento{'\n'}desta denúncia na seção{' '}
              <Text style={styles.acompanharLink}>"Minhas ocorrência"</Text>
              {' '}.
            </Text>
          </View>
        </View>

        {/* Botão ver ocorrências */}
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation?.navigate('Historico')} activeOpacity={0.85}>
          <Text style={styles.primaryBtnIcon}>☰</Text>
          <Text style={styles.primaryBtnText}>Ver minhas ocorrência</Text>
        </TouchableOpacity>

        {/* Voltar para o início */}
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation?.navigate('Home')} activeOpacity={0.7}>
          <Text style={styles.homeBtnIcon}>🏠</Text>
          <Text style={styles.homeBtnText}>Voltar para o início</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#fff' },

  /* Fechar */
  closeBtn:           { alignSelf: 'flex-end', padding: 16, paddingBottom: 0 },
  closeX:             { fontSize: 20, color: '#ef4444', fontWeight: '700' },

  scroll:             { paddingHorizontal: 24, paddingBottom: 32 },

  /* Título */
  title:              { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginTop: 8, marginBottom: 4 },
  subtitle:           { fontSize: 13, color: '#64748b', marginBottom: 20 },

  /* Ilustração */
  illustrationWrapper:{ alignItems: 'center', marginBottom: 20, position: 'relative', height: 120 },
  cityRow:            { flexDirection: 'row', alignItems: 'flex-end', gap: 4, position: 'absolute', bottom: 0, opacity: 0.25 },
  building:           { backgroundColor: '#5bb8d4', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  checkWrapper:       { position: 'absolute', top: 0, alignItems: 'center', justifyContent: 'center', width: '100%' },
  checkCircle:        { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4cd964', alignItems: 'center', justifyContent: 'center', shadowColor: '#4cd964', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  checkMark:          { fontSize: 54, color: '#fff', fontWeight: '700', lineHeight: 60 },

  /* Info card */
  infoCard:           { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  infoMessage:        { fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 14 },
  divider:            { height: 1, backgroundColor: '#f1f5f9', marginBottom: 14 },
  infoRow:            { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  infoIcon:           { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  infoEmoji:          { fontSize: 18 },
  infoLabel:          { fontSize: 12, color: '#1565c0', fontWeight: '600', textDecorationLine: 'underline', marginBottom: 2 },
  infoValue:          { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },

  /* Acompanhar card */
  acompanharCard:     { backgroundColor: '#fefce8', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16, borderWidth: 1, borderColor: '#fde68a' },
  acompanharIcon:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fbbf24', alignItems: 'center', justifyContent: 'center' },
  acompanharEmoji:    { fontSize: 18 },
  acompanharText:     { flex: 1 },
  acompanharTitle:    { fontSize: 13, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  acompanharDesc:     { fontSize: 12, color: '#64748b', lineHeight: 18 },
  acompanharLink:     { color: '#1565c0', fontWeight: '600' },

  /* Botões */
  primaryBtn:         { backgroundColor: '#5bb8d4', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 },
  primaryBtnIcon:     { fontSize: 18, color: '#fff' },
  primaryBtnText:     { fontSize: 16, fontWeight: '700', color: '#fff' },
  homeBtn:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  homeBtnIcon:        { fontSize: 18 },
  homeBtnText:        { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
});
