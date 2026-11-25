import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FONTE_MAXIMA, cores, espaco, layout, raio, estados, tipografia } from '../theme/tokens';
import type { NomeIcone } from '../theme/icones';

type Props = {
  rotulo?: string;
  valor: string;
  aoMudar: (texto: string) => void;
  placeholder?: string;
  ajuda?: string;
  erro?: string;
  seguro?: boolean;
  multilinha?: boolean;
  editavel?: boolean;
  icone?: NomeIcone;
  teclado?: KeyboardTypeOptions;
  capitalizacao?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrecao?: boolean;
  aoEnviar?: () => void;
  maxLength?: number;
  acessibilidadeLabel?: string;
};

/**
 * Campo de formulário com rótulo sempre visível (não depende só do placeholder).
 * Estados: padrão, foco, preenchido, erro, desabilitado.
 */
export default function Campo({
  rotulo,
  valor,
  aoMudar,
  placeholder,
  ajuda,
  erro,
  seguro = false,
  multilinha = false,
  editavel = true,
  icone,
  teclado = 'default',
  capitalizacao = 'sentences',
  autoCorrecao = false,
  aoEnviar,
  maxLength,
  acessibilidadeLabel,
}: Props) {
  const [focado, setFocado] = useState(false);

  const corBorda = erro
    ? cores.estado.erroBorda
    : focado
      ? cores.marca.azul
      : cores.borda.forte;

  return (
    <View style={styles.bloco}>
      {rotulo ? (
        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
          {rotulo}
        </Text>
      ) : null}

      <View
        style={[
          styles.campo,
          multilinha && styles.campoMultilinha,
          { borderColor: corBorda },
          focado && styles.focado,
          !editavel && styles.desabilitado,
        ]}
      >
        {icone ? (
          <Ionicons name={icone} size={layout.icone['2']} color={cores.texto.secundario} />
        ) : null}

        <TextInput
          value={valor}
          onChangeText={aoMudar}
          placeholder={placeholder}
          placeholderTextColor={cores.texto.placeholder}
          secureTextEntry={seguro}
          multiline={multilinha}
          editable={editavel}
          keyboardType={teclado}
          autoCapitalize={capitalizacao}
          autoCorrect={autoCorrecao}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          onSubmitEditing={aoEnviar}
          maxLength={maxLength}
          accessibilityLabel={acessibilidadeLabel || rotulo || placeholder}
          maxFontSizeMultiplier={FONTE_MAXIMA}
          style={[styles.entrada, multilinha && styles.entradaMultilinha, !editavel && styles.entradaDesabilitada]}
        />
      </View>

      {erro ? (
        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.erro}>
          {erro}
        </Text>
      ) : ajuda ? (
        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.ajuda}>
          {ajuda}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: espaco['2'] },
  rotulo: { ...tipografia.rotulo, color: cores.texto.principal },
  campo: {
    minHeight: layout.campoAltura,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['2'],
    borderWidth: estados.bordaPadrao,
    borderRadius: raio['2'],
    paddingHorizontal: espaco['3'],
    backgroundColor: cores.superficie.base,
  },
  campoMultilinha: {
    minHeight: 104,
    alignItems: 'flex-start',
    paddingVertical: espaco['3'],
  },
  focado: { borderWidth: estados.focoBorda },
  desabilitado: {
    backgroundColor: cores.estado.desabilitadoFundo,
    borderColor: cores.estado.desabilitadoBorda,
  },
  entrada: {
    flex: 1,
    ...tipografia.corpo,
    color: cores.texto.principal,
    paddingVertical: espaco['2'],
  },
  entradaMultilinha: {
    textAlignVertical: 'top',
    minHeight: 72,
  },
  entradaDesabilitada: { color: cores.estado.desabilitadoTexto },
  erro: { ...tipografia.corpoPequeno, color: cores.estado.erroTexto },
  ajuda: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
});
