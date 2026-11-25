import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import BarraInferior from '../components/BarraInferior';
import Botao from '../components/Botao';
import Header from '../components/Header';
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
import { ICONE, type NomeIcone } from '../theme/icones';
import { useUsuarioLogado } from '../hooks/useUsuarioLogado';
import { logout } from '../services/authService';

type Props = { navigation?: any };

type LinhaDado = { icone: NomeIcone; rotulo: string; valor: string };

export default function AdminProfileScreen({ navigation }: Props) {
  const { usuario } = useUsuarioLogado();

  async function sair() {
    await logout();
    navigation?.reset?.({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const dados: LinhaDado[] = [
    { icone: ICONE.perfil, rotulo: 'Nome completo', valor: usuario?.nome || 'Administrador' },
    { icone: ICONE.cargo, rotulo: 'Cargo', valor: 'Administrador do sistema' },
    { icone: ICONE.departamento, rotulo: 'Departamento', valor: 'Gestão de ocorrências' },
    { icone: ICONE.permissoes, rotulo: 'Permissões', valor: 'Acesso administrativo' },
  ];

  const resumo = [
    { valor: 'ADM', rotulo: 'Tipo de conta', icone: ICONE.escudo as NomeIcone },
    { valor: String(usuario?.id || '-'), rotulo: 'ID do usuário', icone: ICONE.perfil as NomeIcone },
    { valor: 'Ativo', rotulo: 'Status da conta', icone: 'checkmark-circle-outline' as NomeIcone },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header
        variante="tela"
        titulo="Meu perfil"
        subtitulo="Administrador"
        onVoltar={() => navigation?.goBack?.()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Ionicons name={ICONE.escudoAtivo} size={layout.icone['4']} color={cores.marca.azul} />
          </View>

          <View style={styles.perfilInfo}>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.perfilNome}>
              {usuario?.nome || 'Administrador'}
            </Text>
            <SeloPapel papel={usuario?.role || 'ADMIN'} />
          </View>
        </View>

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
            Contato
          </Text>

          <View style={styles.contatoLinha}>
            <Ionicons name={ICONE.email} size={layout.icone['2']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.contatoTexto}>
              {usuario?.email || 'E-mail não informado'}
            </Text>
          </View>

          <View style={styles.contatoLinha}>
            <Ionicons name={ICONE.telefone} size={layout.icone['2']} color={cores.texto.secundario} />
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.contatoTexto}>
              {usuario?.telefone || 'Telefone não informado'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
            Dados da conta
          </Text>

          {dados.map((dado, index) => (
            <View
              key={dado.rotulo}
              style={[styles.dadoLinha, index > 0 && styles.dadoLinhaBorda]}
            >
              <View style={styles.dadoIcone}>
                <Ionicons name={dado.icone} size={layout.icone['2']} color={cores.marca.azul} />
              </View>
              <View style={styles.dadoConteudo}>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.dadoRotulo}>
                  {dado.rotulo}
                </Text>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.dadoValor}>
                  {dado.valor}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
            Resumo da conta
          </Text>

          <View style={styles.resumoLinha}>
            {resumo.map((item) => (
              <View key={item.rotulo} style={styles.resumoItem}>
                <Ionicons name={item.icone} size={layout.icone['2']} color={cores.marca.azul} />
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoValor}>
                  {item.valor}
                </Text>
                <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.resumoRotulo}>
                  {item.rotulo}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.secaoTitulo}>
            Ações rápidas
          </Text>

          <Pressable
            onPress={() => navigation?.navigate('AdminUsers')}
            accessibilityRole="button"
            accessibilityLabel="Gerenciar usuários"
            style={({ pressed }) => [styles.acaoLinha, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.acaoIcone}>
              <Ionicons name={ICONE.usuarios} size={layout.icone['2']} color={cores.marca.azul} />
            </View>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.acaoTexto}>
              Gerenciar usuários
            </Text>
            <Ionicons name={ICONE.avancar} size={layout.icone['2']} color={cores.texto.secundario} />
          </Pressable>

          <Pressable
            onPress={() => navigation?.navigate('AdminHome')}
            accessibilityRole="button"
            accessibilityLabel="Gerenciar ocorrências"
            style={({ pressed }) => [styles.acaoLinha, pressed && { opacity: 0.7 }]}
          >
            <View style={styles.acaoIcone}>
              <Ionicons name={ICONE.ocorrencias} size={layout.icone['2']} color={cores.marca.azul} />
            </View>
            <Text maxFontSizeMultiplier={FONTE_MAXIMA} style={styles.acaoTexto}>
              Gerenciar ocorrências
            </Text>
            <Ionicons name={ICONE.avancar} size={layout.icone['2']} color={cores.texto.secundario} />
          </Pressable>
        </View>

        <Botao titulo="Sair da conta" icone={ICONE.sair} variante="destrutivo" onPress={sair} />
      </ScrollView>

      <BarraInferior tipo="admin" ativo="perfil" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.superficie.base },
  scroll: {
    paddingHorizontal: espaco['4'],
    paddingTop: espaco['4'],
    paddingBottom: espaco['8'],
    gap: espaco['4'],
  },
  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['4'],
    backgroundColor: cores.superficie.azul,
    borderRadius: raio['3'],
    padding: espaco['5'],
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: raio.pill,
    backgroundColor: cores.superficie.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfilInfo: { flex: 1, gap: espaco['2'], alignItems: 'flex-start' },
  perfilNome: { ...tipografia.tituloTela, color: cores.texto.principal },
  card: {
    backgroundColor: cores.superficie.base,
    borderRadius: raio['3'],
    borderWidth: 1,
    borderColor: cores.borda.suave,
    padding: espaco['4'],
    gap: espaco['3'],
    ...elevacao[1],
  },
  secaoTitulo: { ...tipografia.tituloSecao, color: cores.texto.principal },
  contatoLinha: { flexDirection: 'row', alignItems: 'center', gap: espaco['2'] },
  contatoTexto: { ...tipografia.corpo, color: cores.texto.principal, flex: 1 },
  dadoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    paddingTop: espaco['3'],
  },
  dadoLinhaBorda: { borderTopWidth: 1, borderTopColor: cores.borda.suave },
  dadoIcone: {
    width: 40,
    height: 40,
    borderRadius: raio['2'],
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dadoConteudo: { flex: 1, gap: 2 },
  dadoRotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  dadoValor: { ...tipografia.corpoForte, color: cores.texto.principal },
  resumoLinha: { flexDirection: 'row', alignItems: 'flex-start' },
  resumoItem: { flex: 1, alignItems: 'center', gap: espaco['1'] },
  resumoValor: { ...tipografia.corpoForte, color: cores.texto.principal },
  resumoRotulo: { ...tipografia.legendaNormal, color: cores.texto.secundario, textAlign: 'center' },
  acaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco['3'],
    minHeight: 48,
    paddingVertical: espaco['1'],
    borderTopWidth: 1,
    borderTopColor: cores.borda.suave,
  },
  acaoIcone: {
    width: 40,
    height: 40,
    borderRadius: raio['2'],
    backgroundColor: cores.superficie.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acaoTexto: { ...tipografia.corpoForte, color: cores.texto.principal, flex: 1 },
});
