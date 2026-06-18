import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import {
  listarOcorrencias,
  Ocorrencia,
  listarComentarios,
  criarComentario,
  deletarOcorrencia,
} from '../services/ocorrenciaService';

type Props = { navigation?: any };

export default function HomeScreen({ navigation }: Props) {
  const [feed, setFeed] = useState<any[]>([]);
  const [carregandoFeed, setCarregandoFeed] = useState(true);
  const [comentarios, setComentarios] = useState<{ [key: number]: string }>({});
  const [comentariosPorOcorrencia, setComentariosPorOcorrencia] = useState<{ [key: number]: any[] }>({});

  useEffect(() => {
    carregarFeed();

    const unsubscribe = navigation?.addListener?.('focus', () => {
      carregarFeed(false);
    });

    return unsubscribe;
  }, [navigation]);

  async function carregarFeed(mostrarLoading = true) {
    try {
      if (mostrarLoading) setCarregandoFeed(true);

      const ocorrencias = await listarOcorrencias();

      const feedFormatado = (ocorrencias || []).map((item: Ocorrencia) => ({
        id: item.id,
        titulo: formatarTitulo(item.categoria),
        descricao: item.descricao,
        imagemBase64: item.imagemBase64,
        endereco: montarEndereco(item),
        grau: formatarUrgencia(item.urgencia),
        grauCor: corUrgencia(item.urgencia),
        data: item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString('pt-BR') : '',
        emoji: emojiCategoria(item.categoria),
        bg: bgCategoria(item.categoria),
        original: item,
      }));

      setFeed(feedFormatado);
      carregarComentariosDasOcorrencias(feedFormatado);
    } catch (error) {
      console.log('Erro ao carregar feed:', error);
      setFeed([]);
    } finally {
      setCarregandoFeed(false);
    }
  }

  async function carregarComentariosDasOcorrencias(lista: any[]) {
    const resultado: { [key: number]: any[] } = {};

    await Promise.all(
      lista.map(async (item) => {
        if (!item.id) return;

        try {
          resultado[item.id] = await listarComentarios(item.id);
        } catch {
          resultado[item.id] = [];
        }
      })
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
      setComentarios(prev => ({ ...prev, [ocorrenciaId]: '' }));

      const novosComentarios = await listarComentarios(ocorrenciaId);
      setComentariosPorOcorrencia(prev => ({
        ...prev,
        [ocorrenciaId]: novosComentarios,
      }));
    } catch (error) {
      console.log('Erro ao enviar comentário:', error);
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    }
  }

  function abrirMenuOcorrencia(item: any) {
    Alert.alert(
      'Ocorrência',
      item.descricao || 'Sem descrição informada.',
      [
        {
          text: 'Ver detalhes',
          onPress: () => navigation?.navigate('ReportDetail', { item: item.original || item }),
        },
        {
          text: 'Editar ocorrência',
          onPress: () => navigation?.navigate('NewReport', { ocorrencia: item.original || item }),
        },
        {
          text: 'Apagar ocorrência',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarOcorrencia(item.id);
              carregarFeed(false);
            } catch {
              Alert.alert('Erro', 'Não foi possível apagar a ocorrência.');
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  }

  function montarEndereco(item: Ocorrencia) {
    const rua = item.rua || '';
    const bairro = item.bairro && item.bairro !== 'Não informado' ? item.bairro : '';

    if (rua && bairro) return `${rua}, ${bairro}`;
    return rua || bairro || '';
  }

  function formatarTitulo(categoria?: string) {
    if (categoria === 'ILUMINACAO') return 'Iluminação pública';
    if (categoria === 'SAUDE_PUBLICA') return 'Saúde pública';
    if (categoria === 'TRANSITO') return 'Trânsito';
    if (categoria === 'INFRAESTRUTURA') return 'Infraestrutura';
    if (categoria === 'LIMPEZA') return 'Limpeza urbana';
    return 'Ocorrência';
  }

  function formatarUrgencia(urgencia?: string) {
    if (urgencia === 'ALTA') return 'Grau alto';
    if (urgencia === 'MEDIA') return 'Grau médio';
    return 'Grau baixo';
  }

  function corUrgencia(urgencia?: string) {
    if (urgencia === 'ALTA') return '#ef4444';
    if (urgencia === 'MEDIA') return '#f59e0b';
    return '#22c55e';
  }

  function emojiCategoria(categoria?: string) {
    if (categoria === 'ILUMINACAO') return '💡';
    if (categoria === 'SAUDE_PUBLICA') return '🏥';
    if (categoria === 'TRANSITO') return '🚦';
    if (categoria === 'INFRAESTRUTURA') return '🛣️';
    if (categoria === 'LIMPEZA') return '🗑️';
    return '📍';
  }

  function bgCategoria(categoria?: string) {
    if (categoria === 'ILUMINACAO') return '#1a1a2e';
    if (categoria === 'SAUDE_PUBLICA') return '#ef4444';
    if (categoria === 'TRANSITO') return '#f59e0b';
    if (categoria === 'INFRAESTRUTURA') return '#92a0a8';
    if (categoria === 'LIMPEZA') return '#6b7280';
    return '#7ec8e3';
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.appNameRow}>
          <Text style={styles.appNameBlue}>Observa</Text>
          <Text style={styles.appNameGold}>Cidade</Text>
        </View>

        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation?.navigate('Notification')}
          activeOpacity={0.7}
        >
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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

        {carregandoFeed && (
          <Text style={styles.emptyText}>Carregando ocorrências...</Text>
        )}

        {!carregandoFeed && feed.length === 0 && (
          <Text style={styles.emptyText}>Nenhuma ocorrência cadastrada ainda.</Text>
        )}

        {feed.map((item) => (
          <View key={item.id} style={styles.feedCard}>
            <View style={styles.ocorrenciaRow}>
              <TouchableOpacity
                style={[styles.thumbnail, { backgroundColor: item.bg }]}
                onPress={() => navigation?.navigate('ReportDetail', { item: item.original || item })}
                activeOpacity={0.8}
              >
                {item.imagemBase64 ? (
                  <Image source={{ uri: item.imagemBase64 }} style={styles.thumbnailImage} />
                ) : (
                  <Text style={styles.thumbnailEmoji}>{item.emoji}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ocorrenciaInfo}
                onPress={() => navigation?.navigate('ReportDetail', { item: item.original || item })}
                activeOpacity={0.8}
              >
                <Text style={styles.ocorrenciaTitulo}>{item.titulo}</Text>

                {!!item.endereco && (
                  <Text style={styles.ocorrenciaEndereco}>{item.endereco}</Text>
                )}

                <Text style={styles.ocorrenciaDescricao}>{item.descricao}</Text>

                <View style={styles.ocorrenciaBottom}>
                  <View style={styles.grauRow}>
                    <View style={[styles.grauDot, { backgroundColor: item.grauCor }]} />
                    <Text style={styles.grauText}>{item.grau}</Text>
                  </View>

                  <Text style={styles.ocorrenciaData}>{item.data}</Text>
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

            {(comentariosPorOcorrencia[item.id] || []).map((comentario, index) => (
              <View key={comentario.id || index} style={styles.comentarioRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(comentario.usuario?.nome || 'U').substring(0, 2).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.comentarioContent}>
                  <View style={styles.comentarioHeader}>
                    <Text style={styles.comentarioNome}>{comentario.usuario?.nome || 'Usuário'}</Text>
                    <Text style={styles.comentarioTempo}>
                      {comentario.dataCriacao ? new Date(comentario.dataCriacao).toLocaleDateString('pt-BR') : ''}
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
                value={comentarios[item.id] || ''}
                onChangeText={(text) => setComentarios(prev => ({ ...prev, [item.id]: text }))}
              />

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={() => enviarComentario(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  heroDesc: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 12,
  },
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
  bubbleDots: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },

  feedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 20,
  },

  feedCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  ocorrenciaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  thumbnailEmoji: { fontSize: 32 },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  ocorrenciaInfo: { flex: 1 },
  ocorrenciaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  ocorrenciaEndereco: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  ocorrenciaDescricao: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 6,
    lineHeight: 17,
  },
  ocorrenciaBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grauRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  grauDot: { width: 10, height: 10, borderRadius: 5 },
  grauText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  ocorrenciaData: { fontSize: 11, color: '#94a3b8' },
  menuDots: { padding: 4 },
  menuDotsText: {
    fontSize: 20,
    color: '#64748b',
    lineHeight: 22,
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: 10,
  },

  comentarioRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: '#7c5cbf',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  comentarioContent: { flex: 1 },
  comentarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  comentarioNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  comentarioTempo: {
    fontSize: 11,
    color: '#94a3b8',
  },
  comentarioTexto: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 4,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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
  navPlus: {
    fontSize: 30,
    color: '#1a1a2e',
    lineHeight: 34,
  },
  navIcon: { fontSize: 22 },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1a3a5c',
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#1a1a2e',
  },
});
