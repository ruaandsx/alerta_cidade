import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

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
import { ICONE, type NomeIcone } from '../theme/icones';
import {
  enviarSuporte,
  listarMeusSuportes,
  type Suporte,
} from '../services/suporteService';

type Props = { navigation?: any };

const ASSUNTOS: { rotulo: string; icone: NomeIcone }[] = [
  { rotulo: 'Dúvidas sobre ocorrência', icone: ICONE.documento },
  { rotulo: 'Problemas no aplicativo', icone: 'bug-outline' },
  { rotulo: 'Contas e cadastro', icone: ICONE.perfil },
  { rotulo: 'Notificações', icone: ICONE.notificacoes },
  { rotulo: 'Privacidade e segurança', icone: 'lock-closed-outline' },
  { rotulo: 'Outros assuntos', icone: 'ellipsis-horizontal-circle-outline' },
];

function visualStatus(status?: string): { fundo: string; texto: string; rotulo: string } {
  switch (status) {
    case 'RESPONDIDO':
      return { ...cores.status.resolvido, rotulo: 'Respondido' };
    case 'EM_ANDAMENTO':
      return { ...cores.status.andamento, rotulo: 'Em andamento' };
    case 'FECHADO':
      return {
        fundo: cores.superficie.media,
        texto: cores.texto.secundario,
        rotulo: 'Fechado',
      };
    default:
      return { ...cores.status.analise, rotulo: 'Aguardando resposta' };
  }
}

function dataCurta(valor?: string): string {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleDateString('pt-BR');
}

