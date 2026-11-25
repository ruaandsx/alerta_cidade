import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import Botao from '../components/Botao';
import Header from '../components/Header';
import { FONTE_MAXIMA, cores, espaco, raio, tipografia } from '../theme/tokens';
import { ICONE } from '../theme/icones';

type Props = { navigation?: any; route?: any };

export default function RegisterSuccessScreen({ navigation, route }: Props) {
  const email: string = route?.params?.email || '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header variante="marca" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.anel}>
            <View style={styles.circulo}>
              <Ionicons name="checkmark" size={52} color={cores.texto.inverso} />
            </View>
          </View>

          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.titulo}>
            Cadastro concluído!
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.subtitulo}>
            Sua conta foi criada. Você já pode registrar ocorrências e ajudar a melhorar a cidade.
          </Text>
        </View>

        {email ? (
          <View style={styles.cartao}>
            <Ionicons name={ICONE.email} size={20} color={cores.marca.azul} />
            <View style={styles.cartaoTexto}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cartaoRotulo}>
                Conta criada com
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cartaoValor}>
                {email}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.botoes}>
          <Botao
            titulo="Ir para o início"
            icone={ICONE.inicio}
            onPress={() => navigation?.replace?.('Home')}
          />
          <Botao
            titulo="Ver meu perfil"
            icone={ICONE.perfil}
            variante="secundario"
            onPress={() => navigation?.replace?.('Profile')}
          />
        </View>
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
    paddingBottom: espaco['10'],
    gap: espaco['6'],
  },
  hero: { alignItems: 'center', gap: espaco['2'] },
  anel: {
    width: 128,
    height: 128,
    borderRadius: raio.pill,
    backgroundColor: cores.estado.sucessoFundo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco['2'],
  },
  circulo: {
    width: 96,
    height: 96,
    borderRadius: raio.pill,
    backgroundColor: cores.estado.sucessoGrafico,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { ...tipografia.tituloTela, color: cores.texto.principal, textAlign: 'center' },
  subtitulo: {
    ...tipografia.corpo,
    color: cores.texto.secundario,
    textAlign: 'center',
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['2'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['2'],
    padding: espaco['3'],
  },
  cartaoTexto: { flex: 1, gap: 1 },
  cartaoRotulo: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  cartaoValor: { ...tipografia.corpoForte, color: cores.texto.principal },
  botoes: { gap: espaco['3'] },
});
