# 🎮 GameVault

Aplicativo mobile desenvolvido em React Native com Expo para gerenciamento e acompanhamento de uma biblioteca pessoal de jogos.
O GameVault permite organizar jogos, visualizar informações, dar notas pessoais, acompanhar o progresso de conquistas e visualizar estatísticas detalhadas da biblioteca através de um perfil gamificado.

---

## 📱 Sobre o projeto

O GameVault foi desenvolvido como projeto acadêmico para a disciplina de Análise e Desenvolvimento de Sistemas, com o objetivo de aplicar conceitos de:

* Criação de aplicações React Native com Expo;
* Estrutura de projetos React Native;
* Gerenciamento de dependências e pacotes externos;
* Navegação entre telas via rotas paramétricas (Expo Router);
* Componentização e gerenciamento de estado global/local;
* Persistência de dados locais (`AsyncStorage`) e em nuvem;
* Gamificação e micro-interações (Haptic Feedback);
* Integração com APIs REST externas (RAWG API);
* Autenticação e banco de dados NoSQL em nuvem (Firebase Auth & Firestore);
* Interface responsiva com adaptação inteligente para Mobile e Desktop;
* Criação de formulários, máscaras regex e validação rigorosa de dados.

O projeto foi construído com foco em proporcionar uma experiência premium e imersiva, semelhante aos ecossistemas de plataformas consolidadas como Steam e PlayStation Network.

---

# 🚀 Versão atual — 1.5

A versão 1.5 traz o foco para a **Gamificação e Imersão**, dando controle total ao usuário sobre sua jornada no mundo dos jogos, blindando o aplicativo contra falhas de APIs externas e refinando a interface.

Foram adicionados:

* **Sistema Inteligente de Conquistas:** Controle manual de troféus com limite máximo editável (para suportar DLCs ou jogos sem dados na API). Cálculo automático de porcentagem e "Auto-Platina" ativada ao atingir 100%.
* **Dashboard de Perfil Gamificado:** Remodelação completa do perfil, exibindo estatísticas globais (total de jogos, conquistas obtidas, concluídos), *badges* dinâmicas das plataformas jogadas e vitrines navegáveis ("Últimas Platinas" e "Fila para Jogar").
* **Avaliação Pessoal:** Sistema interativo de avaliação por estrelas (1 a 5) em cada jogo da biblioteca.
* **Micro-interações (Haptic Feedback):** Integração com `expo-haptics` para fornecer respostas vibratórias táteis sutis em seleções e fortes vibrações de recompensa ao dar notas máximas ou platinar um título.
* **Filtros e Visualização da Biblioteca:** Nova organização da biblioteca focada em filtros por *Status* e exibição imediata do progresso de conquistas no card do jogo.
* **Lobby de Entrada (Login):** Nova tela de boas-vindas e acesso à plataforma com feedback visual de carregamento.

---

# 🎮 Funcionalidades

## 🏠 Login / Boas-Vindas

Tela inicial do GameVault responsável por proteger o acesso à biblioteca e fornecer a porta de entrada à aplicação com simulação de resposta assíncrona.

---

## 🌐 Explorar Catálogo

Interface conectada à base de dados global da RAWG API para descoberta de novos jogos.

* Pesquisa dinâmica por título.
* Adição rápida de jogos diretamente para a *Wishlist* ("Na lista para jogar") ou remoção da biblioteca.
* Exibição de notas globais e plataformas originais do jogo.

---

## 📚 Minha Biblioteca

A biblioteca apresenta todos os jogos salvos no dispositivo, consumidos e organizados dinamicamente.
É possível:

* Pesquisar jogos salvos pelo nome;
* **Filtrar jogos pelo Status atual** (Jogando, Platinado, Concluído, etc.);
* Visualizar os jogos em lista estruturada ou alternar para visualização em grade (Grid Dinâmico Responsivo);
* Acompanhar rapidamente a quantidade de conquistas obtidas e a porcentagem de conclusão direto do card de cada jogo.

---

## 🎮 Página individual do jogo

Cada jogo possui uma tela rica em detalhes, acessível através da biblioteca ou do explorar.
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

O sistema de contas com backend em nuvem e validação rígida.

## 👤 Dados pessoais e de acesso

A tela de cadastro possui os seguintes campos validados:

* Nome completo e Nome de usuário (Apelido `@username`);
* E-mail e Telefone;
* Data de nascimento e CPF;
* Senha e Confirmação de senha (com secureTextEntry).

## 📱 Máscaras dos campos e Validação

* Telefone: (00) 00000-0000 | Data de nascimento: DD/MM/AAAA | CPF: 000.000.000-00
Validações rígidas foram implementadas, impedindo o envio com dados mal formatados ou vazios.

---

# ⚙️ Tecnologias utilizadas

* React Native & Expo;
* Expo Router (Navegação baseada em arquivos e passagem de parâmetros);
* TypeScript;
* RAWG Video Games Database API;
* Firebase (Authentication & Cloud Firestore);
* AsyncStorage (Persistência local);
* Expo Image & Expo Blur;
* Expo Haptics (Motores de vibração nativos);
* React Native Reanimated.

---

# 📚 Módulos e Etapas do Projeto

## 🧪 Laboratório 1

Funcionalidades iniciais: criação do projeto, navegação, biblioteca, status básicos e armazenamento local.

## 🧪 Laboratório 2

Tela de cadastro de usuário, componentização, máscaras, validações (CPF, E-mail, Data) e estilização avançada.

## ☁️ Versão 1.4.1 (Nuvem & API)

Integração com a RAWG API, implementação do Firebase Auth e Cloud Firestore, e refinamento de design em grid responsivo.

## 🏆 Versão 1.5 (Gamificação e Imersão)

Dashboard de Perfil Gamificado, sistema customizável de conquistas, suporte lógico para DLCs, avaliações pessoais por estrelas, filtros avançados de Status e imersão tátil.

---

# 🎯 Objetivo acadêmico

O projeto tem como objetivo aplicar, de forma prática, os conceitos apresentados durante as aulas de desenvolvimento mobile com React Native e Expo, permitindo criar interfaces funcionais, responsivas, seguras e com alto nível de experiência de usuário (UX).

---

# 👨‍💻 Projeto acadêmico

Projeto desenvolvido para fins acadêmicos no curso de **Análise e Desenvolvimento de Sistemas**, na matéria **Programação para Dispositivos Móveis**.
**Projeto:** GameVault
**Versão:** 1.5
**Tecnologia principal:** React Native + Expo + RAWG API
**Autor:** Mateus Cantanhêde da Cruz
**Professor responsável pela disciplina:** Alan Felipe de Lima Neres