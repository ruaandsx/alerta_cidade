import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'GoogleLogin'> };

export default function GoogleLoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrapper}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.appNameRow}>
            <Text style={styles.appNameBlue}>Observa</Text>
            <Text style={styles.appNameGold}>Cidade</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.googleLogo}>
              <Text style={{ color: '#4285F4' }}>G</Text><Text style={{ color: '#EA4335' }}>o</Text>
              <Text style={{ color: '#FBBC05' }}>o</Text><Text style={{ color: '#4285F4' }}>g</Text>
              <Text style={{ color: '#34A853' }}>l</Text><Text style={{ color: '#EA4335' }}>e</Text>
            </Text>
            <Text style={styles.loginLabel}>Login</Text>

            <View style={[styles.inputWrapper, focused === 'email' && styles.inputWrapperFocused]}>
              <Text style={styles.fieldLabel}>Digite seu E-mail</Text>
              <View style={styles.inputRow}>
                <Text style={styles.fieldIcon}>✉️</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" returnKeyType="next" onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
              </View>
            </View>

            <View style={[styles.inputWrapper, focused === 'senha' && styles.inputWrapperFocused]}>
              <Text style={styles.fieldLabel}>Digite sua senha</Text>
              <View style={styles.inputRow}>
                <Text style={styles.fieldIcon}>🔒</Text>
                <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry returnKeyType="done" onSubmitEditing={() => navigation.navigate('LoginSucesso')} onFocus={() => setFocused('senha')} onBlur={() => setFocused(null)} />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginSucesso')} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')} activeOpacity={0.7} style={styles.forgotWrapper}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:            { flex: 1, backgroundColor: '#7ec8e3', alignItems: 'center' },
  backButton:           { alignSelf: 'flex-start', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  backArrow:            { fontSize: 26, color: '#1a1a2e', fontWeight: '400' },
  scroll:               { flexGrow: 1, alignItems: 'center', paddingBottom: 24 },
  logoWrapper:          { marginTop: 4, marginBottom: 8 },
  logoImage:            { width: 155, height: 155 },
  appNameRow:           { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  appNameBlue:          { fontSize: 36, fontWeight: '700', color: '#1565c0', letterSpacing: -0.5 },
  appNameGold:          { fontSize: 36, fontWeight: '700', color: '#c8860a', letterSpacing: -0.5 },
  card:                 { width: '92%', backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  googleLogo:           { fontSize: 32, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  loginLabel:           { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 20 },
  inputWrapper:         { width: '100%', backgroundColor: '#b8e0f0', borderRadius: 10, marginBottom: 14, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6, borderWidth: 1.5, borderColor: 'transparent' },
  inputWrapperFocused:  { borderColor: '#1565c0' },
  fieldLabel:           { fontSize: 11, fontWeight: '600', color: '#1a3a5c', marginBottom: 4 },
  inputRow:             { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fieldIcon:            { fontSize: 18 },
  input:                { flex: 1, height: 28, fontSize: 15, color: '#1a1a2e', fontWeight: '500', padding: 0 },
  button:               { width: '100%', backgroundColor: '#5bb8d4', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 4, marginBottom: 14, elevation: 3 },
  buttonText:           { fontSize: 17, fontWeight: '700', color: '#fff' },
  forgotWrapper:        { paddingVertical: 4 },
  forgotText:           { fontSize: 13, fontWeight: '500', color: '#1565c0', textDecorationLine: 'underline' },
  homeIndicator:        { width: 120, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 8, marginTop: 4 },
});
