import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import Botao from '../components/Botao';
import BotaoIcone from '../components/BotaoIcone';
import CardOcorrencia from '../components/CardOcorrencia';
import Header from '../components/Header';
import { Carregando, ErroLista, Vazio } from '../components/Estados';
import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE } from '../theme/icones';
import {
  listarOcorrencias,
  listarComentarios,
  criarComentario,
  deletarOcorrencia,
  Ocorrencia,
} from '../services/ocorrenciaService';
import { fonteImagem, FonteImagem } from '../services/api';
import { getUsuarioLogado } from '../services/auth';

type Props = { navigation?: any };

export default function HomeScreen({ navigation }: Props) {
  const [feed, setFeed] = useState<Ocorrencia[]>([]);
  const [imagens, setImagens] = useState<Record<number, FonteImagem | null>>({});
  const [imagensComFalha, setImagensComFalha] = useState<Record<number, boolean>>({});
  const [usuario, setUsuario] = useState<{ id?: number; role?: string } | null>(null);
  const [carregandoFeed, setCarregandoFeed] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erroFeed, setErroFeed] = useState(false);
  const [comentarios, setComentarios] = useState<{ [key: number]: string }>({});
  const [comentariosPorOcorrencia, setComentariosPorOcorrencia] = useState<{
    [key: number]: any[];
  }>({});

  const ehAdmin = usuario?.role === 'ADMIN';

  function podeGerenciar(item: Ocorrencia): boolean {
    if (ehAdmin) return true;
    if (!usuario?.id || !item.usuarioId) return false;
    return item.usuarioId === usuario.id;
  }

  useEffect(() => {
    getUsuarioLogado()
      .then((u) => setUsuario(u ? { id: u.id, role: u.role } : null))
      .catch(() => setUsuario(null));

    carregarFeed();

    const unsubscribe = navigation?.addListener?.('focus', () => {
      carregarFeed(false);
    });

    return unsubscribe;
  }, [navigation]);

  async function carregarFeed(mostrarLoading = true) {
    try {
      if (mostrarLoading) setCarregandoFeed(true);
      setErroFeed(false);

      const ocorrencias = await listarOcorrencias({ size: 50 });

      setFeed(ocorrencias);

      const entradas = await Promise.all(
        ocorrencias
          .filter((item) => item.id && item.temImagem)
          .map(async (item) => {
            const fonte = await fonteImagem(item.id, item.temImagem);
            return [item.id as number, fonte] as const;
          }),
      );

      setImagens(Object.fromEntries(entradas));

      carregarComentariosDasOcorrencias(ocorrencias);
    } catch (error) {
      console.log('Erro ao carregar feed:', error);
      setFeed([]);
      setErroFeed(true);
    } finally {
      setCarregandoFeed(false);
      setAtualizando(false);
    }
  }

  async function carregarComentariosDasOcorrencias(lista: Ocorrencia[]) {
    const resultado: { [key: number]: any[] } = {};

    await Promise.all(
      lista.map(async (item) => {
        if (!item.id) return;

        try {
          resultado[item.id] = await listarComentarios(item.id);
        } catch {
          resultado[item.id] = [];
        }
      }),
    );

    setComentariosPorOcorrencia(resultado);
  }

  async function enviarComentario(ocorrenciaId: number) {
    const texto = comentarios[ocorrenciaId];

    if (!texto || !texto.trim()) {
      Alert.alert('Comentário vazio', 'Digite um comentário antes de enviar.');
      return;
    }

    try {
      await criarComentario(ocorrenciaId, texto.trim());
      setComentarios((prev) => ({ ...prev, [ocorrenciaId]: '' }));

      const novosComentarios = await listarComentarios(ocorrenciaId);
      setComentariosPorOcorrencia((prev) => ({
        ...prev,
        [ocorrenciaId]: novosComentarios,
      }));
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível enviar o comentário.');
    }
  }

  function abrirMenuOcorrencia(item: Ocorrencia) {
    const opcoes: any[] = [
      {
        text: 'Ver detalhes',
        onPress: () => navigation?.navigate('ReportDetail', { item }),
      },
    ];

    if (podeGerenciar(item)) {
      opcoes.push(
        {
          text: 'Editar ocorrência',
          onPress: () => navigation?.navigate('NewReport', { ocorrencia: item }),
        },
        {
          text: 'Apagar ocorrência',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarOcorrencia(item.id as number);
              carregarFeed(false);
            } catch (error: any) {
              Alert.alert(
                'Erro',
                error?.status === 403
                  ? 'Você só pode apagar as ocorrências que criou.'
                  : 'Não foi possível apagar a ocorrência.',
              );
            }
          },
        },
      );
    }

    opcoes.push({ text: 'Cancelar', style: 'cancel' });

    Alert.alert(item.descricao || 'Ocorrência', undefined, opcoes);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        acoes={
          <>
            <BotaoIcone
              icone={ICONE.assistente}
              rotulo="Abrir assistente"
              onPress={() => navigation?.navigate('Assistente')}
              variante="azul"
            />
            <BotaoIcone
              icone={ICONE.notificacoes}
              rotulo="Ver notificações"
              onPress={() => navigation?.navigate('Notification')}
            />
          </>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              setAtualizando(true);
              carregarFeed(false);
            }}
            colors={[cores.marca.azul]}
            tintColor={cores.marca.azul}
          />
        }
      >
        <View style={styles.destaque}>
          <View style={styles.destaqueIcone}>
            <Ionicons name="megaphone-outline" size={layout.icone['4']} color={cores.marca.azul} />
          </View>

          <View style={styles.destaqueTexto}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.destaqueTitulo}>
              Faça sua parte por uma cidade melhor!
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.destaqueDesc}>
              Reporte problemas e ajude a construir soluções.
            </Text>
          </View>

          <Botao
            titulo="Nova ocorrência"
            icone={ICONE.adicionar}
            onPress={() => navigation?.navigate('NewReport')}
            larguraTotal={false}
          />
        </View>

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
          Ocorrências ativas da população
        </Text>

        {carregandoFeed ? (
          <Carregando texto="Carregando ocorrências..." />
        ) : erroFeed ? (
          <ErroLista
            descricao="Não conseguimos buscar as ocorrências agora."
            aoTentarDeNovo={() => carregarFeed()}
          />
        ) : feed.length === 0 ? (
          <Vazio
            titulo="Nenhuma ocorrência ainda"
            descricao="Quando alguém registrar um problema da cidade, ele aparece aqui."
          />
        ) : (
          <View style={styles.lista}>
            {feed.map((item) => {
              const imagem = imagensComFalha[item.id as number]
                ? null
                : item.id
                  ? imagens[item.id]
                  : null;
              const listaComentarios = comentariosPorOcorrencia[item.id as number] || [];

              return (
                <CardOcorrencia
                  key={item.id}
                  item={item}
                  imagem={imagem}
                  onPress={() => navigation?.navigate('ReportDetail', { item })}
                  onPressMenu={() => abrirMenuOcorrencia(item)}
                  aoFalharImagem={() =>
                    setImagensComFalha((prev) => ({ ...prev, [item.id as number]: true }))
                  }
                >
                  {listaComentarios.map((comentario, index) => (
                    <View key={comentario.id || index} style={styles.comentarioRow}>
                      <View style={styles.avatar}>
                        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.avatarTexto}>
                          {(comentario.usuario?.nome || 'U').substring(0, 2).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.comentarioConteudo}>
                        <View style={styles.comentarioTopo}>
                          <Text
                            maxFontSizeMultiplier={FONTE_MAXIMA}
                            numberOfLines={1}
                            style={styles.comentarioNome}
                          >
                            {comentario.usuario?.nome || 'Usuário'}
                          </Text>
                          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.comentarioData}>
                            {comentario.dataCriacao
                              ? new Date(comentario.dataCriacao).toLocaleDateString('pt-BR')
                              : ''}
                          </Text>
                        </View>

                        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.comentarioTexto}>
                          {comentario.texto}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.envioLinha}>
                    <Ionicons
                      name={ICONE.assistente}
                      size={layout.icone['2']}
                      color={cores.texto.secundario}
                    />
                    <TextInput
                      style={styles.comentarioInput}
                      placeholder="Escreva um comentário..."
                      placeholderTextColor={cores.texto.placeholder}
                      value={comentarios[item.id as number] || ''}
                      onChangeText={(text) =>
                        setComentarios((prev) => ({ ...prev, [item.id as number]: text }))
                      }
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      accessibilityLabel="Campo de comentário"
                      multiline
                    />

                    <Pressable
                      onPress={() => enviarComentario(item.id as number)}
                      accessibilityRole="button"
                      accessibilityLabel="Enviar comentário"
                      hitSlop={4}
                      style={({ pressed }) => [styles.enviar, pressed && { opacity: 0.8 }]}
                    >
                      <Ionicons
                        name={ICONE.enviar}
                        size={layout.icone['2']}
                        color={cores.texto.inverso}
                      />
                    </Pressable>
                  </View>
                </CardOcorrencia>
              );
            })}
          </View>
        )}
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
    paddingBottom: espaco['6'],
  },
  destaque: {
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['3'],
    padding: espaco['5'],
    gap: espaco['3'],
    marginBottom: espaco['6'],
  },
  destaqueIcone: {
    width: 48,
    height: 48,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destaqueTexto: { gap: espaco['1'] },
  destaqueTitulo: { ...tipografia.subtitulo, color: cores.texto.principal },
  destaqueDesc: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  secaoTitulo: {
    ...tipografia.tituloSecao,
    color: cores.texto.principal,
    marginBottom: espaco['3'],
  },
  lista: { gap: espaco['4'] },
  comentarioRow: {
    flexDirection: 'row',
    gap: espaco['2'],
  },
  avatar: {
    width: 32,
    height: 32,
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
  comentarioNome: {
    ...tipografia.rotulo,
    color: cores.texto.principal,
    flex: 1,
  },
  comentarioData: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  comentarioTexto: { ...tipografia.corpoPequeno, color: cores.texto.principal },
  envioLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['2'],
  },
  comentarioInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 2,
    borderColor: cores.borda.forte,
    borderRadius: raio.pill,
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
});
