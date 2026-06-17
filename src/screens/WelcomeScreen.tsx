import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView, Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
        </View>

        <Text style={styles.slogan}>
          Sua cidade melhor{'\n'}começa com você.
        </Text>
      </View>

      <View style={styles.buttonsArea}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#7ec8e3', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  content:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 16 },
  logoWrapper:   { marginBottom: 12 },
  logoImage:     { width: 170, height: 170 },
  appNameRow:    { flexDirection: 'row', alignItems: 'baseline', marginBottom: 24 },
  appNameBlue:   { fontSize: 38, fontWeight: '700', color: '#1565c0', letterSpacing: -0.5 },
  appNameGold:   { fontSize: 38, fontWeight: '700', color: '#c8860a', letterSpacing: -0.5 },
  slogan:        { fontSize: 18, fontWeight: '600', color: '#1a1a2e', textAlign: 'center', lineHeight: 26 },
  buttonsArea:   { width: '100%', paddingHorizontal: 32, gap: 14, marginBottom: 8 },
  button:        { backgroundColor: '#f5f0dc', borderRadius: 18, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
  buttonText:    { fontSize: 17, fontWeight: '600', color: '#1a1a2e', letterSpacing: 0.2 },
  homeIndicator: { width: 120, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 4 },
});
