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
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />

                {/* 3. Registramos a nova tela de Login */}
                <Stack.Screen
                  name="login"
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="cadastro"
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="jogo/[id]"
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    title: 'Modal',
                    headerShown: false
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