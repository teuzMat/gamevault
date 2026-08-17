import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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

const filters = [
  'Todos',
  'PC',
  'PlayStation 2',
  'PlayStation 3',
  'PlayStation 4',
  'PlayStation 5',
];

export default function BibliotecaScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

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

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Minha Biblioteca</Text>

              <Text style={styles.subtitle}>
                Organize e acompanhe seus jogos.
              </Text>
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

            <Text style={styles.resultText}>
              {filteredGames.length}{' '}
              {filteredGames.length === 1
                ? 'jogo encontrado'
                : 'jogos encontrados'}
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.gameCard}>
            <View style={styles.coverContainer}>
              <Image
                source={item.image}
                style={styles.cover}
                contentFit="cover"
                transition={300}
              />

              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(11, 15, 25, 0.25)',
                  'rgba(11, 15, 25, 0.95)',
                ]}
                locations={[0, 0.45, 1]}
                style={styles.gradient}
              />

              <BlurView
                intensity={75}
                tint="dark"
                style={styles.blurInfo}
              >
                <View style={styles.blurTextContainer}>
                  <Text style={styles.coverTitle} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text style={styles.coverDetails}>
                    {item.genre} • {item.platform}
                  </Text>
                </View>
              </BlurView>
            </View>

            <View style={styles.gameInfo}>
              <View style={styles.gameTitleRow}>
                <Text style={styles.gameTitle}>
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
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Nenhum jogo encontrado
            </Text>

            <Text style={styles.emptyText}>
              Tente pesquisar por outro nome ou alterar o filtro.
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
    marginBottom: 24,
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

  gameCard: {
    backgroundColor: '#151A27',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#202638',
  },

  coverContainer: {
    width: '100%',
    aspectRatio: 2 / 3,
    position: 'relative',
    backgroundColor: '#1B2130',
  },

  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1B2130',
  },

  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },

  blurInfo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 64,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  blurTextContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  coverTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  coverDetails: {
    color: '#D1D5DB',
    fontSize: 11,
    marginTop: 3,
  },

  gameInfo: {
    padding: 16,
  },

  gameTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  gameTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  favoriteButton: {
    padding: 4,
    marginLeft: 12,
  },

  favorite: {
    color: '#EF4444',
    fontSize: 26,
  },

  details: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 5,
  },

  statusContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#21183A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 12,
  },

  status: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});