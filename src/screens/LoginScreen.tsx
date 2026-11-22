import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/authService';
import { logout } from '../services/auth';
import { obterApiUrl, definirApiUrl, restaurarApiUrlPadrao } from '../services/api';

/** No APK (sem Expo Go) o endereço do servidor não é descoberto sozinho. */
const BUILD_PROPRIO = !Constants.expoConfig?.hostUri;

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarServidor, setMostrarServidor] = useState(false);
  const [servidor, setServidor] = useState('');
  const [servidorAtual, setServidorAtual] = useState('');
  const [salvandoServidor, setSalvandoServidor] = useState(false);

  useEffect(() => {
    obterApiUrl()
      .then(async (url) => {
        setServidorAtual(url);
        setServidor(url);

        if (BUILD_PROPRIO) {
          const salvo = await AsyncStorage.getItem('apiUrl');
          if (!salvo) setMostrarServidor(true);
        }
      })
      .catch(() => {});
  }, []);

  async function entrar() {
    if (!email.trim() || !senha) {
      Alert.alert('Dados incompletos', 'Informe e-mail e senha.');
      return;
    }

    try {
      setCarregando(true);
      const usuario = await login(email.trim().toLowerCase(), senha);

      if (usuario.role === 'ADMIN') {
        navigation?.replace?.('AdminHome');
      } else {
        navigation?.replace?.('Home');
      }
    } catch (e: any) {
      // Sem conexão? abre a configuração do servidor para facilitar.
      if (!e?.status) setMostrarServidor(true);
      Alert.alert('Erro ao entrar', e?.message || 'Verifique seu e-mail e senha.');
    } finally {
      setCarregando(false);
    }
  }

  async function salvarServidor() {
    try {
      setSalvandoServidor(true);
      const url = await definirApiUrl(servidor);

      await logout();
      setServidorAtual(url);
      setServidor(url);
      setMostrarServidor(false);

      Alert.alert('Servidor configurado', `O app vai usar ${url}`);
    } catch (e: any) {
      Alert.alert('Endereço inválido', e?.message || 'Confira o endereço informado.');
    } finally {
      setSalvandoServidor(false);
    }
  }

  async function usarPadrao() {
    const url = await restaurarApiUrlPadrao();
    await logout();
    setServidor(url);
    setServidorAtual(url);
    Alert.alert('Servidor padrão', url);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.marca}>
          <Text style={styles.marcaAzul}>Observa</Text>
          <Text style={styles.marcaDourada}>Cidade</Text>
        </View>

        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Acesse para registrar e acompanhar ocorrências.</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, carregando && { opacity: 0.6 }]}
          onPress={entrar}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation?.navigate?.('Cadastro')}>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMostrarServidor((v) => !v)}>
          <Text style={styles.servidorLink}>
            Servidor: {servidorAtual || 'detectando...'} {mostrarServidor ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {mostrarServidor && (
          <View style={styles.servidorBox}>
            <Text style={styles.servidorAjuda}>
              Use o IP do computador que está rodando a API, por exemplo 192.168.1.63:8080.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="http://192.168.1.63:8080"
              placeholderTextColor="#94a3b8"
              value={servidor}
              onChangeText={setServidor}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.buttonSecundario, salvandoServidor && { opacity: 0.6 }]}
              onPress={salvarServidor}
              disabled={salvandoServidor}
            >
              <Text style={styles.buttonSecundarioText}>
                {salvandoServidor ? 'Salvando...' : 'Salvar endereço'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={usarPadrao}>
              <Text style={styles.link}>Restaurar padrão</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  marca: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 26 },
  marcaAzul: { fontSize: 28, fontWeight: '800', color: '#1565c0' },
  marcaDourada: { fontSize: 28, fontWeight: '800', color: '#c8860a' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 4, color: '#1a1a2e' },
  subtitle: { fontSize: 13.5, color: '#64748b', marginBottom: 22 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: '#1a1a2e',
  },
  button: {
    backgroundColor: '#1565c0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { textAlign: 'center', color: '#1565c0', marginTop: 14, fontWeight: '600' },
  servidorLink: { textAlign: 'center', color: '#94a3b8', marginTop: 22, fontSize: 12 },
  servidorBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  servidorAjuda: { fontSize: 12, color: '#64748b', marginBottom: 10, lineHeight: 17 },
  buttonSecundario: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonSecundarioText: { color: '#1565c0', fontWeight: '700' },
});
