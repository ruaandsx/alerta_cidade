import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { deletarOcorrencia } from '../services/ocorrenciaService';

export default function ReportDetailScreen({ route, navigation }: any) {
  const item = route?.params?.item?.original || route?.params?.item || {};

  function titulo(categoria?: string) {
    if (categoria === 'ILUMINACAO') return 'Iluminação pública';
    if (categoria === 'SAUDE_PUBLICA') return 'Saúde pública';
    if (categoria === 'TRANSITO') return 'Trânsito';
    if (categoria === 'INFRAESTRUTURA') return 'Infraestrutura';
    if (categoria === 'LIMPEZA') return 'Limpeza urbana';
    return 'Ocorrência';
  }

  function apagar() {
    Alert.alert('Apagar ocorrência', 'Tem certeza que deseja apagar esta ocorrência?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarOcorrencia(item.id);
            Alert.alert('Pronto', 'Ocorrência apagada.');
            navigation?.navigate('Home');
          } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Não foi possível apagar a ocorrência.');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes da ocorrência</Text>
        <TouchableOpacity onPress={apagar}>
          <Text style={styles.trash}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageBox}>
          {item.imagemBase64 ? (
            <Image source={{ uri: item.imagemBase64 }} style={styles.image} />
          ) : (
            <Text style={styles.emoji}>📍</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{titulo(item.categoria)}</Text>

          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.text}>{item.descricao || 'Sem descrição'}</Text>

          <Text style={styles.label}>Endereço</Text>
          <Text style={styles.text}>
            {item.rua || ''}
            {item.bairro && item.bairro !== 'Não informado' ? ', ' + item.bairro : ''}
          </Text>

          <Text style={styles.label}>Referência</Text>
          <Text style={styles.text}>{item.referencia || 'Não informada'}</Text>

          <Text style={styles.label}>Urgência</Text>
          <Text style={styles.text}>{item.urgencia || 'Não informada'}</Text>

          <Text style={styles.label}>Status</Text>
          <Text style={styles.text}>{item.status || 'RECEBIDO'}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation?.navigate('NewReport', { ocorrencia: item })}
        >
          <Text style={styles.buttonText}>Editar ocorrência</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={apagar}>
          <Text style={styles.deleteText}>Apagar ocorrência</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  back: { fontSize: 24, color: '#1a1a2e' },
  trash: { fontSize: 22 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  scroll: { padding: 16 },
  imageBox: { height: 210, borderRadius: 18, backgroundColor: '#d6eef8', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  emoji: { fontSize: 54 },
  card: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#1565c0', marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 10 },
  text: { fontSize: 14, color: '#1a1a2e', lineHeight: 20 },
  button: { marginTop: 16, backgroundColor: '#1565c0', borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteButton: { marginTop: 10, backgroundColor: '#fee2e2', borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  deleteText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});
