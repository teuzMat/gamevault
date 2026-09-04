import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CadastroSectionProps = {
  title: string;
  children: ReactNode;
};

export default function CadastroSection({
  title,
  children,
}: CadastroSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.card}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#151A27',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(37, 43, 58, 0.8)',
    
    // Sombras para iOS e Web
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    
    // Sombra para Android
    elevation: 8,
  },
});