import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import Header from '../components/Header';
import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE, type NomeIcone } from '../theme/icones';

type Props = { navigation?: any };

const RECURSOS: { icone: NomeIcone; titulo: string; descricao: string }[] = [
  {
    icone: 'megaphone-outline',
    titulo: 'Participe da sua cidade',
    descricao:
      'Registre problemas do seu bairro com foto, localização e descrição, e ajude a cidade a melhorar.',
  },
  {
    icone: 'checkmark-done-outline',
    titulo: 'Acompanhe cada etapa',
    descricao:
      'Veja o status das suas ocorrências e acompanhe as respostas e os comentários da comunidade.',
  },
  {
    icone: 'people-outline',
    titulo: 'Transparência e confiança',
    descricao:
      'Tudo fica registrado com protocolo e histórico, dando voz ao cidadão e clareza ao atendimento.',
  },
];

export default function AboutScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Sobre o ObservaCidade"
        onVoltar={() => navigation?.goBack?.()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo do Observa Cidade"
            />
          </View>

          <View style={styles.marca}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.marcaAzul}>
              Observa
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.marcaDourada}>
              Cidade
            </Text>
          </View>

          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.slogan}>
            Sua cidade melhor começa com você.
          </Text>
        </View>

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cardTitulo}>
            O que é o ObservaCidade?
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cardTexto}>
            É um aplicativo que aproxima a população da gestão pública. Você informa problemas
            urbanos de forma simples e rápida, e a equipe responsável acompanha cada registro.
          </Text>

          <View style={styles.recursos}>
            {RECURSOS.map((item) => (
              <View key={item.titulo} style={styles.recurso}>
                <View style={styles.recursoIcone}>
                  <Ionicons name={item.icone} size={layout.icone['2']} color={cores.marca.azul} />
                </View>

                <View style={styles.recursoTexto}>
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.recursoTitulo}>
                    {item.titulo}
                  </Text>
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.recursoDesc}>
                    {item.descricao}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.compromisso}>
          <View style={styles.compromissoTopo}>
            <Ionicons name={ICONE.escudoAtivo} size={layout.icone['3']} color={cores.marca.douradoTexto} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.compromissoTitulo}>
              Nosso compromisso
            </Text>
          </View>

          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.compromissoTexto}>
            Trabalhamos todos os dias por cidades mais limpas, seguras e organizadas, com a
            colaboração de cada cidadão. Sua participação faz a diferença.
          </Text>
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.versao}>
          ObservaCidade · versão 1.0
        </Text>
      </ScrollView>

      <BarraInferior ativo="perfil" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingTop: espaco['4'],
    paddingBottom: espaco['8'],
    gap: espaco['5'],
    alignItems: 'center',
  },
  hero: { alignItems: 'center', gap: espaco['1'] },
  logoWrapper: {
    width: 128,
    height: 128,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco['2'],
  },
  logo: { width: 104, height: 104 },
  marca: { flexDirection: 'row', alignItems: 'baseline' },
  marcaAzul: { ...tipografia.marca, color: cores.marca.azul },
  marcaDourada: { ...tipografia.marca, color: cores.marca.dourado },
  slogan: {
    ...tipografia.corpoPequeno,
    color: cores.texto.secundario,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
  },
  cardTitulo: { ...tipografia.tituloSecao, color: cores.texto.principal },
  cardTexto: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  recursos: { gap: espaco['4'] },
  recurso: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco['3'] },
  recursoIcone: {
    width: 40,
    height: 40,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recursoTexto: { flex: 1, gap: 2 },
  recursoTitulo: { ...tipografia.corpoForte, color: cores.marca.azulEscuro },
  recursoDesc: { ...tipografia.corpoPequeno, color: cores.texto.secundario },

  compromisso: {
    width: '100%',
    backgroundColor: cores.superficie.destaque,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.destaque,
    padding: espaco['4'],
    gap: espaco['2'],
  },
  compromissoTopo: { flexDirection: 'row', alignItems: 'center', gap: espaco['2'] },
  compromissoTitulo: { ...tipografia.tituloSecao, color: cores.texto.principal },
  compromissoTexto: { ...tipografia.corpoPequeno, color: cores.texto.secundario },

  versao: { ...tipografia.legendaNormal, color: cores.texto.placeholder },
});
