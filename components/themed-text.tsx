import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { mvs } from 'react-native-size-matters';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: mvs(16), // <-- Escala dinamicamente
    lineHeight: mvs(24),
  },
  defaultSemiBold: {
    fontSize: mvs(16),
    lineHeight: mvs(24),
    fontWeight: '600',
  },
  title: {
    fontSize: mvs(32),
    fontWeight: 'bold',
    lineHeight: mvs(32),
  },
  subtitle: {
    fontSize: mvs(20),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: mvs(30),
    fontSize: mvs(16),
    color: '#0a7ea4',
  },
});
