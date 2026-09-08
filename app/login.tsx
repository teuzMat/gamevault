import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return; // Só para não deixar entrar vazio

    setIsLoading(true);
    
    // Simulação de tempo de resposta da API (Juice!)
    setTimeout(() => {
      setIsLoading(false);
      // O replace destrói a tela de login para o usuário não voltar pra ela sem querer
      router.replace('/biblioteca'); 
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        
        {/* LOGO E BOAS-VINDAS */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎮</Text>
          </View>
          <Text style={styles.appName}>GameVault</Text>
          <Text style={styles.subtitle}>Sua coleção pessoal de jogos.</Text>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#6B7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable
            style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar na Conta</Text>
            )}
          </Pressable>
        </View>

        {/* RODAPÉ */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <Pressable hitSlop={10}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </Pressable>
        </View>
        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 400, // No PC fica com tamanho de celular no meio da tela
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#151A27',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#202638',
    marginBottom: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#151A27',
    borderWidth: 1,
    borderColor: '#202638',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#3730A3', // Roxo mais apagado e escuro
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  footerLink: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '700',
  },
});