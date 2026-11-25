import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE, iconeStatus, iconeUrgencia } from '../theme/icones';
import { rotuloStatus, rotuloUrgencia } from '../services/ocorrenciaService';

const FUNDO_STATUS: Record<string, { fundo: string; texto: string; grafico: string }> = {
  RECEBIDO: cores.status.recebido,
  EM_ANALISE: cores.status.analise,
  EM_ANDAMENTO: cores.status.andamento,
  RESOLVIDO: cores.status.resolvido,
};

const COR_URGENCIA: Record<string, string> = {
  BAIXA: cores.urgencia.baixa,
  MEDIA: cores.urgencia.media,
  ALTA: cores.urgencia.alta,
};

/** Selo de status: fundo suave + ícone + texto. Nunca depende só da cor. */
export function SeloStatus({ status }: { status?: string }) {
  const coresStatus = FUNDO_STATUS[status || ''] || cores.status.recebido;

  return (
    <View
      style={[styles.selo, { backgroundColor: coresStatus.fundo }]}
      accessibilityLabel={`Status: ${rotuloStatus(status)}`}
    >
      <Ionicons name={iconeStatus(status)} size={layout.icone['1']} color={coresStatus.texto} />
      <Text
        maxFontSizeMultiplier={FONTE_MAXIMA}
        numberOfLines={1}
        style={[styles.seloTexto, { color: coresStatus.texto }]}
      >
        {rotuloStatus(status)}
      </Text>
    </View>
  );
}

/** Urgência: ícone + palavra na cor de urgência, sobre superfície branca. */
export function SeloUrgencia({ urgencia, prefixo = true }: { urgencia?: string; prefixo?: boolean }) {
  const cor = COR_URGENCIA[urgencia || ''] || cores.urgencia.baixa;
  const texto = rotuloUrgencia(urgencia);

  return (
    <View
      style={styles.urgencia}
      accessibilityLabel={`Urgência ${texto}`}
    >
      <Ionicons name={iconeUrgencia(urgencia)} size={layout.icone['2']} color={cor} />
      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={[styles.urgenciaTexto, { color: cor }]}>
        {prefixo ? `Urgência ${texto.toLowerCase()}` : texto}
      </Text>
    </View>
  );
}

/** Papel do usuário na lista do admin. */
export function SeloPapel({ papel }: { papel?: string }) {
  const admin = papel === 'ADMIN';

  return (
    <View
      style={[styles.papel, admin ? styles.papelAdmin : styles.papelCidadao]}
      accessibilityLabel={admin ? 'Administrador' : 'Cidadão'}
    >
      <Ionicons
        name={admin ? ICONE.escudo : ICONE.perfil}
        size={layout.icone['1']}
        color={admin ? cores.texto.inverso : cores.texto.secundario}
      />
      <Text
        maxFontSizeMultiplier={FONTE_MAXIMA}
        style={[styles.papelTexto, admin ? styles.papelTextoAdmin : styles.papelTextoCidadao]}
      >
        {admin ? 'Admin' : 'Cidadão'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['1'],
    alignSelf: 'flex-start',
    borderRadius: raio.pill,
    paddingHorizontal: espaco['2'],
    paddingVertical: 4,
    maxWidth: '100%',
  },
  seloTexto: { ...tipografia.legenda, flexShrink: 1 },
  urgencia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['1'],
    flexShrink: 1,
  },
  urgenciaTexto: { ...tipografia.legenda, flexShrink: 1 },
  papel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['1'],
    borderRadius: raio.pill,
    paddingHorizontal: espaco['2'],
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  papelAdmin: { backgroundColor: cores.marca.azul },
  papelCidadao: { backgroundColor: cores.superficie.media },
  papelTexto: { ...tipografia.legenda },
  papelTextoAdmin: { color: cores.texto.inverso },
  papelTextoCidadao: { color: cores.texto.secundario },
});
