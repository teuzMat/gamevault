import { Stack } from 'expo-router';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

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
  );
}