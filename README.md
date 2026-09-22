# 🎮 GameVault

Aplicativo mobile desenvolvido em React Native com Expo para gerenciamento e acompanhamento de uma biblioteca pessoal de jogos.
O GameVault permite organizar jogos, visualizar informações, dar notas pessoais, acompanhar o progresso de conquistas e visualizar estatísticas detalhadas da biblioteca através de um perfil gamificado.

---

## 📱 Sobre o projeto

O GameVault foi desenvolvido como projeto acadêmico para a disciplina de Análise e Desenvolvimento de Sistemas, com o objetivo de aplicar conceitos de:

* Criação de aplicações React Native com Expo;
* Estrutura de projetos React Native;
* Gerenciamento de dependências e pacotes externos;
* Navegação entre telas via rotas paramétricas (Expo Router) e passagem de parâmetros (`useLocalSearchParams`);
* Componentização dinâmica e gerenciamento de estado global/local (Context API, State, Props);
* Renderização otimizada de listas (`FlatList`);
* Persistência de dados locais (`AsyncStorage`) e em nuvem;
* Gamificação e micro-interações (Haptic Feedback e manipulação avançada de eventos visuais);
* Integração com APIs REST externas (RAWG API);
* Autenticação completa e banco de dados NoSQL em nuvem (Firebase Auth & Firestore);
* Interface responsiva com adaptação inteligente para Mobile e Desktop;
* Criação de formulários avançados, controle de teclado, máscaras regex e validação rigorosa de dados.

O projeto foi construído com foco em proporcionar uma experiência premium e imersiva, semelhante aos ecossistemas de plataformas consolidadas como Steam e PlayStation Network.

---

# 🚀 Versão atual — 1.6

A versão 1.6 consolida a **Interatividade e a Navegação Dinâmica**, aplicando conceitos avançados de roteamento e tratamento de eventos, garantindo um fluxo de autenticação seguro e uma arquitetura de componentes altamente otimizada.

Foram adicionados e refinados:

* **Autenticação e Roteamento Seguro:** Interceptação real de acesso através da tela de Login raiz (`index.tsx`), integrada ao Firebase Auth, bloqueando acessos não autenticados à biblioteca.
* **Navegação Dinâmica (Expo Router):** Implementação de rotas dinâmicas (`[id].tsx`), combinando navegação declarativa (`<Link>`) e programática (`router.push()`), com passagem e captura de identificadores exclusivos.
* **Componentização Avançada:** Isolamento do elemento visual `GameCard`, recebendo dados estruturados via *Props* para otimizar o desempenho de renderização das bibliotecas.
* **Eventos e Interatividade:** Respostas visuais e de sistema baseadas na interação do usuário, incluindo foco de inputs (`onFocus`/`onBlur`), submissões via teclado virtual (`onSubmitEditing`), interações táteis estendidas (`onLongPress` com *easter eggs*) e controles de estado imediato (`Switch`).
* **(Herdado das versões anteriores):** Sistema inteligente de conquistas com suporte a DLCs, dashboard de perfil gamificado, haptic feedback e avaliações pessoais por estrelas.

---

# 🎮 Funcionalidades

## 🏠 Login / Boas-Vindas

Tela inicial do GameVault responsável por proteger o acesso à aplicação. Conectada diretamente ao Firebase Authentication, oferece feedback visual de carregamento, tratamento de erros amigável (ex: credenciais inválidas) e roteamento seguro para a área logada ou para a criação de conta.

---

## 🌐 Explorar Catálogo

Interface conectada à base de dados global da RAWG API para descoberta de novos jogos.

* Pesquisa dinâmica por título.
* Adição rápida de jogos diretamente para a *Wishlist* ("Na lista para jogar") ou remoção da biblioteca.
* Exibição de notas globais e plataformas originais do jogo.

---

## 📚 Minha Biblioteca

A biblioteca apresenta todos os jogos salvos no dispositivo, consumidos e organizados dinamicamente via `FlatList` otimizada.
É possível:

* Pesquisar jogos salvos pelo nome;
* **Filtrar jogos pelo Status atual** (Jogando, Platinado, Concluído, etc.);
* Alternar instantaneamente entre a visualização em lista estruturada ou grade (Grid Dinâmico Responsivo) utilizando controles de `Switch`;
* Acompanhar rapidamente a quantidade de conquistas obtidas e a porcentagem de conclusão direto do card reutilizável de cada jogo.

---

## 🎮 Página individual do jogo (Rota Dinâmica)

Acessada via passagem de parâmetros, cada jogo possui uma tela rica em detalhes, construída de forma genérica para se adaptar ao ID recebido.
Nesta tela o usuário interage diretamente com o seu progresso:

