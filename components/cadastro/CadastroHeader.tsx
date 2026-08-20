import { StyleSheet, Text, View } from 'react-native';

export default function CadastroHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🎮</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Criar sua conta
        </Text>

        <Text style={styles.subtitle}>
          Faça parte do GameVault e organize sua biblioteca.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 25,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 5,
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 19,
  },
});