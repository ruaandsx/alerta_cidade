import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { enviarSuporte } from '../services/suporteService';

const assuntos = [
  { icon:'📄', label:'Dúvidas sobre ocorrência' }, { icon:'⚙️', label:'Problemas no aplicativo' },
  { icon:'👤', label:'Contas e cadastro' }, { icon:'🔔', label:'Notificações' },
  { icon:'🔒', label:'Privacidade e segurança' }, { icon:'•••', label:'Outros assuntos' },
];

export default function HelpSupportScreen({ navigation }: any) {
  const [mensagem,setMensagem]=useState(''); const [assuntoSelecionado,setAssuntoSelecionado]=useState<number|null>(null); const [enviando,setEnviando]=useState(false);
  async function enviar(){
    if(assuntoSelecionado===null){ Alert.alert('Assunto obrigatório','Escolha um assunto antes de enviar.'); return; }
    if(!mensagem.trim()){ Alert.alert('Mensagem obrigatória','Digite sua mensagem.'); return; }
    try{ setEnviando(true); await enviarSuporte(assuntos[assuntoSelecionado].label, mensagem.trim()); setMensagem(''); setAssuntoSelecionado(null); Alert.alert('Mensagem enviada','Seu chamado foi enviado para o suporte.'); }
    catch(e){ console.log(e); Alert.alert('Erro','Não foi possível enviar a mensagem.'); } finally{ setEnviando(false); }
  }
  return (
    <SafeAreaView style={styles.container}><StatusBar barStyle="dark-content" backgroundColor="#7ec8e3" />
      <View style={styles.header}><TouchableOpacity onPress={()=>navigation?.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity><View style={styles.headerCenter}><Text style={styles.headerTitle}>Falar com suporte</Text><Text style={styles.headerSubtitle}>Estamos aqui para ajudar!</Text></View><View style={{width:32}} /></View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}><View style={styles.welcomeText}><Text style={styles.welcomeTitle}>Olá, como{`\n`}podemos ajudar?</Text><Text style={styles.welcomeDesc}>Escolha um dos assuntos{`\n`}abaixo ou envie sua mensagem.</Text></View><View style={styles.agentCircle}><Text style={styles.agentEmoji}>👩‍💻</Text></View></View>
        <Text style={styles.sectionTitle}>Assuntos rápidos</Text><View style={styles.assuntosGrid}>{assuntos.map((item,index)=>(<TouchableOpacity key={index} style={[styles.assuntoCard,assuntoSelecionado===index&&styles.assuntoCardActive]} onPress={()=>setAssuntoSelecionado(index)}><Text style={styles.assuntoIcon}>{item.icon}</Text><Text style={styles.assuntoLabel}>{item.label}</Text></TouchableOpacity>))}</View>
        <Text style={styles.sectionTitle}>Envie sua mensagem</Text><View style={styles.inputCard}><TextInput style={styles.textArea} placeholder="Descreva sua dúvida ou problema..." placeholderTextColor="#94a3b8" value={mensagem} onChangeText={setMensagem} multiline maxLength={500} textAlignVertical="top" /><Text style={styles.charCount}>{mensagem.length}/500</Text></View>
        <TouchableOpacity style={styles.sendButton} onPress={enviar} disabled={enviando}><Text style={styles.sendText}>{enviando?'Enviando...':'Enviar mensagem'}</Text></TouchableOpacity>
        <View style={styles.atendimentoCard}><Text style={styles.headphoneEmoji}>🎧</Text><View style={styles.atendimentoText}><Text style={styles.atendimentoTitle}>Atendimento</Text><Text style={styles.atendimentoDesc}>Segunda a sexta, das 08h às 18h{`\n`}Resposta em até 24h úteis</Text></View></View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#7ec8e3'}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:16,paddingBottom:14},
  backArrow:{fontSize:24,color:'#1a1a2e',width:32}, headerCenter:{alignItems:'center',flex:1}, headerTitle:{fontSize:18,fontWeight:'700',color:'#1a1a2e'}, headerSubtitle:{fontSize:12,color:'#1a3a5c',marginTop:2},
  scroll:{paddingHorizontal:16,paddingBottom:24}, welcomeCard:{backgroundColor:'#fff',borderRadius:16,padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},
  welcomeText:{flex:1}, welcomeTitle:{fontSize:18,fontWeight:'800',color:'#1a1a2e',lineHeight:24,marginBottom:6}, welcomeDesc:{fontSize:12,color:'#64748b',lineHeight:18}, agentCircle:{width:70,height:70,borderRadius:35,backgroundColor:'#e0f2fe',alignItems:'center',justifyContent:'center'}, agentEmoji:{fontSize:40},
  sectionTitle:{fontSize:15,fontWeight:'700',color:'#1a1a2e',marginBottom:12}, assuntosGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:20}, assuntoCard:{width:'30%',backgroundColor:'#5bb8d4',borderRadius:14,padding:10,alignItems:'center',gap:8,minHeight:90,justifyContent:'center'}, assuntoCardActive:{backgroundColor:'#1565c0'}, assuntoIcon:{fontSize:24}, assuntoLabel:{fontSize:10,fontWeight:'600',color:'#fff',textAlign:'center',lineHeight:14},
  inputCard:{backgroundColor:'#fff',borderRadius:14,padding:14,marginBottom:12}, textArea:{height:100,fontSize:13,color:'#1a1a2e',marginBottom:4}, charCount:{fontSize:11,color:'#94a3b8',textAlign:'right',marginBottom:4}, sendButton:{backgroundColor:'#1565c0',borderRadius:14,paddingVertical:16,alignItems:'center',justifyContent:'center',marginBottom:14}, sendText:{fontSize:16,fontWeight:'700',color:'#fff'},
  atendimentoCard:{backgroundColor:'#fff',borderRadius:14,padding:14,flexDirection:'row',alignItems:'center',gap:12,marginBottom:8}, headphoneEmoji:{fontSize:28}, atendimentoText:{flex:1}, atendimentoTitle:{fontSize:14,fontWeight:'700',color:'#1a1a2e',marginBottom:4}, atendimentoDesc:{fontSize:12,color:'#64748b',lineHeight:18}
});
