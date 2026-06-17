import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

type Props = {
  navigation?: any;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState(false);

  const handleEnviar = () => {
    if (!email) {
      console.log('Digite o e-mail');
      return;
    }
    // chamada à API para enviar link de recuperação
    console.log('Enviar link para:', email);
  };

  const handleVoltar = () => {
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Nome do app */}
          <View style={styles.appNameRow}>
            <Text style={styles.appNameBlue}>Observa</Text>
            <Text style={styles.appNameGold}>Cidade</Text>
          </View>

          {/* Título e descrição */}
          <Text style={styles.title}>Esqueci minha senha</Text>
          <Text style={styles.description}>
            Digite o e-mail da sua conta que enviaremos{'\n'}
            um link para você redefinir sua senha.
          </Text>

          {/* Ilustração chave + monitor */}
          <View style={styles.illustration}>
            {/* Monitor */}
            <View style={styles.monitor}>
              <View style={styles.monitorScreen}>
                {/* Chave */}
                <Text style={styles.keyEmoji}>🔑</Text>
              </View>
              <View style={styles.monitorStand} />
              <View style={styles.monitorBase} />
            </View>
            {/* Asteriscos */}
            <Text style={styles.asterisks}>✱ ✱</Text>
          </View>

          {/* Card e-mail */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>E-mail</Text>

            <View style={[styles.inputWrapper, focusedField && styles.inputWrapperFocused]}>
              <Text style={styles.fieldIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleEnviar}
                onFocus={() => setFocusedField(true)}
                onBlur={() => setFocusedField(false)}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleEnviar} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Enviar link de recuperação</Text>
            </TouchableOpacity>
          </View>

          {/* Card dica */}
          <View style={styles.tipCard}>
            <View style={styles.tipIconWrapper}>
              <Text style={styles.tipIcon}>➤</Text>
            </View>
            <View style={styles.tipTextWrapper}>
              <Text style={styles.tipTitle}>Não recebeu o e-mail?</Text>
              <Text style={styles.tipBody}>
                Verifique sua caixa de entrada, lixo eletrônico ou spam. O e-mail pode levar alguns minutos para chegar.
              </Text>
            </View>
          </View>

          {/* Voltar para o login */}
          <TouchableOpacity onPress={handleVoltar} activeOpacity={0.7} style={styles.backWrapper}>
            <Text style={styles.backText}>Voltar para o login</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },

  /* Nome app */
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  appNameBlue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1565c0',
    letterSpacing: -0.3,
  },
  appNameGold: {
    fontSize: 28,
    fontWeight: '700',
    color: '#c8860a',
    letterSpacing: -0.3,
  },

  /* Título */
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  /* Ilustração */
  illustration: {
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  monitor: {
    alignItems: 'center',
  },
  monitorScreen: {
    width: 130,
    height: 90,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#1a3a5c',
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmoji: {
    fontSize: 44,
    transform: [{ rotate: '-30deg' }],
  },
  monitorStand: {
    width: 10,
    height: 20,
    backgroundColor: '#1a3a5c',
  },
  monitorBase: {
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a3a5c',
  },
  asterisks: {
    position: 'absolute',
    top: -6,
    right: -10,
    fontSize: 22,
    color: '#1a1a2e',
    fontWeight: '700',
    letterSpacing: 4,
  },

  /* Card e-mail */
  card: {
    width: '100%',
    backgroundColor: '#d6eef8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 8,
  },
  inputWrapperFocused: {
    borderColor: '#1565c0',
  },
  fieldIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '400',
  },
  button: {
    width: '100%',
    backgroundColor: '#f5f0c8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e0a0',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  /* Card dica */
  tipCard: {
    width: '100%',
    backgroundColor: '#d6eef8',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  tipIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5bb8d4',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  tipTextWrapper: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },

  /* Voltar */
  backWrapper: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5bb8d4',
    textDecorationLine: 'underline',
  },
});
