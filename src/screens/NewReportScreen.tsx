import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, TextInput,
} from 'react-native';

type Props = { navigation?: any };

const categorias = [
  { icon: '💡', label: 'Iluminação' },
  { icon: '🏥', label: 'Saúde\npública' },
  { icon: '🚗', label: 'Trânsito' },
  { icon: '🏗️', label: 'Infraestrutura' },
  { icon: '🗑️', label: 'Limpeza' },
  { icon: '😐', label: 'Outros' },
];

export default function NewReportScreen({ navigation }: Props) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [urgencia, setUrgencia] = useState<string | null>(null);

  const handleEnviar = () => {
    navigation?.navigate('ReportSuccess');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova ocorrência</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Categoria */}
        <Text style={styles.sectionLabel}>Categoria:</Text>
        <View style={styles.categoriasGrid}>
          {categorias.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.catCard, categoriaSelecionada === index && styles.catCardActive]}
              onPress={() => setCategoriaSelecionada(index)}
              activeOpacity={0.8}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Descrição */}
        <Text style={styles.sectionLabel}>Descrição:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Descreva o problema..."
          placeholderTextColor="#94a3b8"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          textAlignVertical="top"
        />

        {/* Endereço */}
        <Text style={styles.sectionLabel}>Endereço:</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.input}
            placeholder="Endereço da rua"
            placeholderTextColor="#94a3b8"
            value={endereco}
            onChangeText={setEndereco}
          />
        </View>

        {/* Fotos e vídeos */}
        <Text style={styles.sectionLabel}>Fotos e videos:</Text>
        <View style={styles.fotosWrapper}>
          <Text style={styles.fotosPlaceholder}>📷  Adicionar fotos ou videos</Text>
          <View style={styles.fotosIcons}>
            <TouchableOpacity style={styles.fotoIcon} activeOpacity={0.7}>
              <Text style={styles.fotoIconText}>📸</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fotoIcon} activeOpacity={0.7}>
              <Text style={styles.fotoIconText}>🖼️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grau de urgência */}
        <Text style={styles.sectionLabel}>Grau de urgência:</Text>
        <View style={styles.urgenciaRow}>
          {[
            { label: 'Baixo', color: '#22c55e', active: '#16a34a' },
            { label: 'Médio', color: '#f59e0b', active: '#d97706' },
            { label: 'Alto',  color: '#ef4444', active: '#dc2626' },
          ].map((u) => (
            <TouchableOpacity
              key={u.label}
              style={[styles.urgBtn, { backgroundColor: urgencia === u.label ? u.active : u.color }]}
              onPress={() => setUrgencia(u.label)}
              activeOpacity={0.85}
            >
              <Text style={styles.urgBtnText}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão enviar */}
        <TouchableOpacity style={styles.sendButton} onPress={handleEnviar} activeOpacity={0.85}>
          <Text style={styles.sendText}>Enviar ocorrência</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#7ec8e3' },
  header:          { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, alignItems: 'center' },
  headerTitle:     { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  scroll:          { paddingHorizontal: 16, paddingBottom: 32 },
  sectionLabel:    { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 10, marginTop: 4 },

  /* Categorias */
  categoriasGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  catCard:         { width: '30%', backgroundColor: '#5bb8d4', borderRadius: 14, padding: 12, alignItems: 'center', gap: 6, minHeight: 80, justifyContent: 'center' },
  catCardActive:   { backgroundColor: '#1565c0' },
  catIcon:         { fontSize: 26 },
  catLabel:        { fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center', lineHeight: 16 },

  /* Descrição */
  textArea:        { backgroundColor: '#fff', borderRadius: 12, padding: 14, height: 100, fontSize: 14, color: '#1a1a2e', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },

  /* Endereço */
  inputWrapper:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5bb8d4', borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 16, gap: 8 },
  inputIcon:       { fontSize: 18 },
  input:           { flex: 1, fontSize: 14, color: '#fff' },

  /* Fotos */
  fotosWrapper:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5bb8d4', borderRadius: 12, paddingHorizontal: 14, height: 54, marginBottom: 16, justifyContent: 'space-between' },
  fotosPlaceholder:{ fontSize: 13, color: '#fff', fontWeight: '500' },
  fotosIcons:      { flexDirection: 'row', gap: 8 },
  fotoIcon:        { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  fotoIconText:    { fontSize: 18 },

  /* Urgência */
  urgenciaRow:     { flexDirection: 'row', gap: 10, marginBottom: 24 },
  urgBtn:          { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  urgBtnText:      { fontSize: 15, fontWeight: '700', color: '#fff' },

  /* Botão */
  sendButton:      { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sendText:        { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
});
