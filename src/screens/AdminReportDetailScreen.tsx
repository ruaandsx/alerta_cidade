import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import BlocoLocalizacao from '../components/BlocoLocalizacao';
import Botao from '../components/Botao';
import Campo from '../components/Campo';
import Header from '../components/Header';
import { SeloStatus, SeloUrgencia } from '../components/Selos';
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
import {
  atualizarStatusOcorrencia,
  buscarOcorrencia,
  criarComentario,
  listarComentarios,
  deletarOcorrencia,
  Ocorrencia,
  tituloCategoria,
  rotuloStatus,
  rotuloUrgencia,
  type StatusOcorrencia,
} from '../services/ocorrenciaService';
import { fonteImagem, FonteImagem } from '../services/api';

type Props = { navigation?: any; route?: any };

type Acao = {
  status: StatusOcorrencia;
  rotulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  fundo: string;
  cor: string;
};

const ACOES: Acao[] = [
  {
    status: 'EM_ANALISE',
    rotulo: 'Em análise',
    icone: 'search-outline',
    fundo: cores.status.analise.fundo,
    cor: cores.status.analise.texto,
  },
  {
    status: 'EM_ANDAMENTO',
    rotulo: 'Em andamento',
    icone: 'hammer-outline',
    fundo: cores.status.andamento.fundo,
    cor: cores.status.andamento.texto,
  },
  {
    status: 'RESOLVIDO',
    rotulo: 'Resolvida',
    icone: 'checkmark-circle-outline',
    fundo: cores.status.resolvido.fundo,
    cor: cores.status.resolvido.texto,
  },
];

