import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ScrollView, TextInput, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  listarOcorrencias,
  listarComentarios,
  criarComentario,
  deletarOcorrencia,
  Ocorrencia,
  tituloCategoria,
  emojiCategoria,
  enderecoOcorrencia,
  rotuloUrgencia,
  corUrgencia,
  rotuloStatus,
  corStatus,
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

      <View style={styles.header}>
        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.assistenteBtn}
            onPress={() => navigation?.navigate('Assistente')}
            activeOpacity={0.7}
          >
            <Text style={styles.assistenteIcon}>💬</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation?.navigate('Notification')}
            activeOpacity={0.7}
          >
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          />
        }
      >
        <View style={styles.heroBanner}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Faça sua parte por{'\n'}uma cidade melhor!</Text>
            <Text style={styles.heroDesc}>Reporte problemas e ajude{'\n'}a construir soluções.</Text>

            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => navigation?.navigate('NewReport')}
              activeOpacity={0.85}
            >
              <Text style={styles.heroBtnText}>Nova ocorrência</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroIllustration}>
            <View style={styles.agentCircle}>
              <Text style={styles.agentEmoji}>👩‍💻</Text>
            </View>

            <View style={styles.bubble}>
              <Text style={styles.bubbleDots}>···</Text>
            </View>
          </View>
        </View>

        <Text style={styles.feedTitle}>Ocorrências ativas da população:</Text>

        {carregandoFeed && <Text style={styles.emptyText}>Carregando ocorrências...</Text>}

        {!carregandoFeed && feed.length === 0 && (
          <Text style={styles.emptyText}>Nenhuma ocorrência cadastrada ainda.</Text>
        )}

        {feed.map((item) => {
          const imagem = imagensComFalha[item.id as number] ? null : item.id ? imagens[item.id] : null;

          return (
            <View key={item.id} style={styles.feedCard}>
              <View style={styles.ocorrenciaRow}>
                <TouchableOpacity
                  style={styles.thumbnail}
                  onPress={() => navigation?.navigate('ReportDetail', { item })}
                  activeOpacity={0.8}
                >
                  {imagem ? (
                    <Image
                      source={imagem}
                      style={styles.thumbnailImage}
                      onError={() =>
                        setImagensComFalha((prev) => ({ ...prev, [item.id as number]: true }))
                      }
                    />
                  ) : (
                    <Text style={styles.thumbnailEmoji}>{emojiCategoria(item.categoria)}</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.ocorrenciaInfo}
                  onPress={() => navigation?.navigate('ReportDetail', { item })}
                  activeOpacity={0.8}
                >
                  <View style={styles.tituloRow}>
                    <Text style={styles.ocorrenciaTitulo}>{tituloCategoria(item.categoria)}</Text>

                    <View
                      style={[
                        styles.statusPill,
                        { backgroundColor: `${corStatus(item.status)}18` },
                      ]}
                    >
                      <View
                        style={[styles.statusDot, { backgroundColor: corStatus(item.status) }]}
                      />
                      <Text style={[styles.statusPillText, { color: corStatus(item.status) }]}>
                        {rotuloStatus(item.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.ocorrenciaEndereco}>{enderecoOcorrencia(item)}</Text>
                  <Text style={styles.ocorrenciaDescricao} numberOfLines={3}>
                    {item.descricao}
                  </Text>

                  <View style={styles.ocorrenciaBottom}>
                    <View style={styles.grauRow}>
                      <View
                        style={[styles.grauDot, { backgroundColor: corUrgencia(item.urgencia) }]}
                      />
                      <Text style={styles.grauText}>{rotuloUrgencia(item.urgencia)}</Text>
                    </View>

                    <Text style={styles.ocorrenciaData}>
                      {item.dataCriacao
                        ? new Date(item.dataCriacao).toLocaleDateString('pt-BR')
                        : ''}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuDots}
                  onPress={() => abrirMenuOcorrencia(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuDotsText}>⋮</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {(comentariosPorOcorrencia[item.id as number] || []).map((comentario, index) => (
                <View key={comentario.id || index} style={styles.comentarioRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(comentario.usuario?.nome || 'U').substring(0, 2).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.comentarioContent}>
                    <View style={styles.comentarioHeader}>
                      <Text style={styles.comentarioNome}>
                        {comentario.usuario?.nome || 'Usuário'}
                      </Text>
                      <Text style={styles.comentarioTempo}>
                        {comentario.dataCriacao
                          ? new Date(comentario.dataCriacao).toLocaleDateString('pt-BR')
                          : ''}
                      </Text>
                    </View>

                    <Text style={styles.comentarioTexto}>{comentario.texto}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Escreva um comentário..."
                  placeholderTextColor="#94a3b8"
                  value={comentarios[item.id as number] || ''}
                  onChangeText={(text) =>
                    setComentarios((prev) => ({ ...prev, [item.id as number]: text }))
                  }
                />

                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={() => enviarComentario(item.id as number)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sendIcon}>➤</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} activeOpacity={0.7}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItemCenter}
          onPress={() => navigation?.navigate('NewReport')}
          activeOpacity={0.7}
        >
          <Text style={styles.navPlus}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  appNameRow: { flexDirection: 'row', alignItems: 'baseline' },
  appNameBlue: { fontSize: 26, fontWeight: '700', color: '#1565c0' },
  appNameGold: { fontSize: 26, fontWeight: '700', color: '#c8860a' },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  notifIcon: { fontSize: 22 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  assistenteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d6eef8',
  },
  assistenteIcon: { fontSize: 20 },

  scroll: { paddingBottom: 24 },

  heroBanner: {
    backgroundColor: '#d6eef8',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroText: { flex: 1 },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    lineHeight: 22,
    marginBottom: 6,
  },
  heroDesc: { fontSize: 12, color: '#334155', lineHeight: 18, marginBottom: 12 },
  heroBtn: {
    backgroundColor: '#f5f0c8',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e8dfc0',
  },
  heroBtnText: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  heroIllustration: { position: 'relative', alignItems: 'center' },
  agentCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentEmoji: { fontSize: 42 },
  bubble: {
    position: 'absolute',
    top: -8,
    right: -4,
    backgroundColor: '#5bb8d4',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  bubbleDots: { fontSize: 12, color: '#fff', fontWeight: '700', letterSpacing: 1 },

  feedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 20 },

  feedCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  ocorrenciaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    backgroundColor: '#d6eef8',
  },
  thumbnailEmoji: { fontSize: 32 },
  thumbnailImage: { width: '100%', height: '100%', borderRadius: 10 },
  ocorrenciaInfo: { flex: 1 },
  tituloRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  ocorrenciaTitulo: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', flexShrink: 1 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { fontSize: 10, fontWeight: '700' },
  ocorrenciaEndereco: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  ocorrenciaDescricao: { fontSize: 12, color: '#334155', marginBottom: 6, lineHeight: 17 },
  ocorrenciaBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grauRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  grauDot: { width: 10, height: 10, borderRadius: 5 },
  grauText: { fontSize: 12, fontWeight: '500', color: '#1a1a2e' },
  ocorrenciaData: { fontSize: 11, color: '#94a3b8' },
  menuDots: { padding: 4 },
  menuDotsText: { fontSize: 20, color: '#64748b', lineHeight: 22 },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 10 },

  comentarioRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: '#7c5cbf',
  },
  avatarText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  comentarioContent: { flex: 1 },
  comentarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  comentarioNome: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  comentarioTempo: { fontSize: 11, color: '#94a3b8' },
  comentarioTexto: { fontSize: 12, color: '#334155', lineHeight: 18, marginBottom: 4 },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentInput: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#1a1a2e',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5bb8d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 14, color: '#fff' },

  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#7ec8e3',
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  navItem: { alignItems: 'center', gap: 2 },
  navItemActive: {},
  navItemCenter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    elevation: 4,
  },
  navPlus: { fontSize: 30, color: '#1a1a2e', lineHeight: 34 },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
  navLabelActive: { fontWeight: '700', color: '#1a1a2e' },
});
