# 🎮 GameVault
Aplicativo mobile desenvolvido em React Native com Expo para gerenciamento e acompanhamento de uma biblioteca pessoal de jogos.
O GameVault permite organizar jogos, visualizar informações, marcar favoritos, acompanhar o status de cada jogo e visualizar estatísticas da biblioteca através de um perfil.
---
## 📱 Sobre o projeto
O GameVault foi desenvolvido como projeto acadêmico para a disciplina de Análise e Desenvolvimento de Sistemas, com o objetivo de aplicar conceitos de:
- Criação de aplicações React Native com Expo;
- Estrutura de projetos React Native;
- Gerenciamento de dependências;
- Instalação e utilização de pacotes externos;
- Navegação entre telas;
- Componentização;
- Gerenciamento de estado global e local;
- Persistência de dados locais e em nuvem;
- Interface responsiva;
- Integração com APIs REST externas (RAWG API);
- Autenticação e banco de dados NoSQL em nuvem (Firebase Auth & Firestore);
- Criação e organização de componentes reutilizáveis;
- Utilização de TextInput e secureTextEntry;
- Criação de formulários, máscaras regex e validação rigorosa de dados;
- Aplicação avançada de Flexbox e StyleSheet dinâmicos.
O projeto também foi desenvolvido com foco em proporcionar uma experiência semelhante a uma biblioteca pessoal de jogos.
---
# 🚀 Versão atual — 1.4.1
A versão 1.4.1 representa a consolidação do GameVault com arquitetura em nuvem, integração de API externa e sistema completo de identidade de usuários.
Foram adicionados:
- **Integração com API externa (RAWG):** Substituição de dados estáticos por buscas e listagens dinâmicas baseadas na RAWG Video Games Database API.
- **Sistema Completo de Autenticação & Cadastro:** Implementação do Firebase Authentication para gestão segura de sessões por e-mail e senha.
- **Banco de Dados em Nuvem (Firestore):** Sincronização de dados complementares do usuário (Nome completo, Apelido exclusivo `@username`, CPF, Telefone e Data de Nascimento).
- **Gerenciamento de Estado Global (`AuthContext`):** Monitoramento automático de sessão de usuários com persistência e redirecionamentos inteligentes.
- **Responsividade global aprimorada:** Layout adaptado para dispositivos móveis e desktop, com grids dinâmicos e correções de alinhamento em componentes de perfil e telas informativas.
- **(E todas as funcionalidades herdadas das versões anteriores, como biblioteca, favoritos, perfil, status persistente e validações avançadas).**

---
# 🎮 Funcionalidades
## 🏠 Início
Tela inicial do GameVault responsável por apresentar a aplicação e fornecer acesso às principais áreas do aplicativo.
---
## 📚 Biblioteca
A biblioteca apresenta todos os jogos cadastrados consumidos dinamicamente.
É possível:
- Pesquisar jogos pelo nome;
- Filtrar jogos por plataforma;
- Visualizar os jogos em lista;
- Alternar para visualização em grade;
- Adicionar ou remover jogos dos favoritos;
- Acessar a página individual de cada jogo.
---
## ❤️ Favoritos
A tela de favoritos apresenta somente os jogos marcados pelo usuário. 
Conta com um Grid Dinâmico Responsivo, ajustando automaticamente a quantidade de colunas com base na largura da tela do dispositivo.
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
As alterações são salvas automaticamente.
---
# 📊 Status dos jogos
Cada jogo pode possuir um dos seguintes estados:
- **Não jogado**
- **Jogando**
- **Concluído**
- **Platinado**
- **Aguardando Lançamento**
O status pode ser alterado diretamente pela página individual do jogo.
### Aguardando lançamento
Jogos que ainda não foram lançados utilizam o status:
> Aguardando Lançamento
Esses jogos não são considerados no cálculo de progresso da biblioteca.
---
# 👤 Perfil
A tela de perfil apresenta informações e estatísticas relacionadas à biblioteca conectada à nuvem.
Entre as informações apresentadas estão:
- Perfil do usuário com dados reais do Firestore;
- Nome de usuário (`@username`);
- Tempo utilizando a plataforma (Membro desde...);
- Plataformas utilizadas;
- Quantidade total de jogos;
- Quantidade de favoritos;
- Jogos em andamento;
- Jogos concluídos;
- Progresso da biblioteca;
- Opções para trocar de conta ou sair (Logout).
---
# 📝 Cadastro e Login de usuário
O sistema de contas foi expandido com backend real em nuvem.
## 👤 Dados pessoais e de acesso
A tela de cadastro possui os seguintes campos, todos validados e responsivos:
- Nome completo;
- Nome de usuário (Apelido `@username`);
- E-mail;
- Telefone;
- Data de nascimento;
- CPF;
- Senha e Confirmação de senha (com secureTextEntry).
## 🧩 Componentização e Estilização
A tela foi dividida em componentes próprios:
- Cabeçalho da tela;
- Campos de entrada (`CadastroInput`) com estilos condicionais de erro;
- Seções do formulário (`CadastroSection`) com layout Flexbox aprimorado;
- Botão de cadastro integrado ao carregamento assíncrono.
## 📱 Máscaras dos campos e Validação
- Telefone: (00) 00000-0000
- Data de nascimento: DD/MM/AAAA
- CPF: 000.000.000-00
Validações rígidas foram implementadas, impedindo o envio com dados mal formatados ou campos vazios, com salvamento seguro no Firebase Authentication e Firestore.
---
# ⚙️ Tecnologias utilizadas
- React Native;
- Expo;
- Expo Router;
- TypeScript;
- RAWG Video Games Database API;
- Firebase (Authentication & Cloud Firestore);
- AsyncStorage;
- Expo Image;
- Expo Blur;
- React Native Reanimated.
---
# 📚 Módulos e Etapas do Projeto
## 🧪 Laboratório 1
Funcionalidades iniciais do GameVault: criação do projeto, navegação, biblioteca, status, favoritos e armazenamento local.
## 🧪 Laboratório 2
Tela de cadastro de usuário, componentização, máscaras, validações (CPF, E-mail, Data), uso de hooks do React e estilização avançada com StyleSheet e Flexbox.
## ☁️ Versão 1.4.1 (Nuvem & API)
Integração completa com a RAWG API, implementação do Firebase Auth e Cloud Firestore, criação do `AuthContext` e refinamento de design em grid responsivo para Desktop e Mobile.
---
# 🎯 Objetivo acadêmico
O projeto tem como objetivo aplicar, de forma prática, os conceitos apresentados durante as aulas de desenvolvimento mobile com React Native e Expo, permitindo criar interfaces funcionais, responsivas, seguras e integradas à nuvem.
---
# 👨‍💻 Projeto acadêmico
Projeto desenvolvido para fins acadêmicos no curso de **Análise e Desenvolvimento de Sistemas**, na matéria **Programação para Dispositivos Móveis**.
**Projeto:** GameVault
**Versão:** 1.4.1
**Tecnologia principal:** React Native + Expo + Firebase + RAWG API
**Autor:** Mateus Cantanhêde da Cruz
**Professor responsável pela disciplina:** Alan Felipe de Lima Neres