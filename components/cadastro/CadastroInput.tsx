import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

type CadastroInputProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function CadastroInput({
  label,
  error,
  ...props
}: CadastroInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        {...props}
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        placeholderTextColor="#6B7280"
      />

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    height: 52,
    minHeight: 52,
    backgroundColor: '#151A27',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#252B3A',
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },

  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#1A1115',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    lineHeight: 16,
  },
});