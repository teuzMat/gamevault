export type Game = {
  id: string;
  name: string;
  genre: string;
  platform: string;
  status: string;
  favorite: boolean;
  image: any;
};

export const games: Game[] = [
  // League of Legends / Valorant
  {
    id: '1',
    name: 'League of Legends',
    genre: 'MOBA',
    platform: 'PC',
    status: 'Jogando',
    favorite: true,
    image: require('@/assets/games/league-of-legends.jpg'),
  },

  {
    id: '2',
    name: 'Valorant',
    genre: 'FPS',
    platform: 'PC',
    status: 'Jogando',
    favorite: true,
    image: require('@/assets/games/valorant.jpg'),
  },

  // LEGO Batman
  {
    id: '3',
    name: 'LEGO Batman: The Videogame',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 2',
    status: 'Concluído',
    favorite: true,
    image: require('@/assets/games/lego-batman.jpg'),
  },

  {
    id: '4',
    name: 'LEGO Batman 2: DC Super Heroes',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 2',
    status: 'Concluído',
    favorite: false,
    image: require('@/assets/games/lego-batman-2.jpg'),
  },

  {
    id: '5',
    name: 'LEGO Batman 3: Beyond Gotham',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 2',
    status: 'Não jogado',
    favorite: false,
    image: require('@/assets/games/lego-batman-3.webp'),
  },

  {
    id: '6',
    name: 'LEGO Batman: Legacy of the Dark Knight',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 5',
    status: 'Não jogado',
    favorite: false,
    image: require('@/assets/games/lego-batman-legacy.jpg'),
  },

  // God of War
  {
    id: '7',
    name: 'God of War',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 2',
    status: 'Concluído',
    favorite: true,
    image: require('@/assets/games/god-of-war.png'),
  },

  {
    id: '8',
    name: 'God of War II',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 2',
    status: 'Concluído',
    favorite: true,
    image: require('@/assets/games/god-of-war-2.png'),
  },

  {
    id: '9',
    name: 'God of War III',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 3',
    status: 'Concluído',
    favorite: true,
    image: require('@/assets/games/god-of-war-3.png'),
  },

  {
    id: '10',
    name: 'God of War',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 4',
    status: 'Concluído',
    favorite: true,
    image: require('@/assets/games/god-of-war-2018.png'),
  },

  {
    id: '11',
    name: 'God of War Ragnarök',
    genre: 'Ação / Aventura',
    platform: 'PlayStation 5',
    status: 'Jogando',
    favorite: true,
    image: require('@/assets/games/god-of-war-ragnarok.jpg'),
  },

  // Marvel's Spider-Man
  {
    id: '12',
    name: "Marvel's Spider-Man",
    genre: 'Ação / Aventura',
    platform: 'PlayStation 4',
    status: 'Concluído',
    favorite: true,
    image: require('@/assets/games/spider-man.png'),
  },

  {
    id: '13',
    name: "Marvel's Spider-Man: Miles Morales",
    genre: 'Ação / Aventura',
    platform: 'PlayStation 5',
    status: 'Concluído',
    favorite: true,
    image: require('@/assets/games/miles-morales.png'),
  },

  {
    id: '14',
    name: "Marvel's Spider-Man 2",
    genre: 'Ação / Aventura',
    platform: 'PlayStation 5',
    status: 'Jogando',
    favorite: true,
    image: require('@/assets/games/spider-man-2.jpg'),
  },

  // Grand Theft Auto
  {
    id: '15',
    name: 'Grand Theft Auto IV',
    genre: 'Ação / Mundo Aberto',
    platform: 'PC',
    status: 'Concluído',
    favorite: false,
    image: require('@/assets/games/gta-iv.png'),
  },

  {
    id: '16',
    name: 'Grand Theft Auto V',
    genre: 'Ação / Mundo Aberto',
    platform: 'PlayStation 5',
    status: 'Jogando',
    favorite: true,
    image: require('@/assets/games/gta-v.png'),
  },

  {
    id: '17',
    name: 'Grand Theft Auto VI',
    genre: 'Ação / Mundo Aberto',
    platform: 'PlayStation 5',
    status: 'Não jogado',
    favorite: true,
    image: require('@/assets/games/gta-vi.jpg'),
  },

  // Minecraft
  {
    id: '18',
    name: 'Minecraft',
    genre: 'Sandbox',
    platform: 'PC',
    status: 'Jogando',
    favorite: true,
    image: require('@/assets/games/minecraft.png'),
  },

  {
    id: '19',
    name: 'Minecraft Dungeons',
    genre: 'RPG / Ação',
    platform: 'PC',
    status: 'Não jogado',
    favorite: false,
    image: require('@/assets/games/minecraft-dungeons.webp'),
  },

  {
    id: '20',
    name: 'Minecraft Dungeons 2',
    genre: 'RPG / Ação',
    platform: 'PC',
    status: 'Aguardando Lançamento',
    favorite: false,
    image: require('@/assets/games/minecraft-dungeons-2.png'),
  },

  // Outros
  {
    id: '21',
    name: 'PEAK',
    genre: 'Aventura / Cooperação',
    platform: 'PC',
    status: 'Jogando',
    favorite: true,
    image: require('@/assets/games/peak.jpg'),
  },

  {
    id: '22',
    name: 'Big Walk',
    genre: 'Aventura / Cooperação',
    platform: 'PC',
    status: 'Não jogado',
    favorite: false,
    image: require('@/assets/games/big-walk.jpg'),
  },

  {
    id: '23',
    name: 'Good Pizza, Great Pizza',
    genre: 'Simulação',
    platform: 'PC',
    status: 'Jogando',
    favorite: false,
    image: require('@/assets/games/good-pizza-great-pizza.png'),
  },
];