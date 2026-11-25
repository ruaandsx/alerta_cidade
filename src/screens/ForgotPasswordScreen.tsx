import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import Botao from '../components/Botao';
import Header from '../components/Header';
import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE } from '../theme/icones';

type Props = { navigation?: any };

export default function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Esqueci minha senha"
        onVoltar={() => navigation?.goBack?.()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.circulo}>
            <Ionicons name="key-outline" size={layout.icone['4']} color={cores.marca.azul} />
          </View>

          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.titulo}>
            Recuperação de senha
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.descricao}>
            O aplicativo ainda não envia link automático de recuperação. A redefinição é feita
            pela equipe responsável pelo Observa Cidade, com a confirmação dos seus dados.
          </Text>
        </View>

        <View style={styles.passos}>
          <View style={styles.passo}>
            <View style={styles.numero}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.numeroTexto}>
                1
              </Text>
            </View>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.passoTexto}>
              Procure a equipe do Observa Cidade na administração da sua cidade ou no canal
              oficial de atendimento.
            </Text>
          </View>

          <View style={styles.passo}>
            <View style={styles.numero}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.numeroTexto}>
                2
              </Text>
            </View>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.passoTexto}>
              Informe seu nome completo e o e-mail usado no cadastro.
            </Text>
          </View>

          <View style={styles.passo}>
            <View style={styles.numero}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.numeroTexto}>
                3
              </Text>
            </View>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.passoTexto}>
              A equipe confirma seus dados e combina uma senha temporária com você.
            </Text>
          </View>
        </View>

        <View style={styles.aviso}>
          <Ionicons name={ICONE.ajuda} size={layout.icone['2']} color={cores.marca.azulEscuro} />
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.avisoTexto}>
            Se alguém da sua casa ainda consegue entrar no app, essa pessoa pode abrir um chamado
            em Ajuda e suporte com o assunto “Contas e cadastro”.
          </Text>
        </View>

        <Botao
          titulo="Voltar para o login"
          icone={ICONE.voltar}
          onPress={() => navigation?.goBack?.()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: espaco['6'],
    paddingVertical: espaco['8'],
    gap: espaco['6'],
  },
  hero: { alignItems: 'center', gap: espaco['2'] },
  circulo: {
    width: 96,
    height: 96,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco['2'],
  },
  titulo: { ...tipografia.tituloTela, color: cores.texto.principal, textAlign: 'center' },
  descricao: {
    ...tipografia.corpo,
    color: cores.texto.secundario,
    textAlign: 'center',
  },
  passos: {
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
  },
  passo: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco['3'] },
  numero: {
    width: 28,
    height: 28,
    borderRadius: raio.pill,
    backgroundColor: cores.marca.azul,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numeroTexto: { ...tipografia.legenda, color: cores.texto.inverso },
  passoTexto: { ...tipografia.corpoPequeno, color: cores.texto.principal, flex: 1 },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['2'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['2'],
    padding: espaco['3'],
  },
  avisoTexto: { ...tipografia.corpoPequeno, color: cores.texto.secundario, flex: 1 },
});
