Você é designer de produto sênior, com experiência em apps de serviço público e em acessibilidade mobile, e também sabe implementar interface em React Native. Quero que você proponha o redesign de um app que já existe. Não é produto novo: é organizar, padronizar e melhorar o que já está pronto.

## 1. Contexto do produto

Observa Cidade é um app mobile onde moradores registram problemas urbanos (ocorrências) e acompanham o andamento, e a prefeitura trata essas ocorrências. São duas faces no mesmo app:

- Cidadão: registra uma ocorrência com categoria, descrição, endereço, foto e GPS; acompanha o status; comenta; recebe notificações; conversa com um assistente que responde dúvidas sobre o app.
- Administrador: vê estatísticas, a fila de ocorrências, o endereço e as coordenadas de cada ocorrência, e abre a localização no app de mapas do celular; muda o status; responde comentários e gerencia usuários.

Público: moradores da cidade, incluindo gente com pouca familiaridade com tecnologia, e servidores municipais. O uso é na rua, muitas vezes com uma mão, no sol e com conexão instável.

Não invente função, tela ou dado que não esteja descrito aqui. Se faltar informação, pergunte (regra 11).

## 2. Limites técnicos

- React Native com Expo SDK 58, TypeScript e StyleSheet.
- Sem biblioteca de UI pronta (nada de React Native Paper, NativeBase, Tamagui, Gluestack e similares). Os componentes são próprios.
- Android (APK) e Expo Go. Só retrato. Só tema claro.
- Não trocar React Native, Expo nem a navegação.
- Não adicionar mapa embutido nem dependência de mapas. A localização é exibida como texto e a ação "Abrir localização no mapa" usa um link para o Google Maps, como já acontece hoje.
- Orçamento de estudante: só coisa gratuita, o mínimo de dependências novas, preferindo o que já vem com o Expo. Fonte do sistema, sem carregar fontes novas, a menos que você justifique muito bem.
- Sem dark mode, sem animação complexa (feedback de toque simples, como opacidade ou ripple do Android, pode), sem ilustração sob medida e sem telas novas.

## 3. O que existe hoje

Identidade: a marca escreve "Observa" em azul #1565c0 e "Cidade" em dourado #c8860a. O splash e o ícone usam fundo #7ec8e3. A tela de boas-vindas usa botões creme #f5f0dc. Texto principal #1a1a2e. Cinzas: #64748b, #94a3b8, #e2e8f0 e #f1f5f9. Status: recebida #2563eb, em análise #d97706, em andamento #7c3aed, resolvida #16a34a. Urgência: baixa #22c55e, média #f59e0b, alta #ef4444. Fonte do sistema, pesos de 500 a 800, tamanhos de 10 a 38 px.

Telas (28): boas-vindas, login por e-mail, Google e telefone, cadastro, esqueci a senha e telas de sucesso. Home com feed, nova ocorrência, detalhe, histórico, perfil, meus dados, notificações, ajuda/suporte, sobre e assistente. No admin: home com estatísticas, perfil, usuários, detalhe da ocorrência e cadastro de usuário em 3 passos. Existem também cinco telas de placeholder e um navegador por abas que não é usado; nada disso entra na revisão.

Componentes: header com a marca e dois botões redondos (assistente e notificações); banner de destaque na home; card de ocorrência com miniatura, selo de status, ponto de urgência, endereço, descrição, data e comentários embutidos; barra inferior fixa com Início, botão + central e Perfil; formulário com seções, seletor de categoria e de urgência, foto e GPS; chat com balões e chips de perguntas frequentes; cards de estatística no admin; indicador dos 3 passos do cadastro de usuário.

Localização: o detalhe da ocorrência, tanto do cidadão quanto do admin, mostra rua, bairro e ponto de referência. Quando a ocorrência tem coordenadas, mostra também a latitude e a longitude e a ação "Abrir localização no mapa", que abre o Google Maps pelo link. Quando não tem, aparece "Sem localização registrada." e a ação não é exibida. O dado de latitude e longitude já vem da API.

Ícones: hoje são emoji e símbolos de texto (💬 🔔 🏠 👤 💡 🏥 🚦 🛣️ 🗑️ 📍 ➤ ← +). Os cinco emojis de categoria são 💡 🏥 🚦 🛣️ 🗑️; use o significado aparente de cada um e, se o nome da categoria não ficar claro, liste em "Perguntas" em vez de supor. O 📍 tem dois papéis hoje: é o ícone da categoria "Outros" e também marca o endereço no detalhe do admin. Não há biblioteca de ícones instalada.

Código: não existe arquivo de tema. Cores, tamanhos e espaçamentos estão repetidos em cada tela. Header e barra inferior são recriados em cada arquivo.

## 4. Problemas a resolver

