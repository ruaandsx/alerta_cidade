import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import Botao from '../components/Botao';
import Campo from '../components/Campo';
import Header from '../components/Header';
import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import {
  ICONE,
  ICONE_CATEGORIA,
  ICONE_URGENCIA,
  type NomeIcone,
} from '../theme/icones';
import {
  criarOcorrencia,
  atualizarOcorrencia,
  ROTULO_CATEGORIA,
  ROTULO_URGENCIA,
  type CategoriaOcorrencia,
  type UrgenciaOcorrencia,
  type Ocorrencia,
} from '../services/ocorrenciaService';
import { fonteImagem, type FonteImagem } from '../services/api';

type Props = { navigation?: any; route?: any };

const CATEGORIAS = (Object.keys(ROTULO_CATEGORIA) as CategoriaOcorrencia[]).map((api) => ({
  api,
  rotulo: ROTULO_CATEGORIA[api],
  icone: ICONE_CATEGORIA[api] as NomeIcone,
}));

const URGENCIAS: { api: UrgenciaOcorrencia; rotulo: string; icone: NomeIcone; cor: string }[] = [
  { api: 'BAIXA', rotulo: ROTULO_URGENCIA.BAIXA, icone: ICONE_URGENCIA.BAIXA, cor: cores.urgencia.baixa },
  { api: 'MEDIA', rotulo: ROTULO_URGENCIA.MEDIA, icone: ICONE_URGENCIA.MEDIA, cor: cores.urgencia.media },
  { api: 'ALTA', rotulo: ROTULO_URGENCIA.ALTA, icone: ICONE_URGENCIA.ALTA, cor: cores.urgencia.alta },
];

