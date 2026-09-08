import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { MinimalGame } from './FavoritesContext';

export type GameStatus =
  | 'Não jogado'
  | 'Jogando'
  | 'Concluído'
  | 'Platinado'
  | 'Aguardando Lançamento'
  | 'Na lista para jogar';

export type StoredGameStatus = {
  status: GameStatus;
  game: MinimalGame;
  selectedPlatforms?: string[]; 
  personalRating?: number;
  achievementsObtained?: number;
  maxAchievements?: number; // <-- NOVO CAMPO: O SEU TOTAL CUSTOMIZADO!
};

type GameStatusMap = Record<string, StoredGameStatus>;

type GameStatusContextData = {
  statuses: GameStatusMap;
  getStatus: (gameId: string, defaultStatus: GameStatus) => GameStatus;
  setStatus: (game: MinimalGame, status: GameStatus, platforms?: string[]) => Promise<void>;
  setPersonalRating: (gameId: string, rating: number) => Promise<void>;
  setAchievementsObtained: (gameId: string, obtained: number) => Promise<void>;
  setMaxAchievements: (gameId: string, max: number) => Promise<void>; // <-- Nova Função
  loading: boolean;
};

const GameStatusContext = createContext<GameStatusContextData | undefined>(undefined);

const STORAGE_KEY = '@gamevault:game_status_v3';

export function GameStatusProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<GameStatusMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatuses() {
      try {
        const storedStatuses = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedStatuses) {
          setStatuses(JSON.parse(storedStatuses));
        }
      } catch (error) {
        console.error('Erro ao carregar status:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStatuses();
  }, []);

  const getStatus = (gameId: string, defaultStatus: GameStatus): GameStatus => {
    return statuses[gameId]?.status ?? defaultStatus;
  };

  const setStatus = async (game: MinimalGame, status: GameStatus, platforms: string[] = []): Promise<void> => {
    const updatedStatuses = {
      ...statuses,
      [game.id]: {
        ...statuses[game.id],
        status,
        game,
        selectedPlatforms: platforms,
      },
    };
    setStatuses(updatedStatuses);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStatuses));
    } catch (error) {
      console.error('Erro ao salvar status:', error);
    }
  };

  const setPersonalRating = async (gameId: string, rating: number): Promise<void> => {
    const currentData = statuses[gameId];
    if (!currentData) return;
    const updatedStatuses = { ...statuses, [gameId]: { ...currentData, personalRating: rating } };
    setStatuses(updatedStatuses);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStatuses));
    } catch (e) { console.error(e); }
  };

  const setAchievementsObtained = async (gameId: string, obtained: number): Promise<void> => {
    const currentData = statuses[gameId];
    if (!currentData) return;
    const updatedStatuses = { ...statuses, [gameId]: { ...currentData, achievementsObtained: obtained } };
    setStatuses(updatedStatuses);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStatuses));
    } catch (e) { console.error(e); }
  };

  // ==========================================
  // FUNÇÃO DE SOBRESCRITA DO LIMITE DA RAWG
  // ==========================================
  const setMaxAchievements = async (gameId: string, max: number): Promise<void> => {
    const currentData = statuses[gameId];
    if (!currentData) return;
    const updatedStatuses = { ...statuses, [gameId]: { ...currentData, maxAchievements: max } };
    setStatuses(updatedStatuses);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStatuses));
    } catch (e) { console.error(e); }
  };

  return (
    <GameStatusContext.Provider value={{ statuses, getStatus, setStatus, setPersonalRating, setAchievementsObtained, setMaxAchievements, loading }}>
      {children}
    </GameStatusContext.Provider>
  );
}

export function useGameStatus() {
  const context = useContext(GameStatusContext);
  if (!context) throw new Error('Erro no Contexto');
  return context;
}