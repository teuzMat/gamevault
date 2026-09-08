import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import {
  GameStatus,
  useGameStatus,
} from '@/contexts/GamesContext';

export default function PerfilScreen() {
  const { favorites } = useFavorites();
  const { statuses } = useGameStatus();
  const { userProfile, logout } = useAuth(); // Puxando o perfil da nuvem e a função de sair

  /*
   * ==========================================
   * LÓGICA DE DADOS DINÂMICOS (API)
   * ==========================================
   */
  const trackedGamesWithStatus = useMemo(() => {
    const gameMap = new Map<string, { status: GameStatus }>();

    Object.entries(statuses).forEach(([id, data]) => {
      gameMap.set(id, { status: data.status });
    });

    favorites.forEach((game) => {
      if (!gameMap.has(game.id)) {
        gameMap.set(game.id, { status: 'Não jogado' });
      }
    });

    return Array.from(gameMap.values());
  }, [favorites, statuses]);

  const availableGames = useMemo(() => {
    return trackedGamesWithStatus.filter(
      (game) => game.status !== 'Aguardando Lançamento'
    );
  }, [trackedGamesWithStatus]);

  const totalGames = trackedGamesWithStatus.length;
  const availableGamesCount = availableGames.length;
  const favoriteCount = favorites.length;

  const playingCount = useMemo(() => {
    return availableGames.filter((game) => game.status === 'Jogando').length;
  }, [availableGames]);

  const completedCount = useMemo(() => {
    return availableGames.filter((game) => game.status === 'Concluído').length;
  }, [availableGames]);

  const platinumCount = useMemo(() => {
    return availableGames.filter((game) => game.status === 'Platinado').length;
  }, [availableGames]);

  const notPlayedCount = useMemo(() => {
    return availableGames.filter((game) => game.status === 'Não jogado').length;
  }, [availableGames]);

  const upcomingCount = useMemo(() => {
    return trackedGamesWithStatus.filter(
      (game) => game.status === 'Aguardando Lançamento'
    ).length;
  }, [trackedGamesWithStatus]);

  const getPercentage = (count: number) => {
    if (availableGamesCount === 0) {
      return 0;
    }
    return Math.round((count / availableGamesCount) * 100);
  };

  const playingPercentage = getPercentage(playingCount);
  const completedPercentage = getPercentage(completedCount);
  const platinumPercentage = getPercentage(platinumCount);
  const notPlayedPercentage = getPercentage(notPlayedCount);

  const handleIrParaLogin = () => {
    router.navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>GV</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.title}>Meu Perfil</Text>
          <Text style={styles.subtitle}>
            Sua identidade e seu progresso no GameVault.
          </Text>
        </View>
      </View>

      {/* PERFIL DO USUÁRIO (Dados Reais da Nuvem) */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.username}>
              {userProfile?.username ? `@${userProfile.username}` : '@gamervault0607'}
            </Text>
            <Text style={styles.realName}>
              {userProfile?.nome || 'Carregando...'}
            </Text>
          </View>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>GAMER</Text>
          </View>
        </View>

        <View style={styles.profileDivider} />

        <View style={styles.profileDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Membro desde</Text>
            <Text style={styles.detailValue}>
              {userProfile?.createdAt 
                ? new Date(userProfile.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) 
                : 'agosto de 2026'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Plataformas</Text>
            <Text style={styles.detailValue}>PC • PlayStation</Text>
          </View>
        </View>
      </View>

      {/* BOTÃO DE LOGIN / TROCAR DE CONTA */}
      <Pressable
        style={({ pressed }) => [
          styles.cadastroButton,
          pressed && styles.cadastroButtonPressed,
        ]}
        onPress={handleIrParaLogin}
        android_ripple={{ color: '#2D1B4E' }}
      >
        <View style={styles.cadastroButtonIcon}>
          <Text style={{ fontSize: 20 }}>👤</Text>
        </View>
        <View style={styles.cadastroButtonContent}>
          <Text style={styles.cadastroButtonTitle}>Acessar outra conta</Text>
          <Text style={styles.cadastroButtonText}>
            Entrar com outro e-mail no GameVault.
          </Text>
        </View>
        <Text style={styles.cadastroButtonArrow}>›</Text>
      </Pressable>

      {/* BOTÃO DE SAIR (LOGOUT) */}
      <Pressable
        style={({ pressed }) => [
          styles.cadastroButton,
          { borderColor: '#EF4444', marginBottom: 28 },
          pressed && styles.cadastroButtonPressed,
        ]}
        onPress={handleLogout}
        android_ripple={{ color: '#451A1A' }}
      >
        <View style={[styles.cadastroButtonIcon, { backgroundColor: '#2F1515' }]}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
        </View>
        <View style={styles.cadastroButtonContent}>
          <Text style={styles.cadastroButtonTitle}>Sair da conta</Text>
          <Text style={styles.cadastroButtonText}>
            Encerrar sessão atual no GameVault.
          </Text>
        </View>
        <Text style={[styles.cadastroButtonArrow, { color: '#EF4444' }]}>›</Text>
      </Pressable>

      {/* ESTATÍSTICAS */}
      <Text style={styles.sectionTitle}>Estatísticas</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎮</Text>
          <Text style={styles.statNumber}>{totalGames}</Text>
          <Text style={styles.statLabel}>Salvos</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>♥</Text>
          <Text style={styles.statNumber}>{favoriteCount}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>▶</Text>
          <Text style={styles.statNumber}>{playingCount}</Text>
          <Text style={styles.statLabel}>Jogando</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
      </View>

      {/* PROGRESSO DA BIBLIOTECA */}
      <Text style={styles.sectionTitle}>Progresso da biblioteca</Text>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>Status dos jogos</Text>
            <Text style={styles.progressSubtitle}>
              {availableGamesCount} jogos contabilizados
            </Text>
          </View>
        </View>

        {/* NÃO JOGADO */}
        <View style={styles.statusRow}>
          <View style={styles.statusLabelContainer}>
            <View style={[styles.statusDot, styles.notPlayedDot]} />
            <Text style={styles.statusLabel}>Não jogado</Text>
          </View>
          <Text style={styles.statusPercentage}>{notPlayedPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              styles.notPlayedFill,
              { width: `${notPlayedPercentage}%` },
            ]}
          />
        </View>

        {/* JOGANDO */}
        <View style={styles.statusRow}>
          <View style={styles.statusLabelContainer}>
            <View style={[styles.statusDot, styles.playingDot]} />
            <Text style={styles.statusLabel}>Jogando</Text>
          </View>
          <Text style={styles.statusPercentage}>{playingPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              styles.playingFill,
              { width: `${playingPercentage}%` },
            ]}
          />
        </View>

        {/* CONCLUÍDO */}
        <View style={styles.statusRow}>
          <View style={styles.statusLabelContainer}>
            <View style={[styles.statusDot, styles.completedDot]} />
            <Text style={styles.statusLabel}>Concluído</Text>
          </View>
          <Text style={styles.statusPercentage}>{completedPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              styles.completedFill,
              { width: `${completedPercentage}%` },
            ]}
          />
        </View>

        {/* PLATINADO */}
        <View style={styles.statusRow}>
          <View style={styles.statusLabelContainer}>
            <View style={[styles.statusDot, styles.platinumDot]} />
            <Text style={styles.statusLabel}>Platinado</Text>
          </View>
          <Text style={styles.statusPercentage}>{platinumPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              styles.platinumFill,
              { width: `${platinumPercentage}%` },
            ]}
          />
        </View>

        {/* AGUARDANDO LANÇAMENTO */}
        <View style={styles.progressDivider} />
        <View style={styles.upcomingContainer}>
          <View>
            <Text style={styles.upcomingTitle}>Aguardando lançamento</Text>
            <Text style={styles.upcomingDescription}>
              Não contabilizados no progresso
            </Text>
          </View>
          <Text style={styles.upcomingCount}>{upcomingCount}</Text>
        </View>
        <Text style={styles.progressText}>
          Jogos aguardando lançamento não são contabilizados no percentual de progresso.
        </Text>
      </View>

      {/* RESUMO */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Seu GameVault</Text>
        <Text style={styles.summaryText}>
          Você possui {totalGames} jogos salvos localmente, sendo {availableGamesCount} disponíveis para acompanhamento e {upcomingCount} aguardando lançamento.
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
    marginBottom: 24,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 5,
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },

  profileCard: {
    backgroundColor: '#151A27',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#202638',
    marginBottom: 14,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  username: {
    color: '#A78BFA',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  realName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  memberBadge: {
    backgroundColor: '#21183A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  memberBadgeText: {
    color: '#A855F7',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  profileDivider: {
    height: 1,
    backgroundColor: '#252B3A',
    marginVertical: 18,
  },

  profileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    color: '#6B7280',
    fontSize: 11,
    marginBottom: 5,
  },

  detailValue: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '600',
  },

  cadastroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#7C3AED',
    padding: 16,
    marginBottom: 14,
  },

  cadastroButtonPressed: {
    opacity: 0.75,
  },

  cadastroButtonIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',       // <--- Adicionado
    justifyContent: 'center',   // <--- Adicionado
    borderRadius: 13,
    backgroundColor: '#21183A',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    marginRight: 13,
  },

  cadastroButtonContent: {
    flex: 1,
  },

  cadastroButtonTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },

  cadastroButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 17,
  },

  cadastroButtonArrow: {
    color: '#A78BFA',
    fontSize: 30,
    fontWeight: '300',
    marginLeft: 8,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, 
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    minWidth: 130, 
    backgroundColor: '#151A27',
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: '#202638',
  },

  statIcon: {
    fontSize: 20,
    marginBottom: 10,
  },

  statNumber: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },

  statLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 3,
  },

  progressCard: {
    backgroundColor: '#151A27',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#202638',
  },

  progressHeader: {
    marginBottom: 20,
  },

  progressTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  progressSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  notPlayedDot: {
    backgroundColor: '#6B7280',
  },

  playingDot: {
    backgroundColor: '#A855F7',
  },

  completedDot: {
    backgroundColor: '#22C55E',
  },

  platinumDot: {
    backgroundColor: '#F59E0B',
  },

  statusLabel: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '600',
  },

  statusPercentage: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  progressBar: {
    height: 9,
    borderRadius: 5,
    backgroundColor: '#252B3A',
    overflow: 'hidden',
    marginBottom: 18,
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
  },

  notPlayedFill: {
    backgroundColor: '#6B7280',
  },

  playingFill: {
    backgroundColor: '#A855F7',
  },

  completedFill: {
    backgroundColor: '#22C55E',
  },

  platinumFill: {
    backgroundColor: '#F59E0B',
  },

  progressDivider: {
    height: 1,
    backgroundColor: '#252B3A',
    marginVertical: 4,
  },

  upcomingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  upcomingTitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },

  upcomingDescription: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 3,
  },

  upcomingCount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  progressText: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },

  summaryCard: {
    backgroundColor: '#151A27',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#202638',
    marginTop: 20,
  },

  summaryTitle: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 7,
  },

  summaryText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 20,
  },
});