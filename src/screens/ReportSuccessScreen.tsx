import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import Botao from '../components/Botao';
import Header from '../components/Header';
import { FONTE_MAXIMA, cores, elevacao, espaco, layout, raio, tipografia } from '../theme/tokens';
import { ICONE, iconeCategoria } from '../theme/icones';
import {
  enderecoOcorrencia,
  tituloCategoria,
  type Ocorrencia,
} from '../services/ocorrenciaService';

type Props = { navigation?: any; route?: any };

function dataHora(valor?: string): string {
  if (!valor) return 'Agora';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return 'Agora';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReportSuccessScreen({ navigation, route }: Props) {
  const ocorrencia: Ocorrencia | undefined = route?.params?.ocorrencia;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Ocorrência enviada"
        onVoltar={() => navigation?.navigate?.('Home')}
        semBorda
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.anel}>
            <View style={styles.circulo}>
              <Ionicons name="checkmark" size={56} color={cores.texto.inverso} />
            </View>
          </View>

          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.titulo}>
            Ocorrência registrada!
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.subtitulo}>
            Obrigado por ajudar a melhorar a cidade. Sua ocorrência já foi encaminhada para análise.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTopo}>
            <View style={styles.cardIcone}>
              <Ionicons
                name={iconeCategoria(ocorrencia?.categoria)}
                size={layout.icone['3']}
                color={cores.marca.azul}
              />
            </View>
            <View style={styles.cardTituloBloco}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cardTitulo}>
                {tituloCategoria(ocorrencia?.categoria)}
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cardProtocolo}>
                {ocorrencia?.protocolo ? `Protocolo ${ocorrencia.protocolo}` : 'Registro confirmado'}
              </Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.linha}>
            <Ionicons name={ICONE.localizacao} size={layout.icone['2']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.linhaTexto}>
              {ocorrencia ? enderecoOcorrencia(ocorrencia) : 'Endereço informado'}
            </Text>
          </View>

          <View style={styles.linha}>
            <Ionicons name={ICONE.historico} size={layout.icone['2']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.linhaTexto}>
              {dataHora(ocorrencia?.dataCriacao)}
            </Text>
          </View>

          <View style={styles.linha}>
            <Ionicons name={ICONE.pendente} size={layout.icone['2']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.linhaTexto}>
              Previsão de resposta: até 5 dias úteis
            </Text>
          </View>
        </View>

        <View style={styles.aviso}>
          <Ionicons name={ICONE.notificacoes} size={layout.icone['3']} color={cores.marca.azulEscuro} />
          <View style={styles.avisoTexto}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.avisoTitulo}>
              Acompanhe o andamento
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.avisoDesc}>
              Você recebe uma notificação a cada mudança de status e pode ver tudo no histórico.
            </Text>
          </View>
        </View>

        <View style={styles.botoes}>
          <Botao
            titulo="Ver minhas ocorrências"
            icone={ICONE.historico}
            onPress={() => navigation?.replace?.('Historico')}
          />
          <Botao
            titulo="Voltar para o início"
            icone={ICONE.inicio}
            variante="secundario"
            onPress={() => navigation?.navigate?.('Home')}
          />
        </View>
      </ScrollView>

      <BarraInferior ativo="inicio" navigation={navigation} />
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
  },
  hero: { alignItems: 'center', gap: espaco['2'], paddingVertical: espaco['4'] },
  anel: {
    width: 128,
    height: 128,
    borderRadius: raio.pill,
    backgroundColor: cores.estado.sucessoFundo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco['2'],
  },
  circulo: {
    width: 96,
    height: 96,
    borderRadius: raio.pill,
    backgroundColor: cores.estado.sucessoGrafico,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { ...tipografia.tituloTela, color: cores.texto.principal, textAlign: 'center' },
  subtitulo: {
    ...tipografia.corpo,
    color: cores.texto.secundario,
    textAlign: 'center',
    maxWidth: 320,
  },

  card: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
    ...elevacao[1],
  },
  cardTopo: { flexDirection: 'row', alignItems: 'center', gap: espaco['3'] },
  cardIcone: {
    width: 48,
    height: 48,
    borderRadius: raio['2'],
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTituloBloco: { flex: 1, gap: 2 },
  cardTitulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  cardProtocolo: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  divisor: { height: 1, backgroundColor: cores.borda.suave },
  linha: { flexDirection: 'row', alignItems: 'flex-start', gap: espaco['2'] },
  linhaTexto: { ...tipografia.corpoPequeno, color: cores.texto.principal, flex: 1 },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['3'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['3'],
    padding: espaco['4'],
  },
  avisoTexto: { flex: 1, gap: 2 },
  avisoTitulo: { ...tipografia.corpoForte, color: cores.marca.azulEscuro },
  avisoDesc: { ...tipografia.corpoPequeno, color: cores.texto.secundario },

  botoes: { gap: espaco['3'] },
});