export default function NewReportScreen({ navigation, route }: Props) {
  const ocorrenciaEditando: Ocorrencia | null = route?.params?.ocorrencia || null;

  const [categoria, setCategoria] = useState<CategoriaOcorrencia | null>(null);
  const [descricao, setDescricao] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [referencia, setReferencia] = useState('');
  const [urgencia, setUrgencia] = useState<UrgenciaOcorrencia | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [imagemExistente, setImagemExistente] = useState<FonteImagem | null>(null);
  const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number } | null>(null);
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!ocorrenciaEditando) {
      capturarLocalizacao(true);
      return;
    }

    setCategoria(ocorrenciaEditando.categoria || null);
    setDescricao(ocorrenciaEditando.descricao || '');
    setRua(ocorrenciaEditando.rua || '');
    setBairro(ocorrenciaEditando.bairro === 'Não informado' ? '' : ocorrenciaEditando.bairro || '');
    setReferencia(
      ocorrenciaEditando.referencia === 'App Mobile' ? '' : ocorrenciaEditando.referencia || '',
    );
    setUrgencia(ocorrenciaEditando.urgencia || null);

    if (ocorrenciaEditando.latitude != null && ocorrenciaEditando.longitude != null) {
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
      fonteImagem(ocorrenciaEditando.id, true)
        .then(setImagemExistente)
        .catch(() => {});
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
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para anexar uma foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.35,
      allowsEditing: true,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.base64) {
      setImagemBase64(`data:image/jpeg;base64,${resultado.assets[0].base64}`);
      setImagemExistente(null);
    }
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar a foto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.35,
      allowsEditing: true,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.base64) {
      setImagemBase64(`data:image/jpeg;base64,${resultado.assets[0].base64}`);
      setImagemExistente(null);
    }
  }

  function removerFoto() {
    setImagemBase64(null);
    setImagemExistente(null);
  }

  async function enviar() {
    if (!categoria) {
      Alert.alert('Categoria obrigatória', 'Selecione a categoria da ocorrência.');
      return;
    }

    if (descricao.trim().length < 5) {
      Alert.alert('Descrição obrigatória', 'Descreva a ocorrência com pelo menos 5 caracteres.');
      return;
    }

    if (!rua.trim()) {
      Alert.alert('Endereço obrigatório', 'Informe a rua ou avenida da ocorrência.');
      return;
    }

    if (!urgencia) {
      Alert.alert('Urgência obrigatória', 'Selecione o grau de urgência.');
      return;
    }

    const payload = {
      categoria,
      descricao: descricao.trim(),
      rua: rua.trim(),
      bairro: bairro.trim() || undefined,
      referencia: referencia.trim() || undefined,
      latitude: coordenadas?.latitude,
      longitude: coordenadas?.longitude,
      urgencia,
      imagemBase64: imagemBase64 || undefined,
    };

    try {
      setSalvando(true);

      if (ocorrenciaEditando?.id) {
        const atualizada = await atualizarOcorrencia(ocorrenciaEditando.id, payload);
        Alert.alert('Tudo certo', 'Ocorrência atualizada com sucesso.');
        navigation?.replace?.('ReportDetail', { item: atualizada || ocorrenciaEditando });
      } else {
        const criada = await criarOcorrencia(payload);
        navigation?.replace?.('ReportSuccess', { ocorrencia: criada });
      }
    } catch (erro: any) {
      Alert.alert('Erro', erro?.message || 'Não foi possível salvar a ocorrência.');
    } finally {
      setSalvando(false);
    }
  }

  const preview = imagemBase64 ? { uri: imagemBase64 } : imagemExistente;
  const editando = !!ocorrenciaEditando;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo={editando ? 'Editar ocorrência' : 'Nova ocorrência'}
        subtitulo={editando ? 'Atualize os dados do registro' : 'Conte o que está acontecendo na cidade'}
        onVoltar={() => navigation?.goBack?.()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.secao}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
              Categoria
            </Text>

            <View style={styles.grid}>
              {CATEGORIAS.map((item) => {
                const ativo = categoria === item.api;

                return (
                  <Pressable
                    key={item.api}
                    onPress={() => setCategoria(item.api)}
                    accessibilityRole="button"
                    accessibilityLabel={`Categoria ${item.rotulo}`}
                    accessibilityState={{ selected: ativo }}
                    style={({ pressed }) => [
                      styles.categoria,
                      ativo ? styles.categoriaAtiva : styles.categoriaInativa,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Ionicons
                      name={item.icone}
                      size={layout.icone['4']}
                      color={ativo ? cores.texto.inverso : cores.marca.azul}
                    />
                    <Text
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      numberOfLines={2}
                      style={[styles.categoriaTexto, ativo && styles.categoriaTextoAtivo]}
                    >
                      {item.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Campo
            rotulo="Descrição"
            valor={descricao}
            aoMudar={setDescricao}
            placeholder="Ex.: poste apagado há três dias na esquina da padaria"
            multilinha
            maxLength={2000}
            ajuda={`${descricao.length}/2000 caracteres`}
            acessibilidadeLabel="Descrição da ocorrência"
          />

          <View style={styles.secao}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
              Onde aconteceu
            </Text>

            <View style={styles.campos}>
              <Campo
                rotulo="Rua ou avenida"
                valor={rua}
                aoMudar={setRua}
                placeholder="Ex.: Rua Maurício de Nassau"
                icone={ICONE.localizacao}
                acessibilidadeLabel="Rua da ocorrência"
              />

              <Campo
                rotulo="Bairro"
                valor={bairro}
                aoMudar={setBairro}
                placeholder="Opcional"
                acessibilidadeLabel="Bairro da ocorrência"
              />

              <Campo
                rotulo="Ponto de referência"
                valor={referencia}
                aoMudar={setReferencia}
                placeholder="Opcional. Ex.: em frente à praça"
                icone={ICONE.referencia}
                acessibilidadeLabel="Ponto de referência"
              />
            </View>
          </View>

          <Pressable
            onPress={() => capturarLocalizacao(false)}
            disabled={buscandoGps}
            accessibilityRole="button"
            accessibilityLabel="Anexar localização por GPS"
            style={({ pressed }) => [styles.gps, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.gpsIcone}>
              <Ionicons name={ICONE.localizacao} size={layout.icone['3']} color={cores.marca.azul} />
            </View>

            <View style={styles.gpsTexto}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.gpsTitulo}>
                {buscandoGps
                  ? 'Buscando sua localização...'
                  : coordenadas
                    ? 'Localização anexada'
                    : 'Anexar minha localização'}
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.gpsAjuda}>
                {coordenadas
                  ? `${coordenadas.latitude.toFixed(5)}, ${coordenadas.longitude.toFixed(5)}`
                  : 'Ajuda a equipe a encontrar o problema'}
              </Text>
            </View>

            {buscandoGps ? (
              <Ionicons name={ICONE.atualizar} size={layout.icone['2']} color={cores.texto.secundario} />
            ) : (
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.gpsAcao}>
                {coordenadas ? 'Atualizar' : 'Capturar'}
              </Text>
            )}
          </Pressable>

          <View style={styles.secao}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
              Foto
            </Text>

            {preview ? (
              <View style={styles.previewBox}>
                <Image
                  source={preview}
                  style={styles.preview}
                  onError={() => setImagemExistente(null)}
                  accessibilityLabel="Foto anexada à ocorrência"
                />

                <Pressable
                  onPress={removerFoto}
                  accessibilityRole="button"
                  accessibilityLabel="Remover foto"
                  style={({ pressed }) => [styles.remover, pressed && { opacity: 0.7 }]}
                >
                  <Ionicons name={ICONE.excluir} size={layout.icone['2']} color={cores.estado.erroTexto} />
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.removerTexto}>
                    Remover foto
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.fotoBotoes}>
                <Botao
                  titulo="Tirar foto"
                  icone={ICONE.camera}
                  variante="secundario"
                  onPress={tirarFoto}
                  larguraTotal={false}
                  estilo={styles.fotoBotao}
                />
                <Botao
                  titulo="Galeria"
                  icone="images-outline"
                  variante="secundario"
                  onPress={escolherGaleria}
                  larguraTotal={false}
                  estilo={styles.fotoBotao}
                />
              </View>
            )}
          </View>

          <View style={styles.secao}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
              Grau de urgência
            </Text>

            <View style={styles.urgencias}>
              {URGENCIAS.map((item) => {
                const ativo = urgencia === item.api;

                return (
                  <Pressable
                    key={item.api}
                    onPress={() => setUrgencia(item.api)}
                    accessibilityRole="button"
                    accessibilityLabel={`Urgência ${item.rotulo}`}
                    accessibilityState={{ selected: ativo }}
                    style={({ pressed }) => [
                      styles.urgencia,
                      { borderColor: item.cor },
                      ativo && { backgroundColor: item.cor },
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <Ionicons
                      name={item.icone}
                      size={layout.icone['3']}
                      color={ativo ? cores.texto.inverso : item.cor}
                    />
                    <Text
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      style={[styles.urgenciaTexto, { color: ativo ? cores.texto.inverso : item.cor }]}
                    >
                      {item.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Botao
            titulo={
              salvando
                ? 'Salvando...'
                : editando
                  ? 'Salvar alteração'
                  : 'Enviar ocorrência'
            }
            icone={editando ? ICONE.editar : ICONE.enviar}
            onPress={enviar}
            carregando={salvando}
            estilo={styles.enviar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingTop: espaco['4'],
    paddingBottom: espaco['8'],
    gap: espaco['5'],
  },
  secao: { gap: espaco['2'] },
  rotuloSecao: { ...tipografia.rotulo, color: cores.texto.principal },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco['2'],
  },
  categoria: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 92,
    borderRadius: raio['2'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['1'],
    paddingHorizontal: espaco['2'],
    paddingVertical: espaco['3'],
    borderWidth: 1,
  },
  categoriaInativa: {
    backgroundColor: cores.superficie.suave,
    borderColor: cores.borda.suave,
  },
  categoriaAtiva: {
    backgroundColor: cores.marca.azul,
    borderColor: cores.marca.azul,
  },
  categoriaTexto: {
    ...tipografia.legenda,
    color: cores.texto.principal,
    textAlign: 'center',
  },
  categoriaTextoAtivo: { color: cores.texto.inverso },

  campos: { gap: espaco['3'] },

  gps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['2'],
    padding: espaco['3'],
  },
  gpsIcone: {
    width: 48,
    height: 48,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTexto: { flex: 1, gap: 2 },
  gpsTitulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  gpsAjuda: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  gpsAcao: { ...tipografia.rotulo, color: cores.marca.azul },

  fotoBotoes: { flexDirection: 'row', gap: espaco['2'] },
  fotoBotao: { flex: 1 },
  previewBox: {
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['2'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['2'],
    gap: espaco['2'],
  },
  preview: { width: '100%', height: 180, borderRadius: raio['1'] },
  remover: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['1'],
  },
  removerTexto: { ...tipografia.rotulo, color: cores.estado.erroTexto },

  urgencias: { flexDirection: 'row', gap: espaco['2'] },
  urgencia: {
    flex: 1,
    minHeight: 64,
    borderRadius: raio['2'],
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco['1'],
    backgroundColor: cores.superficie.base,
  },
  urgenciaTexto: { ...tipografia.rotulo },

  enviar: { marginTop: espaco['1'] },
});
