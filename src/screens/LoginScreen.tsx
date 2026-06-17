import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, SafeAreaView, Image, ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.logoWrapper}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.titleBlue}>Bem-</Text>
          <Text style={styles.titleGold}>vindo!</Text>
        </View>

        <Text style={styles.subtitle}>Entre para continuar{'\n'}ajudando sua cidade.</Text>

        <View style={styles.buttonsArea}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GoogleLogin')} activeOpacity={0.85}>
            <View style={styles.googleIcon}><Text style={styles.googleG}>G</Text></View>
            <Text style={styles.buttonText}>Entrar com Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PhoneLogin')} activeOpacity={0.85}>
            <View style={styles.phoneIcon}><Text style={styles.phoneEmoji}>📞</Text></View>
            <Text style={styles.buttonText}>Entrar com telefone</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginSuccess')} activeOpacity={0.7}>
            <Text style={styles.guestText}>Entrar como convidado</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={styles.footerBold}>Ao continuar, você concorda com nossos </Text>
            <Text style={styles.footerLink}>Termos de Uso</Text>
            <Text style={styles.footerBold}> e </Text>
            <Text style={styles.footerLink}>Política de Privacidade</Text>
            <Text style={styles.footerBold}>.</Text>
          </Text>
        </View>
      </ScrollView>
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#7ec8e3', alignItems: 'center' },
  scroll:        { flexGrow: 1, alignItems: 'center', paddingBottom: 24 },
  logoWrapper:   { marginTop: 20, marginBottom: 8 },
  logoImage:     { width: 160, height: 160 },
  titleRow:      { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16 },
  titleBlue:     { fontSize: 36, fontWeight: '800', color: '#1565c0', fontStyle: 'italic', letterSpacing: -0.5 },
  titleGold:     { fontSize: 36, fontWeight: '800', color: '#c8860a', fontStyle: 'italic', letterSpacing: -0.5 },
  subtitle:      { fontSize: 17, fontWeight: '600', color: '#1a1a2e', textAlign: 'center', lineHeight: 25, marginBottom: 32 },
  buttonsArea:   { width: '100%', paddingHorizontal: 28, gap: 12, alignItems: 'center', marginBottom: 24 },
  button:        { backgroundColor: '#f5f0dc', borderRadius: 18, paddingVertical: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
  buttonText:    { fontSize: 16, fontWeight: '600', color: '#1a1a2e', flex: 1, textAlign: 'center' },
  googleIcon:    { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  googleG:       { fontSize: 16, fontWeight: '700', color: '#4285F4' },
  phoneIcon:     { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  phoneEmoji:    { fontSize: 18 },
  guestText:     { fontSize: 15, fontWeight: '500', color: '#1565c0', textDecorationLine: 'underline', marginTop: 4 },
  footer:        { paddingHorizontal: 28, alignItems: 'center' },
  footerText:    { textAlign: 'center', lineHeight: 20 },
  footerBold:    { fontSize: 12, fontWeight: '700', color: '#1a1a2e' },
  footerLink:    { fontSize: 12, fontWeight: '600', color: '#1565c0', textDecorationLine: 'underline' },
  homeIndicator: { width: 120, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.2)', marginBottom: 8, marginTop: 4 },
});