* **Status Atual:** Alteração rápida de status, com salvamento automático.
* **Controle de Conquistas:** Input numérico para registrar troféus obtidos. Inclui opção de **edição do limite máximo de conquistas**, essencial para rastrear DLCs ou jogos antigos.
* **Sua Avaliação:** Classificação interativa em até 5 estrelas.
* **Plataformas Jogadas:** Seleção das plataformas específicas em que o usuário possui/joga o título.
* Respostas físicas (*Haptic Feedback*) acompanham as interações mais importantes.

---

# 📊 Status dos jogos

O pilar da organização da biblioteca. Cada jogo pode possuir um dos seguintes estados:

* **Não jogado** (Remove o jogo da biblioteca)
* **Na lista para jogar** (Wishlist)
* **Jogando**
* **Concluído**
* **Platinado** (Alcançável manualmente ou automaticamente ao completar 100% das conquistas)
* **Aguardando Lançamento**

---

# 👤 Perfil & Estatísticas

A tela de perfil age como o "Mural de Troféus" do jogador, lendo todos os dados do contexto e gerando um painel em tempo real:

* Identidade visual com Nickname e Nome Real.
* *Tags* dinâmicas das plataformas mais jogadas pelo usuário.
* Painel numérico: Jogos na biblioteca, total de conquistas acumuladas, número de platinas e concluídos.
* Vitrines com atalhos direcionados ("Ver todos") para as listas de últimas platinas e jogos na fila.
* Botão de controle de sessão (Logoff seguro).

---

# 📝 Cadastro de usuário

O sistema de contas com backend em nuvem e validação rígida através de estados e interatividade.

## 👤 Dados pessoais e de acesso

A tela de cadastro possui os seguintes campos validados:

* Nome completo e Nome de usuário (Apelido `@username`);
* E-mail e Telefone;
* Data de nascimento e CPF;
* Senha e Confirmação de senha (com secureTextEntry).

## 📱 Eventos e Validações

* Resposta a eventos de foco e digitação contínua, com feedback visual na interface.
* Máscaras estruturadas: Telefone: (00) 00000-0000 | Data de nascimento: DD/MM/AAAA | CPF: 000.000.000-00
* Validações rígidas que impedem o envio com dados mal formatados, campos vazios ou recusa dos termos de uso.

---

# ⚙️ Tecnologias utilizadas

* React Native & Expo;
* Expo Router (Navegação baseada em arquivos, rotas dinâmicas e passagem de parâmetros);
* TypeScript;
* RAWG Video Games Database API;
* Firebase (Authentication & Cloud Firestore);
* AsyncStorage (Persistência local);
* Expo Image & Expo Blur;
* Expo Haptics (Motores de vibração nativos);
* React Native Reanimated.

---

# 📚 Módulos e Etapas do Projeto

## 🧪 Laboratórios Iniciais (1 e 2)

Funcionalidades fundamentais: criação do projeto, layouts estáticos, validações manuais (CPF, E-mail, Data), componentização inicial de formulários e armazenamento local.

## 🧪 Laboratório 4 (Manipulação de Eventos)

Aplicação prática de manipulação de eventos nativos (`onPress`, `onLongPress`, `onFocus`, `onBlur`, `onSubmitEditing`, `onValueChange`). Integração completa entre *Props*, *State* e interface, permitindo que a aplicação responda organicamente às ações e toques do usuário.

## 🧪 Laboratório 5 (Telas Dinâmicas e Navegabilidade)

Evolução arquitetural para suportar múltiplas telas com o Expo Router. Implementação de roteamento dinâmico (`[id].tsx`), navegação declarativa e programática, passagem/recuperação de parâmetros e otimização de listas através do `FlatList` e de componentes reutilizáveis parametrizados.

## ☁️ Nuvem, Gamificação e Imersão (Versões 1.4 a 1.6)

Integração com a RAWG API, implementação do Firebase Auth e Cloud Firestore. Criação do Dashboard de Perfil Gamificado, sistema customizável de conquistas, haptic feedback e estruturação completa do fluxo de acesso seguro.

---

# 🎯 Objetivo acadêmico

O projeto tem como objetivo aplicar, de forma prática, os conceitos apresentados durante as aulas de desenvolvimento mobile com React Native e Expo, permitindo criar interfaces funcionais, responsivas, seguras, dinâmicas e com alto nível de experiência de usuário (UX).

---

# 👨‍💻 Projeto acadêmico

Projeto desenvolvido para fins acadêmicos no curso de **Análise e Desenvolvimento de Sistemas**, na matéria **Programação para Dispositivos Móveis**.
**Projeto:** GameVault
**Versão:** 1.6
**Tecnologia principal:** React Native + Expo + Firebase + RAWG API
**Autor:** Mateus Cantanhêde da Cruz
**Professor responsável pela disciplina:** Alan Felipe de Lima Neres