import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGameStatus } from '@/contexts/GamesContext';
import { fetchGames, RawgGame } from '@/services/api';

export default function ExplorarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Agora usamos apenas o status, sem os favoritos
  const { statuses, getStatus, setStatus } = useGameStatus();

  const [search, setSearch] = useState('');
  const [apiGames, setApiGames] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const openGame = (gameId: string) => {
    router.push({
      pathname: '/jogo/[id]',
      params: { id: gameId },
    });
  };

  const renderGame = ({ item }: { item: RawgGame }) => {
    const stringId = item.id.toString();
    const currentStatus = getStatus(stringId, 'Não jogado');
    const platformNames = item.platforms?.map(p => p.platform.name).slice(0, 3).join(', ') || 'Várias plataformas';
    
    const inLibrary = currentStatus !== 'Não jogado';

    const gameToSave = {
      id: stringId,
      name: item.name,
      background_image: item.background_image,
      rating: item.rating,
      platforms: item.platforms || [],
      //achievements_count: item.achievements_count, // Necessário para a porcentagem depois
    };

    const handleAdd = () => {
      if (inLibrary) {
        setStatus(gameToSave as any, 'Não jogado');
      } else {
        // Envia direto para a Wishlist!
        setStatus(gameToSave as any, 'Na lista para jogar');
      }
    };

    return (
      <Pressable
        style={styles.gameCard}
        onPress={() => openGame(stringId)}
      >
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: item.background_image }}
            style={styles.cover}
            contentFit="cover"
            transition={300}
          />
          <BlurView intensity={65} tint="dark" style={styles.blurInfo}>
            <Text style={styles.coverTitle} numberOfLines={1}>
              {item.name}
            </Text>
          </BlurView>
        </View>

        <View style={styles.gameInfo}>
          <View style={styles.gameTitleRow}>
            <Text style={styles.gameTitle} numberOfLines={2}>
              {item.name}
            </Text>

            <Pressable
              onPress={handleAdd}
              style={[
                styles.addButton,
                inLibrary && styles.addButtonActive
              ]}
              hitSlop={8}
            >
              <Text style={[styles.addButtonIcon, inLibrary && styles.addButtonIconActive]}>
                {inLibrary ? '✓' : '+'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.details}>
            Nota: {item.rating} • {platformNames}
          </Text>

          {inLibrary && (
            <View style={styles.statusContainer}>
              <Text style={styles.status}>
                Na biblioteca ({currentStatus})
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.wrapper}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonIcon}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Explorar Catálogo</Text>
        </View>

        <View style={styles.content}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Pesquisar jogos no mundo todo..."
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
            autoFocus={true}
          />

          <FlatList
            data={apiGames}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={renderGame}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#7C3AED" />
                ) : (
                  <>
                    <Text style={styles.emptyIcon}>🌐</Text>
                    <Text style={styles.emptyTitle}>
                      {search.length > 0 ? 'Nenhum jogo encontrado' : 'Busque por novos jogos'}
                    </Text>
                  </>
                )}
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  wrapper: { flex: 1, width: '100%', maxWidth: 900, alignSelf: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#202638',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#151A27',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
    borderColor: '#252B3A', marginRight: 16,
  },
  backButtonIcon: { color: '#A78BFA', fontSize: 26, lineHeight: 30 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  content: { flex: 1, width: '100%', paddingHorizontal: 20, paddingTop: 20 },
  searchInput: {
    backgroundColor: '#151A27', borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 14, color: '#FFFFFF', fontSize: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#252B3A',
  },
  gameCard: {
    flexDirection: 'row', backgroundColor: '#151A27', borderRadius: 18,
    overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: '#202638',
    minHeight: 145,
  },
  coverContainer: { width: 105, height: 145, position: 'relative', backgroundColor: '#1B2130' },
  cover: { width: '100%', height: '100%' },
  blurInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 8, paddingVertical: 7 },
  coverTitle: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  gameInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  gameTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  gameTitle: { flex: 1, color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 20 },
  
  addButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#21183A',
    alignItems: 'center', justifyContent: 'center', marginLeft: 10,
  },
  addButtonActive: { backgroundColor: '#7C3AED' },
  addButtonIcon: {
    color: '#A855F7',
    fontSize: 22,
    includeFontPadding: false, // Arranca o espaço inútil das fontes no Android
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: -2, // Ajuste fino para visualização perfeita
  },
  addButtonIconActive: { color: '#FFFFFF' },
  
  details: { color: '#9CA3AF', fontSize: 12, lineHeight: 17, marginTop: 6 },
  statusContainer: {
    alignSelf: 'flex-start', backgroundColor: '#1B2130', borderRadius: 8,
    paddingHorizontal: 9, paddingVertical: 5, marginTop: 10, borderWidth: 1, borderColor: '#252B3A',
  },
  status: { color: '#A78BFA', fontSize: 11, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
});