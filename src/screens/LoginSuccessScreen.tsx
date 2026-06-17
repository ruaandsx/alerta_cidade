import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';

type Props = {
  navigation?: any;
};

export default function LoginSuccessScreen({ navigation }: Props) {

  const handleInicio = () => {
    // navigation?.navigate('Home');
    console.log('Ir para o início');
  };

  const handlePerfil = () => {
    // navigation?.navigate('Perfil');
    console.log('Ir para o meu perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Nome do app */}
      <View style={styles.appNameRow}>
        <Text style={styles.appNameBlue}>Observa</Text>
        <Text style={styles.appNameGold}>Cidade</Text>
      </View>

      {/* Ícone check com brilho */}
      <View style={styles.checkGlow}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      </View>

      {/* Título */}
      <Text style={styles.title}>Login realizado{'\n'}com sucesso!</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Seja bem-vindo de volta ao{' '}
        <Text style={styles.subtitleBlue}>Observa</Text>
        <Text style={styles.subtitleGold}>Cidade</Text>
        {'.\n'}
        Ajude a melhorar nossas cidades.
      </Text>

      {/* Botões */}
      <View style={styles.buttonsArea}>
        <TouchableOpacity style={styles.button} onPress={handleInicio} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Ir para o início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handlePerfil} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Ir para o meu perfil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  /* Nome app */
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 40,
  },
  appNameBlue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1565c0',
    letterSpacing: -0.3,
  },
  appNameGold: {
    fontSize: 30,
    fontWeight: '700',
    color: '#c8860a',
    letterSpacing: -0.3,
  },

  /* Check com brilho verde ao redor */
  checkGlow: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(76, 217, 100, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  checkCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#4cd964',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4cd964',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  checkMark: {
    fontSize: 78,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 86,
  },

  /* Título */
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 14,
  },

  /* Subtítulo */
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
  },
  subtitleBlue: {
    color: '#1565c0',
    fontWeight: '700',
  },
  subtitleGold: {
    color: '#c8860a',
    fontWeight: '700',
  },

  /* Botões */
  buttonsArea: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#7ec8e3',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
});
