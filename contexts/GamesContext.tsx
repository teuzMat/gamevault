import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type GameStatus =
  | 'Não jogado'
  | 'Jogando'
  | 'Concluído'
  | 'Platinado'
  | 'Aguardando Lançamento';

type GameStatusMap = Record<string, GameStatus>;

type GameStatusContextData = {
  statuses: GameStatusMap;
  getStatus: (gameId: string, defaultStatus: GameStatus) => GameStatus;
  setStatus: (gameId: string, status: GameStatus) => Promise<void>;
  loading: boolean;
};

const GameStatusContext = createContext<GameStatusContextData | undefined>(
  undefined
);

const STORAGE_KEY = '@gamevault_game_status';

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
        console.error('Erro ao carregar status dos jogos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStatuses();
  }, []);

  const getStatus = (
    gameId: string,
    defaultStatus: GameStatus
  ): GameStatus => {
    return statuses[gameId] ?? defaultStatus;
  };

  const setStatus = async (
    gameId: string,
    status: GameStatus
  ): Promise<void> => {
    const updatedStatuses = {
      ...statuses,
      [gameId]: status,
    };

    setStatuses(updatedStatuses);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedStatuses)
      );
    } catch (error) {
      console.error('Erro ao salvar status do jogo:', error);
    }
  };

  return (
    <GameStatusContext.Provider
      value={{
        statuses,
        getStatus,
        setStatus,
        loading,
      }}
    >
      {children}
    </GameStatusContext.Provider>
  );
}

export function useGameStatus() {
  const context = useContext(GameStatusContext);

  if (!context) {
    throw new Error(
      'useGameStatus deve ser utilizado dentro de GameStatusProvider'
    );
  }

  return context;
}