export default function HelpSupportScreen({ navigation }: Props) {
  const [assunto, setAssunto] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [chamados, setChamados] = useState<Suporte[]>([]);
  const [carregandoChamados, setCarregandoChamados] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarChamados();

    const unsubscribe = navigation?.addListener?.('focus', () => carregarChamados(false));
    return unsubscribe;
  }, [navigation]);

  async function carregarChamados(mostrarLoading = true) {
    try {
      if (mostrarLoading) setCarregandoChamados(true);
      const lista = await listarMeusSuportes();
      setChamados(lista || []);
    } catch {
      setChamados([]);
    } finally {
      setCarregandoChamados(false);
      setAtualizando(false);
    }
  }

  async function enviar() {
    if (assunto === null) {
      setErro('Escolha um assunto antes de enviar.');
      return;
    }

    if (mensagem.trim().length < 10) {
      setErro('Escreva pelo menos 10 caracteres para o suporte entender o caso.');
      return;
    }

    setErro('');

    try {
      setEnviando(true);
      await enviarSuporte(ASSUNTOS[assunto].rotulo, mensagem.trim());
      setMensagem('');
      setAssunto(null);
      await carregarChamados(false);

      Alert.alert(
        'Mensagem enviada',
        'Recebemos seu chamado. A resposta chega em até 24 horas úteis.',
      );
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Não foi possível enviar sua mensagem.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Ajuda e suporte"
        subtitulo="Estamos aqui para ajudar"
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
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregarChamados(false);
              }}
              colors={[cores.marca.azul]}
              tintColor={cores.marca.azul}
            />
          }
        >
          <View style={styles.intro}>
            <View style={styles.introIcone}>
              <Ionicons name={ICONE.ajuda} size={layout.icone['4']} color={cores.marca.azul} />
            </View>
            <View style={styles.introTexto}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.introTitulo}>
                Como podemos ajudar?
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.introDesc}>
                Escolha um assunto e descreva o que aconteceu. Respondemos de segunda a sexta,
                das 8h às 18h.
              </Text>
            </View>
          </View>

          <View style={styles.secao}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
              1. Escolha o assunto
            </Text>

            <View style={styles.grid}>
              {ASSUNTOS.map((item, index) => {
                const ativo = assunto === index;

                return (
                  <Pressable
                    key={item.rotulo}
                    onPress={() => {
                      setAssunto(index);
                      setErro('');
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={item.rotulo}
                    accessibilityState={{ selected: ativo }}
                    style={({ pressed }) => [
                      styles.assunto,
                      ativo ? styles.assuntoAtivo : styles.assuntoInativo,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Ionicons
                      name={item.icone}
                      size={layout.icone['3']}
                      color={ativo ? cores.texto.inverso : cores.marca.azul}
                    />
                    <Text
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      numberOfLines={2}
                      style={[styles.assuntoTexto, ativo && styles.assuntoTextoAtivo]}
                    >
                      {item.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.secao}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
              2. Escreva sua mensagem
            </Text>

            <Campo
              valor={mensagem}
              aoMudar={(texto) => {
                setMensagem(texto);
                if (erro) setErro('');
              }}
              placeholder="Descreva sua dúvida ou problema com o máximo de detalhes."
              multilinha
              maxLength={500}
              ajuda={`${mensagem.length}/500 caracteres`}
              erro={erro || undefined}
              acessibilidadeLabel="Mensagem para o suporte"
            />
          </View>

          <Botao
            titulo="Enviar mensagem"
            icone={ICONE.enviar}
            onPress={enviar}
            carregando={enviando}
          />

          <View style={styles.secao}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
              Seus chamados
            </Text>

            {carregandoChamados ? (
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.vazio}>
                Carregando chamados...
              </Text>
            ) : chamados.length === 0 ? (
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.vazio}>
                Você ainda não abriu nenhum chamado.
              </Text>
            ) : (
              <View style={styles.chamados}>
                {chamados.map((item) => {
                  const visual = visualStatus(item.status);

                  return (
                    <View key={item.id} style={styles.chamado}>
                      <View style={styles.chamadoTopo}>
                        <Text
                          maxFontSizeMultiplier={FONTE_MAXIMA}
                          numberOfLines={1}
                          style={styles.chamadoAssunto}
                        >
                          {item.assunto}
                        </Text>

                        <View style={[styles.selo, { backgroundColor: visual.fundo }]}>
                          <Text
                            maxFontSizeMultiplier={FONTE_MAXIMA}
                            style={[styles.seloTexto, { color: visual.texto }]}
                          >
                            {visual.rotulo}
                          </Text>
                        </View>
                      </View>

                      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.chamadoMensagem}>
                        {item.mensagem}
                      </Text>

                      {item.resposta ? (
                        <View style={styles.resposta}>
                          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.respostaRotulo}>
                            Resposta do suporte
                          </Text>
                          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.respostaTexto}>
                            {item.resposta}
                          </Text>
                        </View>
                      ) : null}

                      <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.chamadoData}>
                        Aberto em {dataCurta(item.dataCriacao)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.atendimento}>
            <Ionicons name="headset-outline" size={layout.icone['3']} color={cores.marca.azul} />
            <View style={styles.atendimentoTexto}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.atendimentoTitulo}>
                Atendimento
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.atendimentoDesc}>
                Segunda a sexta, das 8h às 18h. Resposta em até 24 horas úteis.
              </Text>
            </View>
          </View>
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

  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['3'],
    padding: espaco['4'],
  },
  introIcone: {
    width: 56,
    height: 56,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.base,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  introTexto: { flex: 1, gap: espaco['1'] },
  introTitulo: { ...tipografia.subtitulo, color: cores.texto.principal },
  introDesc: { ...tipografia.corpoPequeno, color: cores.texto.secundario },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco['2'] },
  assunto: {
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 88,
    borderRadius: raio['2'],
    borderWidth: 1,
    padding: espaco['3'],
    gap: espaco['1'],
    justifyContent: 'center',
  },
  assuntoInativo: {
    backgroundColor: cores.superficie.suave,
    borderColor: cores.borda.suave,
  },
  assuntoAtivo: { backgroundColor: cores.marca.azul, borderColor: cores.marca.azul },
  assuntoTexto: { ...tipografia.rotulo, color: cores.texto.principal },
  assuntoTextoAtivo: { color: cores.texto.inverso },

  vazio: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  chamados: { gap: espaco['3'] },
  chamado: {
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['2'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['3'],
    gap: espaco['2'],
  },
  chamadoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco['2'],
  },
  chamadoAssunto: { ...tipografia.corpoForte, color: cores.texto.principal, flex: 1 },
  selo: {
    borderRadius: raio.pill,
    paddingHorizontal: espaco['2'],
    paddingVertical: 3,
    flexShrink: 0,
  },
  seloTexto: { ...tipografia.legenda },
  chamadoMensagem: { ...tipografia.corpoPequeno, color: cores.texto.principal },
  resposta: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['1'],
    padding: espaco['2'],
    gap: 2,
  },
  respostaRotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  respostaTexto: { ...tipografia.corpoPequeno, color: cores.texto.principal },
  chamadoData: { ...tipografia.legendaNormal, color: cores.texto.placeholder },

  atendimento: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['3'],
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['2'],
    padding: espaco['4'],
  },
  atendimentoTexto: { flex: 1, gap: 2 },
  atendimentoTitulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  atendimentoDesc: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
});
