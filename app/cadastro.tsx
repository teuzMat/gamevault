import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importações do Firebase
import { auth, db } from '@/services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import CadastroButton from '@/components/cadastro/CadastroButton';
import CadastroHeader from '@/components/cadastro/CadastroHeader';
import CadastroInput from '@/components/cadastro/CadastroInput';
import CadastroSection from '@/components/cadastro/CadastroSection';

export default function CadastroScreen() {
  const insets = useSafeAreaInsets();
  
  // ==========================================
  // EVIDÊNCIA 4 e 9: onChangeText e State[cite: 1]
  // ==========================================
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Novos States para o Laboratório 04[cite: 1]
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /*
   * ==========================================
   * EVIDÊNCIA 1: Funções de Tratamento de Eventos[cite: 1]
   * ==========================================
   */
  function handleFocus() {
    console.log('Campo recebeu o foco');
    setIsFocused(true);
  }

  function handleBlur() {
    console.log('Campo perdeu o foco');
    setIsFocused(false);
  }

  function handleSubmit() {
    console.log('Teclado acionou o envio');
    Alert.alert('Ação do Teclado', 'Você pressionou o botão de envio no teclado virtual!');
  }

  function handleLongPress() {
    console.log('Pressão prolongada acionada');
    Alert.alert('🏆 Conquista Desbloqueada', 'Você encontrou a área secreta do GameVault!');
  }

  /*
   * ==========================================
   * MÁSCARAS E VALIDAÇÕES (Mantidas do original)
   * ==========================================
   */
  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const formatDataNascimento = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const validarTelefone = (value: string) => {
    const telefoneNumerico = value.replace(/\D/g, '');
    return telefoneNumerico.length === 10 || telefoneNumerico.length === 11;
  };

  const validarCpf = (value: string) => {
    const cpfNumerico = value.replace(/\D/g, '');
    if (cpfNumerico.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpfNumerico)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpfNumerico[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cpfNumerico[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpfNumerico[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    return resto === Number(cpfNumerico[10]);
  };

  const validarDataNascimento = (value: string) => {
    if (value.length !== 10) return false;
    const partes = value.split('/');
    if (partes.length !== 3) return false;

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const ano = Number(partes[2]);

    if (!Number.isInteger(dia) || !Number.isInteger(mes) || !Number.isInteger(ano)) return false;
    if (ano < 1900 || ano > new Date().getFullYear()) return false;
    if (mes < 1 || mes > 12) return false;

    const ultimoDiaDoMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > ultimoDiaDoMes) return false;

    return true;
  };

  const handleCadastro = async () => {
    // Nova validação integrada (EVIDÊNCIA 10)[cite: 1]
    if (!aceitaTermos) {
      Alert.alert('Aviso', 'Você precisa aceitar os Termos de Uso para criar uma conta.');
      return;
    }

    if (!nome.trim() || !username.trim() || !email.trim() || !telefone.trim() || !dataNascimento.trim() || !cpf.trim() || !senha || !confirmarSenha) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para continuar.');
      return;
    }
    if (nome.trim().length < 3) {
      Alert.alert('Nome inválido', 'Digite seu nome completo.');
      return;
    }
    if (username.trim().length < 3) {
      Alert.alert('Apelido inválido', 'O nome de usuário deve ter pelo menos 3 caracteres.');
      return;
    }
    const emailLimpo = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido, como exemplo@email.com.');
      return;
    }
    if (!validarTelefone(telefone)) {
      Alert.alert('Telefone inválido', 'Digite um telefone válido com DDD.');
      return;
    }
    if (!validarDataNascimento(dataNascimento)) {
      Alert.alert('Data inválida', 'Digite uma data de nascimento válida no formato DD/MM/AAAA.');
      return;
    }
    if (!validarCpf(cpf)) {
      Alert.alert('CPF inválido', 'Digite um CPF válido no formato 000.000.000-00.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha inválida', 'A senha deve possuir pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'A senha e a confirmação de senha precisam ser iguais.');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        nome: nome.trim(),
        username: username.trim().toLowerCase(),
        email: emailLimpo,
        telefone,
        dataNascimento,
        cpf,
        createdAt: new Date().toISOString(),
      });

      setIsLoading(false);

      Alert.alert(
        'Cadastro realizado!',
        `Sua conta foi criada com sucesso, ${nome.trim()}!`,
        [
          { 
            text: 'Entrar no GameVault', 
            onPress: () => {
              router.replace('/(tabs)'); 
            } 
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro no cadastro do Firebase:', error);
      setIsLoading(false);
      let errorMessage = 'Ocorreu um erro ao criar a conta. Tente novamente mais tarde.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está cadastrado em outra conta.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha informada é muito fraca.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Falha na conexão com a internet. Verifique sua rede.';
      }
      Alert.alert('Erro no cadastro', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { 
            paddingTop: insets.top + 20, 
            paddingBottom: insets.bottom + 40 
          }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.backContainer}>
          {/* 
            EVIDÊNCIA 2 e 8: Uso de onPress no botão[cite: 1]
            A função fornecida é router.back e não a sua execução imediata.
          */}
          <Button
            title="Voltar"
            color="#A78BFA"
            onPress={() => router.back()}
          />
        </View>

        <CadastroHeader />

        <CadastroSection title="Dados pessoais">
          {/*
            EVIDÊNCIA 9: Relacionar Props, Eventos e State[cite: 1]
            - placeholder: Prop.
            - onChangeText: Evento que recebe uma função.
            - value: Recebe o valor armazenado no State.
            - setNome: Função que altera o State e atualiza a interface.
          */}
          <CadastroInput
            label="Nome completo"
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <CadastroInput
            label="Nome de usuário (Apelido)"
            placeholder="ex: teuzmat"
            value={username}
            onChangeText={(text) => setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* EVIDÊNCIA 5 e 6: onFocus, onBlur e onSubmitEditing[cite: 1] */}
          <CadastroInput
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
          />

          <CadastroInput
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChangeText={(text) => setTelefone(formatTelefone(text))}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <CadastroInput
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(formatDataNascimento(text))}
            keyboardType="numeric"
            maxLength={10}
          />

          <CadastroInput
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={(text) => setCpf(formatCpf(text))}
            keyboardType="numeric"
            maxLength={14}
          />
        </CadastroSection>

        <CadastroSection title="Dados de acesso">
          <CadastroInput
            label="Senha"
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <CadastroInput
            label="Confirmar senha"
            placeholder="Digite sua senha novamente"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* EVIDÊNCIA 7: onValueChange e Switch[cite: 1] */}
          <View style={styles.switchContainer}>
            <Switch 
              value={aceitaTermos} 
              onValueChange={setAceitaTermos} 
              trackColor={{ false: '#374151', true: '#7C3AED' }}
              thumbColor={aceitaTermos ? '#FFFFFF' : '#9CA3AF'}
            />
            <Text style={styles.switchText}>
              {aceitaTermos ? 'Termos aceitos ✓' : 'Termos não aceitos'}
            </Text>
          </View>

          {/* EVIDÊNCIA 3: Pressable com onPress e onLongPress[cite: 1] */}
          <Pressable 
            style={({ pressed }) => [styles.pressableArea, pressed && styles.pressableAreaActive]}
            onPress={() => console.log('Toque rápido detectado na área secreta')}
            onLongPress={handleLongPress}
          >
            <Text style={styles.pressableText}>Área interativa: Segure pressionado para uma surpresa!</Text>
          </Pressable>

          <CadastroButton
            title={isLoading ? 'Criando conta...' : 'Cadastrar'}
            onPress={isLoading ? () => {} : handleCadastro}
          />
        </CadastroSection>

        <Text style={styles.footerText}>
          Todos os direitos reservados © Mateus Cantanhêde 
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  backContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  switchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#151A27', 
    padding: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#202638',
    marginBottom: 16
  },
  switchText: { 
    color: '#D1D5DB', 
    fontSize: 15, 
    marginLeft: 12, 
    fontWeight: '600' 
  },
  pressableArea: { 
    backgroundColor: '#21183A', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#3730A3', 
    alignItems: 'center',
    marginBottom: 16
  },
  pressableAreaActive: { 
    backgroundColor: '#3730A3' 
  },
  pressableText: { 
    color: '#A78BFA', 
    fontWeight: '700' 
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 4,
  },
});