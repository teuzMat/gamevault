import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // <-- Importado para navegação
import { useMemo } from 'react';
import {
  Pressable, // <-- Importado para tornar os cards clicáveis
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFavorites } from '@/contexts/FavoritesContext';
import { useGameStatus } from '@/contexts/GamesContext'; // <-- Importado para pegar o status dos jogos

export default function HomeScreen() {
  const router = useRouter();
  
  // Pegando os dados salvos no aparelho!
  const { favorites } = useFavorites();
  const { statuses } = useGameStatus();

  // Filtra os jogos que estão com o status "Jogando"
  const playingGames = useMemo(() => {
    return Object.values(statuses)
      .filter((item) => item.status === 'Jogando')
      .map((item) => item.game); // Extrai apenas o objeto do jogo
  }, [statuses]);

  // Calcula o total de jogos únicos salvos (unindo Favoritos e Status)
  const totalGamesTracked = useMemo(() => {
    const uniqueIds = new Set([
      ...favorites.map(f => f.id),
      ...Object.keys(statuses)
    ]);
    return uniqueIds.size;
  }, [favorites, statuses]);

  const openGame = (gameId: string) => {
    router.push({
      pathname: '/jogo/[id]',
      params: { id: gameId },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Bem-vindo ao
          </Text>

          <Text style={styles.title}>
            GameVault
          </Text>
        </View>

        <View style={styles.logo}>
          <Text style={styles.logoText}>
            GV
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Sua biblioteca. Seus jogos. Sua história.
      </Text>

      {/* Card principal */}
      <LinearGradient
        colors={['#7C3AED', '#4F46E5', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>
            SUA COLEÇÃO
          </Text>

          <Text style={styles.heroNumber}>
            {totalGamesTracked}
          </Text>

          <Text style={styles.heroText}>
            jogos salvos localmente
          </Text>

          <View style={styles.heroDivider} />

          <Text style={styles.heroDescription}>
            Organize seus jogos, acompanhe seus favoritos
            e mantenha sua coleção sempre por perto.
          </Text>
        </View>

        <View style={styles.heroDecoration}>
          <Text style={styles.heroGamepad}>
            🎮
          </Text>
        </View>
      </LinearGradient>

      {/* Estatísticas */}
      <Text style={styles.sectionTitle}>
        Visão geral
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>
            🎮
          </Text>
          <Text style={styles.statNumber}>
            {totalGamesTracked}
          </Text>
          <Text style={styles.statLabel}>
            Salvos
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>
            ♥
          </Text>
          <Text style={styles.statNumber}>
            {favorites.length}
          </Text>
          <Text style={styles.statLabel}>
            Favoritos
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>
            ▶
          </Text>
          <Text style={styles.statNumber}>
            {playingGames.length}
          </Text>
          <Text style={styles.statLabel}>
            Jogando
          </Text>
        </View>
      </View>

      {/* Continuar jogando */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Continuar jogando
        </Text>

        <Text style={styles.sectionCount}>
          {playingGames.length}{' '}
          {playingGames.length === 1
            ? 'jogo'
            : 'jogos'}
        </Text>
      </View>

      {playingGames.length > 0 ? (
        <View style={styles.cardsGrid}>
          {playingGames.slice(0, 4).map((game, index) => {
            const platformNames = game.platforms?.map(p => p.platform.name).slice(0, 3).join(', ') || 'Várias plataformas';
            
            return (
              <Pressable 
                key={game?.id ? String(game.id) : String(index)} 
                style={styles.gameCard}
                onPress={() => openGame(game.id)}
              >
                <View style={styles.gameCover}>
                  <Image
                    source={{ uri: game.background_image }}
                    style={styles.gameImage}
                    contentFit="cover"
                    transition={300}
                  />
                </View>

                <View style={styles.gameInfo}>
                  <Text
                    style={styles.gameTitle}
                    numberOfLines={2}
                  >
                    {game.name}
                  </Text>

                  <Text style={styles.gameDetails} numberOfLines={1}>
                    {platformNames}
                  </Text>

                  <View style={styles.playingBadge}>
                    <View style={styles.playingDot} />
                    <Text style={styles.playingText}>
                      Jogando
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>▶</Text>
          <Text style={styles.emptyTitle}>
            Nenhum jogo em andamento
          </Text>
          <Text style={styles.emptyText}>
            Os jogos marcados como "Jogando" aparecerão
            nesta seção.
          </Text>
        </View>
      )}

      {/* Jogos em destaque (Favoritos) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Em destaque
        </Text>

        <Text style={styles.sectionCount}>
          {favorites.length}{' '}
          {favorites.length === 1
            ? 'favorito'
            : 'favoritos'}
        </Text>
      </View>

      {favorites.length > 0 ? (
        <View style={styles.cardsGrid}>
          {favorites.slice(0, 4).map((game, index) => {
            const platformNames = game.platforms?.map(p => p.platform.name).slice(0, 3).join(', ') || 'Várias plataformas';
            
            return (
              <Pressable 
                key={game?.id ? String(game.id) : String(index)} 
                style={styles.gameCard}
                onPress={() => openGame(game.id)}
              >
                <View style={styles.gameCover}>
                  <Image
                    source={{ uri: game.background_image }}
                    style={styles.gameImage}
                    contentFit="cover"
                    transition={300}
                  />
                </View>

                <View style={styles.gameInfo}>
                  <View style={styles.gameTitleRow}>
                    <Text
                      style={styles.gameTitle}
                      numberOfLines={2}
                    >
                      {game.name}
                    </Text>
                    <Text style={styles.favorite}>♥</Text>
                  </View>

                  <Text style={styles.gameDetails} numberOfLines={1}>
                    {platformNames}
                  </Text>

                  <View style={styles.favoriteBadge}>
                    <Text style={styles.favoriteBadgeText}>
                      Favorito
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>☆</Text>
          <Text style={styles.emptyTitle}>
            Sua coleção está esperando
          </Text>
          <Text style={styles.emptyText}>
            Favorite alguns jogos na Biblioteca para
            destacá-los aqui.
          </Text>
        </View>
      )}

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          GameVault
        </Text>
        <Text style={styles.footerSubtext}>
          Sua biblioteca gamer em um só lugar.
        </Text>
      </View>
    </ScrollView>
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
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  greeting: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 3,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 24,
  },

  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#151A27',
    borderWidth: 1,
    borderColor: '#292F42',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '800',
  },

  heroCard: {
    minHeight: 220,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24,
    marginBottom: 28,
    position: 'relative',
  },

  heroContent: {
    zIndex: 2,
    maxWidth: '78%',
  },

  heroLabel: {
    color: '#DDD6FE',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  heroNumber: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    marginTop: 4,
  },

  heroText: {
    color: '#E0E7FF',
    fontSize: 16,
    fontWeight: '600',
  },

  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 16,
  },

  heroDescription: {
    color: '#E0E7FF',
    fontSize: 13,
    lineHeight: 19,
  },

  heroDecoration: {
    position: 'absolute',
    right: -12,
    bottom: -15,
    opacity: 0.16,
  },

  heroGamepad: {
    fontSize: 130,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },

  sectionCount: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 14,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#151A27',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#202638',
  },

  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },

  statNumber: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },

  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },

  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },

  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#151A27',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#202638',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 300, 
  },

  gameCover: {
    width: 105,
    height: 125,
    backgroundColor: '#1B2130',
  },

  gameImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1B2130',
  },

  gameInfo: {
    flex: 1,
    padding: 15,
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
    lineHeight: 21,
  },

  favorite: {
    color: '#EF4444',
    fontSize: 20,
    marginLeft: 10,
  },

  gameDetails: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 6,
  },

  playingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#13251D',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
  },

  playingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },

  playingText: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '700',
  },

  favoriteBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#21183A',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 10,
  },

  favoriteBadgeText: {
    color: '#A78BFA',
    fontSize: 10,
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: '#151A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#202638',
    padding: 24,
    alignItems: 'center',
    marginBottom: 10,
  },

  emptyIcon: {
    color: '#7C3AED',
    fontSize: 38,
    marginBottom: 8,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  footer: {
    alignItems: 'center',
    marginTop: 25,
  },

  footerText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '800',
  },

  footerSubtext: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 4,
  },
});