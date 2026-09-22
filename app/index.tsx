import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Importações do Firebase para Autenticação
import { auth } from '@/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o e-mail e a palavra-passe.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tenta autenticar o utilizador no Firebase
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      
      setIsLoading(false);
      
      // 2. O replace destrói o ecrã de login para o utilizador não conseguir voltar para trás sem fazer logoff
      router.replace('/(tabs)'); 
    } catch (error: any) {
      setIsLoading(false);
      console.error('Erro no login:', error);
      
      let errorMessage = 'Ocorreu um erro ao tentar iniciar sessão. Verifique a sua ligação.';
      
      // Tratamento amigável dos erros do Firebase
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'E-mail ou palavra-passe incorretos.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas falhadas. Tente novamente mais tarde.';
      }
      
      Alert.alert('Erro no Login', errorMessage);
    }
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
          <Text style={styles.subtitle}>A sua biblioteca gamer num só lugar.</Text>
        </View>

        {/* FORMULÁRIO DE LOGIN */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Palavra-passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#6B7280"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <Pressable
            style={[styles.loginButton, (!email || !senha) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!email || !senha || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sessão</Text>
            )}
          </Pressable>
        </View>

        {/* RODAPÉ COM LIGAÇÃO PARA O REGISTO */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <Pressable hitSlop={10} onPress={() => router.push('/cadastro')}>
            <Text style={styles.footerLink}>Registe-se</Text>
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
    maxWidth: 400, // No PC ou tablet fica com tamanho de telemóvel centrado no ecrã
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
    backgroundColor: '#3730A3',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.7,
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