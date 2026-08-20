import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CadastroButton from '@/components/cadastro/CadastroButton';
import CadastroHeader from '@/components/cadastro/CadastroHeader';
import CadastroInput from '@/components/cadastro/CadastroInput';
import CadastroSection from '@/components/cadastro/CadastroSection';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  /*
   * ==========================================
   * MÁSCARA DE TELEFONE
   * ==========================================
   *
   * Formato:
   * (00) 00000-0000
   *
   * Também funciona para telefones com
   * 10 dígitos:
   * (00) 0000-0000
   */
  const formatTelefone = (value: string) => {
    const digits = value
      .replace(/\D/g, '')
      .slice(0, 11);

    if (digits.length === 0) {
      return '';
    }

    if (digits.length <= 2) {
      return `(${digits}`;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(
        2,
        6
      )}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(
      2,
      7
    )}-${digits.slice(7, 11)}`;
  };

  /*
   * ==========================================
   * MÁSCARA DE CPF
   * ==========================================
   *
   * Formato:
   * 000.000.000-00
   */
  const formatCpf = (value: string) => {
    const digits = value
      .replace(/\D/g, '')
      .slice(0, 11);

    if (digits.length <= 3) {
      return digits;
    }

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }

    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(
        3,
        6
      )}.${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}.${digits.slice(
      3,
      6
    )}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  /*
   * ==========================================
   * MÁSCARA DE DATA DE NASCIMENTO
   * ==========================================
   *
   * Formato:
   * DD/MM/AAAA
   */
  const formatDataNascimento = (value: string) => {
    const digits = value
      .replace(/\D/g, '')
      .slice(0, 8);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(
      2,
      4
    )}/${digits.slice(4, 8)}`;
  };

  /*
   * ==========================================
   * VALIDAÇÃO DO TELEFONE
   * ==========================================
   *
   * Aceita:
   * (11) 99999-9999
   * (11) 9999-9999
   */
  const validarTelefone = (value: string) => {
    const telefoneNumerico = value.replace(/\D/g, '');

    return (
      telefoneNumerico.length === 10 ||
      telefoneNumerico.length === 11
    );
  };

  /*
   * ==========================================
   * VALIDAÇÃO DO CPF
   * ==========================================
   */
  const validarCpf = (value: string) => {
    const cpfNumerico = value.replace(/\D/g, '');

    if (cpfNumerico.length !== 11) {
      return false;
    }

    /*
     * Impede CPFs como:
     * 111.111.111-11
     * 222.222.222-22
     * etc.
     */
    if (/^(\d)\1+$/.test(cpfNumerico)) {
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma +=
        Number(cpfNumerico[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) {
      resto = 0;
    }

    if (resto !== Number(cpfNumerico[9])) {
      return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma +=
        Number(cpfNumerico[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) {
      resto = 0;
    }

    return resto === Number(cpfNumerico[10]);
  };

  /*
   * ==========================================
   * VALIDAÇÃO DA DATA
   * ==========================================
   */
  const validarDataNascimento = (value: string) => {
    if (value.length !== 10) {
      return false;
    }

    const partes = value.split('/');

    if (partes.length !== 3) {
      return false;
    }

    const dia = Number(partes[0]);
    const mes = Number(partes[1]);
    const ano = Number(partes[2]);

    if (
      !Number.isInteger(dia) ||
      !Number.isInteger(mes) ||
      !Number.isInteger(ano)
    ) {
      return false;
    }

    if (
      ano < 1900 ||
      ano > new Date().getFullYear()
    ) {
      return false;
    }

    if (mes < 1 || mes > 12) {
      return false;
    }

    const ultimoDiaDoMes = new Date(
      ano,
      mes,
      0
    ).getDate();

    if (
      dia < 1 ||
      dia > ultimoDiaDoMes
    ) {
      return false;
    }

    return true;
  };

  /*
   * ==========================================
   * CADASTRO
   * ==========================================
   */
  const handleCadastro = () => {
    /*
     * Campos obrigatórios
     */
    if (
      !nome.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !dataNascimento.trim() ||
      !cpf.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos para continuar.'
      );

      return;
    }

    /*
     * Nome
     */
    if (nome.trim().length < 3) {
      Alert.alert(
        'Nome inválido',
        'Digite seu nome completo.'
      );

      return;
    }

    /*
     * E-mail
     */
    const emailLimpo = email.trim();

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailLimpo
      );

    if (!emailValido) {
      Alert.alert(
        'E-mail inválido',
        'Digite um e-mail válido, como exemplo@email.com.'
      );

      return;
    }

    /*
     * Telefone
     */
    if (!validarTelefone(telefone)) {
      Alert.alert(
        'Telefone inválido',
        'Digite um telefone válido com DDD.'
      );

      return;
    }

    /*
     * Data de nascimento
     */
    if (!validarDataNascimento(dataNascimento)) {
      Alert.alert(
        'Data inválida',
        'Digite uma data de nascimento válida no formato DD/MM/AAAA.'
      );

      return;
    }

    /*
     * CPF
     */
    if (!validarCpf(cpf)) {
      Alert.alert(
        'CPF inválido',
        'Digite um CPF válido no formato 000.000.000-00.'
      );

      return;
    }

    /*
     * Senha
     */
    if (senha.length < 6) {
      Alert.alert(
        'Senha inválida',
        'A senha deve possuir pelo menos 6 caracteres.'
      );

      return;
    }

    /*
     * Confirmação da senha
     */
    if (senha !== confirmarSenha) {
      Alert.alert(
        'Senhas diferentes',
        'A senha e a confirmação de senha precisam ser iguais.'
      );

      return;
    }

    /*
     * ==========================================
     * CADASTRO APROVADO
     * ==========================================
     *
     * Este Alert é o retorno visual de sucesso.
     */
    Alert.alert(
      'Cadastro realizado!',
      `Bem-vindo ao GameVault, ${nome.trim()}!`,
      [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ==========================================
            VOLTAR
            ========================================== */}

        <View style={styles.backContainer}>
          <Button
            title="Voltar"
            color="#A78BFA"
            onPress={() => router.back()}
          />
        </View>

        {/* ==========================================
            CABEÇALHO
            ========================================== */}

        <CadastroHeader />

        {/* ==========================================
            DADOS PESSOAIS
            ========================================== */}

        <CadastroSection title="Dados pessoais">

          <CadastroInput
            label="Nome completo"
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <CadastroInput
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <CadastroInput
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChangeText={(text) => {
              setTelefone(
                formatTelefone(text)
              );
            }}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <CadastroInput
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            value={dataNascimento}
            onChangeText={(text) => {
              setDataNascimento(
                formatDataNascimento(text)
              );
            }}
            keyboardType="numeric"
            maxLength={10}
          />

          <CadastroInput
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={(text) => {
              setCpf(formatCpf(text));
            }}
            keyboardType="numeric"
            maxLength={14}
          />

        </CadastroSection>

        {/* ==========================================
            DADOS DE ACESSO
            ========================================== */}

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

          <CadastroButton
            title="Cadastrar"
            onPress={handleCadastro}
          />

        </CadastroSection>

        {/* ==========================================
            RODAPÉ
            ========================================== */}

        <Text style={styles.footerText}>
          Este cadastro é apenas demonstrativo para
          o Laboratório 2.
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
    paddingTop: 55,
    paddingBottom: 40,
  },

  backContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },

  footerText: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 4,
  },
});