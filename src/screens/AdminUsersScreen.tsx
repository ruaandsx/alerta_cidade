import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import BotaoIcone from '../components/BotaoIcone';
import Campo from '../components/Campo';
import Header from '../components/Header';
import { Carregando, ErroLista, Vazio } from '../components/Estados';
import { SeloPapel } from '../components/Selos';
import {
  FONTE_MAXIMA,
  cores,
  elevacao,
  espaco,
  layout,
  raio,
  tipografia,
} from '../theme/tokens';
import { ICONE } from '../theme/icones';
import {
  listarUsuarios,
  deletarUsuario,
  tornarAdmin,
  UsuarioAdmin,
} from '../services/adminService';

type Props = { navigation?: any };

export default function AdminUsersScreen({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    carregar();

    const unsubscribe = navigation?.addListener?.('focus', carregar);
    return unsubscribe;
  }, [navigation]);

  async function carregar() {
    try {
      setCarregando(true);
      setErro(false);
      const data = await listarUsuarios();
      setUsuarios(data || []);
    } catch (e) {
      console.log('Erro ao carregar usuários:', e);
      setUsuarios([]);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  function confirmarExcluir(usuario: UsuarioAdmin) {
    Alert.alert('Excluir usuário', `Deseja excluir ${usuario.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarUsuario(usuario.id);
            carregar();
          } catch {
            Alert.alert(
              'Erro',
              'Não foi possível excluir o usuário. Ele pode possuir ocorrências vinculadas.',
            );
          }
        },
      },
    ]);
  }

  async function promover(usuario: UsuarioAdmin) {
    try {
      await tornarAdmin(usuario.id);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível alterar o usuário para admin.');
    }
  }

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      (u.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(busca.toLowerCase()),
  );

  const admins = usuarios.filter((u) => u.role === 'ADMIN').length;
  const comuns = usuarios.filter((u) => u.role !== 'ADMIN').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        adm
        acoes={
          <>
            <BotaoIcone
              icone={ICONE.adicionar}
              rotulo="Adicionar usuário"
              onPress={() => navigation?.navigate?.('AddUserStep1')}
              variante="azul"
            />
            <BotaoIcone icone={ICONE.atualizar} rotulo="Atualizar lista" onPress={carregar} />
          </>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.tituloBloco}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.titulo}>
            Usuários
          </Text>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.descricao}>
            Gerencie as contas e as permissões de acesso.
          </Text>
        </View>

        <View style={styles.resumo}>
          <View style={styles.resumoItem}>
            <Ionicons name={ICONE.usuarios} size={layout.icone['2']} color={cores.marca.azul} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {usuarios.length}
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Total
            </Text>
          </View>

          <View style={styles.resumoDivisor} />

          <View style={styles.resumoItem}>
            <Ionicons name={ICONE.escudo} size={layout.icone['2']} color={cores.marca.azulEscuro} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {admins}
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Admins
            </Text>
          </View>

          <View style={styles.resumoDivisor} />

          <View style={styles.resumoItem}>
            <Ionicons name={ICONE.perfil} size={layout.icone['2']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
              {comuns}
            </Text>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
              Cidadãos
            </Text>
          </View>
        </View>

        <Campo
          valor={busca}
          aoMudar={setBusca}
          placeholder="Buscar por nome ou e-mail"
          icone={ICONE.busca}
          capitalizacao="none"
          acessibilidadeLabel="Buscar usuário por nome ou e-mail"
        />

        {carregando ? (
          <Carregando texto="Carregando usuários..." />
        ) : erro ? (
          <ErroLista
            descricao="Não conseguimos buscar a lista de usuários."
            aoTentarDeNovo={carregar}
          />
        ) : usuariosFiltrados.length === 0 ? (
          <Vazio
            titulo="Nenhum usuário encontrado"
            descricao={busca ? 'Tente outro nome ou e-mail.' : 'Ainda não há usuários cadastrados.'}
            icone={ICONE.usuarios}
          />
        ) : (
          <View style={styles.lista}>
            {usuariosFiltrados.map((usuario, index) => {
              const admin = usuario.role === 'ADMIN';

              return (
                <View
                  key={usuario.id}
                  style={[styles.linha, index < usuariosFiltrados.length - 1 && styles.linhaBorda]}
                >
                  <View style={[styles.avatar, admin ? styles.avatarAdmin : styles.avatarCidadao]}>
                    <Text
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      style={[styles.avatarTexto, admin ? styles.avatarTextoAdmin : styles.avatarTextoCidadao]}
                    >
                      {(usuario.nome || 'U').substring(0, 2).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.info}>
                    <Text
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      numberOfLines={1}
                      style={styles.nome}
                    >
                      {usuario.nome || 'Usuário'}
                    </Text>
                    <Text
                      maxFontSizeMultiplier={FONTE_MAXIMA}
                      numberOfLines={1}
                      style={styles.email}
                    >
                      {usuario.email}
                    </Text>

                    <View style={styles.acoesLinha}>
                      <SeloPapel papel={usuario.role} />

                      {!admin ? (
                        <Pressable
                          onPress={() => promover(usuario)}
                          accessibilityRole="button"
                          accessibilityLabel={`Tornar ${usuario.nome} administrador`}
                          hitSlop={4}
                          style={({ pressed }) => [
                            styles.promover,
                            pressed && { opacity: 0.7 },
                          ]}
                        >
                          <Ionicons
                            name={ICONE.escudo}
                            size={layout.icone['1']}
                            color={cores.marca.azul}
                          />
                          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.promoverTexto}>
                            Tornar admin
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>

                  <Pressable
                    onPress={() => confirmarExcluir(usuario)}
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir ${usuario.nome}`}
                    hitSlop={4}
                    style={({ pressed }) => [styles.excluir, pressed && { opacity: 0.6 }]}
                  >
                    <Ionicons
                      name={ICONE.excluir}
                      size={layout.icone['2']}
                      color={cores.estado.erroTexto}
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <BarraInferior tipo="admin" ativo="usuarios" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingTop: espaco['4'],
    paddingBottom: espaco['6'],
    gap: espaco['4'],
  },
  tituloBloco: { gap: espaco['1'] },
  titulo: { ...tipografia.tituloTela, color: cores.texto.principal },
  descricao: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    paddingVertical: espaco['4'],
    ...elevacao[1],
  },
  resumoItem: { flex: 1, alignItems: 'center', gap: 2 },
  resumoDivisor: { width: 1, height: 48, backgroundColor: cores.borda.suave },
  resumoValor: { ...tipografia.tituloTela, color: cores.texto.principal },
  resumoRotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  lista: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    overflow: 'hidden',
    ...elevacao[1],
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco['3'],
    padding: espaco['3'],
  },
  linhaBorda: { borderBottomWidth: 1, borderBottomColor: cores.borda.suave },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: raio.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarAdmin: { backgroundColor: cores.marca.azul },
  avatarCidadao: { backgroundColor: cores.superficie.azul },
  avatarTexto: { ...tipografia.rotulo },
  avatarTextoAdmin: { color: cores.texto.inverso },
  avatarTextoCidadao: { color: cores.marca.azulEscuro },
  info: { flex: 1, gap: 2 },
  nome: { ...tipografia.corpoForte, color: cores.texto.principal },
  email: { ...tipografia.corpoPequeno, color: cores.texto.secundario },
  acoesLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: espaco['2'],
    marginTop: espaco['1'],
  },
  promover: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['1'],
    paddingHorizontal: espaco['2'],
    paddingVertical: espaco['1'],
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.azul,
  },
  promoverTexto: { ...tipografia.legenda, color: cores.marca.azulEscuro },
  excluir: {
    width: 40,
    height: 40,
    borderRadius: raio.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
