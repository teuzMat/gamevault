// services/api.ts

const API_KEY = process.env.EXPO_PUBLIC_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  platforms: { platform: { name: string } }[];
}

// NOVA INTERFACE: Para os detalhes completos do jogo
export interface RawgGameDetails extends RawgGame {
  description_raw: string;
  genres: { name: string }[];
  achievements_count: number;
}

export const fetchGames = async (searchQuery: string = ''): Promise<RawgGame[]> => {
  try {
    const searchParam = searchQuery ? `&search=${searchQuery}` : '';
    const url = `${BASE_URL}/games?key=${API_KEY}${searchParam}&page_size=20`;

    const response = await fetch(url);
    const data = await response.json();

    return data.results;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return [];
  }
};

// NOVA FUNÇÃO: Busca um jogo específico pelo ID
export const fetchGameDetails = async (id: string): Promise<RawgGameDetails | null> => {
  try {
    const url = `${BASE_URL}/games/${id}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do jogo:', error);
    return null;
  }
};