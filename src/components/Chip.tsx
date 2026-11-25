import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FONTE_MAXIMA, cores, espaco, raio, tipografia } from '../theme/tokens';

type Props = {
  rotulo: string;
  selecionado?: boolean;
  onPress?: () => void;
  desabilitado?: boolean;
};

/** Chip de filtro. Selecionado = azul cheio; não selecionado = cinza claro. */
export default function Chip({ rotulo, selecionado = false, onPress, desabilitado = false }: Props) {
  return (
    <Pressable
      onPress={desabilitado ? undefined : onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ selected: selecionado, disabled: desabilitado }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        selecionado ? styles.ativo : styles.inativo,
        desabilitado && styles.desabilitado,
        pressed && !desabilitado && { opacity: 0.8 },
      ]}
    >
      <Text
        maxFontSizeMultiplier={FONTE_MAXIMA}
        numberOfLines={1}
        style={[
          styles.texto,
          selecionado ? styles.textoAtivo : styles.textoInativo,
          desabilitado && styles.textoDesabilitado,
        ]}
      >
        {rotulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: espaco['4'],
    borderRadius: raio.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ativo: { backgroundColor: cores.marca.azul },
  inativo: { backgroundColor: cores.superficie.media },
  desabilitado: { backgroundColor: cores.estado.desabilitadoFundo },
  texto: { ...tipografia.rotulo },
  textoAtivo: { color: cores.texto.inverso },
  textoInativo: { color: cores.texto.secundario },
  textoDesabilitado: { color: cores.estado.desabilitadoTexto },
});
