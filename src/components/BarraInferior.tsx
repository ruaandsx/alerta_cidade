import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { FONTE_MAXIMA, cores, espaco, layout, raio, toque, tipografia } from '../theme/tokens';
import { ICONE, type NomeIcone } from '../theme/icones';

type ChaveAdmin = 'inicio' | 'usuarios' | 'perfil';
type ChaveCidadao = 'inicio' | 'perfil';

type Props = {
  tipo?: 'cidadao' | 'admin';
  ativo: ChaveAdmin | ChaveCidadao;
  navigation?: any;
};

type Item = {
  chave: string;
  rotulo: string;
  icone: NomeIcone;
  iconeAtivo: NomeIcone;
  rota: string;
};

const ITENS_CIDADAO: Item[] = [
  { chave: 'inicio', rotulo: 'Início', icone: ICONE.inicio, iconeAtivo: ICONE.inicioAtivo, rota: 'Home' },
  { chave: 'perfil', rotulo: 'Perfil', icone: ICONE.perfil, iconeAtivo: ICONE.perfilAtivo, rota: 'Profile' },
];

const ITENS_ADMIN: Item[] = [
  { chave: 'inicio', rotulo: 'Início', icone: ICONE.inicio, iconeAtivo: ICONE.inicioAtivo, rota: 'AdminHome' },
  {
    chave: 'usuarios',
    rotulo: 'Usuários',
    icone: ICONE.usuarios,
    iconeAtivo: ICONE.usuariosAtivo,
    rota: 'AdminUsers',
  },
  { chave: 'perfil', rotulo: 'Perfil', icone: ICONE.perfil, iconeAtivo: ICONE.perfilAtivo, rota: 'AdminProfile' },
];

function ItemBarra({
  item,
  ativo,
  onPress,
}: {
  item: Item;
  ativo: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={item.rotulo}
      accessibilityState={{ selected: ativo }}
      hitSlop={toque.hitSlop}
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.6 }]}
    >
      <Ionicons
        name={ativo ? item.iconeAtivo : item.icone}
        size={layout.icone['3']}
        color={ativo ? cores.marca.azul : cores.texto.secundario}
      />
      <Text
        maxFontSizeMultiplier={FONTE_MAXIMA}
        numberOfLines={1}
        style={[styles.rotulo, ativo && styles.rotuloAtivo]}
      >
        {item.rotulo}
      </Text>
    </Pressable>
  );
}

/**
 * Barra inferior única.
 * Cidadão: Início, botão + central, Perfil. Admin: 3 abas.
 * Ativo = ícone preenchido + texto azul; inativo = contorno + cinza escuro.
 */
export default function BarraInferior({ tipo = 'cidadao', ativo, navigation }: Props) {
  const itens = tipo === 'admin' ? ITENS_ADMIN : ITENS_CIDADAO;

  function ir(rota: string) {
    navigation?.navigate?.(rota);
  }

  return (
    <View style={styles.base}>
      {tipo === 'admin' ? (
        itens.map((item) => (
          <ItemBarra
            key={item.chave}
            item={item}
            ativo={ativo === item.chave}
            onPress={() => ir(item.rota)}
          />
        ))
      ) : (
        <>
          <ItemBarra
            item={itens[0]}
            ativo={ativo === itens[0].chave}
            onPress={() => ir(itens[0].rota)}
          />

          <Pressable
            onPress={() => ir('NewReport')}
            accessibilityRole="button"
            accessibilityLabel="Registrar nova ocorrência"
            hitSlop={toque.hitSlop}
            style={({ pressed }) => [styles.central, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name={ICONE.adicionar} size={layout.icone['4']} color={cores.texto.inverso} />
          </Pressable>

          <ItemBarra
            item={itens[1]}
            ativo={ativo === itens[1].chave}
            onPress={() => ir(itens[1].rota)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.barraAltura,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: cores.superficie.base,
    borderTopWidth: 1,
    borderTopColor: cores.borda.suave,
    paddingHorizontal: espaco['2'],
  },
  item: {
    minWidth: 64,
    minHeight: 56,
    paddingVertical: espaco['1'],
    paddingHorizontal: espaco['2'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    flex: 1,
  },
  rotulo: { ...tipografia.legenda, color: cores.texto.secundario },
  rotuloAtivo: { color: cores.marca.azul },
  central: {
    width: layout.botaoCentral,
    height: layout.botaoCentral,
    minWidth: 56,
    minHeight: 56,
    borderRadius: raio.pill,
    backgroundColor: cores.marca.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -espaco['5'],
    elevation: 3,
  },
});
