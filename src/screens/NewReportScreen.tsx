import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  criarOcorrencia,
  atualizarOcorrencia,
  CategoriaOcorrencia,
  UrgenciaOcorrencia,
} from '../services/ocorrenciaService';
import { fonteImagem, FonteImagem } from '../services/api';

type Props = { navigation?: any; route?: any };

const categorias = [
  { icon: '💡', label: 'Iluminação', api: 'ILUMINACAO' },
  { icon: '🏥', label: 'Saúde\npública', api: 'SAUDE_PUBLICA' },
  { icon: '🚗', label: 'Trânsito', api: 'TRANSITO' },
  { icon: '🏗️', label: 'Infraestrutura', api: 'INFRAESTRUTURA' },
  { icon: '🗑️', label: 'Limpeza', api: 'LIMPEZA' },
  { icon: '😐', label: 'Outros', api: 'OUTROS' },
] as const;

const urgencias: { label: string; api: UrgenciaOcorrencia; color: string; active: string }[] = [
  { label: 'Baixo', api: 'BAIXA', color: '#22c55e', active: '#16a34a' },
  { label: 'Médio', api: 'MEDIA', color: '#f59e0b', active: '#d97706' },
  { label: 'Alto', api: 'ALTA', color: '#ef4444', active: '#dc2626' },
];

