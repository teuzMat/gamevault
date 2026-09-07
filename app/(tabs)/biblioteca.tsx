import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { useFavorites } from '@/contexts/FavoritesContext';
import { useGameStatus } from '@/contexts/GamesContext';
import { fetchGames, RawgGame } from '@/services/api';

const filters = [
  'Todos',
  'PC',
  'PlayStation 4',
  'PlayStation 5',
  'Xbox One',
  'Xbox Series S/X',
  'Nintendo Switch',
];

export default function BibliotecaScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { getStatus } = useGameStatus();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [gridView, setGridView] = useState(false);
  
  const [apiGames, setApiGames] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // BUSCA NA API
  // ==========================================
  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      const data = await fetchGames(search);
      setApiGames(data);
      setIsLoading(false);
    };

    const delay = setTimeout(() => {
      loadGames();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  // ==========================================
  // LÓGICA DE COLUNAS DINÂMICAS
  // ==========================================
  const dynamicColumns = useMemo(() => {
    if (!gridView) return 1;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  }, [gridView, width]);

  // ==========================================
  // FILTRO LOCAL POR PLATAFORMA
  // ==========================================
  const filteredGames = useMemo(() => {
    return apiGames.filter((game) => {
      if (selectedFilter === 'Todos') return true;
      
      const hasPlatform = game.platforms?.some((p) => 
        p.platform.name.toLowerCase().includes(selectedFilter.toLowerCase())
      );
      
      return hasPlatform;
    });
  }, [apiGames, selectedFilter]);

  const openGame = (gameId: string) => {
    router.push({
      pathname: '/jogo/[id]',
      params: { id: gameId },
    });
  };

  const renderGame = ({ item }: { item: RawgGame }) => {
    const stringId = item.id.toString();
    const currentStatus = getStatus(stringId, 'Não jogado');

    // Mapeando as plataformas para exibição visual
    const platformNames = item.platforms?.map(p => p.platform.name).slice(0, 3).join(', ') || 'Várias plataformas';

    // CORREÇÃO AQUI: Criando o objeto MinimalGame que o nosso Contexto agora espera!
    const gameToSave = {
      id: stringId,
      name: item.name,
      background_image: item.background_image,
      rating: item.rating,
      platforms: item.platforms || [],
    };

    if (gridView) {
      return (
        <Pressable
          style={styles.gridCard}
          onPress={() => openGame(stringId)}
        >
          {/* CAPA */}
          <View style={styles.gridCoverContainer}>
            <Image
              source={{ uri: item.background_image }}
              style={styles.gridCover}
              contentFit="cover"
              transition={300}
            />

            <Pressable
              onPress={() => toggleFavorite(gameToSave)} // <-- Enviando o objeto!
              style={styles.gridFavoriteButton}
              hitSlop={8}
            >
              <Text style={styles.gridFavorite}>
                {isFavorite(stringId) ? '♥' : '♡'}
              </Text>
            </Pressable>

            <BlurView
              intensity={65}
              tint="dark"
              style={styles.gridBlurInfo}
            >
              <Text style={styles.gridStatus} numberOfLines={1}>
                {currentStatus}
              </Text>
            </BlurView>
          </View>

          {/* INFORMAÇÕES */}
          <View style={styles.gridInfo}>
            <Text style={styles.gridTitle} numberOfLines={2}>
              {item.name}
            </Text>

            <Text style={styles.gridDetails} numberOfLines={1}>
              {platformNames}
            </Text>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={styles.gameCard}
        onPress={() => openGame(stringId)}
      >
        {/* CAPA */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: item.background_image }}
            style={styles.cover}
            contentFit="cover"
            transition={300}
          />

          <BlurView
            intensity={65}
            tint="dark"
            style={styles.blurInfo}
          >
            <Text style={styles.coverTitle} numberOfLines={1}>
              {item.name}
            </Text>
          </BlurView>
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.gameInfo}>
          <View style={styles.gameTitleRow}>
            <Text style={styles.gameTitle} numberOfLines={2}>
              {item.name}
            </Text>

            <Pressable
              onPress={() => toggleFavorite(gameToSave)} // <-- Enviando o objeto!
              style={styles.favoriteButton}
              hitSlop={8}
            >
              <Text style={styles.favorite}>
                {isFavorite(stringId) ? '♥' : '♡'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.details}>
            Nota: {item.rating} • {platformNames}
          </Text>

          <View style={styles.statusContainer}>
            <Text style={styles.status}>
              {currentStatus}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        key={`${gridView ? 'grid' : 'list'}-${dynamicColumns}`}
        data={filteredGames}
        keyExtractor={(item) => item.id.toString()}
        numColumns={dynamicColumns}
        columnWrapperStyle={
          dynamicColumns > 1 ? styles.gridRow : undefined
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  Minha Biblioteca
                </Text>

                <Text style={styles.subtitle}>
                  Explore jogos do mundo inteiro.
                </Text>
              </View>

              <Pressable
                onPress={() => setGridView((current) => !current)}
                style={styles.viewButton}
                hitSlop={8}
              >
                <Text style={styles.viewButtonIcon}>
                  {gridView ? '☰' : '▦'}
                </Text>
              </Pressable>
            </View>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Pesquisar jogo (ex: GTA, Zelda)..."
              placeholderTextColor="#6B7280"
              style={styles.searchInput}
            />

            <FlatList
              horizontal
              data={filters}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
              renderItem={({ item: filter }) => {
                const isSelected = selectedFilter === filter;
                return (
                  <Pressable
                    onPress={() => setSelectedFilter(filter)}
                    style={[
                      styles.filterButton,
                      isSelected && styles.filterButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        isSelected && styles.filterTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <View style={styles.resultsRow}>
              <Text style={styles.resultText}>
                {filteredGames.length}{' '}
                {filteredGames.length === 1
                  ? 'jogo encontrado'
                  : 'jogos encontrados'}
              </Text>
              {isLoading && <ActivityIndicator size="small" color="#7C3AED" />}
            </View>
          </>
        }
        renderItem={renderGame}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                Nenhum jogo encontrado
              </Text>
              <Text style={styles.emptyText}>
                Tente pesquisar por outro nome ou alterar o filtro de plataforma.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  content: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    paddingRight: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 15,
  },
  viewButton: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#151A27',
    borderWidth: 1,
    borderColor: '#252B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonIcon: {
    color: '#A78BFA',
    fontSize: 23,
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#151A27',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#252B3A',
  },
  filters: {
    gap: 10,
    paddingBottom: 18,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#151A27',
  },
  filterButtonSelected: {
    backgroundColor: '#7C3AED',
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultText: {
    color: '#6B7280',
    fontSize: 13,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#151A27',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#202638',
    minHeight: 145,
  },
  coverContainer: {
    width: 105,
    height: 145,
    position: 'relative',
    backgroundColor: '#1B2130',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1B2130',
  },
  blurInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 7,
    overflow: 'hidden',
  },
  coverTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  gameInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  gameTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  gameTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  favorite: {
    color: '#EF4444',
    fontSize: 24,
  },
  details: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#21183A',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 10,
  },
  status: {
    color: '#A855F7',
    fontSize: 11,
    fontWeight: '600',
  },
  gridRow: {
    gap: 14,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#151A27',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#202638',
  },
  gridCoverContainer: {
    width: '100%',
    aspectRatio: 2 / 3,
    position: 'relative',
    backgroundColor: '#1B2130',
  },
  gridCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1B2130',
  },
  gridFavoriteButton: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(11, 15, 25, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  gridFavorite: {
    color: '#EF4444',
    fontSize: 21,
  },
  gridBlurInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 9,
    paddingVertical: 7,
    overflow: 'hidden',
  },
  gridStatus: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  gridInfo: {
    padding: 11,
  },
  gridTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    minHeight: 36,
  },
  gridDetails: {
    color: '#9CA3AF',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});