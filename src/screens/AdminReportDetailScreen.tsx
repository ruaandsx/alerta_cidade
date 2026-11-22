import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  atualizarStatusOcorrencia,
  buscarOcorrencia,
  criarComentario,
  listarComentarios,
  deletarOcorrencia,
  Ocorrencia,
  tituloCategoria,
  rotuloStatus,
  corStatus,
} from '../services/ocorrenciaService';
import { fonteImagem, FonteImagem } from '../services/api';

type Props = { navigation?: any; route?: any };

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

  async function mudarStatus(status: 'RECEBIDO' | 'EM_ANALISE' | 'EM_ANDAMENTO' | 'RESOLVIDO') {
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
            Alert.alert('Erro', 'Não foi possível excluir. Verifique comentários/notificações vinculados.');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Detalhes da ocorrência</Text>
          <Text style={styles.headerSubtitle}>ID: #{item.id}</Text>
        </View>
        <TouchableOpacity onPress={excluir}>
          <Text style={styles.menuDots}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imagemWrapper}>
          <View style={styles.imagemPrincipal}>
            {imagem ? (
              <Image source={imagem} style={styles.imagemReal} />
            ) : (
              <Text style={styles.imagemEmoji}>📍</Text>
            )}
          </View>

          <View style={styles.infoLateral}>
            <View style={[styles.statusBtn, { backgroundColor: `${corStatus(item.status)}18`, borderColor: corStatus(item.status) }]}>
              <Text style={[styles.statusBtnText, { color: corStatus(item.status) }]}>
                {rotuloStatus(item.status)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValue}>{tituloCategoria(item.categoria)}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Prioridade</Text>
              <Text style={styles.infoValue}>{item.urgenciaLabel || item.urgencia || 'Não informada'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Criada por</Text>
              <Text style={styles.infoValue}>{item.usuario?.nome || item.usuarioNome || 'Usuário'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Contato</Text>
              <Text style={styles.infoValue}>{item.usuario?.email || 'Sem e-mail'}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ações administrativas</Text>
        <View style={styles.acoesRow}>
          <TouchableOpacity style={[styles.acaoBtn, { backgroundColor: '#f59e0b' }]} onPress={() => mudarStatus('EM_ANALISE')}>
            <Text style={styles.acaoBtnIcon}>🔎</Text>
            <Text style={styles.acaoBtnText}>Em análise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.acaoBtn, { backgroundColor: '#7c3aed' }]} onPress={() => mudarStatus('EM_ANDAMENTO')}>
            <Text style={styles.acaoBtnIcon}>🚧</Text>
            <Text style={styles.acaoBtnText}>Em andamento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.acaoBtn, { backgroundColor: '#22c55e' }]} onPress={() => mudarStatus('RESOLVIDO')}>
            <Text style={styles.acaoBtnIcon}>✅</Text>
            <Text style={styles.acaoBtnText}>Resolvida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.acaoBtn, { backgroundColor: '#ef4444' }]} onPress={excluir}>
            <Text style={styles.acaoBtnIcon}>🗑️</Text>
            <Text style={styles.acaoBtnText}>Excluir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Descrição da ocorrência</Text>
        <View style={styles.descricaoCard}>
          <Text style={styles.descricaoText}>{item.descricao || 'Sem descrição'}</Text>
          <Text style={styles.enderecoText}>
            📍 {item.rua || ''}{item.bairro && item.bairro !== 'Não informado' ? ', ' + item.bairro : ''}
          </Text>
          {item.referencia ? <Text style={styles.enderecoText}>📌 {item.referencia}</Text> : null}
        </View>

        <Text style={styles.sectionTitle}>Responder ao usuário</Text>
        <View style={styles.respostaBox}>
          <TextInput
            style={styles.inputResposta}
            placeholder="Digite uma resposta administrativa..."
            placeholderTextColor="#94a3b8"
            value={resposta}
            onChangeText={setResposta}
            multiline
          />
          <TouchableOpacity style={styles.responderBtn} onPress={responder}>
            <Text style={styles.responderText}>Enviar resposta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.comentariosHeader}>
          <Text style={styles.sectionTitle}>Comentários ({comentarios.length})</Text>
        </View>

        {comentarios.map((c, i) => (
          <View key={c.id || i} style={styles.comentarioCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(c.usuario?.nome || 'U').substring(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.comentarioContent}>
              <View style={styles.comentarioTop}>
                <Text style={styles.comentarioNome}>{c.usuario?.nome || 'Usuário'}</Text>
                <Text style={styles.comentarioData}>{c.dataCriacao ? new Date(c.dataCriacao).toLocaleString('pt-BR') : ''}</Text>
              </View>
              <Text style={styles.comentarioTexto}>{c.texto}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminHome')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminUsers')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate('AdminProfile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backArrow: { fontSize: 22, color: '#1a1a2e' },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  headerSubtitle: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  menuDots: { fontSize: 20 },
  scroll: { paddingHorizontal: 14, paddingBottom: 24 },
  imagemWrapper: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 10 },
  imagemPrincipal: { width: 160, height: 140, borderRadius: 12, backgroundColor: '#92a0a8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  imagemReal: { width: '100%', height: '100%' },
  imagemEmoji: { fontSize: 48 },
  infoLateral: { flex: 1, gap: 8 },
  statusBtn: { backgroundColor: '#fef9c3', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#fde68a' },
  statusBtnText: { fontSize: 11, fontWeight: '700', color: '#b45309' },
  infoItem: { gap: 2 },
  infoLabel: { fontSize: 10, color: '#94a3b8' },
  infoValue: { fontSize: 12, fontWeight: '600', color: '#1a1a2e' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 10, marginTop: 8 },
  acoesRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  acaoBtn: { borderRadius: 10, padding: 10, alignItems: 'center', minWidth: 85 },
  acaoBtnIcon: { fontSize: 18, marginBottom: 2 },
  acaoBtnText: { fontSize: 10, fontWeight: '700', color: '#fff', textAlign: 'center' },
  descricaoCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  descricaoText: { fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 8 },
  enderecoText: { fontSize: 12, color: '#64748b', marginTop: 4 },
  respostaBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  inputResposta: { minHeight: 70, fontSize: 13, color: '#1a1a2e', textAlignVertical: 'top' },
  responderBtn: { backgroundColor: '#1565c0', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  responderText: { color: '#fff', fontWeight: '700' },
  comentariosHeader: { marginTop: 12 },
  comentarioCard: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1565c0', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  comentarioContent: { flex: 1 },
  comentarioTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  comentarioNome: { fontSize: 12, fontWeight: '700', color: '#1a1a2e', flex: 1 },
  comentarioData: { fontSize: 10, color: '#94a3b8' },
  comentarioTexto: { fontSize: 12, color: '#334155', lineHeight: 17 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#7ec8e3', paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  navItem: { alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: '500', color: '#1a3a5c' },
});
