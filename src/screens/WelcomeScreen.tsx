import React from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Botao from '../components/Botao';
import { FONTE_MAXIMA, cores, espaco, raio, tipografia } from '../theme/tokens';

type Props = {
  navigation: any;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Logo do Observa Cidade"
          />
        </View>

        <View style={styles.appNameRow}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.appNameBlue}>
            Observa
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.appNameGold}>
            Cidade
          </Text>
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.slogan}>
          Sua cidade melhor{'\n'}começa com você.
        </Text>
      </View>

      <View style={styles.buttonsArea}>
        <Botao
          titulo="Começar"
          onPress={() => navigation.navigate('Cadastro')}
          acessibilidadeLabel="Começar: criar uma conta"
        />
        <Botao
          titulo="Entrar"
          variante="destaque"
          onPress={() => navigation.navigate('Login')}
          acessibilidadeLabel="Entrar na minha conta"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.marca.agua,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: espaco['6'],
    paddingVertical: espaco['5'],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['4'],
  },
  logoWrapper: {
    width: 168,
    height: 168,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.base,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco['3'],
  },
  logoImage: { width: 136, height: 136 },
  appNameRow: { flexDirection: 'row', alignItems: 'baseline' },
  appNameBlue: { ...tipografia.display, color: cores.marca.azul },
  appNameGold: { ...tipografia.display, color: cores.marca.dourado },
  slogan: {
    ...tipografia.subtitulo,
    color: cores.texto.sobreAgua,
    textAlign: 'center',
  },
  buttonsArea: {
    width: '100%',
    gap: espaco['3'],
  },
});