export default function AdminReportDetailScreen({ navigation, route }: Props) {
  const [item, setItem] = useState<Ocorrencia>(route?.params?.item || {});
  const [imagem, setImagem] = useState<FonteImagem | null>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [resposta, setResposta] = useState('');

  useEffect(() => {
    carregarDetalhe();
    carregarComentarios();
  }, [route?.params?.item?.id]);

  async function carregarDetalhe() {
    const id = route?.params?.item?.id;
    if (!id) return;

    try {
      const detalhe = await buscarOcorrencia(id);
      setItem(detalhe);

      if (detalhe.temImagem) {
        setImagem(await fonteImagem(detalhe.id, true));
      }
    } catch (error) {
      console.log('Erro ao carregar detalhe:', error);
    }
  }

  async function carregarComentarios() {
    if (!item?.id) return;
    try {
      const data = await listarComentarios(item.id);
      setComentarios(data || []);
    } catch {
      setComentarios([]);
    }
  }

  function abrirMapa() {
    if (item.latitude == null || item.longitude == null) {
      Alert.alert('Sem localização', 'Esta ocorrência não possui coordenadas.');
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o mapa.'));
  }

  async function mudarStatus(status: StatusOcorrencia) {
    try {
      const atualizado = await atualizarStatusOcorrencia(item.id as number, status);
      setItem(atualizado);
      Alert.alert('Status atualizado', `Ocorrência marcada como ${rotuloStatus(status)}.`);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível atualizar o status.');
    }
  }

  async function responder() {
    if (!resposta.trim()) {
      Alert.alert('Resposta vazia', 'Digite uma resposta para o usuário.');
      return;
    }

    try {
      await criarComentario(item.id, resposta.trim());
      setResposta('');
      carregarComentarios();
      Alert.alert('Enviado', 'Resposta enviada ao usuário.');
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a resposta.');
    }
  }

  function excluir() {
    Alert.alert('Excluir ocorrência', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarOcorrencia(item.id);
            navigation?.navigate('AdminHome');
          } catch {
            Alert.alert(
              'Erro',
              'Não foi possível excluir. Verifique comentários/notificações vinculados.',
            );
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Detalhes da ocorrência"
        subtitulo={`ID: #${item.id ?? ''}`}
        onVoltar={() => navigation?.goBack?.()}
        acoes={
          <Pressable
            onPress={excluir}
            accessibilityRole="button"
            accessibilityLabel="Excluir ocorrência"
            hitSlop={4}
            style={({ pressed }) => [styles.acaoExcluir, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name={ICONE.excluir} size={layout.icone['2']} color={cores.estado.erroTexto} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imagemWrapper}>
          {imagem ? (
            <Image source={imagem} style={styles.imagemReal} />
          ) : (
            <Ionicons
              name={iconeCategoria(item.categoria)}
              size={48}
              color={cores.marca.azul}
            />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.statusLinha}>
            <SeloStatus status={item.status} />
            <SeloUrgencia urgencia={item.urgencia} />
          </View>

          <View style={styles.infoGrade}>
            <View style={styles.infoItem}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
                Categoria
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.valor}>
                {tituloCategoria(item.categoria)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
                Prioridade
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.valor}>
                {item.urgenciaLabel || rotuloUrgencia(item.urgencia)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
                Criada por
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.valor}>
                {item.usuario?.nome || item.usuarioNome || 'Usuário'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
                Contato
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.valor}>
                {item.usuario?.email || 'Sem e-mail'}
              </Text>
            </View>
          </View>
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
          Ações administrativas
        </Text>

        <View style={styles.acoesGrade}>
          {ACOES.map((acao) => (
            <Pressable
              key={acao.status}
              onPress={() => mudarStatus(acao.status)}
              accessibilityRole="button"
              accessibilityLabel={`Marcar como ${acao.rotulo}`}
              style={({ pressed }) => [
                styles.acaoBotao,
                { backgroundColor: acao.fundo },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons name={acao.icone} size={layout.icone['2']} color={acao.cor} />
              <Text
                maxFontSizeMultiplier={FONTE_MAXIMA}
                style={[styles.acaoBotaoTexto, { color: acao.cor }]}
              >
                {acao.rotulo}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={excluir}
            accessibilityRole="button"
            accessibilityLabel="Excluir ocorrência"
            style={({ pressed }) => [
              styles.acaoBotao,
              { backgroundColor: cores.estado.erroFundo },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name={ICONE.excluir} size={layout.icone['2']} color={cores.estado.erroTexto} />
            <Text
              maxFontSizeMultiplier={FONTE_MAXIMA}
              style={[styles.acaoBotaoTexto, { color: cores.estado.erroTexto }]}
            >
              Excluir
            </Text>
          </Pressable>
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
          Descrição da ocorrência
        </Text>

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.descricao}>
            {item.descricao || 'Sem descrição'}
          </Text>

          <BlocoLocalizacao
            rua={item.rua}
            bairro={item.bairro}
            referencia={item.referencia}
            latitude={item.latitude}
            longitude={item.longitude}
            aoAbrirMapa={abrirMapa}
          />
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
          Responder ao usuário
        </Text>

        <View style={styles.card}>
          <Campo
            valor={resposta}
            aoMudar={setResposta}
            placeholder="Digite uma resposta administrativa..."
            multilinha
            acessibilidadeLabel="Resposta ao usuário"
          />

          <Botao titulo="Enviar resposta" icone={ICONE.enviar} onPress={responder} />
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
          Comentários ({comentarios.length})
        </Text>

        {comentarios.length === 0 ? (
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.vazio}>
            Nenhum comentário ainda.
          </Text>
        ) : (
          <View style={styles.comentarios}>
            {comentarios.map((c, i) => (
              <View key={c.id || i} style={styles.comentario}>
                <View style={styles.avatar}>
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.avatarTexto}>
                    {(c.usuario?.nome || 'U').substring(0, 2).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.comentarioConteudo}>
                  <View style={styles.comentarioTopo}>
                    <Text
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      numberOfLines={1}
                      style={styles.comentarioNome}
                    >
                      {c.usuario?.nome || 'Usuário'}
                    </Text>
                    <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.comentarioData}>
                      {c.dataCriacao ? new Date(c.dataCriacao).toLocaleString('pt-BR') : ''}
                    </Text>
                  </View>
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.comentarioTexto}>
                    {c.texto}
                  </Text>
                </View>
              </View>
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
  acaoExcluir: {
    width: 48,
    height: 48,
    borderRadius: raio.pill,
    backgroundColor: cores.estado.erroFundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingTop: espaco['4'],
    paddingBottom: espaco['8'],
    gap: espaco['4'],
  },
  imagemWrapper: {
    height: 200,
    borderRadius: raio['3'],
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagemReal: { width: '100%', height: '100%' },
  card: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
    ...elevacao[1],
  },
  statusLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: espaco['2'],
  },
  infoGrade: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco['3'] },
  infoItem: { width: '47%', gap: 2 },
  rotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  valor: { ...tipografia.corpoForte, color: cores.texto.principal },
  secaoTitulo: { ...tipografia.tituloSecao, color: cores.texto.principal },
  acoesGrade: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco['2'] },
  acaoBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['1'],
    minHeight: 48,
    paddingHorizontal: espaco['3'],
    borderRadius: raio['2'],
    flexGrow: 1,
    flexBasis: '45%',
  },
  acaoBotaoTexto: { ...tipografia.rotulo },
  descricao: { ...tipografia.corpo, color: cores.texto.principal },
  vazio: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  comentarios: { gap: espaco['4'] },
  comentario: { flexDirection: 'row', gap: espaco['2'] },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarTexto: { ...tipografia.legenda, color: cores.marca.azulEscuro },
  comentarioConteudo: { flex: 1, gap: 2 },
  comentarioTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco['2'],
  },
  comentarioNome: { ...tipografia.rotulo, color: cores.texto.principal, flex: 1 },
  comentarioData: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  comentarioTexto: { ...tipografia.corpoPequeno, color: cores.texto.principal },
});