- Emoji como ícone muda de desenho conforme o aparelho, desalinha do texto e não parece profissional.
- Muitos textos entre 10 e 13 px. O cinza #94a3b8 sobre branco tem cerca de 2,6:1 de contraste, abaixo do mínimo de 4,5:1. O #64748b tem 4,8:1 e serve. O dourado #c8860a tem 3,1:1 e só serve para texto grande, como o nome da marca.
- Os status #d97706 (cerca de 3,2:1) e #16a34a (cerca de 3,3:1) também não passam como texto pequeno sobre branco. Os pontos de urgência #22c55e (cerca de 2,3:1) e #f59e0b (cerca de 2,2:1) ficam abaixo de 3:1 como elemento gráfico. Esses valores são aproximados; recalcule antes de usar.
- Raios de borda variam de 8 a 26 sem critério.
- Botões não têm estados de pressed, disabled e carregando padronizados.
- A mesma barra superior e inferior é reescrita em cada tela, então qualquer ajuste exige mexer em cerca de 20 arquivos.
- O bloco de localização existe em duas telas com aparência diferente e sem regra para texto longo, coordenadas e estado sem GPS. Ele precisa de um componente único, com as mesmas medidas e estados nos dois detalhes.
- O emoji 📍 aparece como categoria e como endereço, então o mesmo símbolo diz duas coisas diferentes.

## 5. Regras para você

- Redesenhe o que existe. Não proponha dark mode, animações complexas, ilustrações sob medida, telas novas, troca de stack ou de navegação.
- Toda cor em hexadecimal, com o nome do token e onde ela é usada.
- Não invente função, dado ou texto de tela. Se uma informação mudar muito a sua resposta, não decida sozinho: liste no fim, em uma seção "Perguntas".
- Português do Brasil, direto, sem elogios e sem enrolação.
- Se a resposta não couber de uma vez, entregue por partes, na ordem dos itens abaixo, pare no fim de uma delas e diga qual é a próxima. Eu respondo "continue".

## 6. O que entregar, nesta ordem

### Item 1. Sistema visual com tokens nomeados

Use nomes semânticos (texto-principal, superfície, borda, status-analise-texto), não nomes soltos como azul1.

- Paleta: para cada cor, o nome, o hex, onde é usada, o fundo sobre o qual aparece, a razão de contraste calculada pela fórmula do WCAG (uma casa decimal) e se passa (4,5:1 para texto normal, 3:1 para texto grande e para elementos gráficos). Mantenha o azul e o dourado da marca. Dourado #c8860a só em texto grande ou decorativo; se precisar de dourado em texto pequeno, derive um tom mais escuro e calcule. Para status, defina uma versão de preenchimento suave e uma de texto que passe nos 4,5:1. Defina também as cores de erro, sucesso e aviso. Diga o que fazer com o creme #f5f0dc dos botões de boas-vindas (virar variante de botão ou ser substituído) e onde o #7ec8e3 entra além do splash e do ícone.
- Escala tipográfica: nomes (título, subtítulo, corpo, corpo pequeno, legenda, botão etc.) com tamanho, peso e altura de linha. Nenhum texto abaixo de 12 px, corpo em 16 px. Reduza os pesos de 500 a 800 para poucos, de uso claro.
- Espaçamento: escala base com nomes e onde cada passo é usado.
- Raios: reduza os valores de 8 a 26 para poucos tokens e diga qual usar em cada componente (campo, botão, card, selo, chip, balão do chat, botão redondo).
- Elevação: 3 níveis com elevation para Android e, se for barato, shadow para quem abrir no Expo Go em iPhone.
- Estados: valores exatos de pressed, focused, disabled, loading e error (cor ou opacidade).

### Item 2. Ícones

Avalie @expo/vector-icons, que já vem com o Expo, e escolha uma única família. Justifique em até 4 linhas. Depois entregue uma tabela: onde hoje há emoji ou símbolo, nome exato do ícone novo, tamanho, token de cor e rótulo de acessibilidade. Cubra os 12 itens atuais (💬 🔔 🏠 👤 💡 🏥 🚦 🛣️ 🗑️ 📍 ➤ ← +) e também as demais ações que já existem nas telas (foto, editar, comentar, sair, status, urgência, localização, referência, abrir no mapa etc.), sem inventar ação nova. Resolva o conflito do 📍: escolha um ícone para localização e outro para a categoria "Outros", e diga qual é qual. Defina a regra de ícone ativo e inativo na barra inferior (contorno ou preenchido).

### Item 3. Componentes por estado

Para cada componente: anatomia, medidas (altura, padding, raio, tamanho de texto e de ícone), tokens por estado, comportamento com texto longo e com fonte ampliada, e accessibilityRole e accessibilityLabel. Componentes e estados:

