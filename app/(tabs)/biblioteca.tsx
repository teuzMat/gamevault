import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import GameCard from '@/components/GameCard'; // EVIDÊNCIA 4: Importação do componente reutilizável[cite: 3]
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
  
  // ==========================================
  // EVIDÊNCIA 5: State controlando a interface[cite: 3]
  // ==========================================
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

  // ==========================================
  // EVIDÊNCIA 8: Navegação programática utilizando useRouter e router.push[cite: 3]
  // EVIDÊNCIA 9: Envio do identificador (gameId) do item[cite: 3]
  // ==========================================
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

    let platformNames = 'Plataforma não informada';
    if (playedPlatforms && playedPlatforms.length > 0) {
      platformNames = playedPlatforms.join(', ');
    }

    let ratingText = personalRating ? `Sua nota: ${personalRating}/5` : 'Sem nota';

    // ==========================================
    // EVIDÊNCIA 4: Utilizando o componente reutilizável e passando dados através de Props[cite: 3]
    // ==========================================
    return (
      <GameCard
        id={stringId}
        name={item.name}
        backgroundImage={item.background_image}
        status={currentStatus}
        platformNames={platformNames}
        ratingText={ratingText}
        gridView={gridView}
        onPress={() => openGame(stringId)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* 
        ==========================================
        - O Link (no cabeçalho) realiza navegação declarativa.
        - O router.push (no componente GameCard) executa a navegação programática via código.
        ==========================================
      */}

      {/* EVIDÊNCIA 2 e 3: Utilizando FlatList, data, renderItem e keyExtractor[cite: 3] */}
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
                
                {/* EVIDÊNCIA 7: Navegando utilizando o componente Link */}
                <Link href="/explorar" asChild>
                  <Text style={styles.subtitleLink}>Ir para Explorar (via Link)</Text>
                </Link>
              </View>
              <View style={styles.headerButtons}>
                <Pressable onPress={handleExplore} style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>+ Explorar</Text>
                </Pressable>
                
                {/* EVIDÊNCIA 5: Interação (Switch) que altera o State (gridView) e modifica a interface */}
                <View style={{ alignItems: 'center', marginLeft: 10 }}>
                  <Switch 
                    value={gridView} 
                    onValueChange={setGridView} 
                    trackColor={{ true: '#7C3AED' }} 
                  />
                  <Text style={{ color: '#9CA3AF', fontSize: 10, marginTop: 2 }}>Grade</Text>
                </View>
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
  subtitleLink: { color: '#A78BFA', fontSize: 14, textDecorationLine: 'underline' },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  exploreButton: { height: 44, paddingHorizontal: 14, backgroundColor: '#7C3AED', borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  exploreButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  searchInput: { backgroundColor: '#151A27', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#FFFFFF', fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: '#252B3A' },
  filters: { gap: 10, paddingBottom: 18 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: '#151A27' },
  filterButtonSelected: { backgroundColor: '#7C3AED' },
  filterText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  filterTextSelected: { color: '#FFFFFF' },
  resultsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  resultText: { color: '#6B7280', fontSize: 13 },
  gridRow: { gap: 14 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 54, marginBottom: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 14, lineHeight: 20, textAlign: 'center', paddingHorizontal: 10 },
  emptyButton: { marginTop: 24, backgroundColor: '#7C3AED', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  emptyButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});