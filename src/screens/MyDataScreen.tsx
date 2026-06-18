import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, TextInput,
} from 'react-native';

import { useUsuarioLogado } from '../hooks/useUsuarioLogado';
import { atualizarUsuarioLogado } from '../services/authService';

type Props = { navigation?: any };

export default function MyDataScreen({ navigation }: Props) {
  const { usuario } = useUsuarioLogado();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [cidade, setCidade] = useState('');
  const [focused, setFocused] = useState('');
  

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone || '');
      setNascimento(usuario.nascimento || '');
      setCidade(usuario.cidade || '');
    }
  }, [usuario]);

  async function salvarDados() {
    try {
      await atualizarUsuarioLogado({ nome, telefone, nascimento, cidade });
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.log(error);
      alert('Erro ao salvar dados.');
    }
  }

  const campos = [
    { key: 'nome',       label: 'Nome completo',    icon: '👤', value: nome,       set: setNome,       keyboard: 'default' as const },
    { key: 'email',      label: 'E-mail',            icon: '✉️', value: email,      set: setEmail,      keyboard: 'email-address' as const },
    { key: 'telefone',   label: 'Telefone',          icon: '📞', value: telefone,   set: setTelefone,   keyboard: 'phone-pad' as const },
    { key: 'nascimento', label: 'Data de nascimento',icon: '📅', value: nascimento, set: setNascimento, keyboard: 'default' as const },
    { key: 'cidade',     label: 'Cidade',            icon: '📍', value: cidade,     set: setCidade,     keyboard: 'default' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Meus dados</Text>
          <Text style={styles.headerSubtitle}>Atualize sua informações pessoais{'\n'}e de contato.</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Card perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>
            {/* Botão câmera */}
            <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
              <Text style={styles.cameraEmoji}>📷</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{nome || 'Usuário'}</Text>
            <View style={styles.profileRow}>
              <Text style={styles.profileIcon}>✉️</Text>
              <Text style={styles.profileText}>{email || 'email não informado'}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileIcon}>📞</Text>
              <Text style={styles.profileText}>{telefone || 'telefone não informado'}</Text>
            </View>
          </View>
        </View>

        {/* Informações pessoais */}
        <Text style={styles.sectionTitle}>Informações pessoais</Text>

        <View style={styles.formCard}>
          {campos.map((campo, index) => (
            <View key={campo.key} style={[styles.inputGroup, index < campos.length - 1 && styles.inputGroupBorder]}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputIcon}>{campo.icon}</Text>
                <Text style={styles.inputLabel}>{campo.label}</Text>
              </View>
              <TextInput
                style={[styles.inputField, focused === campo.key && styles.inputFieldFocused]}
                value={campo.value}
                onChangeText={campo.set}
                keyboardType={campo.keyboard}
                autoCapitalize={campo.key === 'email' ? 'none' : 'words'}
                onFocus={() => setFocused(campo.key)}
                onBlur={() => setFocused('')}
              />
            </View>
          ))}
        </View>

        {/* Botão salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={salvarDados} activeOpacity={0.85}>
          <Text style={styles.saveText}>Salvar alteração</Text>
        </TouchableOpacity>

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
  container:          { flex: 1, backgroundColor: '#fff' },

  /* Header */
  header:             { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backArrow:          { fontSize: 22, color: '#1a1a2e', marginRight: 8, marginTop: 2 },
  headerCenter:       { flex: 1, alignItems: 'center' },
  headerTitle:        { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  headerSubtitle:     { fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 18, marginTop: 4 },

  scroll:             { paddingHorizontal: 16, paddingBottom: 24 },

  /* Card perfil */
  profileCard:        { backgroundColor: '#7ec8e3', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  avatarWrapper:      { position: 'relative' },
  avatarCircle:       { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e8e0f7', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarHead:         { width: 28, height: 28, borderRadius: 14, backgroundColor: '#7c5cbf', marginBottom: -3 },
  avatarBody:         { width: 52, height: 30, borderRadius: 26, backgroundColor: '#7c5cbf', marginTop: 3 },
  cameraBtn:          { position: 'absolute', bottom: 0, right: -2, width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#7ec8e3' },
  cameraEmoji:        { fontSize: 12 },
  profileInfo:        { flex: 1, gap: 4 },
  profileName:        { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  profileRow:         { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileIcon:        { fontSize: 14 },
  profileText:        { fontSize: 13, color: '#1a1a2e' },

  /* Seção */
  sectionTitle:       { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },

  /* Form */
  formCard:           { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24, overflow: 'hidden' },
  inputGroup:         { paddingHorizontal: 16, paddingVertical: 12 },
  inputGroupBorder:   { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  inputLabelRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  inputIcon:          { fontSize: 16 },
  inputLabel:         { fontSize: 12, color: '#64748b', fontWeight: '500' },
  inputField:         { fontSize: 15, color: '#1a1a2e', fontWeight: '500', paddingVertical: 2 },
  inputFieldFocused:  { color: '#1565c0' },

  /* Botão salvar */
  saveButton:         { backgroundColor: '#5bb8d4', borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginBottom: 8 },
  saveText:           { fontSize: 17, fontWeight: '700', color: '#fff' },

  /* Bottom Nav */
  bottomNav:          { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem:            { alignItems: 'center', gap: 2 },
  navItemCenter:      { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: -24, elevation: 4 },
  navPlus:            { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon:            { fontSize: 22 },
  navLabel:           { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
});
