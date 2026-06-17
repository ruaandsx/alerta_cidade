import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'PhoneLogin'> };

export default function PhoneLoginScreen({ navigation }: Props) {
  const [telefone, setTelefone] = useState('');
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
            <View style={styles.titleRow}>
              <Text style={styles.titleIcon}>📞</Text>
              <Text style={styles.titleText}>Telefone</Text>
            </View>
            <Text style={styles.loginLabel}>Login</Text>

            <View style={[styles.inputWrapper, focused === 'telefone' && styles.inputWrapperFocused]}>
              <Text style={styles.fieldLabel}>Digite seu Telefone</Text>
              <View style={styles.inputRow}>
                <Text style={styles.fieldIcon}>📞</Text>
                <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" returnKeyType="next" onFocus={() => setFocused('telefone')} onBlur={() => setFocused(null)} />
              </View>
            </View>

            <View style={[styles.inputWrapper, focused === 'senha' && styles.inputWrapperFocused]}>
              <Text style={styles.fieldLabel}>Digite sua senha</Text>
              <View style={styles.inputRow}>
                <Text style={styles.fieldIcon}>🔒</Text>
                <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry returnKeyType="done" onSubmitEditing={() => navigation.navigate('LoginSuccess')} onFocus={() => setFocused('senha')} onBlur={() => setFocused(null)} />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginSuccess')} activeOpacity={0.85}>
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
  container:           { flex: 1, backgroundColor: '#7ec8e3', alignItems: 'center' },
  backButton:          { alignSelf: 'flex-start', marginTop: 8, marginLeft: 12, backgroundColor: '#6a0dad', borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backArrow:           { fontSize: 20, color: '#fff', fontWeight: '600', lineHeight: 22 },
  scroll:              { flexGrow: 1, alignItems: 'center', paddingBottom: 24 },
  logoWrapper:         { marginTop: 10, marginBottom: 8 },
  logoImage:           { width: 155, height: 155 },
  appNameRow:          { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  appNameBlue:         { fontSize: 36, fontWeight: '700', color: '#1565c0', letterSpacing: -0.5 },
  appNameGold:         { fontSize: 36, fontWeight: '700', color: '#c8860a', letterSpacing: -0.5 },
  card:                { width: '92%', backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  titleRow:            { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  titleIcon:           { fontSize: 22 },
  titleText:           { fontSize: 22, fontWeight: '700', color: '#1a1a2e' },
  loginLabel:          { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 20 },
  inputWrapper:        { width: '100%', backgroundColor: '#b8e0f0', borderRadius: 10, marginBottom: 14, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6, borderWidth: 1.5, borderColor: 'transparent' },
  inputWrapperFocused: { borderColor: '#1565c0' },
  fieldLabel:          { fontSize: 11, fontWeight: '600', color: '#1a3a5c', marginBottom: 4 },
  inputRow:            { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fieldIcon:           { fontSize: 16 },
  input:               { flex: 1, height: 28, fontSize: 15, color: '#1a1a2e', fontWeight: '500', padding: 0 },
  button:              { width: '100%', backgroundColor: '#5bb8d4', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 4, marginBottom: 14, elevation: 3 },
  buttonText:          { fontSize: 17, fontWeight: '700', color: '#fff' },
  forgotWrapper:       { paddingVertical: 4 },
  forgotText:          { fontSize: 13, fontWeight: '500', color: '#1565c0', textDecorationLine: 'underline' },
  homeIndicator:       { width: 120, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 8, marginTop: 4 },
});