- Botão: primário, secundário, texto, ícone, + central, desabilitado e carregando; cada um em padrão, pressed, disabled e loading.
- Campo de formulário: padrão, foco, preenchido, erro, desabilitado, com texto de ajuda.
- Card de ocorrência: com e sem foto, com comentários, texto longo, pressed.
- Selo de status: os 4 status. Seletores de categoria e de urgência. Status e urgência nunca podem depender só de cor: use texto ou ícone junto.
- Chip: selecionado, não selecionado, pressed, desabilitado.
- Barra inferior e header: item ativo e inativo, botão + central, botões redondos. Se já existir contador de não lidas nas notificações, especifique; se não existir, não inclua.
- Chat: balão do usuário, balão do assistente, chips de perguntas frequentes, campo de envio, carregando resposta, erro de envio.
- Card de estatística (admin) e indicador de passos (cadastro de usuário).
- Bloco de localização: usado no detalhe do cidadão e no detalhe do admin. Mostra rua e bairro, ponto de referência, coordenadas e a ação "Abrir localização no mapa". Estados: com coordenadas, sem coordenadas (texto curto e ação oculta), endereço longo e coordenadas longas. Diga o alvo de toque da ação e o rótulo de acessibilidade do bloco.
- Estados de vazio, carregando e erro das listas (feed, histórico, notificações, usuários): só o visual e o texto curto, com botão "Tentar de novo" no erro. Não crie função de uso offline.

### Item 4. Revisão tela por tela, em ordem de impacto

Ordene por quantas pessoas usam a tela, gravidade dos problemas nela e quantas outras telas dependem do mesmo componente. Pode agrupar telas parecidas (por exemplo, as de login), mas cite todas as 28, menos as cinco de placeholder. Para cada tela ou grupo: o que muda (em termos dos tokens e componentes dos itens 1 a 3, sem desenhar pixel a pixel), por que muda (ligado a um problema da seção 4 ou a uma regra do item 5) e o esforço (P, M ou G). Quando duas telas usarem o mesmo componente, diga isso explicitamente: o detalhe do cidadão e o detalhe do admin usam o mesmo bloco de localização, por exemplo.

### Item 5. Acessibilidade

- Contraste: 4,5:1 para texto normal, 3:1 para texto grande (a partir de 24 px, ou 18,66 px em negrito) e para elementos gráficos (ícones, borda de campo, indicador de selecionado). Para informação crítica (status, endereço, coordenadas, botões), mire em 7:1.
- Alvo de toque: no mínimo 48 x 48 dp, com 8 dp de espaço entre alvos. Diga onde usar hitSlop.
- Texto: mínimo de 12 px, corpo em 16 px, e nenhum corte nem sobreposição com a fonte do Android ampliada até 1,3x. Indique onde limitar com maxFontSizeMultiplier.
- Leitura no sol: evitar peso fino e cinza claro sobre branco, bordas visíveis nos campos e cards, botão primário de alto contraste.
- Uma mão: ações principais na metade inferior da tela quando fizer sentido, e botão de enviar fixo no rodapé nos formulários longos.
- TalkBack: accessibilityRole, accessibilityLabel em todo botão só de ícone, estados (selected, disabled, busy) e ordem de leitura.
- Linguagem simples nos textos de erro e de ajuda, para quem tem pouca familiaridade com tecnologia.
- Respeitar a área segura e a barra de navegação do Android no header e na barra inferior.

### Item 6. Como aplicar no código

- Diga onde criar o arquivo de tokens (sugira um caminho, como src/theme/tokens.ts, e explique como adaptar se a minha estrutura for outra) e entregue o arquivo completo, tipado, pronto para colar.
- Entregue uma tabela "valor atual → token" para todos os hex listados na seção 3, para os raios de 8 a 26 e para os tamanhos de 10 a 38 px.
- Liste os componentes compartilhados a criar (por exemplo Tela, Header, BarraInferior, Botão, Campo, Chip, SeloStatus, Card, BlocoLocalizacao, Vazio, Carregando, Erro) com as props de cada um. Mostre o código completo de apenas um (o Botão); dos outros, só as props e os estados.
- Dê a ordem de migração em etapas que deixem o app rodando ao fim de cada uma: tokens, componentes compartilhados, telas na ordem do item 4, varredura final.
- Dê comandos ou regex de busca para achar valores soltos (hex, fontSize, borderRadius) e um comando para confirmar que não sobrou hex fora do arquivo de tokens.

## 7. Lista de verificação

Feche a resposta passando por esta lista, item por item, dizendo em que parte da resposta cada um foi cumprido:

- Nenhuma tela nova, dark mode, animação complexa, ilustração, troca de stack, troca de navegação ou mapa embutido.
- Todas as cores em hex, com nome, uso, fundo e contraste calculado.
- #94a3b8 não aparece mais como cor de texto; #c8860a só aparece em texto grande ou decorativo.
- Status, urgência e erro não dependem só de cor.
- Nenhum texto abaixo de 12 px; poucos tamanhos, pesos e raios.
- Uma única família de ícones, todos os emojis e símbolos atuais substituídos com nome exato de ícone, e o 📍 sem duplo papel.
- Todos os componentes do item 3 com todos os estados pedidos, incluindo o bloco de localização.
- Todas as telas (menos placeholders) revisadas, em ordem de impacto, com o que muda e por quê.
- O bloco de localização aparece no detalhe do cidadão e no do admin, com o estado sem coordenadas.
- Alvos de toque de pelo menos 48 dp e texto ampliado a 1,3x sem quebrar.
- Arquivo de tokens completo, tabela valor → token e etapas de migração que mantêm o app rodando.
- Dúvidas listadas em "Perguntas", sem suposições escondidas.
