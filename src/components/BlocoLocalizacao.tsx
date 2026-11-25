import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FONTE_MAXIMA, cores, espaco, layout, raio, tipografia } from '../theme/tokens';
import { ICONE } from '../theme/icones';
import Botao from './Botao';

type Props = {
  rua?: string;
  bairro?: string;
  referencia?: string;
  latitude?: number | null;
  longitude?: number | null;
  aoAbrirMapa?: () => void;
};

function enderecoCompleto(rua?: string, bairro?: string): string {
  const r = (rua || '').trim();
  const b = (bairro || '').trim();
  const bairroValido = b && b !== 'Não informado' ? b : '';

  if (r && bairroValido) return `${r}, ${bairroValido}`;
  return r || bairroValido || 'Endereço não informado';
}

/**
 * Bloco único de localização, usado no detalhe do cidadão e no do admin.
 * Com coordenadas: mostra latitude/longitude e o botão do mapa.
 * Sem coordenadas: mostra o texto curto e esconde o botão.
 */
export default function BlocoLocalizacao({
  rua,
  bairro,
  referencia,
  latitude,
  longitude,
  aoAbrirMapa,
}: Props) {
  const temCoordenadas = latitude != null && longitude != null;
  const endereco = enderecoCompleto(rua, bairro);
  const coordenadas = temCoordenadas
    ? `${latitude!.toFixed(6)}, ${longitude!.toFixed(6)}`
    : '';

  return (
    <View style={styles.bloco}>
      <View style={styles.cabecalho}>
        <Ionicons name={ICONE.localizacao} size={layout.icone['2']} color={cores.marca.azul} />
        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.titulo}>
          Localização
        </Text>
      </View>

      <Text
        maxFontSizeMultiplier={FONTE_MAXIMA}
        style={styles.endereco}
        accessibilityLabel={`Endereço: ${endereco}`}
      >
        {endereco}
      </Text>

      {referencia ? (
        <View style={styles.referenciaLinha}>
          <Ionicons name={ICONE.referencia} size={layout.icone['1']} color={cores.texto.secundario} />
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.referencia}>
            {referencia}
          </Text>
        </View>
      ) : null}

      {temCoordenadas ? (
        <>
          <View style={styles.coordenadasBloco}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
              Coordenadas
            </Text>
            <Text
              maxFontSizeMultiplier={FONTE_MAXIMA}
              selectable
              style={styles.coordenadas}
              accessibilityLabel={`Coordenadas ${latitude}, ${longitude}`}
            >
              {coordenadas}
            </Text>
          </View>

          <Botao
            titulo="Abrir localização no mapa"
            icone={ICONE.mapa}
            variante="secundario"
            onPress={aoAbrirMapa}
            acessibilidadeLabel={`Abrir ${endereco} no aplicativo de mapas`}
            estilo={styles.botaoMapa}
          />
        </>
      ) : (
        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.semLocal}>
          Sem localização registrada.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['2'],
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['1'],
  },
  titulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  endereco: { ...tipografia.corpo, color: cores.texto.principal },
  referenciaLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['1'],
  },
  referencia: { ...tipografia.corpoPequeno, color: cores.texto.secundario, flex: 1 },
  coordenadasBloco: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['1'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['3'],
    gap: 2,
  },
  rotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  coordenadas: {
    ...tipografia.corpoPequeno,
    color: cores.texto.principal,
    letterSpacing: 0.3,
  },
  semLocal: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  botaoMapa: { marginTop: espaco['1'] },
});
