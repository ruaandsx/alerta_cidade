import React from 'react';
import {
  Image,
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
  elevacao,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE, iconeCategoria } from '../theme/icones';
import type { FonteImagem } from '../services/api';
import {
  enderecoOcorrencia,
  tituloCategoria,
  type Ocorrencia,
} from '../services/ocorrenciaService';
import { SeloStatus, SeloUrgencia } from './Selos';

type Props = {
  item: Ocorrencia;
  imagem?: FonteImagem | null;
  onPress?: () => void;
  onPressMenu?: () => void;
  /** Chamado quando a foto não carrega; a tela pode cair para o ícone. */
  aoFalharImagem?: () => void;
  /** Linha compacta da fila do admin. */
  compacto?: boolean;
  /** Rodapé do card (comentários da home, por exemplo). */
  children?: React.ReactNode;
  estilo?: StyleProp<ViewStyle>;
};

function dataCurta(data?: string): string {
  if (!data) return '';
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return '';
  return valor.toLocaleDateString('pt-BR');
}

function dataHora(data?: string): string {
  if (!data) return '';
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return '';
  return valor.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Card da ocorrência, com e sem foto, com rodapé livre (comentários) e
 * variante compacta para a fila do admin.
 */
export default function CardOcorrencia({
  item,
  imagem,
  onPress,
  onPressMenu,
  aoFalharImagem,
  compacto = false,
  children,
  estilo,
}: Props) {
  if (compacto) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${tituloCategoria(item.categoria)}, ${enderecoOcorrencia(item)}`}
        style={({ pressed }) => [styles.card, styles.compacto, pressed && { opacity: 0.85 }, estilo]}
      >
        <View style={[styles.compactoThumb, !imagem && styles.thumbFallback]}>
          {imagem ? (
            <Image source={imagem} style={styles.imagem} onError={aoFalharImagem} />
          ) : (
            <Ionicons
              name={iconeCategoria(item.categoria)}
              size={layout.icone['3']}
              color={cores.marca.azul}
            />
          )}
        </View>

        <View style={styles.compactoInfo}>
          <Text
            maxFontSizeMultiplier={FONTE_MAXIMA}
            numberOfLines={1}
            style={styles.tituloCompacto}
          >
            {tituloCategoria(item.categoria)}
          </Text>
          <Text
            maxFontSizeMultiplier={FONTE_MAXIMA}
            numberOfLines={1}
            style={styles.enderecoCompacto}
          >
            {enderecoOcorrencia(item)}
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.dataCompacta}>
            {dataHora(item.dataCriacao)}
          </Text>
        </View>

        <View style={styles.compactoDireita}>
          <SeloStatus status={item.status} />
          <Ionicons
            name={ICONE.avancar}
            size={layout.icone['2']}
            color={cores.texto.secundario}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, estilo]}>
      <View style={styles.topo}>
        <Pressable
          onPress={onPress}
          accessibilityRole="imagebutton"
          accessibilityLabel={`Abrir ocorrência ${tituloCategoria(item.categoria)}`}
          style={({ pressed }) => [
            styles.thumb,
            !imagem && styles.thumbFallback,
            pressed && { opacity: 0.85 },
          ]}
        >
          {imagem ? (
            <Image source={imagem} style={styles.imagem} onError={aoFalharImagem} />
          ) : (
            <Ionicons
              name={iconeCategoria(item.categoria)}
              size={layout.icone['4']}
              color={cores.marca.azul}
            />
          )}
        </Pressable>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${tituloCategoria(item.categoria)}, ${enderecoOcorrencia(item)}`}
          style={({ pressed }) => [styles.info, pressed && { opacity: 0.85 }]}
        >
          <View style={styles.tituloLinha}>
            <Text
              maxFontSizeMultiplier={FONTE_MAXIMA}
              numberOfLines={2}
              style={styles.titulo}
            >
              {tituloCategoria(item.categoria)}
            </Text>
            <SeloStatus status={item.status} />
          </View>

          <View style={styles.enderecoLinha}>
            <Ionicons
              name={ICONE.localizacao}
              size={layout.icone['1']}
              color={cores.texto.secundario}
            />
            <Text
              maxFontSizeMultiplier={FONTE_MAXIMA}
              numberOfLines={2}
              style={styles.endereco}
            >
              {enderecoOcorrencia(item)}
            </Text>
          </View>

          <Text
            maxFontSizeMultiplier={FONTE_MAXIMA}
            numberOfLines={3}
            style={styles.descricao}
          >
            {item.descricao}
          </Text>

          <View style={styles.rodape}>
            <SeloUrgencia urgencia={item.urgencia} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.data}>
              {dataCurta(item.dataCriacao)}
            </Text>
          </View>
        </Pressable>

        {onPressMenu ? (
          <Pressable
            onPress={onPressMenu}
            accessibilityRole="button"
            accessibilityLabel="Mais opções da ocorrência"
            hitSlop={4}
            style={({ pressed }) => [styles.menu, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name={ICONE.menu} size={layout.icone['2']} color={cores.texto.secundario} />
          </Pressable>
        ) : null}
      </View>

      {children ? <View style={styles.rodapeCard}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
    ...elevacao[1],
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['3'],
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: raio['2'],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie.azul,
    flexShrink: 0,
  },
  thumbFallback: { backgroundColor: cores.superficie.azul },
  imagem: { width: '100%', height: '100%' },
  info: { flex: 1, gap: espaco['1'] },
  tituloLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: espaco['2'],
  },
  titulo: {
    ...tipografia.corpoForte,
    color: cores.texto.principal,
    flexShrink: 1,
  },
  enderecoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['1'],
  },
  endereco: {
    ...tipografia.legendaNormal,
    color: cores.texto.secundario,
    flex: 1,
  },
  descricao: {
    ...tipografia.corpoPequeno,
    color: cores.texto.principal,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco['2'],
    marginTop: espaco['1'],
  },
  data: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  menu: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -espaco['2'],
    marginRight: -espaco['2'],
  },
  rodapeCard: {
    borderTopWidth: 1,
    borderTopColor: cores.borda.suave,
    paddingTop: espaco['3'],
    gap: espaco['3'],
  },

  // Compacto (fila do admin)
  compacto: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: espaco['3'],
    gap: espaco['3'],
  },
  compactoThumb: {
    width: 56,
    height: 56,
    borderRadius: raio['2'],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  compactoInfo: { flex: 1, gap: 2 },
  tituloCompacto: { ...tipografia.corpoForte, color: cores.texto.principal },
  enderecoCompacto: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  dataCompacta: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  compactoDireita: { alignItems: 'flex-end', gap: espaco['1'], flexShrink: 0 },
});
