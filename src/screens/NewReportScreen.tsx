import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, ScrollView, TextInput, Alert, Image,
} from 'react-native';
import { criarOcorrencia, atualizarOcorrencia } from '../services/ocorrenciaService';

type Props = { navigation?: any; route?: any };

const categorias = [
  { icon: '💡', label: 'Iluminação', api: 'ILUMINACAO' },
  { icon: '🏥', label: 'Saúde\npública', api: 'SAUDE_PUBLICA' },
  { icon: '🚗', label: 'Trânsito', api: 'TRANSITO' },
  { icon: '🏗️', label: 'Infraestrutura', api: 'INFRAESTRUTURA' },
  { icon: '🗑️', label: 'Limpeza', api: 'LIMPEZA' },
  { icon: '😐', label: 'Outros', api: 'OUTROS' },
] as const;

export default function NewReportScreen({ navigation, route }: Props) {
  const ocorrenciaEditando = route?.params?.ocorrencia || null;

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [referencia, setReferencia] = useState('');
  const [urgencia, setUrgencia] = useState<string | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!ocorrenciaEditando) return;

    const index = categorias.findIndex(c => c.api === ocorrenciaEditando.categoria);
    const urgenciasFront: any = { BAIXA: 'Baixo', MEDIA: 'Medio', ALTA: 'Alto' };

    setCategoriaSelecionada(index >= 0 ? index : null);
    setDescricao(ocorrenciaEditando.descricao || '');
    setEndereco(ocorrenciaEditando.rua || '');
    setBairro(ocorrenciaEditando.bairro === 'Não informado' ? '' : ocorrenciaEditando.bairro || '');
    setReferencia(ocorrenciaEditando.referencia === 'App Mobile' ? '' : ocorrenciaEditando.referencia || '');
    setUrgencia(urgenciasFront[ocorrenciaEditando.urgencia] || null);
    setImagemBase64(ocorrenciaEditando.imagemBase64 || null);
  }, [ocorrenciaEditando]);

  async function escolherGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.35,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setImagemBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.35,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setImagemBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  }

  async function handleEnviar() {
    try {
      if (categoriaSelecionada === null) {
        Alert.alert('Categoria obrigatória', 'Selecione uma categoria.');
        return;
      }

      if (!descricao.trim()) {
        Alert.alert('Descrição obrigatória', 'Informe a descrição da ocorrência.');
        return;
      }

      if (!endereco.trim()) {
        Alert.alert('Endereço obrigatório', 'Informe o endereço da ocorrência.');
        return;
      }

      if (!urgencia) {
        Alert.alert('Urgência obrigatória', 'Selecione o grau de urgência.');
        return;
      }

      const urgenciasApi: Record<string, 'BAIXA' | 'MEDIA' | 'ALTA'> = {
        Baixo: 'BAIXA',
        Medio: 'MEDIA',
        Alto: 'ALTA',
      };

      const payload = {
        categoria: categorias[categoriaSelecionada].api,
        descricao: descricao.trim(),
        rua: endereco.trim(),
        bairro: bairro.trim() || undefined,
        referencia: referencia.trim() || undefined,
        urgencia: urgenciasApi[urgencia],
        imagemBase64: imagemBase64 || undefined,
      };

      setSalvando(true);

      if (ocorrenciaEditando?.id) {
        await atualizarOcorrencia(ocorrenciaEditando.id, payload as any);
      } else {
        await criarOcorrencia(payload as any);
      }

      navigation?.navigate('Home');
    } catch (error) {
      console.log('Erro ao salvar ocorrência:', error);
      Alert.alert('Erro', 'Não foi possível salvar a ocorrência.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {ocorrenciaEditando ? 'Editar ocorrência' : 'Nova ocorrência'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Categoria:</Text>

        <View style={styles.categoriasGrid}>
          {categorias.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.catCard, categoriaSelecionada === index && styles.catCardActive]}
              onPress={() => setCategoriaSelecionada(index)}
              activeOpacity={0.8}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Descrição:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Descreva o problema..."
          placeholderTextColor="#94a3b8"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.sectionLabel}>Endereço:</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.input}
            placeholder="Endereço da rua"
            placeholderTextColor="#e2e8f0"
            value={endereco}
            onChangeText={setEndereco}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>🏘️</Text>
          <TextInput
            style={styles.input}
            placeholder="Bairro (opcional)"
            placeholderTextColor="#e2e8f0"
            value={bairro}
            onChangeText={setBairro}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📌</Text>
          <TextInput
            style={styles.input}
            placeholder="Ponto de referência (opcional)"
            placeholderTextColor="#e2e8f0"
            value={referencia}
            onChangeText={setReferencia}
          />
        </View>

        <Text style={styles.sectionLabel}>Foto:</Text>
        <View style={styles.fotosWrapper}>
          <Text style={styles.fotosPlaceholder}>
            {imagemBase64 ? '✅ Imagem adicionada' : 'Adicionar foto da ocorrência'}
          </Text>

          <View style={styles.fotosIcons}>
            <TouchableOpacity style={styles.fotoIcon} onPress={tirarFoto} activeOpacity={0.7}>
              <Text style={styles.fotoIconText}>📸</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fotoIcon} onPress={escolherGaleria} activeOpacity={0.7}>
              <Text style={styles.fotoIconText}>🖼️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {imagemBase64 && (
          <View style={styles.previewBox}>
            <Image source={{ uri: imagemBase64 }} style={styles.previewImage} />

            <TouchableOpacity style={styles.removeImage} onPress={() => setImagemBase64(null)}>
              <Text style={styles.removeImageText}>Remover foto</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionLabel}>Grau de urgência:</Text>

        <View style={styles.urgenciaRow}>
          {[
            { label: 'Baixo', color: '#22c55e', active: '#16a34a' },
            { label: 'Medio', color: '#f59e0b', active: '#d97706' },
            { label: 'Alto', color: '#ef4444', active: '#dc2626' },
          ].map((u) => (
            <TouchableOpacity
              key={u.label}
              style={[styles.urgBtn, { backgroundColor: urgencia === u.label ? u.active : u.color }]}
              onPress={() => setUrgencia(u.label)}
              activeOpacity={0.85}
            >
              <Text style={styles.urgBtnText}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleEnviar} disabled={salvando} activeOpacity={0.85}>
          <Text style={styles.sendText}>
            {salvando ? 'Salvando...' : ocorrenciaEditando ? 'Salvar alteração' : 'Enviar ocorrência'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#7ec8e3' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 10, marginTop: 4 },
  categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  catCard: { width: '30%', backgroundColor: '#5bb8d4', borderRadius: 14, padding: 12, alignItems: 'center', gap: 6, minHeight: 80, justifyContent: 'center' },
  catCardActive: { backgroundColor: '#1565c0' },
  catIcon: { fontSize: 26 },
  catLabel: { fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center', lineHeight: 16 },
  textArea: { backgroundColor: '#fff', borderRadius: 12, padding: 14, height: 100, fontSize: 14, color: '#1a1a2e', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5bb8d4', borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 12, gap: 8 },
  inputIcon: { fontSize: 18 },
  input: { flex: 1, fontSize: 14, color: '#fff' },
  fotosWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5bb8d4', borderRadius: 12, paddingHorizontal: 14, height: 54, marginBottom: 12, justifyContent: 'space-between' },
  fotosPlaceholder: { fontSize: 13, color: '#fff', fontWeight: '500', flex: 1 },
  fotosIcons: { flexDirection: 'row', gap: 8 },
  fotoIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  fotoIconText: { fontSize: 18 },
  previewBox: { backgroundColor: '#fff', borderRadius: 14, padding: 10, marginBottom: 16 },
  previewImage: { width: '100%', height: 180, borderRadius: 10 },
  removeImage: { paddingVertical: 10, alignItems: 'center' },
  removeImageText: { color: '#ef4444', fontWeight: '700' },
  urgenciaRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  urgBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  urgBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  sendButton: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  sendText: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
});
