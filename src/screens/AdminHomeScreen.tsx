import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import BotaoIcone from '../components/BotaoIcone';
import CardOcorrencia from '../components/CardOcorrencia';
import Chip from '../components/Chip';
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
import { ICONE, type NomeIcone } from '../theme/icones';
import {
  listarOcorrencias,
  obterEstatisticas,
  Ocorrencia,
  Estatisticas,
} from '../services/ocorrenciaService';
import { fonteImagem, FonteImagem } from '../services/api';
import { listarUsuarios } from '../services/adminService';
import { useUsuarioLogado } from '../hooks/useUsuarioLogado';

type Props = { navigation?: any };

const filtros = ['Todas', 'Em andamento', 'Pendentes', 'Resolvidas'];

type Cartao = {
  valor: number;
  rotulo: string;
  icone: NomeIcone;
  fundo: string;
  cor: string;
};

export default function AdminHomeScreen({ navigation }: Props) {
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [imagens, setImagens] = useState<Record<number, FonteImagem | null>>({});
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const { usuario } = useUsuarioLogado();

  useEffect(() => {
    carregarTudo();

    const interval = setInterval(carregarTudo, 5000);

    const unsubscribe = navigation?.addListener?.('focus', carregarTudo);

    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, [navigation]);

  async function carregarTudo() {
    try {
      setErro(false);

      const [ocorrenciasData, usuariosData, estatisticasData] = await Promise.all([
        listarOcorrencias({ size: 100 }),
        listarUsuarios().catch(() => []),
        obterEstatisticas().catch(() => null),
      ]);

      setOcorrencias(ocorrenciasData);
      setTotalUsuarios(usuariosData.length || 0);
      setEstatisticas(estatisticasData);

      const entradas = await Promise.all(
        ocorrenciasData
          .filter((item) => item.id && item.temImagem)
          .map(async (item) => [item.id as number, await fonteImagem(item.id, true)] as const),
      );

      setImagens(Object.fromEntries(entradas));
    } catch (e) {
      console.log('Erro ao carregar dashboard admin:', e);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  function statusNaAba(item: Ocorrencia) {
    if (filtroAtivo === 'Todas') return true;
    if (filtroAtivo === 'Em andamento') {
      return item.status === 'EM_ANALISE' || item.status === 'EM_ANDAMENTO';
    }
    if (filtroAtivo === 'Pendentes') return item.status === 'RECEBIDO';
    if (filtroAtivo === 'Resolvidas') return item.status === 'RESOLVIDO';
    return true;
  }

  const ocorrenciasFiltradas = ocorrencias.filter(statusNaAba);

  const pendentes =
    estatisticas?.porStatus?.RECEBIDO ?? ocorrencias.filter((o) => o.status === 'RECEBIDO').length;
  const andamento =
    (estatisticas?.porStatus?.EM_ANALISE || 0) + (estatisticas?.porStatus?.EM_ANDAMENTO || 0);
  const resolvidas =
    estatisticas?.porStatus?.RESOLVIDO ?? ocorrencias.filter((o) => o.status === 'RESOLVIDO').length;
  const total = estatisticas?.total ?? ocorrencias.length;

  const cartoes: Cartao[] = [
    {
      valor: total,
      rotulo: 'Ocorrências recebidas',
      icone: ICONE.documento,
      fundo: cores.superficie.azul,
      cor: cores.marca.azul,
    },
    {
      valor: andamento,
      rotulo: 'Em andamento',
      icone: 'hammer-outline',
      fundo: cores.status.andamento.fundo,
      cor: cores.status.andamento.texto,
    },
    {
      valor: resolvidas,
      rotulo: 'Resolvidas',
      icone: ICONE.resolvido,
      fundo: cores.status.resolvido.fundo,
      cor: cores.status.resolvido.texto,
    },
    {
      valor: pendentes,
      rotulo: 'Pendentes',
      icone: ICONE.pendente,
      fundo: cores.estado.avisoFundo,
      cor: cores.estado.avisoTexto,
    },
    {
      valor: totalUsuarios,
      rotulo: 'Usuários',
      icone: ICONE.usuarios,
      fundo: cores.superficie.media,
      cor: cores.marca.azulEscuro,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        adm
        acoes={
          <>
            <BotaoIcone
              icone={ICONE.atualizar}
              rotulo="Atualizar dados"
              onPress={carregarTudo}
            />
            <BotaoIcone
              icone={ICONE.assistente}
              rotulo="Abrir assistente"
              onPress={() => navigation?.navigate('Assistente')}
              variante="azul"
            />
          </>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.saudacao}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.saudacaoTitulo}>
            Olá, {usuario?.nome || 'administrador'}!
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.saudacaoDesc}>
            Acompanhe as ocorrências da cidade em tempo quase real.
          </Text>
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
          Visão geral
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cartoes}
        >
          {cartoes.map((cartao) => (
            <View key={cartao.rotulo} style={styles.cartao}>
              <View style={[styles.cartaoIcone, { backgroundColor: cartao.fundo }]}>
                <Ionicons name={cartao.icone} size={layout.icone['2']} color={cartao.cor} />
              </View>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cartaoValor}>
                {cartao.valor}
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cartaoRotulo}>
                {cartao.rotulo}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
          Acompanhamento
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
        >
          {filtros.map((filtro) => (
            <Chip
              key={filtro}
              rotulo={filtro}
              selecionado={filtroAtivo === filtro}
              onPress={() => setFiltroAtivo(filtro)}
            />
          ))}
        </ScrollView>

        {carregando ? (
          <Carregando texto="Carregando ocorrências..." />
        ) : erro ? (
          <ErroLista
            descricao="Não conseguimos buscar a fila de ocorrências."
            aoTentarDeNovo={carregarTudo}
          />
        ) : ocorrenciasFiltradas.length === 0 ? (
          <Vazio
            titulo="Nenhuma ocorrência neste filtro"
            descricao="Troque o filtro acima para ver outras ocorrências."
          />
        ) : (
          <View style={styles.lista}>
            {ocorrenciasFiltradas.map((item) => (
              <CardOcorrencia
                key={item.id}
                compacto
                item={item}
                imagem={item.id ? imagens[item.id] : null}
                onPress={() => navigation?.navigate('AdminReportDetail', { item })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BarraInferior tipo="admin" ativo="inicio" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingTop: espaco['4'],
    paddingBottom: espaco['6'],
  },
  saudacao: { gap: espaco['1'], marginBottom: espaco['6'] },
  saudacaoTitulo: { ...tipografia.tituloTela, color: cores.texto.principal },
  saudacaoDesc: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  secaoTitulo: {
    ...tipografia.tituloSecao,
    color: cores.texto.principal,
    marginBottom: espaco['3'],
  },
  cartoes: { gap: espaco['3'], paddingBottom: espaco['6'], paddingRight: espaco['4'] },
  cartao: {
    width: 148,
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['1'],
    ...elevacao[1],
  },
  cartaoIcone: {
    width: 36,
    height: 36,
    borderRadius: raio['2'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco['1'],
  },
  cartaoValor: { ...tipografia.tituloTela, color: cores.texto.principal },
  cartaoRotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  filtros: { gap: espaco['2'], paddingBottom: espaco['4'], paddingRight: espaco['4'] },
  lista: { gap: espaco['2'] },
});
