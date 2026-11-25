import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import Botao from '../components/Botao';
import Header from '../components/Header';
import {
  FONTE_MAXIMA,
  cores,
  elevacao,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE, type NomeIcone } from '../theme/icones';
import { useUsuarioLogado } from '../hooks/useUsuarioLogado';
import { logout } from '../services/authService';

type Props = { navigation?: any };

type ItemMenu = { icone: NomeIcone; rotulo: string; rota: string };

const MENU: ItemMenu[] = [
  { icone: ICONE.dados, rotulo: 'Meus dados', rota: 'MeusDados' },
  { icone: ICONE.historico, rotulo: 'Histórico de ocorrências', rota: 'Historico' },
  { icone: ICONE.ajuda, rotulo: 'Ajuda e suporte', rota: 'Ajuda' },
  { icone: ICONE.sobre, rotulo: 'Sobre o ObservaCidade', rota: 'SobreObservaCidade' },
];

export default function ProfileScreen({ navigation }: Props) {
  const { usuario } = useUsuarioLogado();

  async function handleLogout() {
    await logout();
    navigation?.reset?.({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header variante="tela" titulo="Meu perfil" onVoltar={() => navigation?.goBack?.()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Ionicons name={ICONE.perfilAtivo} size={48} color={cores.marca.azul} />
          </View>

          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.nome}>
            {usuario?.nome || 'Usuário'}
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.email}>
            {usuario?.email || ''}
          </Text>
        </View>

        <View style={styles.menu}>
          {MENU.map((item, index) => (
            <Pressable
              key={item.rota}
              onPress={() => navigation?.navigate(item.rota)}
              accessibilityRole="button"
              accessibilityLabel={item.rotulo}
              style={({ pressed }) => [
                styles.menuLinha,
                index < MENU.length - 1 && styles.menuLinhaBorda,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.menuIcone}>
                <Ionicons name={item.icone} size={layout.icone['2']} color={cores.marca.azul} />
              </View>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.menuTexto}>
                {item.rotulo}
              </Text>
              <Ionicons
                name={ICONE.avancar}
                size={layout.icone['2']}
                color={cores.texto.secundario}
              />
            </Pressable>
          ))}
        </View>

        <Botao titulo="Sair" icone={ICONE.sair} variante="destrutivo" onPress={handleLogout} />
      </ScrollView>

      <BarraInferior ativo="perfil" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingBottom: espaco['8'],
    gap: espaco['5'],
  },
  avatarArea: { alignItems: 'center', gap: espaco['1'], paddingTop: espaco['4'] },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco['2'],
  },
  nome: { ...tipografia.tituloTela, color: cores.texto.principal, textAlign: 'center' },
  email: { ...tipografia.corpoPequeno, color: cores.texto.secundario, textAlign: 'center' },
  menu: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    overflow: 'hidden',
    ...elevacao[1],
  },
  menuLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    minHeight: 64,
    paddingHorizontal: espaco['4'],
    paddingVertical: espaco['2'],
  },
  menuLinhaBorda: { borderBottomWidth: 1, borderBottomColor: cores.borda.suave },
  menuIcone: {
    width: 40,
    height: 40,
    borderRadius: raio['2'],
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTexto: { ...tipografia.corpoForte, color: cores.texto.principal, flex: 1 },
});
