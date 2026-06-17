import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Cadastro'> };

export default function RegisterScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const handleCadastrar = () => {
    if (!nome || !email || !senha || !confirmar) return;
    if (senha !== confirmar) return;
    navigation.navigate('CadastroSucesso', { email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />
      <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrapper}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.titleBlue}>Bem-</Text>
            <Text style={styles.titleGold}>vindo!</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Criar conta</Text>
            <Text style={styles.cardSubtitle}>Preenchar os dados para continuar</Text>

            {[
              { key: 'nome',     placeholder: 'Nome completo', icon: '👤', value: nome,     set: setNome,     secure: false, keyboard: 'default' as const },
              { key: 'email',    placeholder: 'E-mail',        icon: '✉️', value: email,    set: setEmail,    secure: false, keyboard: 'email-address' as const },
              { key: 'senha',    placeholder: 'Senha',         icon: '🔒', value: senha,    set: setSenha,    secure: true,  keyboard: 'default' as const },
              { key: 'confirmar',placeholder: 'Confirmar senha',icon: '🔒',value: confirmar, set: setConfirmar,secure: true,  keyboard: 'default' as const },
            ].map((f) => (
              <View key={f.key} style={[styles.inputWrapper, focused === f.key && styles.inputWrapperFocused]}>
                <View style={styles.iconBox}><Text style={styles.iconEmoji}>{f.icon}</Text></View>
                <TextInput
                  style={styles.input}
                  placeholder={f.placeholder}
                  placeholderTextColor="#555"
                  value={f.value}
                  onChangeText={f.set}
                  secureTextEntry={f.secure}
                  keyboardType={f.keyboard}
                  autoCapitalize={f.key === 'nome' ? 'words' : 'none'}
                  onFocus={() => setFocused(f.key)}
                  onBlur={() => setFocused(null)}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleCadastrar} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#7ec8e3', alignItems: 'center' },
  scroll:              { flexGrow: 1, alignItems: 'center', paddingBottom: 24 },
  logoWrapper:         { marginTop: 20, marginBottom: 8 },
  logoImage:           { width: 150, height: 150 },
  titleRow:            { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  titleBlue:           { fontSize: 34, fontWeight: '800', color: '#1565c0', fontStyle: 'italic', letterSpacing: -0.5 },
  titleGold:           { fontSize: 34, fontWeight: '800', color: '#c8860a', fontStyle: 'italic', letterSpacing: -0.5 },
  card:                { width: '92%', backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  cardTitle:           { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  cardSubtitle:        { fontSize: 13, color: '#64748b', marginBottom: 20 },
  inputWrapper:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#b8e0f0', borderRadius: 12, marginBottom: 14, borderWidth: 1.5, borderColor: 'transparent', overflow: 'hidden' },
  inputWrapperFocused: { borderColor: '#1565c0' },
  iconBox:             { width: 46, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#9fd4ea' },
  iconEmoji:           { fontSize: 18 },
  input:               { flex: 1, height: 50, paddingHorizontal: 14, fontSize: 15, color: '#1a1a2e', fontWeight: '500' },
  button:              { backgroundColor: '#5bb8d4', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6, marginBottom: 18, elevation: 4 },
  buttonText:          { fontSize: 17, fontWeight: '700', color: '#fff' },
  loginRow:            { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText:           { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  loginLink:           { fontSize: 14, fontWeight: '700', color: '#1565c0', textDecorationLine: 'underline' },
  homeIndicator:       { width: 120, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 8, marginTop: 4 },
});
