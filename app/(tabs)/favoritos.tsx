import { Image } from 'expo-image';
import { useRouter } from 'expo-router'; // <-- Importado para podermos clicar e ir pro jogo
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { useFavorites } from '@/contexts/FavoritesContext';
import { useGameStatus } from '@/contexts/GamesContext'; // <-- Importado para pegar o status salvo localmente

export default function FavoritosScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // O favorites agora JÁ É uma lista de objetos completos! Não precisamos mais filtrar.
  const { favorites, isFavorite, toggleFavorite, loading } = useFavorites();
  const { getStatus } = useGameStatus();

  // ==========================================
  // LÓGICA DE GRID RESPONSIVO
  // ==========================================
  const numColumns = useMemo(() => {
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    if (width >= 600) return 2;
    return 1;
  }, [width]);

  const openGame = (gameId: string) => {
    router.push({
      pathname: '/jogo/[id]',
      params: { id: gameId },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Carregando favoritos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={`grid-${numColumns}`}
        numColumns={numColumns} 
        data={favorites} // <-- Usando os dados diretos do AsyncStorage
        keyExtractor={(item, index) => item?.id ? String(item.id) : String(index)}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={[
          styles.content,
          favorites.length === 0 && styles.emptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              Favoritos
            </Text>

            <Text style={styles.subtitle}>
              Seus jogos favoritos em um só lugar.
            </Text>

            {favorites.length > 0 && (
              <Text style={styles.resultText}>
                {favorites.length}{' '}
                {favorites.length === 1
                  ? 'jogo favorito'
                  : 'jogos favoritos'}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          // Busca o status salvo localmente
          const currentStatus = getStatus(item.id.toString(), 'Não jogado');
          const platformNames = item.platforms?.map(p => p.platform.name).slice(0, 3).join(', ') || 'Várias plataformas';

          return (
            // Transformei em Pressable para podermos clicar no Favorito e ver os detalhes!
            <Pressable 
              style={styles.gameCard}
              onPress={() => openGame(item.id.toString())}
            >
              {/* Capa */}
              <View style={styles.coverContainer}>
                <Image
                  source={{ uri: item.background_image }} // Imagem salva do RAWG API
                  style={styles.cover}
                  contentFit="cover"
                  transition={300}
                />
              </View>

              {/* Informações */}
              <View style={styles.gameInfo}>
                <View style={styles.gameTitleRow}>
                  <Text
                    style={styles.gameTitle}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  <Pressable
                    onPress={() => toggleFavorite(item)} // Enviando o objeto inteiro como o Contexto pede agora
                    style={styles.favoriteButton}
                    hitSlop={8}
                  >
                    <Text style={styles.favorite}>
                      {isFavorite(item.id.toString()) ? '♥' : '♡'}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.details} numberOfLines={1}>
                  {platformNames}
                </Text>

                <View style={styles.statusContainer}>
                  <Text style={styles.status}>
                    {currentStatus}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              ♡
            </Text>

            <Text style={styles.emptyTitle}>
              Nenhum favorito ainda
            </Text>

            <Text style={styles.emptyText}>
              Você ainda não adicionou nenhum jogo aos
              favoritos.
            </Text>

            <Text style={styles.emptyHint}>
              Acesse a Biblioteca e toque no coração dos
              jogos que deseja guardar aqui.
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
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },

  emptyContent: {
    flexGrow: 1,
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

  resultText: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 16,
  },

  row: {
    flex: 1,
    gap: 16,
    justifyContent: 'flex-start',
  },

  gameCard: {
    flex: 1,
    minWidth: '20%',
    backgroundColor: '#151A27',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#202638',
  },

  coverContainer: {
    width: '100%',
    height: 230,
    backgroundColor: '#1B2130',
  },

  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1B2130',
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
    lineHeight: 23,
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
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    color: '#7C3AED',
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

  emptyHint: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
});