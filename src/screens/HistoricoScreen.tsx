import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import CardOcorrencia from '../components/CardOcorrencia';
import Header from '../components/Header';
import { Carregando, ErroLista, Vazio } from '../components/Estados';
import {
  FONTE_MAXIMA,
  cores,
  elevacao,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE } from '../theme/icones';
import {
  listarMinhasOcorrencias,
  obterMinhasEstatisticas,
  type Ocorrencia,
} from '../services/ocorrenciaService';
import { fonteImagem, type FonteImagem } from '../services/api';

type Props = { navigation?: any };

type Resumo = { total: number; abertas: number; resolvidas: number };

export default function HistoricoScreen({ navigation }: Props) {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [imagens, setImagens] = useState<Record<number, FonteImagem | null>>({});
  const [falhas, setFalhas] = useState<Record<number, boolean>>({});
  const [resumo, setResumo] = useState<Resumo>({ total: 0, abertas: 0, resolvidas: 0 });
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    carregar();

    const unsubscribe = navigation?.addListener?.('focus', () => carregar(false));
    return unsubscribe;
  }, [navigation]);

  async function carregar(mostrarLoading = true) {
    try {
      if (mostrarLoading) setCarregando(true);
      setErro(false);

      const [lista, estatisticas] = await Promise.all([
        listarMinhasOcorrencias({ size: 100 }),
        obterMinhasEstatisticas().catch(() => null),
      ]);

      setOcorrencias(lista);

      if (estatisticas) {
        setResumo({
          total: estatisticas.total || lista.length,
          abertas:
            (estatisticas.porStatus?.RECEBIDO || 0) +
            (estatisticas.porStatus?.EM_ANALISE || 0) +
            (estatisticas.porStatus?.EM_ANDAMENTO || 0),
          resolvidas: estatisticas.porStatus?.RESOLVIDO || 0,
        });
      } else {
        setResumo({
          total: lista.length,
          abertas: lista.filter((i) => i.status !== 'RESOLVIDO').length,
          resolvidas: lista.filter((i) => i.status === 'RESOLVIDO').length,
        });
      }

      const comImagem = lista.filter((item) => item.id && item.temImagem);

      const entradas = await Promise.all(
        comImagem.map(async (item) => {
          try {
            const fonte = await fonteImagem(item.id, true);
            return [item.id as number, fonte] as const;
          } catch {
            return [item.id as number, null] as const;
          }
        }),
      );

      setImagens(Object.fromEntries(entradas));
    } catch (e) {
      console.log('Erro ao carregar histórico:', e);
      setOcorrencias([]);
      setErro(true);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Histórico"
        subtitulo="Suas ocorrências registradas"
        onVoltar={() => navigation?.goBack?.()}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              setAtualizando(true);
              carregar(false);
            }}
            colors={[cores.marca.azul]}
            tintColor={cores.marca.azul}
          />
        }
      >
        <View style={styles.resumo}>
          <View style={styles.resumoItem}>
            <Ionicons name={ICONE.ocorrencias} size={layout.icone['2']} color={cores.marca.azul} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {resumo.total}
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Total
            </Text>
          </View>

          <View style={styles.resumoDivisor} />

          <View style={styles.resumoItem}>
            <Ionicons name={ICONE.pendente} size={layout.icone['2']} color={cores.urgencia.media} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {resumo.abertas}
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Em aberto
            </Text>
          </View>

          <View style={styles.resumoDivisor} />

          <View style={styles.resumoItem}>
            <Ionicons name={ICONE.resolvido} size={layout.icone['2']} color={cores.estado.sucessoGrafico} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {resumo.resolvidas}
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Resolvidas
            </Text>
          </View>
        </View>

        {carregando ? (
          <Carregando texto="Carregando seu histórico..." />
        ) : erro ? (
          <ErroLista
            descricao="Não conseguimos buscar suas ocorrências agora."
            aoTentarDeNovo={() => carregar()}
          />
        ) : ocorrencias.length === 0 ? (
          <Vazio
            titulo="Nenhuma ocorrência ainda"
            descricao="Quando você registrar um problema da cidade, ele aparece aqui para acompanhamento."
            icone={ICONE.historico}
            acao={{ titulo: 'Registrar ocorrência', onPress: () => navigation?.navigate?.('NewReport') }}
          />
        ) : (
          <View style={styles.lista}>
            {ocorrencias.map((item) => (
              <CardOcorrencia
                key={item.id}
                item={item}
                imagem={falhas[item.id as number] ? null : item.id ? imagens[item.id] : null}
                onPress={() => navigation?.navigate?.('ReportDetail', { item })}
                aoFalharImagem={() =>
                  setFalhas((prev) => ({ ...prev, [item.id as number]: true }))
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BarraInferior ativo="perfil" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingTop: espaco['4'],
    paddingBottom: espaco['6'],
    gap: espaco['4'],
  },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    paddingVertical: espaco['4'],
    ...elevacao[1],
  },
  resumoItem: { flex: 1, alignItems: 'center', gap: 2 },
  resumoDivisor: { width: 1, height: 48, backgroundColor: cores.borda.suave },
  resumoValor: { ...tipografia.tituloTela, color: cores.texto.principal },
  resumoRotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  lista: { gap: espaco['4'] },
});
