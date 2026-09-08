import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { useGameStatus } from '@/contexts/GamesContext';

type SavedGame = {
  id: string;
  name: string;
  background_image: string;
  rating: number;
  platforms: { platform: { name: string } }[];
  achievements_count?: number;
};

const filters = [
  'Todos',
  'Jogando',
  'Na lista para jogar',
  'Concluído',
  'Platinado',
  'Aguardando Lançamento',
];

export default function BibliotecaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  
  const { width } = useWindowDimensions();
  const { statuses, getStatus } = useGameStatus();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [gridView, setGridView] = useState(false);

  useEffect(() => {
    if (params.filter && filters.includes(params.filter)) {
      setSelectedFilter(params.filter);
    }
  }, [params.filter]);

  const dynamicColumns = useMemo(() => {
    if (!gridView) return 1;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  }, [gridView, width]);

  const myLibraryGames = useMemo(() => {
    if (!statuses) return [];
    return Object.values(statuses)
      .filter((stored) => stored.status !== 'Não jogado')
      .map((stored) => stored.game as SavedGame);
  }, [statuses]);

  const filteredGames = useMemo(() => {
    return myLibraryGames.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedFilter === 'Todos') return true;
      
      const storedData = statuses[game.id.toString()];
      return storedData?.status === selectedFilter;
    });
  }, [myLibraryGames, search, selectedFilter, statuses]);

  const openGame = (gameId: string) => {
    router.push({
      pathname: '/jogo/[id]',
      params: { id: gameId },
    });
  };

  const handleExplore = () => {
    router.push('/explorar');
  };

  const renderGame = ({ item }: { item: SavedGame }) => {
    const stringId = item.id.toString();
    const storedData = statuses[stringId];
    const currentStatus = storedData?.status ?? 'Não jogado';
    
    const playedPlatforms = storedData?.selectedPlatforms;
    const personalRating = storedData?.personalRating;

    const obtained = (storedData as any)?.achievementsObtained || 0;
    const total = (storedData as any)?.maxAchievements || item.achievements_count || 0;
    const percentage = total > 0 ? Math.round((obtained / total) * 100) : 0;

    let platformNames = 'Plataforma não informada';
    if (playedPlatforms && playedPlatforms.length > 0) {
      platformNames = playedPlatforms.join(', ');
    }

    let ratingText = personalRating ? `Sua nota: ${personalRating}/5` : 'Sem nota';

    if (gridView) {
      return (
        <Pressable style={styles.gridCard} onPress={() => openGame(stringId)}>
          <View style={styles.gridCoverContainer}>
            <Image source={{ uri: item.background_image }} style={styles.gridCover} contentFit="cover" transition={300} />
            <BlurView intensity={65} tint="dark" style={styles.gridBlurInfo}>
              <Text style={styles.gridStatus} numberOfLines={1}>{currentStatus}</Text>
            </BlurView>
          </View>
          <View style={styles.gridInfo}>
            <Text style={styles.gridTitle} numberOfLines={2}>{item.name}</Text>
            <View style={styles.gridInfoBottom}>
              <Text style={styles.gridDetails} numberOfLines={1}>{platformNames}</Text>
              {total > 0 && <Text style={styles.gridPercentage}>{percentage}%</Text>}
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable style={styles.gameCard} onPress={() => openGame(stringId)}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: item.background_image }} style={styles.cover} contentFit="cover" transition={300} />
          <BlurView intensity={65} tint="dark" style={styles.blurInfo}>
            <Text style={styles.coverTitle} numberOfLines={1}>{item.name}</Text>
          </BlurView>
        </View>

        <View style={styles.gameInfo}>
          <View style={styles.gameTitleRow}>
            <Text style={styles.gameTitle} numberOfLines={2}>{item.name}</Text>
          </View>
          <Text style={styles.details}>{ratingText} • {platformNames}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>{currentStatus}</Text>
          </View>
        </View>

        {total > 0 && (
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementText}>{obtained}/{total}</Text>
            <Text style={styles.achievementPercent}>{percentage}%</Text>
          </View>
        )}
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
        columnWrapperStyle={dynamicColumns > 1 ? styles.gridRow : undefined}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Minha Biblioteca</Text>
                <Text style={styles.subtitle}>Seus jogos salvos e catalogados.</Text>
              </View>
              <View style={styles.headerButtons}>
                <Pressable onPress={handleExplore} style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>+ Explorar</Text>
                </Pressable>
                <Pressable onPress={() => setGridView((current) => !current)} style={styles.viewButton} hitSlop={8}>
                  <Text style={styles.viewButtonIcon}>{gridView ? '☰' : '▦'}</Text>
                </Pressable>
              </View>
            </View>

            {myLibraryGames.length > 0 && (
              <>
                <TextInput value={search} onChangeText={setSearch} placeholder="Pesquisar na sua biblioteca..." placeholderTextColor="#6B7280" style={styles.searchInput} />

                <FlatList
                  horizontal data={filters} keyExtractor={(item) => item}
                  showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}
                  renderItem={({ item: filter }) => {
                    const isSelected = selectedFilter === filter;
                    return (
                      <Pressable onPress={() => setSelectedFilter(filter)} style={[styles.filterButton, isSelected && styles.filterButtonSelected]}>
                        <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>{filter}</Text>
                      </Pressable>
                    );
                  }}
                />

                <View style={styles.resultsRow}>
                  <Text style={styles.resultText}>{filteredGames.length} {filteredGames.length === 1 ? 'jogo listado' : 'jogos listados'}</Text>
                </View>
              </>
            )}
          </>
        }
        renderItem={renderGame}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎮</Text>
            <Text style={styles.emptyTitle}>Sua biblioteca está vazia</Text>
            <Text style={styles.emptyText}>Você ainda não adicionou nenhum título. Explore o catálogo global para montar sua coleção!</Text>
            <Pressable style={styles.emptyButton} onPress={handleExplore}>
              <Text style={styles.emptyButtonText}>Adicionar jogos</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: 20, paddingTop: 60, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerText: { flex: 1, paddingRight: 10 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#9CA3AF', fontSize: 15 },
  headerButtons: { flexDirection: 'row', gap: 10 },
  exploreButton: { height: 44, paddingHorizontal: 14, backgroundColor: '#7C3AED', borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  exploreButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  viewButton: { width: 44, height: 44, borderRadius: 13, backgroundColor: '#151A27', borderWidth: 1, borderColor: '#252B3A', alignItems: 'center', justifyContent: 'center' },
  viewButtonIcon: { color: '#A78BFA', fontSize: 23, fontWeight: '700' },
  searchInput: { backgroundColor: '#151A27', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#FFFFFF', fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: '#252B3A' },
  filters: { gap: 10, paddingBottom: 18 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: '#151A27' },
  filterButtonSelected: { backgroundColor: '#7C3AED' },
  filterText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  filterTextSelected: { color: '#FFFFFF' },
  resultsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  resultText: { color: '#6B7280', fontSize: 13 },
  gameCard: { flexDirection: 'row', backgroundColor: '#151A27', borderRadius: 18, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: '#202638', minHeight: 145 },
  coverContainer: { width: 105, height: 145, position: 'relative', backgroundColor: '#1B2130' },
  cover: { width: '100%', height: '100%', backgroundColor: '#1B2130' },
  blurInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 8, paddingVertical: 7, overflow: 'hidden' },
  coverTitle: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  gameInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  gameTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  gameTitle: { flex: 1, color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 20 },
  details: { color: '#9CA3AF', fontSize: 12, lineHeight: 17, marginTop: 6 },
  statusContainer: { alignSelf: 'flex-start', backgroundColor: '#21183A', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5, marginTop: 10 },
  status: { color: '#A855F7', fontSize: 11, fontWeight: '600' },
  achievementBadge: { justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16, paddingLeft: 10 },
  achievementText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  achievementPercent: { color: '#A78BFA', fontSize: 12, fontWeight: '700', marginTop: 2 },
  gridRow: { gap: 14 },
  gridCard: { flex: 1, backgroundColor: '#151A27', borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: '#202638' },
  gridCoverContainer: { width: '100%', aspectRatio: 2 / 3, position: 'relative', backgroundColor: '#1B2130' },
  gridCover: { width: '100%', height: '100%', backgroundColor: '#1B2130' },
  gridBlurInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 9, paddingVertical: 7, overflow: 'hidden' },
  gridStatus: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  gridInfo: { padding: 11 },
  gridTitle: { color: '#FFFFFF', fontSize: 14, lineHeight: 18, fontWeight: '700', minHeight: 36 },
  gridInfoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  gridDetails: { flex: 1, color: '#9CA3AF', fontSize: 11, lineHeight: 15, paddingRight: 5 },
  gridPercentage: { color: '#A78BFA', fontSize: 11, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 54, marginBottom: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 14, lineHeight: 20, textAlign: 'center', paddingHorizontal: 10 },
  emptyButton: { marginTop: 24, backgroundColor: '#7C3AED', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  emptyButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});