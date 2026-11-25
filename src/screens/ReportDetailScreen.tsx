import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BlocoLocalizacao from '../components/BlocoLocalizacao';
import Botao from '../components/Botao';
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
  deletarOcorrencia,
  buscarOcorrencia,
  listarComentarios,
  criarComentario,
  Ocorrencia,
  tituloCategoria,
  rotuloStatus,
  corStatus,
} from '../services/ocorrenciaService';
import { fonteImagem, FonteImagem } from '../services/api';
import { getUsuarioLogado } from '../services/auth';

export default function ReportDetailScreen({ route, navigation }: any) {
  const inicial: Ocorrencia = route?.params?.item || {};
  const [item, setItem] = useState<Ocorrencia>(inicial);
  const [imagem, setImagem] = useState<FonteImagem | null>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [usuario, setUsuario] = useState<{ id?: number; role?: string } | null>(null);

  useEffect(() => {
    getUsuarioLogado()
      .then((u) => setUsuario(u ? { id: u.id, role: u.role } : null))
      .catch(() => setUsuario(null));
  }, []);

  const donoId = item.usuarioId ?? item.usuario?.id;
  const podeGerenciar =
    usuario?.role === 'ADMIN' || (!!usuario?.id && !!donoId && usuario.id === donoId);

  useEffect(() => {
    carregar();
  }, [inicial.id]);

  async function carregar() {
    if (!inicial.id) return;

    try {
      setCarregando(true);

      const detalhe = await buscarOcorrencia(inicial.id);
      setItem(detalhe);

      if (detalhe.temImagem) {
        setImagem(await fonteImagem(detalhe.id, true));
      }

      setComentarios(await listarComentarios(inicial.id));
    } catch (error) {
      console.log('Erro ao carregar detalhe:', error);
    } finally {
      setCarregando(false);
    }
  }

  function apagar() {
    Alert.alert('Apagar ocorrência', 'Tem certeza que deseja apagar esta ocorrência?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarOcorrencia(item.id as number);
            Alert.alert('Pronto', 'Ocorrência apagada.');
            navigation?.navigate('Home');
          } catch (error: any) {
            Alert.alert('Erro', error?.message || 'Não foi possível apagar a ocorrência.');
          }
        },
      },
    ]);
  }

  async function comentar() {
    if (!novoComentario.trim()) return;

    try {
      await criarComentario(item.id as number, novoComentario.trim());
      setNovoComentario('');
      setComentarios(await listarComentarios(item.id as number));
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível enviar o comentário.');
    }
  }

  function abrirMapa() {
    if (item.latitude == null || item.longitude == null) {
      Alert.alert('Sem localização', 'Esta ocorrência não possui coordenadas.');
      return;
    }

    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`,
    ).catch(() => Alert.alert('Erro', 'Não foi possível abrir o mapa.'));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Detalhes da ocorrência"
        subtitulo={
          item.protocolo ? `Protocolo ${item.protocolo}` : item.id ? `Ocorrência #${item.id}` : ''
        }
        onVoltar={() => navigation?.goBack?.()}
        acoes={
          podeGerenciar ? (
            <Pressable
              onPress={apagar}
              accessibilityRole="button"
              accessibilityLabel="Apagar ocorrência"
              hitSlop={4}
              style={({ pressed }) => [styles.acaoExcluir, pressed && { opacity: 0.6 }]}
            >
              <Ionicons
                name={ICONE.excluir}
                size={layout.icone['2']}
                color={cores.estado.erroTexto}
              />
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imagemBox}>
          {imagem ? (
            <Image source={imagem} style={styles.imagem} onError={() => setImagem(null)} />
          ) : (
            <Ionicons name={iconeCategoria(item.categoria)} size={48} color={cores.marca.azul} />
          )}

          {carregando && (
            <View style={styles.carregandoImagem}>
              <ActivityIndicator color={cores.marca.azul} />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.cardTitulo}>
            {tituloCategoria(item.categoria)}
          </Text>

          <View style={styles.selosLinha}>
            <SeloStatus status={item.status} />
            <SeloUrgencia urgencia={item.urgencia} />
          </View>

          <View style={styles.campoBloco}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
              Descrição
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.texto}>
              {item.descricao || 'Sem descrição'}
            </Text>
          </View>

          <View style={styles.linhaDupla}>
            <View style={styles.campoBloco}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
                Registrada em
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.texto}>
                {item.dataCriacao
                  ? new Date(item.dataCriacao).toLocaleString('pt-BR')
                  : 'Não informada'}
              </Text>
            </View>

            {!!item.usuario?.nome && (
              <View style={styles.campoBloco}>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotulo}>
                  Registrada por
                </Text>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.texto}>
                  {item.usuario.nome}
                </Text>
              </View>
            )}
          </View>

          <BlocoLocalizacao
            rua={item.rua}
            bairro={item.bairro}
            referencia={item.referencia}
            latitude={item.latitude}
            longitude={item.longitude}
            aoAbrirMapa={abrirMapa}
          />
        </View>

        {!!item.historico?.length && (
          <View style={styles.card}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
              Histórico
            </Text>

            {item.historico.map((h) => (
              <View key={h.id} style={styles.historicoItem}>
                <View style={[styles.historicoPonto, { backgroundColor: corStatus(h.statusNovo) }]} />
                <View style={styles.historicoConteudo}>
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.historicoTitulo}>
                    {h.statusNovoLabel || rotuloStatus(h.statusNovo)}
                  </Text>
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.historicoData}>
                    {h.dataCriacao ? new Date(h.dataCriacao).toLocaleString('pt-BR') : ''}
                    {h.usuarioNome ? ` · ${h.usuarioNome}` : ''}
                  </Text>
                  {!!h.observacao && (
                    <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.historicoObs}>
                      {h.observacao}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
            Comentários ({comentarios.length})
          </Text>

          {comentarios.length === 0 && (
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.vazio}>
              Nenhum comentário ainda.
            </Text>
          )}

          {comentarios.map((c, index) => (
            <View key={c.id || index} style={styles.comentarioRow}>
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
                    {c.dataCriacao ? new Date(c.dataCriacao).toLocaleDateString('pt-BR') : ''}
                  </Text>
                </View>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.comentarioTexto}>
                  {c.texto}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.envioLinha}>
            <TextInput
              style={styles.comentarioInput}
              placeholder="Escreva um comentário..."
              placeholderTextColor={cores.texto.placeholder}
              value={novoComentario}
              onChangeText={setNovoComentario}
              maxFontSizeMultiplier={FONTE_MAXIMA}
              accessibilityLabel="Campo de comentário"
              multiline
            />

            <Pressable
              onPress={comentar}
              accessibilityRole="button"
              accessibilityLabel="Enviar comentário"
              hitSlop={4}
              style={({ pressed }) => [styles.enviar, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name={ICONE.enviar} size={layout.icone['2']} color={cores.texto.inverso} />
            </Pressable>
          </View>
        </View>

        {podeGerenciar && (
          <View style={styles.acoesFinais}>
            <Botao
              titulo="Editar ocorrência"
              icone={ICONE.editar}
              onPress={() => navigation?.navigate('NewReport', { ocorrencia: item })}
            />

            <Botao
              titulo="Apagar ocorrência"
              icone={ICONE.excluir}
              variante="destrutivo"
              onPress={apagar}
            />
          </View>
        )}
      </ScrollView>
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
  imagemBox: {
    height: 220,
    borderRadius: raio['3'],
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagem: { width: '100%', height: '100%' },
  carregandoImagem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
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
  cardTitulo: { ...tipografia.tituloSecao, color: cores.texto.principal },
  selosLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: espaco['2'],
  },
  campoBloco: { gap: 2, flex: 1 },
  linhaDupla: { flexDirection: 'row', gap: espaco['3'], flexWrap: 'wrap' },
  rotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  texto: { ...tipografia.corpo, color: cores.texto.principal },
  secaoTitulo: { ...tipografia.tituloSecao, color: cores.texto.principal },
  historicoItem: { flexDirection: 'row', gap: espaco['2'] },
  historicoPonto: {
    width: 12,
    height: 12,
    borderRadius: raio.pill,
    marginTop: 6,
    flexShrink: 0,
  },
  historicoConteudo: { flex: 1, gap: 2 },
  historicoTitulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  historicoData: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  historicoObs: {
    ...tipografia.corpoPequeno,
    color: cores.texto.secundario,
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['1'],
    padding: espaco['2'],
    marginTop: espaco['1'],
  },
  vazio: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  comentarioRow: { flexDirection: 'row', gap: espaco['2'] },
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
  envioLinha: { flexDirection: 'row', alignItems: 'flex-end', gap: espaco['2'] },
  comentarioInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: raio.pill,
    borderWidth: 2,
    borderColor: cores.borda.forte,
    paddingHorizontal: espaco['4'],
    paddingVertical: espaco['2'],
    ...tipografia.corpoPequeno,
    color: cores.texto.principal,
  },
  enviar: {
    width: 48,
    height: 48,
    borderRadius: raio.pill,
    backgroundColor: cores.marca.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acoesFinais: { gap: espaco['3'] },
});
