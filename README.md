# 🎮 GameVault

> **Sua biblioteca. Seus jogos. Sua história.**

O **GameVault** é uma aplicação de biblioteca pessoal de jogos desenvolvida com **React Native e Expo** como parte da atividade acadêmica **Laboratório 1: Criando o projeto e adicionando pacotes**, do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

A aplicação permite organizar uma coleção de jogos, pesquisar títulos, filtrar por plataforma, visualizar capas, acompanhar jogos em andamento e gerenciar uma lista de favoritos com persistência local.

---

## 📱 Sobre o projeto

O GameVault foi desenvolvido com o objetivo de aplicar, na prática, conceitos relacionados a:

- Criação de aplicações React Native com Expo;
- Estrutura de projetos React Native;
- Gerenciamento de dependências;
- Instalação de pacotes utilizando npm e `npx expo install`;
- Utilização do `package.json`;
- Utilização do `package-lock.json`;
- Organização de componentes e arquivos;
- Integração de bibliotecas externas;
- Persistência de dados localmente;
- Desenvolvimento de interfaces mobile.

O projeto utiliza dados locais para representar a biblioteca de jogos, não necessitando de backend ou banco de dados externo.

---

## ✨ Funcionalidades

### 🏠 Início

A tela inicial apresenta uma visão geral da biblioteca, incluindo:

- Quantidade total de jogos;
- Quantidade de jogos favoritos;
- Jogos atualmente em andamento;
- Jogos em destaque;
- Informações resumidas da coleção;
- Gradiente visual utilizando `expo-linear-gradient`.

### 🎮 Biblioteca

A biblioteca permite:

- Visualizar todos os jogos cadastrados;
- Pesquisar jogos pelo nome;
- Filtrar jogos por plataforma;
- Visualizar capas dos jogos;
- Visualizar gênero e plataforma;
- Visualizar o status de cada jogo;
- Adicionar ou remover jogos dos favoritos;
- Utilizar efeito de desfoque nas informações das capas.

### ❤️ Favoritos

A tela de favoritos apresenta todos os jogos marcados pelo usuário.

Os favoritos são armazenados localmente, permitindo que permaneçam disponíveis mesmo após o encerramento e reabertura da aplicação.

### 🧩 Tecnologias utilizadas

A aplicação possui uma seção específica apresentando as bibliotecas externas utilizadas no desenvolvimento.

---

## 📦 Pacotes externos utilizados

O laboratório exigia a utilização efetiva de pelo menos cinco pacotes externos. O GameVault utiliza os seguintes:

| Pacote | Utilização |
|---|---|
| `@react-native-async-storage/async-storage` | Persistência local dos favoritos |
| `expo-linear-gradient` | Criação de gradientes na interface |
| `expo-haptics` | Feedback tátil durante interações |
| `expo-image` | Exibição das capas dos jogos |
| `expo-blur` | Efeito de desfoque nas informações das capas |

Todos os pacotes foram efetivamente integrados à aplicação.

---

## 🛠️ Tecnologias

### Base

- **React Native**
- **Expo**
- **TypeScript**
- **Expo Router**
- **React**

### Bibliotecas externas

- **AsyncStorage**
- **Expo Linear Gradient**
- **Expo Haptics**
- **Expo Image**
- **Expo Blur**

### Ferramentas

- **Node.js**
- **npm**
- **Git**
- **GitHub**
- **Visual Studio Code**

---

## 📂 Estrutura do projeto

```text
GameVault/
│
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── biblioteca.tsx
│   │   ├── favoritos.tsx
│   │   └── tecnologias.tsx
│   │
│   ├── jogo/
│   │   └── [id].tsx
│   │
│   ├── _layout.tsx
│   └── modal.tsx
│
├── assets/
│   └── games/
│       ├── big-walk.jpg
│       ├── god-of-war.png
│       ├── minecraft.png
│       └── ...
│
├── components/
│   └── haptic-tab.tsx
│
├── constants/
│   └── games.ts
│
├── contexts/
│   └── FavoritesContext.tsx
│
├── hooks/
│
├── scripts/
│
├── .gitignore
├── app.json
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json