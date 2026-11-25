import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { cores, layout, raio } from '../theme/tokens';
import type { NomeIcone } from '../theme/icones';

type Props = {
  icone: NomeIcone;
  rotulo: string;
  onPress?: () => void;
  variante?: 'claro' | 'azul';
  tamanho?: number;
};

/** Botão redondo só de ícone. Sempre com accessibilityLabel. */
export default function BotaoIcone({
  icone,
  rotulo,
  onPress,
  variante = 'claro',
  tamanho = layout.icone['3'],
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        variante === 'azul' ? styles.azul : styles.claro,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons
        name={icone}
        size={tamanho}
        color={variante === 'azul' ? cores.texto.inverso : cores.marca.azul}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 48,
    height: 48,
    minWidth: 48,
    minHeight: 48,
    borderRadius: raio.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claro: { backgroundColor: cores.superficie.media },
  azul: { backgroundColor: cores.marca.azul },
});
