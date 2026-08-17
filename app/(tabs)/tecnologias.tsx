import { ScrollView, StyleSheet, Text, View } from 'react-native';

const technologies = [
  {
    name: '@react-native-async-storage/async-storage',
    category: 'Persistência local',
    description:
      'Permite armazenar informações localmente no dispositivo.',
    usage:
      'Utilizado para salvar os jogos favoritos e manter essas informações mesmo após fechar ou reiniciar o aplicativo.',
    icon: '💾',
  },
  {
    name: 'expo-linear-gradient',
    category: 'Gradientes',
    description:
      'Permite criar elementos visuais com transições suaves entre diferentes cores.',
    usage:
      'Utilizado no card principal da tela Início para criar o gradiente de cores da apresentação da biblioteca.',
    icon: '🎨',
  },
  {
    name: 'expo-haptics',
    category: 'Feedback tátil',
    description:
      'Fornece recursos de feedback háptico para interações do usuário.',
    usage:
      'Utilizado no componente HapticTab para fornecer resposta tátil durante a interação com as abas de navegação.',
    icon: '📳',
  },
  {
    name: 'expo-image',
    category: 'Imagens',
    description:
      'Oferece um componente otimizado para exibição de imagens no aplicativo.',
    usage:
      'Utilizado para carregar e exibir as capas dos jogos na Biblioteca e nos jogos em destaque da tela Início.',
    icon: '🖼️',
  },
  {
    name: 'expo-blur',
    category: 'Efeito de desfoque',
    description:
      'Permite aplicar efeitos de desfoque sobre elementos da interface.',
    usage:
      'Utilizado na Biblioteca para criar o efeito de desfoque sobre a parte inferior das capas, melhorando a apresentação das informações.',
    icon: '✨',
  },
];

export default function TecnologiasScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          GAMEVAULT
        </Text>

        <Text style={styles.title}>
          Tecnologias
        </Text>

        <Text style={styles.subtitle}>
          Bibliotecas e ferramentas utilizadas no desenvolvimento
          da aplicação.
        </Text>
      </View>

      {/* Introdução */}
      <View style={styles.introCard}>
        <View style={styles.introIconContainer}>
          <Text style={styles.introIcon}>
            🧩
          </Text>
        </View>

        <View style={styles.introContent}>
          <Text style={styles.introTitle}>
            Pacotes utilizados
          </Text>

          <Text style={styles.introText}>
            O GameVault utiliza bibliotecas externas para adicionar
            recursos de persistência, imagens, efeitos visuais e
            interação à aplicação.
          </Text>
        </View>
      </View>

      {/* Lista de tecnologias */}
      <Text style={styles.sectionTitle}>
        Bibliotecas
      </Text>

      {technologies.map((technology, index) => (
        <View
          key={technology.name}
          style={styles.techCard}
        >
          <View style={styles.techHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>
                {technology.icon}
              </Text>
            </View>

            <View style={styles.techTitleContainer}>
              <Text style={styles.techNumber}>
                PACOTE {String(index + 1).padStart(2, '0')}
              </Text>

              <Text style={styles.techName}>
                {technology.name}
              </Text>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {technology.category}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionLabel}>
            O que faz
          </Text>

          <Text style={styles.description}>
            {technology.description}
          </Text>

          <Text style={styles.descriptionLabel}>
            Utilização no GameVault
          </Text>

          <Text style={styles.usage}>
            {technology.usage}
          </Text>
        </View>
      ))}

      {/* Resumo */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryIcon}>
          🚀
        </Text>

        <Text style={styles.summaryTitle}>
          React Native + Expo
        </Text>

        <Text style={styles.summaryText}>
          As bibliotecas apresentadas foram integradas ao GameVault
          para demonstrar na prática o gerenciamento e a utilização
          de dependências em uma aplicação React Native.
        </Text>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>
          GameVault
        </Text>

        <Text style={styles.footerText}>
          Sua biblioteca. Seus jogos. Sua história.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  eyebrow: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 6,
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },

  introCard: {
    flexDirection: 'row',
    backgroundColor: '#151A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#202638',
    padding: 18,
    marginBottom: 28,
  },

  introIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#21183A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  introIcon: {
    fontSize: 23,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },

  introText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },

  techCard: {
    backgroundColor: '#151A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#202638',
    padding: 18,
    marginBottom: 14,
  },

  techHeader: {
    flexDirection: 'row',
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#1B2130',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  icon: {
    fontSize: 21,
  },

  techTitleContainer: {
    flex: 1,
  },

  techNumber: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3,
  },

  techName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#21183A',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 7,
  },

  categoryText: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#252B3A',
    marginVertical: 16,
  },

  descriptionLabel: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },

  description: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },

  usage: {
    color: '#C4B5FD',
    fontSize: 12,
    lineHeight: 18,
  },

  summaryCard: {
    backgroundColor: '#151A27',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#30264D',
    padding: 22,
    alignItems: 'center',
    marginTop: 14,
  },

  summaryIcon: {
    fontSize: 30,
    marginBottom: 10,
  },

  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 7,
  },

  summaryText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },

  footer: {
    alignItems: 'center',
    marginTop: 30,
  },

  footerTitle: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '800',
  },

  footerText: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});