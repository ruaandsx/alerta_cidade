import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import Header from '../components/Header';
import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE } from '../theme/icones';
import {
  perguntarAssistente,
  statusAssistente,
  sugestoesAssistente,
} from '../services/assistenteService';

type Props = { navigation?: any };

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
  if (origem === 'LLM') return 'Respondido por IA';
  if (origem === 'FAQ') return 'Base de conhecimento';
  if (origem === 'SEM_RESPOSTA') return 'Não encontrado na base';
  return '';
}

export default function AssistenteScreen({ navigation }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: 'boas-vindas', autor: 'bot', texto: BOAS_VINDAS },
  ]);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [motor, setMotor] = useState('base-faq');
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

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

    setMensagens((prev) => [...prev, { id: `eu-${Date.now()}`, autor: 'eu', texto: pergunta }]);
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
    } catch {
      setMensagens((prev) => [
        ...prev,
        {
          id: `erro-${Date.now()}`,
          autor: 'bot',
          texto:
            'Não consegui falar com o servidor agora. Confira sua conexão e tente novamente.',
          origem: 'SEM_RESPOSTA',
        },
      ]);
    } finally {
      setEnviando(false);
      rolarParaFim();
    }
  }

  const rotuloMotor = motor === 'base-faq' ? 'Base de conhecimento' : `IA · ${motor}`;
  const podeEnviar = !enviando && !!texto.trim();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Assistente"
        subtitulo={rotuloMotor}
        onVoltar={() => navigation?.goBack?.()}
      />

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
          showsVerticalScrollIndicator={false}
        >
          {mensagens.map((mensagem) => {
            const doUsuario = mensagem.autor === 'eu';

            return (
              <View
                key={mensagem.id}
                style={[styles.linha, doUsuario ? styles.linhaDireita : styles.linhaEsquerda]}
              >
                {!doUsuario ? (
                  <View style={styles.avatarBot}>
                    <Ionicons name={ICONE.assistente} size={layout.icone['2']} color={cores.marca.azul} />
                  </View>
                ) : null}

                <View style={[styles.balao, doUsuario ? styles.balaoUsuario : styles.balaoBot]}>
                  <Text
                    maxFontSizeMultiplier={FONTE_MAXIMA}
                    style={doUsuario ? styles.textoUsuario : styles.textoBot}
                  >
                    {mensagem.texto}
                  </Text>

                  {!doUsuario && !!mensagem.origem ? (
                    <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.origem}>
                      {rotuloOrigem(mensagem.origem)}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}

          {enviando ? (
            <View style={[styles.linha, styles.linhaEsquerda]}>
              <View style={styles.avatarBot}>
                <Ionicons name={ICONE.assistente} size={layout.icone['2']} color={cores.marca.azul} />
              </View>

              <View style={[styles.balao, styles.balaoBot, styles.digitando]}>
                <ActivityIndicator size="small" color={cores.marca.azul} />
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.digitandoTexto}>
                  Consultando...
                </Text>
              </View>
            </View>
          ) : null}

          {!enviando && sugestoes.length > 0 ? (
            <View style={styles.sugestoes}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.sugestoesTitulo}>
                Perguntas frequentes
              </Text>

              {sugestoes.map((sugestao) => (
                <Pressable
                  key={sugestao}
                  onPress={() => enviar(sugestao)}
                  accessibilityRole="button"
                  accessibilityLabel={`Perguntar: ${sugestao}`}
                  style={({ pressed }) => [styles.sugestao, pressed && { opacity: 0.75 }]}
                >
                  <Ionicons name="chatbubble-outline" size={layout.icone['1']} color={cores.marca.azul} />
                  <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.sugestaoTexto}>
                    {sugestao}
                  </Text>
                  <Ionicons name={ICONE.avancar} size={layout.icone['1']} color={cores.texto.secundario} />
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.barra}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva sua pergunta..."
            placeholderTextColor={cores.texto.placeholder}
            multiline
            maxLength={500}
            maxFontSizeMultiplier={FONTE_MAXIMA}
            onSubmitEditing={() => enviar()}
            returnKeyType="send"
            editable={!enviando}
            accessibilityLabel="Campo de pergunta para o assistente"
            style={styles.entrada}
          />

          <Pressable
            onPress={() => enviar()}
            disabled={!podeEnviar}
            accessibilityRole="button"
            accessibilityLabel="Enviar pergunta"
            accessibilityState={{ disabled: !podeEnviar, busy: enviando }}
            hitSlop={4}
            style={({ pressed }) => [
              styles.enviar,
              !podeEnviar && styles.enviarInativo,
              pressed && podeEnviar && { opacity: 0.85 },
            ]}
          >
            <Ionicons name={ICONE.enviar} size={layout.icone['2']} color={cores.texto.inverso} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  flex: { flex: 1 },
  chat: {
    padding: espaco['4'],
    paddingBottom: espaco['6'],
    gap: espaco['3'],
  },

  linha: { flexDirection: 'row', alignItems: 'flex-end', gap: espaco['2'] },
  linhaEsquerda: { justifyContent: 'flex-start' },
  linhaDireita: { justifyContent: 'flex-end' },

  avatarBot: {
    width: 32,
    height: 32,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  balao: {
    maxWidth: '82%',
    borderRadius: raio['3'],
    paddingHorizontal: espaco['3'],
    paddingVertical: espaco['2'],
    gap: espaco['1'],
  },
  balaoBot: {
    backgroundColor: cores.superficie.base,
    borderWidth: 1,
    borderColor: cores.borda.suave,
    borderBottomLeftRadius: raio['1'],
  },
  balaoUsuario: {
    backgroundColor: cores.marca.azul,
    borderBottomRightRadius: raio['1'],
  },
  textoBot: { ...tipografia.corpoPequeno, color: cores.texto.principal },
  textoUsuario: { ...tipografia.corpoPequeno, color: cores.texto.inverso },
  origem: {
    ...tipografia.legenda,
    color: cores.texto.placeholder,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 2,
  },

  digitando: { flexDirection: 'row', alignItems: 'center', gap: espaco['2'] },
  digitandoTexto: { ...tipografia.corpoPequeno, color: cores.texto.secundario },

  sugestoes: { gap: espaco['2'], marginTop: espaco['2'] },
  sugestoesTitulo: {
    ...tipografia.legenda,
    color: cores.texto.secundario,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sugestao: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['2'],
    backgroundColor: cores.superficie.base,
    borderRadius: raio['2'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    paddingHorizontal: espaco['3'],
    paddingVertical: espaco['2'],
  },
  sugestaoTexto: { ...tipografia.corpoPequeno, color: cores.marca.azulEscuro, flex: 1 },

  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espaco['2'],
    paddingHorizontal: espaco['3'],
    paddingVertical: espaco['2'],
    backgroundColor: cores.superficie.base,
    borderTopWidth: 1,
    borderTopColor: cores.borda.suave,
  },
  entrada: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: cores.superficie.media,
    borderRadius: raio['3'],
    paddingHorizontal: espaco['4'],
    paddingVertical: espaco['3'],
    ...tipografia.corpoPequeno,
    color: cores.texto.principal,
  },
  enviar: {
    width: 48,
    height: 48,
    borderRadius: raio.pill,
    backgroundColor: cores.marca.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enviarInativo: { backgroundColor: cores.estado.desabilitadoBorda },
});
