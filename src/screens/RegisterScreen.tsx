import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { cadastrar } from '../services/authService';

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function criarConta() {
    if (nome.trim().length < 3) {
      Alert.alert('Nome inválido', 'Informe seu nome completo (mínimo 3 letras).');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('E-mail inválido', 'Confira o e-mail informado.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha curta', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setCarregando(true);
      await cadastrar(nome.trim(), email.trim().toLowerCase(), senha);
      navigation?.replace?.('Home');
    } catch (e: any) {
      Alert.alert('Erro ao cadastrar', e?.message || 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Leva menos de um minuto.</Text>

      <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#94a3b8" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} />
      <TextInput style={styles.input} placeholder="Senha (mínimo 6 caracteres)" placeholderTextColor="#94a3b8" value={senha} onChangeText={setSenha} secureTextEntry />

      <TouchableOpacity style={[styles.button, carregando && { opacity: 0.6 }]} onPress={criarConta} disabled={carregando}>
        <Text style={styles.buttonText}>{carregando ? 'Criando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation?.navigate?.('Login')}>
        <Text style={styles.link}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4, color: '#1a1a2e' },
  subtitle: { fontSize: 13.5, color: '#64748b', marginBottom: 22 },
  input: { height: 48, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, marginBottom: 12, color: '#1a1a2e' },
  button: { backgroundColor: '#1565c0', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { textAlign: 'center', color: '#1565c0', marginTop: 18, fontWeight: '600' },
});
