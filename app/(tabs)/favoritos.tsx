import { Image } from 'expo-image';
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions, // <-- Importado para medir a tela dinamicamente
} from 'react-native';

import { games } from '@/constants/games';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function FavoritosScreen() {
  const { favorites, isFavorite, toggleFavorite, loading } = useFavorites();
  const { width } = useWindowDimensions(); // <-- Pega a largura atual da tela

  const favoriteGames = useMemo(() => {
    return games.filter((game) => favorites.includes(game.id));
  }, [favorites]);

  // ==========================================
  // EVIDÊNCIA 4: LÓGICA DE GRID RESPONSIVO
  // ==========================================
  // Define o número de colunas baseado na largura da tela
  const numColumns = useMemo(() => {
    if (width >= 1024) return 4; // Monitores grandes (4 jogos por linha)
    if (width >= 768) return 3;  // Tablets/Monitores médios (3 jogos por linha)
    if (width >= 600) return 2;  // Celulares grandes na horizontal (2 jogos por linha)
    return 1;                    // Celulares padrão na vertical (1 jogo por linha)
  }, [width]);

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
        // O key é necessário aqui porque o FlatList precisa ser recriado se o numColumns mudar
        key={`grid-${numColumns}`}
        numColumns={numColumns} 
        data={favoriteGames}
        keyExtractor={(item) => item.id}
        // O columnWrapperStyle só pode ser passado se tiver mais de 1 coluna
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={[
          styles.content,
          favoriteGames.length === 0 && styles.emptyContent,
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

            {favoriteGames.length > 0 && (
              <Text style={styles.resultText}>
                {favoriteGames.length}{' '}
                {favoriteGames.length === 1
                  ? 'jogo favorito'
                  : 'jogos favoritos'}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gameCard}>
            {/* Capa */}
            <View style={styles.coverContainer}>
              <Image
                source={item.image}
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

  // ==========================================
  // EVIDÊNCIA 3: FLEXBOX PARA DISTRIBUIR O GRID
  // ==========================================
  row: {
    flex: 1,
    gap: 16, // Espaçamento entre os cartões na mesma linha (suportado no React Native mais recente)
    justifyContent: 'flex-start',
  },

  gameCard: {
    flex: 1, // Faz com que os cartões na mesma linha dividam o espaço igualmente
    minWidth: '20%', // Garante que o cartão não fique muito esmagado se tiver muitos na tela
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