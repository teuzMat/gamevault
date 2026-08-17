import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

const FAVORITES_KEY = '@gamevault:favorites';

type FavoritesContextData = {
  favorites: string[];
  isFavorite: (gameId: string) => boolean;
  toggleFavorite: (gameId: string) => Promise<void>;
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
  const [favorites, setFavorites] = useState<string[]>([]);
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

  async function toggleFavorite(gameId: string) {
    try {
      const isCurrentlyFavorite = favorites.includes(gameId);

      const updatedFavorites = isCurrentlyFavorite
        ? favorites.filter((id) => id !== gameId)
        : [...favorites, gameId];

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
    return favorites.includes(gameId);
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