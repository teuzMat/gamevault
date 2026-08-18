# 🎮 GameVault

Aplicativo mobile desenvolvido em React Native com Expo para gerenciamento e acompanhamento de uma biblioteca pessoal de jogos.

O GameVault permite organizar jogos, visualizar informações, marcar favoritos, acompanhar o status de cada jogo e visualizar estatísticas da biblioteca através de um perfil.

---

## 📱 Sobre o projeto

O GameVault foi desenvolvido como projeto acadêmico para a disciplina de React Native/Expo, com o objetivo de aplicar conceitos de:

- Criação de aplicações React Native com Expo;
- Estrutura de projetos React Native;
- Gerenciamento de dependências;
- Instalação e utilização de pacotes externos;
- Navegação entre telas;
- Componentização;
- Gerenciamento de estado;
- Persistência de dados;
- Interface responsiva;
- Integração de bibliotecas externas.

O projeto também foi desenvolvido com foco em proporcionar uma experiência semelhante a uma biblioteca pessoal de jogos.

---

# 🚀 Versão atual — 1.1

A versão 1.1 representa uma evolução significativa da primeira versão do GameVault.

Foram adicionados:

- Biblioteca completa de jogos;
- Imagens das capas dos jogos;
- Sistema de favoritos;
- Persistência dos favoritos;
- Tela individual para cada jogo;
- Sistema de status dos jogos;
- Persistência dos status;
- Visualização em lista;
- Visualização em grade;
- Filtro por plataforma;
- Pesquisa por nome;
- Tela de perfil;
- Estatísticas da biblioteca;
- Contagem de jogos por status;
- Sistema de progresso da biblioteca;
- Aba de tecnologias utilizadas;
- Navegação por abas;
- Armazenamento local utilizando AsyncStorage.

---

# 🎮 Funcionalidades

## 🏠 Início

Tela inicial do GameVault responsável por apresentar a aplicação e fornecer acesso às principais áreas do aplicativo.

---

## 📚 Biblioteca

A biblioteca apresenta todos os jogos cadastrados.

É possível:

- Pesquisar jogos pelo nome;
- Filtrar jogos por plataforma;
- Visualizar os jogos em lista;
- Alternar para visualização em grade;
- Adicionar ou remover jogos dos favoritos;
- Acessar a página individual de cada jogo.

### Visualização em lista

Apresenta os jogos horizontalmente, mostrando:

- Capa;
- Nome;
- Gênero;
- Plataforma;
- Status;
- Favorito.

### Visualização em grade

Apresenta dois jogos por linha, permitindo visualizar mais jogos simultaneamente.

---

## ❤️ Favoritos

A tela de favoritos apresenta somente os jogos marcados pelo usuário.

O usuário pode:

- Visualizar seus jogos favoritos;
- Remover um jogo dos favoritos;
- Acessar novamente a biblioteca.

Os favoritos são armazenados localmente no dispositivo.

---

## 🎮 Página individual do jogo

Cada jogo possui uma tela própria acessível através da biblioteca.

Nessa tela são apresentadas:

- Capa do jogo;
- Nome;
- Gênero;
- Plataforma;
- Favorito;
- Status atual.

Também é possível alterar o status do jogo diretamente pela interface.

---

# 📊 Status dos jogos

Cada jogo pode possuir um dos seguintes estados:

- **Não jogado**
- **Jogando**
- **Concluído**
- **Platinado**
- **Aguardando Lançamento**

O status pode ser alterado diretamente pela página individual do jogo.

As alterações são salvas automaticamente no armazenamento local.

### Aguardando lançamento

Jogos que ainda não foram lançados utilizam o status:

> Aguardando Lançamento

Esses jogos não são considerados no cálculo de progresso da biblioteca.

---

# 👤 Perfil

A tela de perfil apresenta informações e estatísticas relacionadas à biblioteca.

Entre as informações apresentadas estão:

- Perfil do usuário;
- Nome de usuário;
- Nome da pessoa;
- Tempo utilizando a plataforma;
- Plataformas utilizadas;
- Quantidade total de jogos;
- Quantidade de favoritos;
- Jogos em andamento;
- Jogos concluídos;
- Progresso da biblioteca.

As estatísticas são calculadas com base nos jogos cadastrados e nos respectivos status.

Jogos classificados como **Aguardando Lançamento** não participam do cálculo de progresso.

---

# ⚙️ Tecnologias utilizadas

O projeto utiliza React Native com Expo e diferentes bibliotecas externas.

Entre elas:

- React Native;
- Expo;
- Expo Router;
- Expo Image;
- Expo Blur;
- AsyncStorage;
- React Native Reanimated.

As bibliotecas foram utilizadas efetivamente na aplicação para adicionar funcionalidades e melhorar a experiência do usuário.

---

# 🧩 Estrutura do projeto

```text
GameVault/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── biblioteca.tsx
│   │   ├── favoritos.tsx
│   │   ├── perfil.tsx
│   │   ├── tecnologias.tsx
│   │   └── _layout.tsx
│   │
│   ├── jogo/
│   │   └── [id].tsx
│   │
│   └── _layout.tsx
│
├── assets/
│   └── games/
│       └── imagens das capas dos jogos
│
├── components/
│
├── constants/
│   ├── games.ts
│   └── theme.ts
│
├── contexts/
│   ├── FavoritesContext.tsx
│   └── GamesContext.tsx
│
├── package.json
├── package-lock.json
├── app.json
└── README.md