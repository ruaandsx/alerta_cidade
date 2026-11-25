import React, { useEffect, useState } from 'react';
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

import BarraInferior from '../components/BarraInferior';
import Botao from '../components/Botao';
import Campo from '../components/Campo';
import Header from '../components/Header';
import { SeloPapel } from '../components/Selos';
import {
  FONTE_MAXIMA,
  cores,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE } from '../theme/icones';
import { useUsuarioLogado } from '../hooks/useUsuarioLogado';
import { alterarSenha, atualizarUsuarioLogado } from '../services/authService';

type Props = { navigation?: any };

export default function MyDataScreen({ navigation }: Props) {
  const { usuario, carregando, recarregarUsuario } = useUsuarioLogado();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [cidade, setCidade] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroNome, setErroNome] = useState('');

  const [abrirSenha, setAbrirSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState<{ atual?: string; nova?: string; confirmar?: string }>({});

  useEffect(() => {
    if (!usuario) return;

    setNome(usuario.nome || '');
    setTelefone(usuario.telefone || '');
    setNascimento(usuario.nascimento || '');
    setCidade(usuario.cidade || '');
  }, [usuario]);

  async function salvar() {
    if (nome.trim().length < 3) {
      setErroNome('Informe seu nome completo (mínimo 3 letras).');
      return;
    }

    setErroNome('');

    try {
      setSalvando(true);

      await atualizarUsuarioLogado({
        nome: nome.trim(),
        telefone: telefone.trim() || undefined,
        nascimento: nascimento.trim() || undefined,
        cidade: cidade.trim() || undefined,
      });

      await recarregarUsuario();
      Alert.alert('Dados salvos', 'Suas informações foram atualizadas.');
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Não foi possível salvar seus dados.');
    } finally {
      setSalvando(false);
    }
  }

  async function trocarSenha() {
    const novos: typeof erroSenha = {};

    if (!senhaAtual) novos.atual = 'Informe a senha atual.';
    if (novaSenha.length < 6) novos.nova = 'A nova senha precisa ter pelo menos 6 caracteres.';
    if (confirmarSenha !== novaSenha) novos.confirmar = 'As senhas não coincidem.';
    if (novaSenha && novaSenha === senhaAtual) {
      novos.nova = 'Escolha uma senha diferente da atual.';
    }

    setErroSenha(novos);
    if (Object.keys(novos).length > 0) return;

    try {
      setSalvandoSenha(true);
      await alterarSenha(senhaAtual, novaSenha);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setAbrirSenha(false);
      Alert.alert('Senha alterada', 'Use a nova senha no próximo acesso.');
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Não foi possível alterar a senha.');
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Meus dados"
        subtitulo="Informações pessoais e de contato"
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
          <View style={styles.perfil}>
            <View style={styles.avatar}>
              <Ionicons name={ICONE.perfilAtivo} size={40} color={cores.marca.azul} />
            </View>

            <View style={styles.perfilInfo}>
              <Text
                maxFontSizeMultiplier={FONTE_MAXIMA}
                numberOfLines={1}
                style={styles.perfilNome}
              >
                {carregando ? 'Carregando...' : usuario?.nome || 'Usuário'}
              </Text>
              <Text
                maxFontSizeMultiplier={FONTE_MAXIMA}
                numberOfLines={1}
                style={styles.perfilEmail}
              >
                {usuario?.email || ''}
              </Text>

              {usuario?.role ? (
                <View style={styles.papel}>
                  <SeloPapel papel={usuario.role} />
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.formulario}>
            <Campo
              rotulo="Nome completo"
              valor={nome}
              aoMudar={(texto) => {
                setNome(texto);
                if (erroNome) setErroNome('');
              }}
              placeholder="Como você quer ser chamado"
              icone={ICONE.perfil}
              capitalizacao="words"
              erro={erroNome || undefined}
              acessibilidadeLabel="Campo de nome completo"
            />

            <Campo
              rotulo="E-mail"
              valor={usuario?.email || ''}
              aoMudar={() => {}}
              editavel={false}
              icone={ICONE.email}
              ajuda="O e-mail de acesso não pode ser alterado por aqui."
              acessibilidadeLabel="E-mail da conta"
            />

            <Campo
              rotulo="Telefone"
              valor={telefone}
              aoMudar={setTelefone}
              placeholder="(81) 99999-9999"
              icone={ICONE.telefone}
              teclado="phone-pad"
              acessibilidadeLabel="Campo de telefone"
            />

            <Campo
              rotulo="Data de nascimento"
              valor={nascimento}
              aoMudar={setNascimento}
              placeholder="dd/mm/aaaa"
              icone="calendar-outline"
              teclado="numbers-and-punctuation"
              acessibilidadeLabel="Data de nascimento"
            />

            <Campo
              rotulo="Cidade"
              valor={cidade}
              aoMudar={setCidade}
              placeholder="Onde você mora"
              icone={ICONE.localizacao}
              capitalizacao="words"
              acessibilidadeLabel="Cidade"
            />
          </View>

          <Botao
            titulo={salvando ? 'Salvando...' : 'Salvar alterações'}
            icone="checkmark"
            onPress={salvar}
            carregando={salvando}
          />

          <View style={styles.senhaCard}>
            <Pressable
              onPress={() => setAbrirSenha((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Alterar senha"
              accessibilityState={{ expanded: abrirSenha }}
              style={({ pressed }) => [styles.senhaTopo, pressed && { opacity: 0.75 }]}
            >
              <View style={styles.senhaIcone}>
                <Ionicons name="lock-closed-outline" size={layout.icone['2']} color={cores.marca.azul} />
              </View>

              <View style={styles.senhaTexto}>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.senhaTitulo}>
                  Alterar senha
                </Text>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.senhaDesc}>
                  {abrirSenha ? 'Preencha para trocar' : 'Proteja o acesso à sua conta'}
                </Text>
              </View>

              <Ionicons
                name={abrirSenha ? 'chevron-up' : 'chevron-down'}
                size={layout.icone['2']}
                color={cores.texto.secundario}
              />
            </Pressable>

            {abrirSenha ? (
              <View style={styles.senhaForm}>
                <Campo
                  rotulo="Senha atual"
                  valor={senhaAtual}
                  aoMudar={(texto) => {
                    setSenhaAtual(texto);
                    if (erroSenha.atual) setErroSenha((e) => ({ ...e, atual: undefined }));
                  }}
                  placeholder="Sua senha de hoje"
                  seguro
                  capitalizacao="none"
                  erro={erroSenha.atual}
                  acessibilidadeLabel="Senha atual"
                />

                <Campo
                  rotulo="Nova senha"
                  valor={novaSenha}
                  aoMudar={(texto) => {
                    setNovaSenha(texto);
                    if (erroSenha.nova) setErroSenha((e) => ({ ...e, nova: undefined }));
                  }}
                  placeholder="Mínimo de 6 caracteres"
                  seguro
                  capitalizacao="none"
                  ajuda="Use pelo menos 6 caracteres."
                  erro={erroSenha.nova}
                  acessibilidadeLabel="Nova senha"
                />

                <Campo
                  rotulo="Confirmar nova senha"
                  valor={confirmarSenha}
                  aoMudar={(texto) => {
                    setConfirmarSenha(texto);
                    if (erroSenha.confirmar) setErroSenha((e) => ({ ...e, confirmar: undefined }));
                  }}
                  placeholder="Repita a nova senha"
                  seguro
                  capitalizacao="none"
                  erro={erroSenha.confirmar}
                  aoEnviar={trocarSenha}
                  acessibilidadeLabel="Confirmar nova senha"
                />

                <Botao
                  titulo={salvandoSenha ? 'Alterando...' : 'Alterar senha'}
                  variante="secundario"
                  onPress={trocarSenha}
                  carregando={salvandoSenha}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.aviso}>
            <Ionicons name={ICONE.escudo} size={layout.icone['2']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.avisoTexto}>
              Seus dados são usados apenas para o atendimento das ocorrências e não são
              compartilhados com terceiros.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraInferior ativo="perfil" navigation={navigation} />
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

  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['4'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['3'],
    padding: espaco['4'],
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.base,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  perfilInfo: { flex: 1, gap: 2 },
  perfilNome: { ...tipografia.tituloSecao, color: cores.texto.principal },
  perfilEmail: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  papel: { marginTop: espaco['1'] },

  formulario: { gap: espaco['4'] },

  senhaCard: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    overflow: 'hidden',
  },
  senhaTopo: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    paddingHorizontal: espaco['4'],
    paddingVertical: espaco['3'],
  },
  senhaIcone: {
    width: 40,
    height: 40,
    borderRadius: raio['2'],
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  senhaTexto: { flex: 1, gap: 2 },
  senhaTitulo: { ...tipografia.corpoForte, color: cores.texto.principal },
  senhaDesc: { ...tipografia.legendaNormal, color: cores.texto.secundario },
  senhaForm: {
    gap: espaco['4'],
    paddingHorizontal: espaco['4'],
    paddingBottom: espaco['4'],
    paddingTop: espaco['1'],
    borderTopWidth: 1,
    borderTopColor: cores.borda.suave,
  },

  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['2'],
    paddingHorizontal: espaco['2'],
  },
  avisoTexto: { ...tipografia.legendaNormal, color: cores.texto.secundario, flex: 1 },
});
