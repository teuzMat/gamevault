import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

type FormInputProps = TextInputProps & {
  label: string;
};

export default function FormInput({
  label,
  ...inputProps
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        {...inputProps}
        style={styles.input}
        placeholderTextColor="#6B7280"
      />
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
    backgroundColor: '#151A27',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#252B3A',
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },
});