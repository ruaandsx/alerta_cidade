import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
  toque,
} from '../theme/tokens';
import type { NomeIcone } from '../theme/icones';

export type VarianteBotao = 'primario' | 'secundario' | 'destaque' | 'texto' | 'destrutivo';

type Props = {
  titulo: string;
  onPress?: () => void;
  variante?: VarianteBotao;
  icone?: NomeIcone;
  carregando?: boolean;
  desabilitado?: boolean;
  larguraTotal?: boolean;
  estilo?: StyleProp<ViewStyle>;
  acessibilidadeLabel?: string;
};

const CORES_TEXTO: Record<VarianteBotao, string> = {
  primario: cores.texto.inverso,
  secundario: cores.marca.azulEscuro,
  destaque: cores.texto.principal,
  texto: cores.marca.azul,
  destrutivo: cores.estado.erroTexto,
};

const CORES_FUNDO: Record<VarianteBotao, string> = {
  primario: cores.marca.azul,
  secundario: cores.superficie.azul,
  destaque: cores.superficie.destaque,
  texto: 'transparent',
  destrutivo: cores.estado.erroFundo,
};

const CORES_ICONE: Record<VarianteBotao, string> = CORES_TEXTO;

/**
 * Botão único do app. Altura de 48 dp, raio 12, rótulo de 16/600.
 * Estados: padrão, pressed (opacidade), desabilitado e carregando.
 */
export default function Botao({
  titulo,
  onPress,
  variante = 'primario',
  icone,
  carregando = false,
  desabilitado = false,
  larguraTotal = true,
  estilo,
  acessibilidadeLabel,
}: Props) {
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={inativo ? undefined : onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={acessibilidadeLabel || titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      hitSlop={toque.hitSlop}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: CORES_FUNDO[variante] },
        variante === 'destaque' && styles.destaqueBorda,
        variante === 'destrutivo' && styles.destrutivoBorda,
        inativo && styles.desabilitado,
        larguraTotal && styles.larguraTotal,
        pressed && !inativo && { opacity: 0.85 },
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator
          size="small"
          color={inativo ? cores.estado.desabilitadoTexto : CORES_TEXTO[variante]}
        />
      ) : (
        <View style={styles.conteudo}>
          {icone ? (
            <Ionicons
              name={icone}
              size={layout.icone['2']}
              color={inativo ? cores.estado.desabilitadoTexto : CORES_ICONE[variante]}
            />
          ) : null}
          <Text
            maxFontSizeMultiplier={FONTE_MAXIMA}
            style={[
              styles.texto,
              { color: inativo ? cores.estado.desabilitadoTexto : CORES_TEXTO[variante] },
            ]}
          >
            {titulo}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.botaoAltura,
    paddingHorizontal: espaco['5'],
    paddingVertical: espaco['3'],
    borderRadius: raio['2'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['2'],
  },
  larguraTotal: { alignSelf: 'stretch' },
  destaqueBorda: {
    borderWidth: 1,
    borderColor: cores.borda.destaque,
  },
  destrutivoBorda: {
    borderWidth: 1,
    borderColor: cores.estado.erroBorda,
  },
  desabilitado: {
    backgroundColor: cores.estado.desabilitadoFundo,
    borderWidth: 1,
    borderColor: cores.estado.desabilitadoBorda,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['2'],
  },
  texto: {
    ...tipografia.botao,
    textAlign: 'center',
    flexShrink: 1,
  },
});
