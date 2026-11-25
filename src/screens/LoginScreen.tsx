import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Botao from '../components/Botao';
import Campo from '../components/Campo';
import { FONTE_MAXIMA, cores, espaco, layout, raio, tipografia } from '../theme/tokens';
import { ICONE } from '../theme/icones';
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.marca}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.marcaAzul}>
              Observa
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.marcaDourada}>
              Cidade
            </Text>
          </View>

          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.title}>
            Entrar
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.subtitle}>
            Acesse para registrar e acompanhar ocorrências.
          </Text>

          <View style={styles.formulario}>
            <Campo
              rotulo="E-mail"
              valor={email}
              aoMudar={setEmail}
              placeholder="seuemail@exemplo.com"
              icone={ICONE.email}
              teclado="email-address"
              capitalizacao="none"
              acessibilidadeLabel="Campo de e-mail"
            />

            <Campo
              rotulo="Senha"
              valor={senha}
              aoMudar={setSenha}
              placeholder="Sua senha"
              seguro
              capitalizacao="none"
              aoEnviar={entrar}
              acessibilidadeLabel="Campo de senha"
            />
          </View>

          <Botao
            titulo={carregando ? 'Entrando...' : 'Entrar'}
            onPress={entrar}
            carregando={carregando}
            estilo={styles.botaoEntrar}
          />

          <Pressable
            onPress={() => navigation?.navigate?.('EsqueciSenha')}
            accessibilityRole="button"
            accessibilityLabel="Esqueci minha senha"
            style={({ pressed }) => [styles.esqueci, pressed && { opacity: 0.6 }]}
          >
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.esqueciTexto}>
              Esqueci minha senha
            </Text>
          </Pressable>

          <Botao
            titulo="Criar conta"
            variante="texto"
            onPress={() => navigation?.navigate?.('Cadastro')}
          />

          <Pressable
            onPress={() => setMostrarServidor((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Configurar endereço do servidor"
            accessibilityState={{ expanded: mostrarServidor }}
            style={({ pressed }) => [styles.servidorToggle, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name={ICONE.dados} size={layout.icone['1']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.servidorLink}>
              Servidor: {servidorAtual || 'detectando...'}
            </Text>
            <Ionicons
              name={mostrarServidor ? 'chevron-up' : 'chevron-down'}
              size={layout.icone['1']}
              color={cores.texto.secundario}
            />
          </Pressable>

          {mostrarServidor && (
            <View style={styles.servidorBox}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.servidorTitulo}>
                Endereço da API
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.servidorAjuda}>
                Use o IP do computador que está rodando a API, por exemplo 192.168.1.63:8082.
              </Text>

              <Campo
                valor={servidor}
                aoMudar={setServidor}
                placeholder="http://192.168.1.63:8082"
                capitalizacao="none"
                teclado="url"
                acessibilidadeLabel="Endereço da API"
              />

              <Botao
                titulo={salvandoServidor ? 'Salvando...' : 'Salvar endereço'}
                variante="secundario"
                onPress={salvarServidor}
                carregando={salvandoServidor}
              />

              <Botao titulo="Restaurar padrão" variante="texto" onPress={usarPadrao} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: espaco['6'],
    paddingVertical: espaco['10'],
  },
  marca: { flexDirection: 'row', alignItems: 'baseline', marginBottom: espaco['6'] },
  marcaAzul: { ...tipografia.marca, color: cores.marca.azul },
  marcaDourada: { ...tipografia.marca, color: cores.marca.dourado },
  title: { ...tipografia.tituloTela, color: cores.texto.principal, marginBottom: espaco['1'] },
  subtitle: {
    ...tipografia.corpoPequeno,
    color: cores.texto.secundario,
    marginBottom: espaco['6'],
  },
  formulario: { gap: espaco['4'] },
  botaoEntrar: { marginTop: espaco['6'] },
  esqueci: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -espaco['2'],
  },
  esqueciTexto: { ...tipografia.rotulo, color: cores.marca.azul },
  servidorToggle: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['1'],
    marginTop: espaco['2'],
  },
  servidorLink: { ...tipografia.legenda, color: cores.texto.secundario },
  servidorBox: {
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['2'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
    marginTop: espaco['1'],
  },
  servidorTitulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  servidorAjuda: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
});
