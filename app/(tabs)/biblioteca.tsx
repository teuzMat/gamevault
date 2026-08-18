import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { games } from '@/constants/games';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useGameStatus } from '@/contexts/GamesContext';

const filters = [
  'Todos',
  'PC',
  'PlayStation 2',
  'PlayStation 3',
  'PlayStation 4',
  'PlayStation 5',
];

export default function BibliotecaScreen() {
  const router = useRouter();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { getStatus } = useGameStatus();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [gridView, setGridView] = useState(false);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const normalizedSearch = search.toLowerCase().trim();

      const matchesSearch = game.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesPlatform =
        selectedFilter === 'Todos' ||
        game.platform === selectedFilter;

      return matchesSearch && matchesPlatform;
    });
  }, [search, selectedFilter]);

  const openGame = (gameId: string) => {
    router.push({
      pathname: '/jogo/[id]',
      params: {
        id: gameId,
      },
    });
  };

  const renderGame = ({
    item,
  }: {
    item: (typeof games)[number];
  }) => {
    const currentStatus = getStatus(
      item.id,
      item.status as any
    );

    if (gridView) {
      return (
        <Pressable
          style={styles.gridCard}
          onPress={() => openGame(item.id)}
        >
          {/* CAPA */}
          <View style={styles.gridCoverContainer}>
            <Image
              source={item.image}
              style={styles.gridCover}
              contentFit="cover"
              transition={300}
            />

            <Pressable
              onPress={() => toggleFavorite(item.id)}
              style={styles.gridFavoriteButton}
              hitSlop={8}
            >
              <Text style={styles.gridFavorite}>
                {isFavorite(item.id) ? '♥' : '♡'}
              </Text>
            </Pressable>

            <BlurView
              intensity={65}
              tint="dark"
              style={styles.gridBlurInfo}
            >
              <Text
                style={styles.gridStatus}
                numberOfLines={1}
              >
                {currentStatus}
              </Text>
            </BlurView>
          </View>

          {/* INFORMAÇÕES */}
          <View style={styles.gridInfo}>
            <Text
              style={styles.gridTitle}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            <Text
              style={styles.gridDetails}
              numberOfLines={2}
            >
              {item.genre}
            </Text>

            <Text
              style={styles.gridPlatform}
              numberOfLines={1}
            >
              {item.platform}
            </Text>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={styles.gameCard}
        onPress={() => openGame(item.id)}
      >
        {/* CAPA */}
        <View style={styles.coverContainer}>
          <Image
            source={item.image}
            style={styles.cover}
            contentFit="cover"
            transition={300}
          />

          <BlurView
            intensity={65}
            tint="dark"
            style={styles.blurInfo}
          >
            <Text
              style={styles.coverTitle}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </BlurView>
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.gameInfo}>
          <View style={styles.gameTitleRow}>
            <Text
              style={styles.gameTitle}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            <Pressable
              onPress={() => toggleFavorite(item.id)}
              style={styles.favoriteButton}
              hitSlop={8}
            >
              <Text style={styles.favorite}>
                {isFavorite(item.id) ? '♥' : '♡'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.details}>
            {item.genre} • {item.platform}
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
        key={gridView ? 'grid' : 'list'}
        data={filteredGames}
        keyExtractor={(item) => item.id}
        numColumns={gridView ? 2 : 1}
        columnWrapperStyle={
          gridView ? styles.gridRow : undefined
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
                  Organize e acompanhe seus jogos.
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setGridView((current) => !current)
                }
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
              placeholder="Pesquisar jogo..."
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
                const isSelected =
                  selectedFilter === filter;

                return (
                  <Pressable
                    onPress={() =>
                      setSelectedFilter(filter)
                    }
                    style={[
                      styles.filterButton,
                      isSelected &&
                        styles.filterButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        isSelected &&
                          styles.filterTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <Text style={styles.resultText}>
              {filteredGames.length}{' '}
              {filteredGames.length === 1
                ? 'jogo encontrado'
                : 'jogos encontrados'}
            </Text>
          </>
        }
        renderItem={renderGame}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Nenhum jogo encontrado
            </Text>

            <Text style={styles.emptyText}>
              Tente pesquisar por outro nome ou alterar o
              filtro.
            </Text>
          </View>
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

  resultText: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 14,
  },

  /*
   * ==========================================
   * MODO LISTA
   * ==========================================
   */

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

  /*
   * ==========================================
   * MODO GRADE
   * ==========================================
   */

  gridRow: {
    justifyContent: 'space-between',
  },

  gridCard: {
    width: '48.5%',
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

  gridPlatform: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 4,
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