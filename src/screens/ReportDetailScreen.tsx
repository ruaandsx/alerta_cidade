import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Linking, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  deletarOcorrencia,
  buscarOcorrencia,
  listarComentarios,
  criarComentario,
  Ocorrencia,
  tituloCategoria,
  emojiCategoria,
  enderecoOcorrencia,
  rotuloStatus,
  corStatus,
  rotuloUrgencia,
  corUrgencia,
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
    if (!item.latitude || !item.longitude) {
      Alert.alert('Sem localização', 'Esta ocorrência não possui coordenadas.');
      return;
    }

    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`,
    ).catch(() => Alert.alert('Erro', 'Não foi possível abrir o mapa.'));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes da ocorrência</Text>
        {podeGerenciar ? (
          <TouchableOpacity onPress={apagar}>
            <Text style={styles.trash}>🗑️</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imageBox}>
          {imagem ? (
            <Image
              source={imagem}
              style={styles.image}
              onError={() => setImagem(null)}
            />
          ) : (
            <Text style={styles.emoji}>{emojiCategoria(item.categoria)}</Text>
          )}

          {carregando && (
            <View style={styles.carregandoImagem}>
              <ActivityIndicator color="#1565c0" />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cabecalho}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{tituloCategoria(item.categoria)}</Text>
              <Text style={styles.protocolo}>
                {item.protocolo ? `Protocolo ${item.protocolo}` : `Ocorrência #${item.id}`}
              </Text>
            </View>

            <View style={[styles.statusPill, { backgroundColor: `${corStatus(item.status)}18` }]}>
              <View style={[styles.statusDot, { backgroundColor: corStatus(item.status) }]} />
              <Text style={[styles.statusText, { color: corStatus(item.status) }]}>
                {rotuloStatus(item.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.text}>{item.descricao || 'Sem descrição'}</Text>

          <Text style={styles.label}>Endereço</Text>
          <Text style={styles.text}>{enderecoOcorrencia(item)}</Text>

          {!!item.referencia && (
            <>
              <Text style={styles.label}>Referência</Text>
              <Text style={styles.text}>{item.referencia}</Text>
            </>
          )}

          <View style={styles.duasColunas}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Urgência</Text>
              <View style={styles.grauRow}>
                <View style={[styles.grauDot, { backgroundColor: corUrgencia(item.urgencia) }]} />
                <Text style={styles.text}>{rotuloUrgencia(item.urgencia)}</Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Registrada em</Text>
              <Text style={styles.text}>
                {item.dataCriacao
                  ? new Date(item.dataCriacao).toLocaleString('pt-BR')
                  : 'Não informada'}
              </Text>
            </View>
          </View>

          {!!item.usuario?.nome && (
            <>
              <Text style={styles.label}>Registrada por</Text>
              <Text style={styles.text}>{item.usuario.nome}</Text>
            </>
          )}

          {!!item.latitude && !!item.longitude && (
            <TouchableOpacity style={styles.mapaBtn} onPress={abrirMapa}>
              <Text style={styles.mapaBtnText}>📍 Abrir localização no mapa</Text>
            </TouchableOpacity>
          )}
        </View>

        {!!item.historico?.length && (
          <View style={styles.historicoCard}>
            <Text style={styles.sectionTitle}>Histórico</Text>

            {item.historico.map((h) => (
              <View key={h.id} style={styles.historicoItem}>
                <View style={[styles.historicoDot, { backgroundColor: corStatus(h.statusNovo) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.historicoTitulo}>
                    {h.statusNovoLabel || rotuloStatus(h.statusNovo)}
                  </Text>
                  <Text style={styles.historicoData}>
                    {h.dataCriacao ? new Date(h.dataCriacao).toLocaleString('pt-BR') : ''}
                    {h.usuarioNome ? ` · ${h.usuarioNome}` : ''}
                  </Text>
                  {!!h.observacao && <Text style={styles.historicoObs}>{h.observacao}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.comentariosCard}>
          <Text style={styles.sectionTitle}>Comentários ({comentarios.length})</Text>

          {comentarios.length === 0 && (
            <Text style={styles.vazio}>Nenhum comentário ainda.</Text>
          )}

          {comentarios.map((c, index) => (
            <View key={c.id || index} style={styles.comentarioRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(c.usuario?.nome || 'U').substring(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.comentarioTopo}>
                  <Text style={styles.comentarioNome}>{c.usuario?.nome || 'Usuário'}</Text>
                  <Text style={styles.comentarioData}>
                    {c.dataCriacao ? new Date(c.dataCriacao).toLocaleDateString('pt-BR') : ''}
                  </Text>
                </View>
                <Text style={styles.comentarioTexto}>{c.texto}</Text>
              </View>
            </View>
          ))}

          <View style={styles.novoComentario}>
            <TextInput
              style={styles.comentarioInput}
              placeholder="Escreva um comentário..."
              placeholderTextColor="#94a3b8"
              value={novoComentario}
              onChangeText={setNovoComentario}
              multiline
            />

            <TouchableOpacity style={styles.enviarBtn} onPress={comentar}>
              <Text style={styles.enviarBtnText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {podeGerenciar && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation?.navigate('NewReport', { ocorrencia: item })}
            >
              <Text style={styles.buttonText}>Editar ocorrência</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={apagar}>
              <Text style={styles.deleteText}>Apagar ocorrência</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  back: { fontSize: 24, color: '#1a1a2e' },
  trash: { fontSize: 22 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  scroll: { padding: 16, paddingBottom: 32 },
  imageBox: {
    height: 220,
    borderRadius: 18,
    backgroundColor: '#d6eef8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  emoji: { fontSize: 54 },
  carregandoImagem: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.55)' },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#1565c0' },
  protocolo: { fontSize: 11.5, color: '#94a3b8', marginTop: 2, fontWeight: '600' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11.5, fontWeight: '700' },
  label: { fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 12 },
  text: { fontSize: 14, color: '#1a1a2e', lineHeight: 20, marginTop: 2 },
  duasColunas: { flexDirection: 'row', gap: 12 },
  grauRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  grauDot: { width: 10, height: 10, borderRadius: 5 },
  mapaBtn: {
    marginTop: 14,
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  mapaBtnText: { color: '#1565c0', fontWeight: '700', fontSize: 13 },
  historicoCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: { fontSize: 15.5, fontWeight: '800', color: '#1a1a2e', marginBottom: 10 },
  historicoItem: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  historicoDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  historicoTitulo: { fontSize: 13.5, fontWeight: '700', color: '#1a1a2e' },
  historicoData: { fontSize: 11.5, color: '#94a3b8', marginTop: 1 },
  historicoObs: {
    fontSize: 12.5,
    color: '#475569',
    marginTop: 5,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
  },
  comentariosCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  vazio: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  comentarioRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#7c5cbf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  comentarioTopo: { flexDirection: 'row', justifyContent: 'space-between' },
  comentarioNome: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  comentarioData: { fontSize: 11, color: '#94a3b8' },
  comentarioTexto: { fontSize: 13, color: '#334155', lineHeight: 19, marginTop: 2 },
  novoComentario: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', marginTop: 4 },
  comentarioInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1a1a2e',
  },
  enviarBtn: {
    backgroundColor: '#1565c0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  enviarBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  button: {
    marginTop: 16,
    backgroundColor: '#1565c0',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  deleteText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});
