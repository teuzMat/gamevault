import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { MinimalGame } from './FavoritesContext'; // Importando a tipagem que criamos no Favorites!

export type GameStatus =
  | 'Não jogado'
  | 'Jogando'
  | 'Concluído'
  | 'Platinado'
  | 'Aguardando Lançamento';

// ==========================================
// NOVA ESTRUTURA: Objeto minimalista + Status
// ==========================================
export type StoredGameStatus = {
  status: GameStatus;
  game: MinimalGame;
};

// Agora o mapa guarda o ID do jogo e o objeto StoredGameStatus (que tem o status e a capa)
type GameStatusMap = Record<string, StoredGameStatus>;

type GameStatusContextData = {
  statuses: GameStatusMap;
  getStatus: (gameId: string, defaultStatus: GameStatus) => GameStatus;
  setStatus: (game: MinimalGame, status: GameStatus) => Promise<void>; // Agora recebe o objeto inteiro
  loading: boolean;
};

const GameStatusContext = createContext<GameStatusContextData | undefined>(
  undefined
);

// Nova chave para evitar conflito com os dados antigos e quebrar o app
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
    // Busca o status dentro do novo objeto salvo
    return statuses[gameId]?.status ?? defaultStatus;
  };

  const setStatus = async (
    game: MinimalGame,
    status: GameStatus
  ): Promise<void> => {
    const updatedStatuses = {
      ...statuses,
      [game.id]: {
        status,
        game,
      },
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