import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFavorites } from '@/contexts/FavoritesContext';
import { GameStatus, useGameStatus } from '@/contexts/GamesContext';
import { fetchGameDetails, RawgGameDetails } from '@/services/api';

const statusOptions: { value: GameStatus; label: string; icon: string }[] = [
  { value: 'Não jogado', label: 'Não jogado', icon: '○' },
  { value: 'Na lista para jogar', label: 'Na lista para jogar', icon: '🔖' },
  { value: 'Jogando', label: 'Jogando', icon: '▶' },
  { value: 'Concluído', label: 'Concluído', icon: '✓' },
  { value: 'Platinado', label: 'Platinado', icon: '★' },
  { value: 'Aguardando Lançamento', label: 'Aguardando lançamento', icon: '◷' },
];

export default function JogoScreen() {
  // ==========================================
  // EVIDÊNCIA 10: Recuperar o parâmetro utilizando useLocalSearchParams[cite: 3]
  // ==========================================
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const gameId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { isFavorite, toggleFavorite } = useFavorites();
  const { statuses, getStatus, setStatus, setPersonalRating, setAchievementsObtained, setMaxAchievements } = useGameStatus();

  const [game, setGame] = useState<RawgGameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentStatusData = statuses[gameId as string];
  const currentStatus = currentStatusData?.status ?? 'Não jogado';
  const currentRating = currentStatusData?.personalRating ?? 0;
  
  const [achievements, setAchievements] = useState<string>(
    currentStatusData?.achievementsObtained?.toString() || ''
  );

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    currentStatusData?.selectedPlatforms || []
  );

  const [isEditingMax, setIsEditingMax] = useState(false);
  const [maxInput, setMaxInput] = useState('');

  useEffect(() => {
    const loadGame = async () => {
      setIsLoading(true);
      const data = await fetchGameDetails(gameId);
      setGame(data);
      setIsLoading(false);
    };

    if (gameId) loadGame();
  }, [gameId]);

  if (isLoading) {
    return (
      <View style={styles.notFoundContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }
  if (!game) return <View style={styles.notFoundContainer}><Text style={styles.loadingText}>Não encontrado</Text></View>;

  const minimalGameToSave = {
    id: game.id.toString(),
    name: game.name,
    background_image: game.background_image,
    rating: game.rating,
    platforms: game.platforms || [],
    achievements_count: game.achievements_count,
  };

  const handleStatusChange = async (status: GameStatus) => {
    if (status === 'Platinado') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    let platformsToSave = [...selectedPlatforms];
    if (status === 'Não jogado') platformsToSave = [];
    else if (platformsToSave.length === 0 && game.platforms && game.platforms.length > 0) {
      platformsToSave = [game.platforms[0].platform.name];
    }
    setSelectedPlatforms(platformsToSave);
    await setStatus(minimalGameToSave, status, platformsToSave);
  };

  const handlePlatformChange = (platformName: string) => {
    Haptics.selectionAsync();

    let newPlatforms = selectedPlatforms.includes(platformName)
      ? selectedPlatforms.filter(p => p !== platformName)
      : [...selectedPlatforms, platformName];
    setSelectedPlatforms(newPlatforms);
    if (currentStatus !== 'Não jogado') setStatus(minimalGameToSave, currentStatus, newPlatforms);
  };

  const handleRating = (rating: number) => {
    if (rating === 5) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPersonalRating(gameId as string, rating);
  };

  const displayTotal = currentStatusData?.maxAchievements !== undefined 
    ? currentStatusData.maxAchievements 
    : (game.achievements_count || 0);

  const handleAchievementChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAchievements(numericValue);

    const obtained = parseInt(numericValue, 10);
    if (!isNaN(obtained)) {
      setAchievementsObtained(gameId as string, obtained);
      
      if (displayTotal > 0 && obtained >= displayTotal && currentStatus !== 'Platinado') {
        handleStatusChange('Platinado');
      }
    } else if (numericValue === '') {
      setAchievementsObtained(gameId as string, 0);
    }
  };

  const handleSaveMax = () => {
    const newMax = parseInt(maxInput, 10);
    if (!isNaN(newMax) && newMax > 0) {
      setMaxAchievements(gameId as string, newMax);
      const obtained = parseInt(achievements, 10) || 0;
      if (obtained >= newMax && currentStatus !== 'Platinado') {
        handleStatusChange('Platinado');
      }
    }
    setIsEditingMax(false);
  };

  const formattedGenres = game.genres?.map(g => g.name).slice(0, 3).join(', ') || 'Sem gênero';
  const formattedPlatforms = game.platforms?.map(p => p.platform.name).slice(0, 3).join(', ') || 'Várias plataformas';

  const toggleFavoriteWithHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(minimalGameToSave);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ========================================== */}
        {/* EVIDÊNCIA 12: Criar navegação de retorno utilizando router.back()[cite: 3] */}
        {/* ========================================== */}
        <Pressable onPress={() => router.back()} style={styles.backButtonTop} hitSlop={8}>
          <Text style={styles.backButtonTopText}>‹</Text>
          <Text style={styles.backButtonLabel}>Voltar</Text>
        </Pressable>

        <View style={styles.coverContainer}>
          <Image source={{ uri: game.background_image }} style={styles.cover} contentFit="cover" transition={300} />
          <View style={styles.coverOverlay} />
          <View style={styles.coverBottom}>
            <Text style={styles.coverGenre}>{formattedGenres}</Text>
            <Text style={styles.coverTitle} numberOfLines={2}>{game.name}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoText}>
              <Text style={styles.title} numberOfLines={2}>{game.name}</Text>
              <Text style={styles.details}>{formattedPlatforms}</Text>
            </View>
            <Pressable
              onPress={toggleFavoriteWithHaptic}
              style={styles.favoriteButton}
              hitSlop={8}
            >
              <Text style={styles.favorite}>
                {isFavorite(gameId) ? '♥' : '♡'}
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Status do jogo</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusDescription}>Escolha o status atual deste jogo.</Text>
          <View style={styles.statusList}>
            {statusOptions.map((option) => {
              const selected = currentStatus === option.value;
              return (
                <Pressable
                  key={option.value} onPress={() => handleStatusChange(option.value)}
                  style={[styles.statusOption, selected && styles.statusOptionSelected]}
                >
                  <View style={[styles.statusIconContainer, selected && styles.statusIconContainerSelected]}>
                    <Text style={[styles.statusIcon, selected && styles.statusIconSelected]}>{option.icon}</Text>
                  </View>
                  <Text style={[styles.statusOptionText, selected && styles.statusOptionTextSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {currentStatus !== 'Não jogado' && (
          <>
            <Text style={styles.sectionTitle}>Conquistas</Text>
            <View style={styles.achievementCard}>
              {displayTotal > 0 ? (
                <>
                  <Text style={styles.statusDescription}>Progresso de troféus obtidos neste jogo:</Text>
                  <View style={styles.achievementRow}>
                    <TextInput
                      style={styles.achievementInput}
                      keyboardType="numeric" value={achievements}
                      onChangeText={handleAchievementChange}
                      placeholder="0" placeholderTextColor="#6B7280" maxLength={4}
                    />
                    {isEditingMax ? (
                      <View style={styles.editMaxContainer}>
                        <Text style={styles.achievementSlash}> / </Text>
                        <TextInput
                          style={styles.achievementInputTotal}
                          keyboardType="numeric" autoFocus
                          value={maxInput} onChangeText={setMaxInput}
                          onBlur={handleSaveMax} onSubmitEditing={handleSaveMax}
                        />
                      </View>
                    ) : (
                      <Pressable style={styles.editMaxContainer} onPress={() => { setMaxInput(displayTotal.toString()); setIsEditingMax(true); }}>
                        <Text style={styles.achievementTotal}> / {displayTotal}</Text>
                        <Text style={styles.editIcon}>✏️</Text>
                      </Pressable>
                    )}
                  </View>
                  {(parseInt(achievements, 10) || 0) >= displayTotal && (
                    <Text style={styles.achievementFeedback}>100% concluído! 🏆</Text>
                  )}
                </>
              ) : (
                <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                  <Text style={[styles.statusDescription, { textAlign: 'center', marginBottom: 16 }]}>
                    O banco de dados não encontrou conquistas para este jogo. Ele possui sistema de troféus?
                  </Text>
                  <Pressable 
                    style={styles.addAchievementsBtn}
                    onPress={() => { setMaxInput(''); setIsEditingMax(true); setMaxAchievements(gameId as string, 1); }}
                  >
                    <Text style={styles.addAchievementsText}>+ Definir Conquistas</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        )}

        {currentStatus !== 'Não jogado' && (
          <>
            <Text style={styles.sectionTitle}>Sua Avaliação</Text>
            <View style={styles.ratingCard}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => handleRating(star)} style={styles.starButton}>
                    <Text style={[styles.starIcon, star <= currentRating && styles.starIconSelected]}>★</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}

        {currentStatus !== 'Não jogado' && game.platforms && game.platforms.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Plataforma(s)</Text>
            <View style={styles.platformCard}>
              <View style={styles.platformList}>
                {game.platforms.map((p) => {
                  const pName = p.platform.name;
                  const isSelected = selectedPlatforms.includes(pName);
                  return (
                    <Pressable key={pName} onPress={() => handlePlatformChange(pName)} style={[styles.platformOption, isSelected && styles.platformOptionSelected]}>
                      <Text style={[styles.platformOptionText, isSelected && styles.platformOptionTextSelected]}>{pName}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: 20, paddingTop: 50, paddingBottom: 40 },
  loadingText: { color: '#9CA3AF', marginTop: 16, fontSize: 16, fontWeight: '600' },
  backButtonTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  backButtonTopText: { color: '#A78BFA', fontSize: 36, lineHeight: 32, marginRight: 5 },
  backButtonLabel: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
  coverContainer: { width: '100%', height: 390, borderRadius: 24, overflow: 'hidden', backgroundColor: '#151A27', position: 'relative', marginBottom: 18 },
  cover: { width: '100%', height: '100%' },
  coverOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, backgroundColor: 'rgba(0,0,0,0.55)' },
  coverBottom: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  coverGenre: { color: '#C4B5FD', fontSize: 12, fontWeight: '700', marginBottom: 5 },
  coverTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '900' },
  infoCard: { backgroundColor: '#151A27', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#202638', marginBottom: 28 },
  infoHeader: { flexDirection: 'row', alignItems: 'center' },
  infoText: { flex: 1 },
  title: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  details: { color: '#9CA3AF', fontSize: 13, marginTop: 6 },
  favoriteButton: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#21182F', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  favorite: { color: '#EF4444', fontSize: 27 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 14 },
  statusCard: { backgroundColor: '#151A27', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#202638', marginBottom: 16 },
  statusDescription: { color: '#6B7280', fontSize: 13, lineHeight: 19, marginBottom: 16 },
  statusList: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statusOption: { flex: 1, minWidth: 250, minHeight: 58, flexDirection: 'row', alignItems: 'center', backgroundColor: '#101521', borderRadius: 14, paddingHorizontal: 12, borderWidth: 1, borderColor: '#202638' },
  statusOptionSelected: { backgroundColor: '#21183A', borderColor: '#7C3AED' },
  statusIconContainer: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#1B2130', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statusIconContainerSelected: { backgroundColor: '#7C3AED' },
  statusIcon: { color: '#9CA3AF', fontSize: 16, fontWeight: '800' },
  statusIconSelected: { color: '#FFFFFF' },
  statusOptionText: { flex: 1, color: '#D1D5DB', fontSize: 14, fontWeight: '600' },
  statusOptionTextSelected: { color: '#FFFFFF', fontWeight: '800' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#4B5563', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: '#A78BFA' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#A78BFA' },
  achievementCard: { backgroundColor: '#151A27', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#202638', marginBottom: 24 },
  achievementRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  achievementInput: { backgroundColor: '#101521', borderRadius: 12, borderWidth: 1, borderColor: '#252B3A', color: '#FFFFFF', fontSize: 18, fontWeight: '800', textAlign: 'center', paddingVertical: 10, paddingHorizontal: 16, minWidth: 80 },
  editMaxContainer: { flexDirection: 'row', alignItems: 'center' },
  achievementSlash: { color: '#9CA3AF', fontSize: 18, fontWeight: '800', marginHorizontal: 8 },
  achievementInputTotal: { backgroundColor: '#1B2130', borderRadius: 12, borderWidth: 1, borderColor: '#7C3AED', color: '#A78BFA', fontSize: 18, fontWeight: '800', textAlign: 'center', paddingVertical: 10, paddingHorizontal: 16, minWidth: 80, marginLeft: 8 },
  achievementTotal: { color: '#9CA3AF', fontSize: 18, fontWeight: '800', marginLeft: 12 },
  editIcon: { fontSize: 14, marginLeft: 10, padding: 4 },
  achievementFeedback: { color: '#FBBF24', fontSize: 13, fontWeight: '700', marginTop: 12 },
  addAchievementsBtn: { backgroundColor: '#21183A', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#7C3AED' },
  addAchievementsText: { color: '#D8B4FE', fontWeight: '800', fontSize: 14 },
  ratingCard: { backgroundColor: '#151A27', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#202638', marginBottom: 24, alignItems: 'center' },
  starsContainer: { flexDirection: 'row', gap: 12 },
  starButton: { padding: 5 },
  starIcon: { fontSize: 42, color: '#1B2130' },
  starIconSelected: { color: '#FBBF24', textShadowColor: 'rgba(251, 191, 36, 0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  platformCard: { backgroundColor: '#151A27', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#202638', marginBottom: 24 },
  platformList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  platformOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#101521', borderWidth: 1, borderColor: '#202638' },
  platformOptionSelected: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  platformOptionText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  platformOptionTextSelected: { color: '#FFFFFF', fontWeight: '800' },
  notFoundContainer: { flex: 1, backgroundColor: '#0B0F19', alignItems: 'center', justifyContent: 'center' },
});