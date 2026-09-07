import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// ==========================================
// NOVA ESTRUTURA: Objeto minimalista
// ==========================================
export type MinimalGame = {
  id: string;
  name: string;
  background_image: string;
  rating: number;
  platforms: { platform: { name: string } }[];
};

// Nova chave para evitar conflito com os arrays de string da versão anterior
const FAVORITES_KEY = '@gamevault:favorites_v3';

type FavoritesContextData = {
  favorites: MinimalGame[]; // Agora é um array de objetos, não mais de strings
  isFavorite: (gameId: string) => boolean;
  toggleFavorite: (game: MinimalGame) => Promise<void>; // Agora recebe o objeto inteiro
  loading: boolean;
};

const FavoritesContext = createContext<FavoritesContextData | undefined>(
  undefined
);

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<MinimalGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(game: MinimalGame) {
    try {
      // Verifica se o jogo já existe comparando os IDs
      const isCurrentlyFavorite = favorites.some((g) => g.id === game.id);

      const updatedFavorites = isCurrentlyFavorite
        ? favorites.filter((g) => g.id !== game.id) // Remove se já existir
        : [...favorites, game]; // Adiciona o objeto completo se não existir

      setFavorites(updatedFavorites);

      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  }

  function isFavorite(gameId: string) {
    return favorites.some((g) => g.id === gameId);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      'useFavorites deve ser utilizado dentro de FavoritesProvider'
    );
  }

  return context;
}