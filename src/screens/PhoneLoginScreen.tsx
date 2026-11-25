import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FONTE_MAXIMA, cores, espaco, tipografia } from '../theme/tokens';

type Props = { navigation?: any };

/**
 * A API não tem login por telefone. A rota antiga entrava sem senha, então
 * agora ela apenas leva para o login real por e-mail e senha.
 */
export default function PhoneLoginScreen({ navigation }: Props) {
  useEffect(() => {
    navigation?.replace?.('Login');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ActivityIndicator size="large" color={cores.marca.azul} />
      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.texto}>
        Abrindo o login por e-mail...
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.superficie.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['3'],
    padding: espaco['6'],
  },
  texto: { ...tipografia.corpoPequeno, color: cores.texto.secundario, textAlign: 'center' },
});
