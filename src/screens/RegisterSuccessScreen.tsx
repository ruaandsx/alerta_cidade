import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

type Props = {
  navigation?: any;
  route?: {
    params?: {
      email?: string;
    };
  };
};

export default function RegisterSuccessScreen({ navigation, route }: Props) {
  const email = route?.params?.email ?? 'pauloph09@gmail.com';

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

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Nome do app */}
        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
        </View>

        {/* Ícone de sucesso — círculo verde com check */}
        <View style={styles.checkOuterBorder}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Cadastro realizado{'\n'}com sucesso!</Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          Seja bem-vindo ao{' '}
          <Text style={styles.subtitleBlue}>Observa</Text>
          <Text style={styles.subtitleGold}>Cidade</Text>
          {'.\n'}
          Sua conta foi criada e você já pode{'\n'}
          começar a ajudar a melhorar{'\n'}
          Sua cidade.
        </Text>

        {/* Card e-mail de confirmação */}
        <View style={styles.emailCard}>
          <View style={styles.emailIconWrapper}>
            <Text style={styles.emailIcon}>✉️</Text>
          </View>
          <View style={styles.emailTextWrapper}>
            <Text style={styles.emailCardTitle}>E-mail de confirmação enviado!</Text>
            <Text style={styles.emailCardBody}>
              Enviamos um e-mail para{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
              {'\n'}Clique no link do e-mail para{'\n'}verificar sua conta.
            </Text>
          </View>
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleInicio} activeOpacity={0.85}>
          <Text style={styles.buttonPrimaryText}>Ir para o início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={handlePerfil} activeOpacity={0.85}>
          <Text style={styles.buttonSecondaryText}>Ir para o meu perfil</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
  },

  /* Nome app */
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 32,
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

  /* Check */
  checkOuterBorder: {
    width: 160,
    height: 160,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#5bb8d4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  checkCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#4cd964',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4cd964',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  checkMark: {
    fontSize: 72,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 80,
  },

  /* Título */
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 14,
  },

  /* Subtítulo */
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  subtitleBlue: {
    color: '#1565c0',
    fontWeight: '700',
  },
  subtitleGold: {
    color: '#c8860a',
    fontWeight: '700',
  },

  /* Card e-mail */
  emailCard: {
    width: '100%',
    backgroundColor: '#d6eef8',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  emailIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5bb8d4',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  emailIcon: {
    fontSize: 20,
  },
  emailTextWrapper: {
    flex: 1,
  },
  emailCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  emailCardBody: {
    fontSize: 12,
    fontWeight: '400',
    color: '#334155',
    lineHeight: 18,
  },
  emailHighlight: {
    fontWeight: '700',
    color: '#1a1a2e',
  },

  /* Botões */
  buttonPrimary: {
    width: '100%',
    backgroundColor: '#7ec8e3',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonPrimaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  buttonSecondary: {
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
  buttonSecondaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
});
