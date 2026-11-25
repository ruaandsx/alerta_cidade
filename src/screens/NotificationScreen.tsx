import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BotaoIcone from '../components/BotaoIcone';
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
import { ICONE, iconeStatus, type NomeIcone } from '../theme/icones';
import {
  listarNotificacoes,
  marcarNotificacaoComoLida,
  marcarNotificacoesComoLidas,
  type Notificacao,
} from '../services/ocorrenciaService';

type Props = { navigation?: any };

/** Cada tipo de notificação usa o mesmo par de cores do status correspondente. */
function visualNotificacao(tipo?: string): { icone: NomeIcone; fundo: string; cor: string } {
  switch (tipo) {
    case 'RESOLVIDO':
      return {
        icone: iconeStatus('RESOLVIDO'),
        fundo: cores.status.resolvido.fundo,
        cor: cores.status.resolvido.texto,
      };
    case 'EM_ANALISE':
      return {
        icone: iconeStatus('EM_ANALISE'),
        fundo: cores.status.analise.fundo,
        cor: cores.status.analise.texto,
      };
    case 'EM_ANDAMENTO':
      return {
        icone: iconeStatus('EM_ANDAMENTO'),
        fundo: cores.status.andamento.fundo,
        cor: cores.status.andamento.texto,
      };
    case 'COMENTARIO':
      return {
        icone: ICONE.assistente,
        fundo: cores.superficie.azul,
        cor: cores.marca.azulEscuro,
      };
    default:
      return {
        icone: iconeStatus('RECEBIDO'),
        fundo: cores.status.recebido.fundo,
        cor: cores.status.recebido.texto,
      };
  }
}

function dataHora(valor?: string): string {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationScreen({ navigation }: Props) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(false);
  const [marcando, setMarcando] = useState(false);

  useEffect(() => {
    carregar();

    const unsubscribe = navigation?.addListener?.('focus', () => carregar(false));
    return unsubscribe;
  }, [navigation]);

  async function carregar(mostrarLoading = true) {
    try {
      if (mostrarLoading) setCarregando(true);
      setErro(false);

      const lista = await listarNotificacoes(true);
      setNotificacoes(lista || []);
    } catch (e) {
      console.log('Erro ao carregar notificações:', e);
      setNotificacoes([]);
      setErro(true);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  async function abrir(item: Notificacao) {
    try {
      if (item.lida === false) {
        await marcarNotificacaoComoLida(item.id);
        setNotificacoes((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, lida: true } : n)),
        );
      }
    } catch {
      // não bloqueia a navegação
    }

    if (item.ocorrenciaId) {
      navigation?.navigate?.('ReportDetail', { item: { id: item.ocorrenciaId } });
    }
  }

  async function marcarTodas() {
    try {
      setMarcando(true);
      await marcarNotificacoesComoLidas();
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
    } catch {
      // silencioso: o usuário pode tocar de novo
    } finally {
      setMarcando(false);
    }
  }

  const naoLidas = notificacoes.filter((n) => n.lida === false).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Notificações"
        subtitulo={naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''}` : 'Tudo em dia'}
        onVoltar={() => navigation?.goBack?.()}
        acoes={
          naoLidas > 0 ? (
            <BotaoIcone
              icone="checkmark-done-outline"
              rotulo="Marcar todas como lidas"
              onPress={marcando ? undefined : marcarTodas}
            />
          ) : undefined
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
              carregar(false);
            }}
            colors={[cores.marca.azul]}
            tintColor={cores.marca.azul}
          />
        }
      >
        {carregando ? (
          <Carregando texto="Carregando notificações..." />
        ) : erro ? (
          <ErroLista
            descricao="Não conseguimos buscar suas notificações."
            aoTentarDeNovo={() => carregar()}
          />
        ) : notificacoes.length === 0 ? (
          <Vazio
            titulo="Nenhuma notificação"
            descricao="Quando o status de uma ocorrência mudar ou alguém comentar, você fica sabendo aqui."
            icone={ICONE.notificacoes}
          />
        ) : (
          <View style={styles.lista}>
            {notificacoes.map((item) => {
              const visual = visualNotificacao(item.tipo);
              const nova = item.lida === false;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => abrir(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.titulo}. ${item.mensagem}`}
                  style={({ pressed }) => [
                    styles.card,
                    nova && styles.cardNova,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <View style={[styles.icone, { backgroundColor: visual.fundo }]}>
                    <Ionicons name={visual.icone} size={layout.icone['2']} color={visual.cor} />
                  </View>

                  <View style={styles.conteudo}>
                    <View style={styles.topo}>
                      <Text
                        maxFontSizeMultiplier={FONTE_MAXIMA}
                        numberOfLines={2}
                        style={styles.titulo}
                      >
                        {item.titulo || 'Atualização da ocorrência'}
                      </Text>

                      {nova ? (
                        <View style={styles.seloNova}>
                          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.seloNovaTexto}>
                            Nova
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.mensagem}>
                      {item.mensagem || 'Você recebeu uma nova atualização.'}
                    </Text>

                    <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.data}>
                      {dataHora(item.dataCriacao)}
                    </Text>
                  </View>

                  {item.ocorrenciaId ? (
                    <Ionicons
                      name={ICONE.avancar}
                      size={layout.icone['2']}
                      color={cores.texto.secundario}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.rodape}>
          <Ionicons name={ICONE.historico} size={layout.icone['2']} color={cores.texto.secundario} />
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rodapeTexto}>
            As notificações são apagadas automaticamente depois de um tempo.
          </Text>
        </View>
      </ScrollView>
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
  lista: { gap: espaco['3'] },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['3'],
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
  },
  cardNova: {
    backgroundColor: cores.superficie.suave,
    borderColor: cores.marca.azul,
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: raio.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  conteudo: { flex: 1, gap: espaco['1'] },
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['2'],
  },
  titulo: { ...tipografia.corpoForte, color: cores.texto.principal, flex: 1 },
  seloNova: {
    backgroundColor: cores.marca.azul,
    borderRadius: raio.pill,
    paddingHorizontal: espaco['2'],
    paddingVertical: 2,
  },
  seloNovaTexto: { ...tipografia.legenda, color: cores.texto.inverso },
  mensagem: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  data: { ...tipografia.legendaNormal, color: cores.texto.placeholder },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['2'],
    paddingHorizontal: espaco['2'],
    paddingTop: espaco['2'],
  },
  rodapeTexto: { ...tipografia.legendaNormal, color: cores.texto.secundario, flex: 1 },
});
