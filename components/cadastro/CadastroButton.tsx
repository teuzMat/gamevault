import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

type CadastroButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export default function CadastroButton({
  title,
  onPress,
  variant = 'primary',
}: CadastroButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,

        variant === 'primary'
          ? styles.primaryButton
          : styles.secondaryButton,

        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,

          variant === 'primary'
            ? styles.primaryButtonText
            : styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButton: {
    backgroundColor: '#7C3AED',
    marginTop: 8,
  },

  secondaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#151A27',
    borderWidth: 1,
    borderColor: '#252B3A',
    paddingHorizontal: 18,
    height: 44,
    marginBottom: 18,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },

  primaryButtonText: {
    color: '#FFFFFF',
  },

  secondaryButtonText: {
    color: '#A78BFA',
  },
});