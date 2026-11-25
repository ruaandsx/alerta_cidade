import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FONTE_MAXIMA, cores, espaco, layout, raio, tipografia } from '../theme/tokens';
import { ICONE } from '../theme/icones';

type Props = {
  /** "marca": abertura com a marca. "tela": telas internas com voltar. */
  variante?: 'marca' | 'tela';
  titulo?: string;
  subtitulo?: string;
  /** Mostra o selo ADM ao lado da marca (telas do administrador). */
  adm?: boolean;
  onVoltar?: () => void;
  acoes?: React.ReactNode;
  semBorda?: boolean;
};

/**
 * Header único. 56 dp de altura, fundo branco, divisória de 1 dp.
 * A marca usa 24/700: o dourado só aparece em texto grande, como manda o item 1.
 */
export default function Header({
  variante = 'marca',
  titulo,
  subtitulo,
  adm = false,
  onVoltar,
  acoes,
  semBorda = false,
}: Props) {
  return (
    <View style={[styles.base, !semBorda && styles.borda]}>
      {variante === 'marca' ? (
        <View style={styles.marcaArea}>
          <View style={styles.marca}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.marcaAzul}>
              Observa
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.marcaDourada}>
              Cidade
            </Text>
          </View>
          {adm ? (
            <View style={styles.seloAdm} accessibilityLabel="Área do administrador">
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.seloAdmTexto}>
                ADM
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.telaArea}>
          {onVoltar ? (
            <Pressable
              onPress={onVoltar}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              hitSlop={4}
              style={({ pressed }) => [styles.voltar, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name={ICONE.voltar} size={layout.icone['3']} color={cores.texto.principal} />
            </Pressable>
          ) : (
            <View style={styles.voltarVazio} />
          )}

          <View style={styles.tituloArea}>
            <Text
              maxFontSizeMultiplier={FONTE_MAXIMA}
              numberOfLines={1}
              style={styles.titulo}
            >
              {titulo}
            </Text>
            {subtitulo ? (
              <Text
                maxFontSizeMultiplier={FONTE_MAXIMA}
                numberOfLines={1}
                style={styles.subtitulo}
              >
                {subtitulo}
              </Text>
            ) : null}
          </View>

          <View style={styles.acoes}>{acoes}</View>
        </View>
      )}

      {variante === 'marca' && acoes ? <View style={styles.acoes}>{acoes}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.headerAltura,
    paddingHorizontal: espaco['4'],
    backgroundColor: cores.superficie.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco['2'],
  },
  borda: {
    borderBottomWidth: 1,
    borderBottomColor: cores.borda.suave,
  },
  marcaArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['2'],
    flexShrink: 1,
  },
  marca: { flexDirection: 'row', alignItems: 'baseline' },
  marcaAzul: { ...tipografia.tituloTela, color: cores.marca.azul },
  marcaDourada: { ...tipografia.tituloTela, color: cores.marca.dourado },
  seloAdm: {
    backgroundColor: cores.marca.azul,
    borderRadius: raio.pill,
    paddingHorizontal: espaco['2'],
    paddingVertical: 2,
  },
  seloAdmTexto: {
    ...tipografia.legenda,
    color: cores.texto.inverso,
  },
  telaArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['2'],
  },
  voltar: {
    width: 48,
    height: 48,
    borderRadius: raio.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -espaco['3'],
  },
  voltarVazio: { width: espaco['1'] },
  tituloArea: { flex: 1 },
  titulo: { ...tipografia.tituloSecao, color: cores.texto.principal },
  subtitulo: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  acoes: { flexDirection: 'row', alignItems: 'center', gap: espaco['2'] },
});
