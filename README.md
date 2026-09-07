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
- Integração de bibliotecas externas;
- Criação e organização de componentes reutilizáveis;
- Utilização de TextInput e secureTextEntry;
- Criação de formulários e validação de dados;
- Aplicação avançada de Flexbox e StyleSheet dinâmicos.
O projeto também foi desenvolvido com foco em proporcionar uma experiência semelhante a uma biblioteca pessoal de jogos.
---
# 🚀 Versão atual — 1.4 - Incompleta
A versão 1.3 representa o aprimoramento visual e estrutural do GameVault, focando em responsividade universal (Mobile, Tablet e Desktop) e estilização avançada de componentes.
Foram adicionados:
- Responsividade global para a Web/Desktop;
- Sistema de Grid Dinâmico na tela de Favoritos adaptável ao tamanho da tela (useWindowDimensions);
- Refatoração da estilização utilizando StyleSheet.create() de forma otimizada;
- Aplicação avançada de Flexbox (flexDirection, alignItems, justifyContent, gap);
- Nova organização visual na tela de cadastro (destaques laterais, melhoria de contraste e bordas);
- Ajuste de componentes de formulário para evitar distorções em telas de diferentes proporções;
- (E todas as funcionalidades herdadas da versão 1.2, como o sistema completo de biblioteca, favoritos, perfil, status persistente e validações avançadas de formulário com máscaras regex).

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
---
## ❤️ Favoritos
A tela de favoritos apresenta somente os jogos marcados pelo usuário. 
A partir da versão 1.3, esta tela conta com um Grid Dinâmico Responsivo, ajustando automaticamente a quantidade de colunas (1 a 4) com base na largura da tela do dispositivo.
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
- Tempo utilizando a plataforma;
- Plataformas utilizadas;
- Quantidade total de jogos;
- Quantidade de favoritos;
- Jogos em andamento;
- Jogos concluídos;
- Progresso da biblioteca.
---
# 📝 Cadastro de usuário
A tela de cadastro de usuário foi desenvolvida como parte do Laboratório 2, focada na componentização e estilização avançada.
## 👤 Dados pessoais e de acesso
A tela de cadastro possui os seguintes campos, todos responsivos:
- Nome completo;
- E-mail;
- Telefone;
- Data de nascimento;
- CPF;
- Senha e Confirmação de senha (com secureTextEntry).
## 🧩 Componentização e Estilização (v1.3)
A tela foi dividida em componentes próprios:
- Cabeçalho da tela;
- Campos de entrada (CadastroInput) com estilos condicionais de erro;
- Seções do formulário (CadastroSection) com layout Flexbox aprimorado;
- Botão de cadastro.
## 📱 Máscaras dos campos e Validação
- Telefone: (00) 00000-0000
- Data de nascimento: DD/MM/AAAA
- CPF: 000.000.000-00
Validações rígidas foram implementadas, impedindo o envio com dados mal formatados ou campos vazios. A persistência aqui possui finalidade acadêmica (demonstrativa via Alerts).
---
# ⚙️ Tecnologias utilizadas
- React Native;
- Expo;
- Expo Router;
- Expo Image;
- Expo Blur;
- AsyncStorage;
- React Native Reanimated.
---
# 📚 Laboratórios
## 🧪 Laboratório 1
Funcionalidades iniciais do GameVault: criação do projeto, navegação, biblioteca, status, favoritos e armazenamento local.
## 🧪 Laboratório 2
Tela de cadastro de usuário, componentização, máscaras, validações (CPF, E-mail, Data), uso de hooks do React e estilização avançada com StyleSheet e Flexbox.
---
# 🎯 Objetivo acadêmico
O projeto tem como objetivo aplicar, de forma prática, os conceitos apresentados durante as aulas de desenvolvimento mobile com React Native e Expo, permitindo criar interfaces funcionais, responsivas e visualmente agradáveis.
---
# 👨‍💻 Projeto acadêmico
Projeto desenvolvido para fins acadêmicos no curso de **Análise e Desenvolvimento de Sistemas**.
**Projeto:** GameVault
**Versão:** 1.4
**Tecnologia principal:** React Native + Expo
**Autor:** Mateus