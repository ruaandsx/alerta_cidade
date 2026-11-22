import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  perguntarAssistente,
  statusAssistente,
  sugestoesAssistente,
} from '../services/assistenteService';

type Mensagem = {
  id: string;
  autor: 'bot' | 'eu';
  texto: string;
  origem?: string;
};

const BOAS_VINDAS =
  'Olá! Sou o assistente do Observa Cidade. Posso explicar como registrar uma ocorrência, ' +
  'acompanhar o status, editar seus registros e usar o suporte. O que você quer saber?';

function rotuloOrigem(origem?: string) {
  if (origem === 'LLM') return 'IA';
  if (origem === 'FAQ') return 'Base de conhecimento';
  if (origem === 'SEM_RESPOSTA') return 'Não encontrado na base';
  return '';
}

export default function AssistenteScreen({ navigation }: any) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: 'boas-vindas', autor: 'bot', texto: BOAS_VINDAS },
  ]);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [motor, setMotor] = useState('base-faq');
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    sugestoesAssistente()
      .then((lista) => setSugestoes((lista || []).slice(0, 4)))
      .catch(() => setSugestoes([]));

    statusAssistente()
      .then((status) => setMotor(status?.motor || 'base-faq'))
      .catch(() => setMotor('base-faq'));
  }, []);

  function rolarParaFim() {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  }

  async function enviar(perguntaDigitada?: string) {
    const pergunta = (perguntaDigitada ?? texto).trim();
    if (!pergunta || enviando) return;

    setMensagens((prev) => [
      ...prev,
      { id: `eu-${Date.now()}`, autor: 'eu', texto: pergunta },
    ]);
    setTexto('');
    setEnviando(true);
    rolarParaFim();

    try {
      const resposta = await perguntarAssistente(pergunta);

      setMensagens((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          autor: 'bot',
          texto: resposta?.resposta || 'Não consegui gerar uma resposta agora.',
          origem: resposta?.origem,
        },
      ]);

      if (Array.isArray(resposta?.sugestoes) && resposta.sugestoes.length > 0) {
        setSugestoes(resposta.sugestoes.slice(0, 4));
      }
    } catch (error) {
      console.log('Erro no assistente:', error);
      setMensagens((prev) => [
        ...prev,
        {
          id: `erro-${Date.now()}`,
          autor: 'bot',
          texto:
            'Não consegui falar com o servidor agora. Verifique sua conexão e tente novamente.',
          origem: 'SEM_RESPOSTA',
        },
      ]);
    } finally {
      setEnviando(false);
      rolarParaFim();
    }
  }

  const rotuloMotor = motor === 'base-faq' ? 'FAQ' : `IA (${motor})`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} hitSlop={10}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Assistente</Text>
          <Text style={styles.subtitle}>Observa Cidade · {rotuloMotor}</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.chat}
          onContentSizeChange={rolarParaFim}
          keyboardShouldPersistTaps="handled"
        >
          {mensagens.map((mensagem) => {
            const doUsuario = mensagem.autor === 'eu';

            return (
              <View
                key={mensagem.id}
                style={[styles.linha, doUsuario ? styles.linhaDireita : styles.linhaEsquerda]}
              >
                <View style={[styles.balao, doUsuario ? styles.balaoUsuario : styles.balaoBot]}>
                  <Text style={doUsuario ? styles.textoUsuario : styles.textoBot}>
                    {mensagem.texto}
                  </Text>

                  {!doUsuario && !!mensagem.origem && (
                    <Text style={styles.origem}>{rotuloOrigem(mensagem.origem)}</Text>
                  )}
                </View>
              </View>
            );
          })}

          {enviando && (
            <View style={[styles.linha, styles.linhaEsquerda]}>
              <View style={[styles.balao, styles.balaoBot, styles.balaoDigitando]}>
                <ActivityIndicator size="small" color="#1565c0" />
                <Text style={styles.digitando}>Consultando...</Text>
              </View>
            </View>
          )}

          {!enviando && sugestoes.length > 0 && (
            <View style={styles.sugestoes}>
              <Text style={styles.sugestoesTitulo}>Perguntas frequentes</Text>

              {sugestoes.map((sugestao) => (
                <TouchableOpacity
                  key={sugestao}
                  style={styles.chip}
                  activeOpacity={0.75}
                  onPress={() => enviar(sugestao)}
                >
                  <Text style={styles.chipTexto}>{sugestao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva sua pergunta..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
            onSubmitEditing={() => enviar()}
            returnKeyType="send"
            editable={!enviando}
          />

          <TouchableOpacity
            style={[styles.sendBtn, (enviando || !texto.trim()) && styles.sendBtnOff]}
            onPress={() => enviar()}
            activeOpacity={0.8}
            disabled={enviando || !texto.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  back: { fontSize: 26, color: '#1a1a2e' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '800', color: '#1a1a2e' },
  subtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },

  chat: { padding: 16, paddingBottom: 24, gap: 10 },

  linha: { flexDirection: 'row' },
  linhaEsquerda: { justifyContent: 'flex-start' },
  linhaDireita: { justifyContent: 'flex-end' },

  balao: { maxWidth: '85%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  balaoBot: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  balaoUsuario: { backgroundColor: '#1565c0', borderTopRightRadius: 4 },
  balaoDigitando: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  textoBot: { fontSize: 14, color: '#1a1a2e', lineHeight: 21 },
  textoUsuario: { fontSize: 14, color: '#fff', lineHeight: 21 },

  origem: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  digitando: { fontSize: 12, color: '#64748b' },

  sugestoes: { marginTop: 6, gap: 8 },
  sugestoesTitulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipTexto: { fontSize: 13, color: '#1565c0', fontWeight: '600' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 42,
    backgroundColor: '#f1f5f9',
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 14,
    color: '#1a1a2e',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565c0',
  },
  sendBtnOff: { backgroundColor: '#94a3b8' },
  sendIcon: { color: '#fff', fontSize: 17 },
});
