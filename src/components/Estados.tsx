import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FONTE_MAXIMA, cores, espaco, layout, raio, tipografia } from '../theme/tokens';
import { ICONE, type NomeIcone } from '../theme/icones';
import Botao from './Botao';

export function Carregando({ texto = 'Carregando...' }: { texto?: string }) {
  return (
    <View style={styles.area} accessibilityRole="progressbar" accessibilityLabel={texto}>
      <ActivityIndicator size="large" color={cores.marca.azul} />
      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.texto}>
        {texto}
      </Text>
    </View>
  );
}

type VazioProps = {
  titulo: string;
  descricao?: string;
  icone?: NomeIcone;
  acao?: { titulo: string; onPress: () => void };
};

export function Vazio({ titulo, descricao, icone = ICONE.vazio, acao }: VazioProps) {
  return (
    <View style={styles.area}>
      <View style={styles.circulo}>
        <Ionicons name={icone} size={layout.icone['4']} color={cores.marca.azul} />
      </View>
      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.titulo}>
        {titulo}
      </Text>
      {descricao ? (
        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.texto}>
          {descricao}
        </Text>
      ) : null}
      {acao ? (
        <Botao
          titulo={acao.titulo}
          variante="secundario"
          onPress={acao.onPress}
          larguraTotal={false}
          estilo={styles.acao}
        />
      ) : null}
    </View>
  );
}

type ErroProps = {
  titulo?: string;
  descricao?: string;
  aoTentarDeNovo?: () => void;
};

export function ErroLista({
  titulo = 'Não foi possível carregar',
  descricao = 'Confira sua conexão e tente de novo.',
  aoTentarDeNovo,
}: ErroProps) {
  return (
    <View style={styles.area} accessibilityRole="alert">
      <View style={[styles.circulo, styles.circuloErro]}>
        <Ionicons name={ICONE.erro} size={layout.icone['4']} color={cores.estado.erroTexto} />
      </View>
      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.titulo}>
        {titulo}
      </Text>
      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.texto}>
        {descricao}
      </Text>
      {aoTentarDeNovo ? (
        <Botao
          titulo="Tentar de novo"
          icone={ICONE.atualizar}
          variante="secundario"
          onPress={aoTentarDeNovo}
          larguraTotal={false}
          estilo={styles.acao}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    alignItems: 'center',
    paddingVertical: espaco['8'],
    paddingHorizontal: espaco['4'],
    gap: espaco['2'],
  },
  circulo: {
    width: 64,
    height: 64,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco['1'],
  },
  circuloErro: { backgroundColor: cores.estado.erroFundo },
  titulo: {
    ...tipografia.corpoForte,
    color: cores.texto.principal,
    textAlign: 'center',
  },
  texto: {
    ...tipografia.corpoPequeno,
    color: cores.texto.secundario,
    textAlign: 'center',
  },
  acao: { marginTop: espaco['2'] },
});
