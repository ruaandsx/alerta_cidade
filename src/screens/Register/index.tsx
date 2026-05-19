import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');

  const handleRegister = async () => {
    try {
      await register(name, email, password, city);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a conta');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#E53935', padding: 40, alignItems: 'center', paddingTop: 60 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  form: { padding: 24, gap: 14 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 15 },
  btn: { backgroundColor: '#E53935', borderRadius: 8, padding: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