export default function NewReportScreen({ navigation, route }: Props) {
  const ocorrenciaEditando = route?.params?.ocorrencia || null;

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [referencia, setReferencia] = useState('');
  const [urgencia, setUrgencia] = useState<string | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [imagemExistente, setImagemExistente] = useState<FonteImagem | null>(null);
  const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!ocorrenciaEditando) {
      capturarLocalizacao(true);
      return;
    }

    const index = categorias.findIndex((c) => c.api === ocorrenciaEditando.categoria);

    setCategoriaSelecionada(index >= 0 ? index : null);
    setDescricao(ocorrenciaEditando.descricao || '');
    setEndereco(ocorrenciaEditando.rua || '');
    setBairro(ocorrenciaEditando.bairro === 'Não informado' ? '' : ocorrenciaEditando.bairro || '');
    setReferencia(ocorrenciaEditando.referencia === 'App Mobile' ? '' : ocorrenciaEditando.referencia || '');
    setUrgencia(
      ocorrenciaEditando.urgencia === 'ALTA'
        ? 'Alto'
        : ocorrenciaEditando.urgencia === 'MEDIA'
          ? 'Médio'
          : ocorrenciaEditando.urgencia === 'BAIXA'
            ? 'Baixo'
            : null,
    );

    if (ocorrenciaEditando.latitude && ocorrenciaEditando.longitude) {
      setCoordenadas({
        latitude: ocorrenciaEditando.latitude,
        longitude: ocorrenciaEditando.longitude,
      });
    } else {
      capturarLocalizacao(true);
    }

    if (ocorrenciaEditando.imagemBase64) {
      setImagemBase64(ocorrenciaEditando.imagemBase64);
    } else if (ocorrenciaEditando.id && ocorrenciaEditando.temImagem !== false) {
      fonteImagem(ocorrenciaEditando.id, true).then(setImagemExistente).catch(() => {});
    }
  }, [ocorrenciaEditando]);

  async function capturarLocalizacao(silencioso = false) {
    try {
      setBuscandoGps(true);

      const permissao = await Location.requestForegroundPermissionsAsync();

      if (!permissao.granted) {
        if (!silencioso) {
          Alert.alert(
            'Localização desativada',
            'Permita o acesso à localização para anexar as coordenadas da ocorrência.',
          );
        }
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoordenadas({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      });
    } catch {
      if (!silencioso) {
        Alert.alert('GPS indisponível', 'Não foi possível obter sua localização agora.');
      }
    } finally {
      setBuscandoGps(false);
    }
  }

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
      setImagemExistente(null);
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
      setImagemExistente(null);
    }
  }

  function removerFoto() {
    setImagemBase64(null);
    setImagemExistente(null);
  }

  async function handleEnviar() {
    if (categoriaSelecionada === null) {
      Alert.alert('Categoria obrigatória', 'Selecione uma categoria.');
      return;
    }

    if (!descricao.trim() || descricao.trim().length < 5) {
      Alert.alert('Descrição obrigatória', 'Descreva a ocorrência com pelo menos 5 caracteres.');
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

    const urgenciaSelecionada = urgencias.find((u) => u.label === urgencia);

    const payload = {
      categoria: categorias[categoriaSelecionada].api as CategoriaOcorrencia,
      descricao: descricao.trim(),
      rua: endereco.trim(),
      bairro: bairro.trim() || undefined,
      referencia: referencia.trim() || undefined,
      latitude: coordenadas?.latitude,
      longitude: coordenadas?.longitude,
      urgencia: (urgenciaSelecionada?.api || 'BAIXA') as UrgenciaOcorrencia,
      imagemBase64: imagemBase64 || undefined,
    };

    try {
      setSalvando(true);

      if (ocorrenciaEditando?.id) {
        await atualizarOcorrencia(ocorrenciaEditando.id, payload);
      } else {
        await criarOcorrencia(payload);
      }

      Alert.alert(
        'Tudo certo',
        ocorrenciaEditando ? 'Ocorrência atualizada.' : 'Ocorrência registrada com sucesso.',
      );

      navigation?.navigate('Home');
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível salvar a ocorrência.');
    } finally {
      setSalvando(false);
    }
  }

  const preview = imagemBase64 ? { uri: imagemBase64 } : imagemExistente;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerBack}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {ocorrenciaEditando ? 'Editar ocorrência' : 'Nova ocorrência'}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Categoria:</Text>

        <View style={styles.categoriasGrid}>
          {categorias.map((cat, index) => (
            <TouchableOpacity
              key={cat.api}
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
          maxLength={2000}
        />

        <Text style={styles.sectionLabel}>Endereço:</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>📍</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua / avenida"
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

        <TouchableOpacity
          style={styles.gpsRow}
          onPress={() => capturarLocalizacao(false)}
          activeOpacity={0.8}
          disabled={buscandoGps}
        >
          <Text style={styles.gpsIcon}>🛰️</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.gpsTitle}>
              {buscandoGps
                ? 'Buscando sua localização...'
                : coordenadas
                  ? 'Localização anexada'
                  : 'Anexar minha localização'}
            </Text>
            <Text style={styles.gpsSub}>
              {coordenadas
                ? `${coordenadas.latitude.toFixed(5)}, ${coordenadas.longitude.toFixed(5)}`
                : 'Toque para capturar as coordenadas por GPS'}
            </Text>
          </View>

          {buscandoGps ? (
            <ActivityIndicator color="#1565c0" />
          ) : (
            <Text style={styles.gpsAction}>{coordenadas ? 'Atualizar' : 'Capturar'}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Foto:</Text>
        <View style={styles.fotosWrapper}>
          <Text style={styles.fotosPlaceholder}>
            {preview ? '✅ Imagem adicionada' : 'Adicionar foto da ocorrência'}
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

        {preview && (
          <View style={styles.previewBox}>
            <Image source={preview} style={styles.previewImage} />

            <TouchableOpacity style={styles.removeImage} onPress={removerFoto}>
              <Text style={styles.removeImageText}>Remover foto</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionLabel}>Grau de urgência:</Text>

        <View style={styles.urgenciaRow}>
          {urgencias.map((u) => (
            <TouchableOpacity
              key={u.api}
              style={[
                styles.urgBtn,
                { backgroundColor: urgencia === u.label ? u.active : u.color },
              ]}
              onPress={() => setUrgencia(u.label)}
              activeOpacity={0.85}
            >
              <Text style={styles.urgBtnText}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.sendButton, salvando && { opacity: 0.6 }]}
          onPress={handleEnviar}
          disabled={salvando}
          activeOpacity={0.85}
        >
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerBack: { width: 26 },
  headerBackText: { fontSize: 24, color: '#1a1a2e' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e' },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 10, marginTop: 4 },
  categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  catCard: {
    width: '30%',
    backgroundColor: '#5bb8d4',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    minHeight: 80,
    justifyContent: 'center',
  },
  catCardActive: { backgroundColor: '#1565c0' },
  catIcon: { fontSize: 26 },
  catLabel: { fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center', lineHeight: 16 },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    height: 100,
    fontSize: 14,
    color: '#1a1a2e',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5bb8d4',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 12,
    gap: 8,
  },
  inputIcon: { fontSize: 18 },
  input: { flex: 1, fontSize: 14, color: '#fff' },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#c7dff0',
  },
  gpsIcon: { fontSize: 20 },
  gpsTitle: { fontSize: 13.5, fontWeight: '700', color: '#1a1a2e' },
  gpsSub: { fontSize: 11.5, color: '#64748b', marginTop: 1 },
  gpsAction: { fontSize: 12, fontWeight: '700', color: '#1565c0' },
  fotosWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5bb8d4',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  fotosPlaceholder: { fontSize: 13, color: '#fff', fontWeight: '500', flex: 1 },
  fotosIcons: { flexDirection: 'row', gap: 8 },
  fotoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
