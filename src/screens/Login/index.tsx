import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AlertaCidade</Text>
        <Text style={styles.subtitle}>Sua voz transforma a cidade</Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#E53935', padding: 40, alignItems: 'center', paddingTop: 60 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 6 },
  form: { padding: 24, gap: 14 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 15 },
  btn: { backgroundColor: '#E53935', borderRadius: 8, padding: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  link: { textAlign: 'center', color: '#E53935', fontSize: 14 },
});
