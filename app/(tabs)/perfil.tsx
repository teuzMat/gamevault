import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useGameStatus } from '@/contexts/GamesContext';

export default function PerfilScreen() {
  const router = useRouter();
  const { statuses } = useGameStatus();

  const { stats, uniquePlatforms, recentPlatinums, recentWishlist } = useMemo(() => {
    const values = Object.values(statuses || {});
    const libraryItems = values.filter((item) => item.status !== 'Não jogado');

    const totalGames = libraryItems.length;
    const completed = libraryItems.filter((item) => item.status === 'Concluído').length;
    const platinated = libraryItems.filter((item) => item.status === 'Platinado').length;
    const playing = libraryItems.filter((item) => item.status === 'Jogando').length;
    const wishlistCount = libraryItems.filter((item) => item.status === 'Na lista para jogar').length;
    
    const totalAchievements = libraryItems.reduce((acc, curr) => acc + ((curr as any).achievementsObtained || 0), 0);

    const allPlatforms = new Set<string>();
    libraryItems.forEach((item) => {
      item.selectedPlatforms?.forEach((p) => {
        let shortName = p;
        if (p.includes('PlayStation')) shortName = p.replace('PlayStation ', 'PS');
        if (p.includes('Xbox Series')) shortName = 'Xbox S/X';
        if (p.includes('Nintendo')) shortName = 'Switch';
        allPlatforms.add(shortName);
      });
    });
    const platformsArray = Array.from(allPlatforms).slice(0, 4);

    const reversedLibrary = [...libraryItems].reverse();
    const platinums = reversedLibrary.filter(item => item.status === 'Platinado').slice(0, 3);
    const wishlist = reversedLibrary.filter(item => item.status === 'Na lista para jogar').slice(0, 3);

    return {
      stats: { totalGames, completed, platinated, playing, wishlistCount, totalAchievements },
      uniquePlatforms: platformsArray,
      recentPlatinums: platinums,
      recentWishlist: wishlist,
    };
  }, [statuses]);

  const openGame = (gameId: string) => {
    router.push({
      pathname: '/jogo/[id]',
      params: { id: gameId },
    });
  };

  const openLibraryWithFilter = (filterName: string) => {
    router.push({
      pathname: '/biblioteca',
      params: { filter: filterName },
    });
  };

  // ==========================================
  // LÓGICA DE LOGOFF SEGURO (MÓVEL E WEB)
  // ==========================================
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      // Navegadores usam o window.confirm padrão
      const desejaSair = window.confirm('Tem certeza que deseja sair do GameVault?');
      if (desejaSair) {
        // Substitui a navegação atual pela raiz (sua tela de Login/Logoff)
        router.replace('/'); 
      }
    } else {
      // iOS e Android usam o Alert nativo
      Alert.alert(
        'Sair da Conta',
        'Tem certeza que deseja sair do GameVault?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: () => {
              // Substitui a navegação atual pela raiz
              router.replace('/'); 
            },
          },
        ]
      );
    }
  };

  const renderMiniCard = (item: any) => (
    <Pressable
      key={item.game.id}
      style={styles.miniCard}
      onPress={() => openGame(item.game.id.toString())}
    >
      <Image
        source={{ uri: item.game.background_image }}
        style={styles.miniCover}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.miniCardInfo}>
        <Text style={styles.miniCardTitle} numberOfLines={1}>
          {item.game.name}
        </Text>
        <Text style={styles.miniCardSubtitle}>
          {item.status === 'Platinado' ? '★ Troféu Máximo' : '🔖 Adicionado à fila'}
        </Text>
      </View>
      <Text style={styles.miniCardArrow}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>TM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileNickname}>@teuzMat</Text>
            <Text style={styles.profileName}>Mateus Cantanhêde</Text>
            
            {uniquePlatforms.length > 0 && (
              <View style={styles.platformBadgeContainer}>
                {uniquePlatforms.map(plat => (
                  <View key={plat} style={styles.platformBadge}>
                    <Text style={styles.platformBadgeText}>{plat}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalGames}</Text>
            <Text style={styles.statLabel}>Jogos na Biblioteca</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#A78BFA' }]}>{stats.totalAchievements}</Text>
            <Text style={styles.statLabel}>Conquistas Obtidas</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#FBBF24' }]}>{stats.platinated}</Text>
            <Text style={styles.statLabel}>Platinados</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#34D399' }]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </View>
        </View>

        {recentPlatinums.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Últimas Platinas</Text>
                <Text style={styles.sectionIcon}>🏆</Text>
              </View>
              <Pressable onPress={() => openLibraryWithFilter('Platinado')} hitSlop={10}>
                <Text style={styles.seeAllText}>Ver todos ›</Text>
              </Pressable>
            </View>
            <View style={styles.listContainer}>
              {recentPlatinums.map(renderMiniCard)}
            </View>
          </>
        )}

        {recentWishlist.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Na Fila para Jogar</Text>
                <Text style={styles.sectionIcon}>⏳</Text>
              </View>
              <Pressable onPress={() => openLibraryWithFilter('Na lista para jogar')} hitSlop={10}>
                <Text style={styles.seeAllText}>Ver todos ›</Text>
              </Pressable>
            </View>
            <View style={styles.listContainer}>
              {recentWishlist.map(renderMiniCard)}
            </View>
          </>
        )}

        {/* ========================================== */}
        {/* BOTÃO DE LOGOFF NO FIM DA TELA */}
        {/* ========================================== */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: 20, paddingTop: 60, paddingBottom: 40 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#151A27', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#202638', marginBottom: 24 },
  avatarContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 2, borderColor: '#A855F7' },
  avatarText: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  profileInfo: { flex: 1 },
  profileNickname: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginBottom: 2 },
  profileName: { color: '#9CA3AF', fontSize: 13, fontWeight: '600', marginBottom: 10 },
  platformBadgeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  platformBadge: { backgroundColor: '#21183A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#7C3AED' },
  platformBadgeText: { color: '#D8B4FE', fontSize: 10, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 14 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  sectionIcon: { fontSize: 20, marginLeft: 6 },
  seeAllText: { color: '#A78BFA', fontSize: 13, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 24, marginTop: 14 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: '#151A27', borderRadius: 18, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#202638' },
  statValue: { color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginBottom: 6 },
  statLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  listContainer: { backgroundColor: '#151A27', borderRadius: 18, padding: 12, borderWidth: 1, borderColor: '#202638', marginBottom: 24 },
  miniCard: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, marginBottom: 8, backgroundColor: '#101521' },
  miniCover: { width: 48, height: 48, borderRadius: 8, marginRight: 14, backgroundColor: '#1B2130' },
  miniCardInfo: { flex: 1, justifyContent: 'center' },
  miniCardTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  miniCardSubtitle: { color: '#9CA3AF', fontSize: 11, fontWeight: '600' },
  miniCardArrow: { color: '#6B7280', fontSize: 24, paddingHorizontal: 10 },
  
  // ESTILOS DO BOTÃO DE LOGOFF
  logoutButton: {
    marginTop: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800',
  },
});