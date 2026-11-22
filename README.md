# Observa Cidade — app mobile (Expo)

Frontend do projeto **Observa Cidade**, feito em React Native + Expo (SDK 58).
Consome a API Spring Boot do repositório `observacidade-backend`.

> O SDK do projeto acompanha o **Expo Go** da Play Store: hoje, SDK 58
> (React Native 0.88, React 19.3). Se o Expo Go reclamar de versão incompatível,
> rode `npx expo install expo@latest` + `npx expo install --fix`.

## 1. Subir a API

No computador, dentro da pasta do backend:

```powershell
.\run-dev.cmd
```

A API sobe em `http://localhost:8080` (perfil `dev`, banco H2 persistido em `./data`).
Confira em <http://localhost:8080/health>.

## 2. Rodar o app

```powershell
npm install
npx expo start
```

Abra o **Expo Go** no celular e escaneie o QR code (o celular precisa estar na mesma
rede Wi-Fi do computador). Se o QR não funcionar, use "Enter URL manually" com o
endereço `exp://SEU_IP:8081` mostrado no terminal.

### Endereço da API

O app descobre o IP automaticamente pelo endereço do Expo (`http://SEU_IP:8080`).
Se precisar trocar (outra rede, túnel, emulador), abra a tela de login, toque em
**Servidor** e informe o endereço, por exemplo:

- celular físico: `http://192.168.0.10:8080`
- emulador Android: `http://10.0.2.2:8080`
- túnel HTTPS: `https://sua-url.ngrok-free.app`

Também é possível definir por variável de ambiente:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://192.168.0.10:8080"
npx expo start
```

> HTTP sem TLS exige que o celular aceite tráfego não criptografado. No **Expo Go**
> isso já funciona; no APK o `usesCleartextTraffic` já vem habilitado
> (`expo-build-properties`).

## 2.1 Gerar o APK

**Opção A — EAS Build (na nuvem, recomendado)**

```powershell
npx eas-cli build -p android --profile preview
```

O perfil `preview` (em `eas.json`) gera um **APK** para instalação direta. Ao
terminar, o link do arquivo aparece no terminal e em
<https://expo.dev/accounts/dyonff7/projects/observa-cidade/builds>.

**Opção B — build local (precisa de Android SDK/NDK)**

```powershell
npx expo prebuild --platform android   # gera a pasta android/
cd android
.\gradlew.bat assembleRelease
```

APK gerado em:

```
android\app\build\outputs\apk\release\app-release.apk
```

> Em caminhos muito longos (Windows), o build local pode falhar no CMake.
> Nesse caso use o EAS Build.

Copie para o celular (cabo, Google Drive, WhatsApp) e instale liberando
"Instalar de fontes desconhecidas".

Requisitos para compilar: JDK 17+, Android SDK (platform 36, build-tools 36.0.0,
NDK 27.1.12297006). Defina `ANDROID_HOME` e o caminho do SDK em
`android/local.properties`.

### Servidor padrão do APK

Como o APK não tem o Expo para descobrir o IP, ele usa `extra.apiUrl` do
`app.json` (hoje `http://192.168.0.10:8080`) e o usuário pode trocar em
**login → Servidor**. Para um endereço público fixo, use o Tailscale Funnel do
backend (`https://SEU-PC.SUA-TAILNET.ts.net`) e coloque aqui no `app.json` antes
de compilar.

## 3. Contas

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@observacidade.com` | `admin123` |
| Cidadão | crie em **Criar conta** | — |

## 4. O que o app faz

**Cidadão**
- Login e cadastro com JWT (`/auth/login`, `/auth/cadastro`)
- Feed de ocorrências com foto, status, urgência e comentários
- Nova ocorrência com câmera/galeria, GPS (`expo-location`) e endereço
- Editar/apagar as próprias ocorrências
- Histórico pessoal com resumo (total, em aberto, resolvidas)
- Notificações (lidas/não lidas) e suporte
- Meus dados e troca de perfil
- **Assistente virtual** (ícone 💬 no topo): chat com perguntas frequentes, respostas da base do backend e sugestões

**Administrador**
- Painel com estatísticas reais (`/ocorrencias/estatisticas`)
- Filtros por status, atualização automática a cada 5s
- Detalhe da ocorrência, mudança de status (análise → andamento → resolvida)
- Resposta ao cidadão via comentário
- Gestão de usuários (promover a admin, excluir)
- **Assistente virtual** com métricas de uso (`/assistente/estatisticas`)

## 5. Estrutura

```
App.tsx                     navegação e auto-login
src/services/api.ts         fetch, JWT, URL configurável, imagens autenticadas
src/services/auth.ts        login/cadastro/perfil
src/services/ocorrenciaService.ts  ocorrências, comentários, notificações, estatísticas
src/services/adminService.ts       usuários (paginado)
src/services/suporteService.ts     chamados de suporte
src/services/assistenteService.ts  chat do assistente (FAQ + IA)
src/screens/AssistenteScreen.tsx   tela do assistente
src/screens/                telas do cidadão e do administrador
```

## 6. Verificações

```powershell
npx tsc --noEmit     # tipos
npx expo export      # bundle de produção
```
