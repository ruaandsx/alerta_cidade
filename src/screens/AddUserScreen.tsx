import React, { useState } from 'react';
import {
  Alert,
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
import { criarUsuario, type NovoUsuario } from '../services/adminService';

type Props = { navigation?: any; route?: any };

const PASSOS = ['Dados', 'Tipo', 'Confirmar'];

const PERMISSOES_CIDADAO: { icone: NomeIcone; rotulo: string }[] = [
  { icone: ICONE.ocorrencias, rotulo: 'Registrar ocorrências' },
  { icone: ICONE.assistente, rotulo: 'Comentar nas ocorrências' },
  { icone: ICONE.historico, rotulo: 'Acompanhar as próprias ocorrências' },
  { icone: ICONE.ajuda, rotulo: 'Abrir chamados no suporte' },
];

const PERMISSOES_ADMIN: { icone: NomeIcone; rotulo: string }[] = [
  { icone: ICONE.ocorrencias, rotulo: 'Tudo que o cidadão faz' },
  { icone: ICONE.pendente, rotulo: 'Analisar e mudar o status das ocorrências' },
  { icone: ICONE.usuarios, rotulo: 'Gerenciar usuários e permissões' },
  { icone: ICONE.escudo, rotulo: 'Responder chamados do suporte' },
];

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'US';
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function Stepper({ passo }: { passo: number }) {
  return (
    <View style={styles.stepper} accessibilityLabel={`Passo ${passo} de 3`}>
      {PASSOS.map((rotulo, indice) => {
        const numero = indice + 1;
        const ativo = numero === passo;
        const concluido = numero < passo;

        return (
          <React.Fragment key={rotulo}>
            <View style={styles.passo}>
              <View
                style={[
                  styles.passoCirculo,
                  (ativo || concluido) && styles.passoCirculoAtivo,
                ]}
              >
                {concluido ? (
                  <Ionicons name="checkmark" size={layout.icone['1']} color={cores.texto.inverso} />
                ) : (
                  <Text
                    maxFontSizeMultiplier={FONTE_MAXIMA}
                    style={[styles.passoNumero, ativo && styles.passoNumeroAtivo]}
                  >
                    {numero}
                  </Text>
                )}
              </View>
              <Text
                maxFontSizeMultiplier={FONTE_MAXIMA}
                numberOfLines={1}
                style={[styles.passoRotulo, ativo && styles.passoRotuloAtivo]}
              >
                {rotulo}
              </Text>
            </View>

            {indice < PASSOS.length - 1 ? (
              <View style={[styles.linha, concluido && styles.linhaAtiva]} />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ── Passo 1: dados ────────────────────────────────────────────────────────────
export function AddUserStep1({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [erros, setErros] = useState<{ nome?: string; email?: string; senha?: string }>({});

  function avancar() {
    const novos: typeof erros = {};

    if (nome.trim().length < 3) novos.nome = 'Informe o nome completo (mínimo 3 letras).';
    if (!email.includes('@')) novos.email = 'Confira o e-mail informado.';
    if (senha.length < 6) novos.senha = 'A senha precisa ter pelo menos 6 caracteres.';

    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    navigation?.navigate?.('AddUserStep2', {
      dados: {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        telefone: telefone.trim() || undefined,
        cidade: cidade.trim() || undefined,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Adicionar usuário"
        subtitulo="Passo 1 de 3 · Dados pessoais"
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
          <Stepper passo={1} />

          <View style={styles.cartao}>
            <View style={styles.previa}>
              <View style={styles.previaAvatar}>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.previaTexto}>
                  {iniciais(nome)}
                </Text>
              </View>
              <View style={styles.previaInfo}>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.previaNome}>
                  {nome.trim() || 'Novo usuário'}
                </Text>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.previaEmail}>
                  {email.trim() || 'O e-mail será o login'}
                </Text>
              </View>
            </View>

            <View style={styles.formulario}>
              <Campo
                rotulo="Nome completo"
                valor={nome}
                aoMudar={(texto) => {
                  setNome(texto);
                  if (erros.nome) setErros((e) => ({ ...e, nome: undefined }));
                }}
                placeholder="Nome e sobrenome"
                icone={ICONE.perfil}
                capitalizacao="words"
                erro={erros.nome}
                acessibilidadeLabel="Nome completo do novo usuário"
              />

              <Campo
                rotulo="E-mail"
                valor={email}
                aoMudar={(texto) => {
                  setEmail(texto);
                  if (erros.email) setErros((e) => ({ ...e, email: undefined }));
                }}
                placeholder="usuario@exemplo.com"
                icone={ICONE.email}
                teclado="email-address"
                capitalizacao="none"
                erro={erros.email}
                acessibilidadeLabel="E-mail do novo usuário"
              />

              <Campo
                rotulo="Senha inicial"
                valor={senha}
                aoMudar={(texto) => {
                  setSenha(texto);
                  if (erros.senha) setErros((e) => ({ ...e, senha: undefined }));
                }}
                placeholder="Mínimo de 6 caracteres"
                seguro
                capitalizacao="none"
                ajuda="O usuário pode trocar depois em Meus dados."
                erro={erros.senha}
                acessibilidadeLabel="Senha inicial do novo usuário"
              />

              <Campo
                rotulo="Telefone"
                valor={telefone}
                aoMudar={setTelefone}
                placeholder="Opcional"
                icone={ICONE.telefone}
                teclado="phone-pad"
                acessibilidadeLabel="Telefone do novo usuário"
              />

              <Campo
                rotulo="Cidade"
                valor={cidade}
                aoMudar={setCidade}
                placeholder="Opcional"
                icone={ICONE.localizacao}
                capitalizacao="words"
                acessibilidadeLabel="Cidade do novo usuário"
              />
            </View>
          </View>

          <View style={styles.botoes}>
            <Botao
              titulo="Cancelar"
              variante="secundario"
              onPress={() => navigation?.goBack?.()}
              larguraTotal={false}
              estilo={styles.botaoMetade}
            />
            <Botao
              titulo="Próximo"
              icone={ICONE.avancar}
              onPress={avancar}
              larguraTotal={false}
              estilo={styles.botaoMetade}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Passo 2: tipo e permissões ────────────────────────────────────────────────
export function AddUserStep2({ navigation, route }: Props) {
  const dados: NovoUsuario | undefined = route?.params?.dados;
  const [tipo, setTipo] = useState<'USER' | 'ADMIN'>('USER');

  const permissoes = tipo === 'ADMIN' ? PERMISSOES_ADMIN : PERMISSOES_CIDADAO;

  function avancar() {
    navigation?.navigate?.('AddUserStep3', { dados, tipo });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Adicionar usuário"
        subtitulo="Passo 2 de 3 · Tipo de acesso"
        onVoltar={() => navigation?.goBack?.()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Stepper passo={2} />

        <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.rotuloSecao}>
          O que este usuário poderá fazer?
        </Text>

        {(['USER', 'ADMIN'] as const).map((opcao) => {
          const admin = opcao === 'ADMIN';
          const ativo = tipo === opcao;

          return (
            <Pressable
              key={opcao}
              onPress={() => setTipo(opcao)}
              accessibilityRole="radio"
              accessibilityLabel={admin ? 'Administrador' : 'Cidadão'}
              accessibilityState={{ checked: ativo }}
              style={({ pressed }) => [
                styles.tipoCartao,
                ativo && styles.tipoCartaoAtivo,
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={[styles.tipoIcone, admin ? styles.tipoIconeAdmin : styles.tipoIconeUser]}>
                <Ionicons
                  name={admin ? ICONE.escudo : ICONE.perfil}
                  size={layout.icone['3']}
                  color={admin ? cores.texto.inverso : cores.marca.azul}
                />
              </View>

              <View style={styles.tipoInfo}>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.tipoNome}>
                  {admin ? 'Administrador' : 'Cidadão'}
                </Text>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.tipoDesc}>
                  {admin
                    ? 'Acesso à gestão: analisa ocorrências, gerencia usuários e responde o suporte.'
                    : 'Acesso comum: registra e acompanha as próprias ocorrências.'}
                </Text>
              </View>

              <View style={[styles.radio, ativo && styles.radioAtivo]}>
                {ativo ? <View style={styles.radioPonto} /> : null}
              </View>
            </Pressable>
          );
        })}

        <View style={styles.permissoes}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.permissoesTitulo}>
            Permissões {tipo === 'ADMIN' ? 'do administrador' : 'do cidadão'}
          </Text>

          {permissoes.map((item) => (
            <View key={item.rotulo} style={styles.permissao}>
              <Ionicons name={item.icone} size={layout.icone['2']} color={cores.marca.azul} />
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.permissaoTexto}>
                {item.rotulo}
              </Text>
              <Ionicons name="checkmark-circle" size={layout.icone['2']} color={cores.estado.sucessoGrafico} />
            </View>
          ))}
        </View>

        <View style={styles.botoes}>
          <Botao
            titulo="Voltar"
            variante="secundario"
            onPress={() => navigation?.goBack?.()}
            larguraTotal={false}
            estilo={styles.botaoMetade}
          />
          <Botao
            titulo="Próximo"
            icone={ICONE.avancar}
            onPress={avancar}
            larguraTotal={false}
            estilo={styles.botaoMetade}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Passo 3: confirmação ──────────────────────────────────────────────────────
export function AddUserStep3({ navigation, route }: Props) {
  const dados: NovoUsuario | undefined = route?.params?.dados;
  const tipo: 'USER' | 'ADMIN' = route?.params?.tipo || 'USER';
  const [criando, setCriando] = useState(false);

  async function confirmar() {
    if (!dados) {
      Alert.alert('Dados perdidos', 'Volte ao primeiro passo e preencha novamente.');
      navigation?.navigate?.('AddUserStep1');
      return;
    }

    try {
      setCriando(true);

      await criarUsuario(dados, tipo === 'ADMIN');

      Alert.alert(
        'Usuário criado',
        `${dados.nome} já pode entrar com o e-mail ${dados.email}.` +
          (tipo === 'ADMIN' ? '\n\nA conta foi criada como administrador.' : ''),
        [{ text: 'OK', onPress: () => navigation?.navigate?.('AdminUsers') }],
      );
    } catch (e: any) {
      const mensagem =
        e?.status === 409
          ? 'Já existe uma conta com este e-mail.'
          : e?.message || 'Não foi possível criar o usuário.';

      Alert.alert('Erro ao criar usuário', mensagem);
    } finally {
      setCriando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Adicionar usuário"
        subtitulo="Passo 3 de 3 · Confirmar"
        onVoltar={() => navigation?.goBack?.()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Stepper passo={3} />

        <View style={styles.resumo}>
          <View style={styles.resumoTopo}>
            <View style={styles.previaAvatar}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.previaTexto}>
                {iniciais(dados?.nome || '')}
              </Text>
            </View>

            <View style={styles.resumoInfo}>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoNome}>
                {dados?.nome || 'Novo usuário'}
              </Text>
              <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoEmail}>
                {dados?.email || 'sem e-mail'}
              </Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.resumoLinha}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Tipo de acesso
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {tipo === 'ADMIN' ? 'Administrador' : 'Cidadão'}
            </Text>
          </View>

          <View style={styles.resumoLinha}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Telefone
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {dados?.telefone || 'Não informado'}
            </Text>
          </View>

          <View style={styles.resumoLinha}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Cidade
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {dados?.cidade || 'Não informada'}
            </Text>
          </View>
        </View>

        <View style={styles.aviso}>
          <Ionicons name={ICONE.escudo} size={layout.icone['2']} color={cores.marca.azulEscuro} />
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.avisoTexto}>
            A senha informada no passo 1 será a senha inicial. Combine com o usuário para ele
            trocar no primeiro acesso.
          </Text>
        </View>

        <View style={styles.botoes}>
          <Botao
            titulo="Voltar"
            variante="secundario"
            onPress={() => navigation?.goBack?.()}
            larguraTotal={false}
            estilo={styles.botaoMetade}
          />
          <Botao
            titulo={criando ? 'Criando...' : 'Confirmar'}
            icone="checkmark"
            onPress={confirmar}
            carregando={criando}
            larguraTotal={false}
            estilo={styles.botaoMetade}
          />
        </View>
      </ScrollView>
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

  stepper: { flexDirection: 'row', alignItems: 'flex-start' },
  passo: { alignItems: 'center', gap: espaco['1'], width: 84 },
  passoCirculo: {
    width: 32,
    height: 32,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.media,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passoCirculoAtivo: { backgroundColor: cores.marca.azul },
  passoNumero: { ...tipografia.rotulo, color: cores.texto.secundario },
  passoNumeroAtivo: { color: cores.texto.inverso },
  passoRotulo: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  passoRotuloAtivo: { color: cores.marca.azul, fontWeight: '600' },
  linha: {
    flex: 1,
    height: 2,
    backgroundColor: cores.borda.suave,
    marginTop: 15,
  },
  linhaAtiva: { backgroundColor: cores.marca.azul },

  cartao: { gap: espaco['4'] },
  previa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['3'],
    padding: espaco['4'],
  },
  previaAvatar: {
    width: 56,
    height: 56,
    borderRadius: raio.pill,
    backgroundColor: cores.marca.azul,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previaTexto: { ...tipografia.corpoForte, color: cores.texto.inverso },
  previaInfo: { flex: 1, gap: 2 },
  previaNome: { ...tipografia.corpoForte, color: cores.texto.principal },
  previaEmail: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  formulario: { gap: espaco['4'] },

  rotuloSecao: { ...tipografia.tituloSecao, color: cores.texto.principal },

  tipoCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 2,
    borderColor: cores.borda.suave,
    padding: espaco['3'],
  },
  tipoCartaoAtivo: { borderColor: cores.marca.azul, backgroundColor: cores.superficie.suave },
  tipoIcone: {
    width: 48,
    height: 48,
    borderRadius: raio.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipoIconeUser: { backgroundColor: cores.superficie.azul },
  tipoIconeAdmin: { backgroundColor: cores.marca.azul },
  tipoInfo: { flex: 1, gap: 2 },
  tipoNome: { ...tipografia.corpoForte, color: cores.texto.principal },
  tipoDesc: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  radio: {
    width: 24,
    height: 24,
    borderRadius: raio.pill,
    borderWidth: 2,
    borderColor: cores.borda.forte,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioAtivo: { borderColor: cores.marca.azul },
  radioPonto: {
    width: 12,
    height: 12,
    borderRadius: raio.pill,
    backgroundColor: cores.marca.azul,
  },

  permissoes: {
    backgroundColor: cores.superficie.suave,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
  },
  permissoesTitulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  permissao: { flexDirection: 'row', alignItems: 'center', gap: espaco['2'] },
  permissaoTexto: { ...tipografia.corpoPequeno, color: cores.texto.principal, flex: 1 },

  resumo: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
  },
  resumoTopo: { flexDirection: 'row', alignItems: 'center', gap: espaco['3'] },
  resumoInfo: { flex: 1, gap: 2 },
  resumoNome: { ...tipografia.tituloSecao, color: cores.texto.principal },
  resumoEmail: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  divisor: { height: 1, backgroundColor: cores.borda.suave },
  resumoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco['3'],
  },
  resumoRotulo: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  resumoValor: { ...tipografia.corpoPequeno, color: cores.texto.principal, textAlign: 'right', flexShrink: 1 },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['2'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['2'],
    padding: espaco['3'],
  },
  avisoTexto: { ...tipografia.corpoPequeno, color: cores.texto.secundario, flex: 1 },

  botoes: { flexDirection: 'row', gap: espaco['3'] },
  botaoMetade: { flex: 1 },
});
