import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Botao from '../components/Botao';
import Campo from '../components/Campo';
import Header from '../components/Header';
import { FONTE_MAXIMA, cores, espaco, tipografia } from '../theme/tokens';
import { ICONE } from '../theme/icones';
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
    <SafeAreaView style={styles.container}>
      <Header
        variante="tela"
        titulo="Criar conta"
        subtitulo="Leva menos de um minuto."
        onVoltar={() => navigation?.goBack?.()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.title}>
            Seus dados
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.subtitle}>
            Depois de criar a conta você já pode registrar uma ocorrência.
          </Text>

          <View style={styles.formulario}>
            <Campo
              rotulo="Nome completo"
              valor={nome}
              aoMudar={setNome}
              placeholder="Como você quer ser chamado"
              icone={ICONE.perfil}
              capitalizacao="words"
              acessibilidadeLabel="Campo de nome completo"
            />

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
              placeholder="Mínimo de 6 caracteres"
              ajuda="Use pelo menos 6 caracteres."
              seguro
              capitalizacao="none"
              aoEnviar={criarConta}
              acessibilidadeLabel="Campo de senha"
            />
          </View>

          <Botao
            titulo={carregando ? 'Criando conta...' : 'Cadastrar'}
            onPress={criarConta}
            carregando={carregando}
            estilo={styles.botao}
          />

          <Botao
            titulo="Já tenho conta"
            variante="texto"
            onPress={() => navigation?.navigate?.('Login')}
          />
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
    paddingHorizontal: espaco['6'],
    paddingTop: espaco['6'],
    paddingBottom: espaco['10'],
  },
  title: { ...tipografia.tituloTela, color: cores.texto.principal, marginBottom: espaco['1'] },
  subtitle: {
    ...tipografia.corpoPequeno,
    color: cores.texto.secundario,
    marginBottom: espaco['6'],
  },
  formulario: { gap: espaco['4'] },
  botao: { marginTop: espaco['6'] },
});
