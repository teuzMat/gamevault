import { Stack } from 'expo-router';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// 1. Importamos o nosso provedor de Autenticação
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { GameStatusProvider } from '@/contexts/GamesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 2. Abraçamos toda a aplicação com o AuthProvider!
    <AuthProvider>
      <GameStatusProvider>
        <FavoritesProvider>
          <SafeAreaProvider>
            <ThemeProvider
              value={
                colorScheme === 'dark'
                  ? DarkTheme
                  : DefaultTheme
              }
            >
              {/* O screenOptions aqui remove o cabeçalho de todas as rotas de uma só vez */}
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />

                {/* 3. Ecrã inicial atualizado para "index" em vez de "login" */}
                <Stack.Screen name="index" />
                <Stack.Screen name="cadastro" />
                <Stack.Screen name="jogo/[id]" />

                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    title: 'Modal',
                    // Mantemos apenas as opções exclusivas do modal
                  }}
                />
              </Stack>

              <StatusBar style="auto" />
            </ThemeProvider>
          </SafeAreaProvider>
        </FavoritesProvider>
      </GameStatusProvider>
    </AuthProvider>
  );
}