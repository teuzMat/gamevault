import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { games } from '@/constants/games';
import { useFavorites } from '@/contexts/FavoritesContext';
import {
    GameStatus,
    useGameStatus,
} from '@/contexts/GamesContext';

const statusOptions: {
  value: GameStatus;
  label: string;
  icon: string;
}[] = [
  {
    value: 'Não jogado',
    label: 'Não jogado',
    icon: '○',
  },
  {
    value: 'Jogando',
    label: 'Jogando',
    icon: '▶',
  },
  {
    value: 'Concluído',
    label: 'Concluído',
    icon: '✓',
  },
  {
    value: 'Platinado',
    label: 'Platinado',
    icon: '★',
  },
  {
    value: 'Aguardando Lançamento',
    label: 'Aguardando lançamento',
    icon: '◷',
  },
];

export default function JogoScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();

  const gameId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const { isFavorite, toggleFavorite } = useFavorites();
  const { getStatus, setStatus } = useGameStatus();

  const game = useMemo(() => {
    return games.find((item) => item.id === gameId);
  }, [gameId]);

  if (!game) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundIcon}>🎮</Text>

        <Text style={styles.notFoundTitle}>
          Jogo não encontrado
        </Text>

        <Text style={styles.notFoundText}>
          Não foi possível encontrar esse jogo na sua
          biblioteca.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  const currentStatus = getStatus(
    game.id,
    game.status as GameStatus
  );

  const handleStatusChange = async (
    status: GameStatus
  ) => {
    await setStatus(game.id, status);
  };

  const currentStatusOption = statusOptions.find(
    (option) => option.value === currentStatus
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* VOLTAR */}
        <Pressable
          onPress={() => router.back()}
          style={styles.backButtonTop}
          hitSlop={8}
        >
          <Text style={styles.backButtonTopText}>
            ‹
          </Text>

          <Text style={styles.backButtonLabel}>
            Biblioteca
          </Text>
        </Pressable>

        {/* CAPA */}
        <View style={styles.coverContainer}>
          <Image
            source={game.image}
            style={styles.cover}
            contentFit="cover"
            transition={300}
          />

          <View style={styles.coverOverlay} />

          <View style={styles.coverBottom}>
            <Text style={styles.coverGenre}>
              {game.genre}
            </Text>

            <Text
              style={styles.coverTitle}
              numberOfLines={2}
            >
              {game.name}
            </Text>
          </View>
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoText}>
              <Text
                style={styles.title}
                numberOfLines={2}
              >
                {game.name}
              </Text>

              <Text style={styles.details}>
                {game.genre} • {game.platform}
              </Text>
            </View>

            <Pressable
              onPress={() => toggleFavorite(game.id)}
              style={styles.favoriteButton}
              hitSlop={8}
            >
              <Text style={styles.favorite}>
                {isFavorite(game.id) ? '♥' : '♡'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* STATUS */}
        <Text style={styles.sectionTitle}>
          Status do jogo
        </Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusDescription}>
            Escolha o status atual deste jogo. A alteração
            será salva automaticamente.
          </Text>

          <View style={styles.statusList}>
            {statusOptions.map((option) => {
              const selected =
                currentStatus === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() =>
                    handleStatusChange(option.value)
                  }
                  style={[
                    styles.statusOption,
                    selected &&
                      styles.statusOptionSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.statusIconContainer,
                      selected &&
                        styles.statusIconContainerSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusIcon,
                        selected &&
                          styles.statusIconSelected,
                      ]}
                    >
                      {option.icon}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.statusOptionText,
                      selected &&
                        styles.statusOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>

                  <View
                    style={[
                      styles.radio,
                      selected && styles.radioSelected,
                    ]}
                  >
                    {selected && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* STATUS ATUAL */}
        <View style={styles.currentStatusCard}>
          <View style={styles.currentStatusInfo}>
            <Text style={styles.currentStatusLabel}>
              STATUS ATUAL
            </Text>

            <Text style={styles.currentStatusText}>
              {currentStatus}
            </Text>
          </View>

          <Text style={styles.currentStatusIcon}>
            {currentStatusOption?.icon ?? '○'}
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 40,
  },

  backButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  backButtonTopText: {
    color: '#A78BFA',
    fontSize: 36,
    lineHeight: 32,
    marginRight: 5,
  },

  backButtonLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },

  coverContainer: {
    width: '100%',
    height: 390,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#151A27',
    position: 'relative',
    marginBottom: 18,
  },

  cover: {
    width: '100%',
    height: '100%',
  },

  coverOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 170,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  coverBottom: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
  },

  coverGenre: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
  },

  coverTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },

  infoCard: {
    backgroundColor: '#151A27',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#202638',
    marginBottom: 28,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  details: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 6,
  },

  favoriteButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#21182F',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  favorite: {
    color: '#EF4444',
    fontSize: 27,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },

  statusCard: {
    backgroundColor: '#151A27',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#202638',
    marginBottom: 16,
  },

  statusDescription: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },

  statusList: {
    gap: 10,
  },

  statusOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101521',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#202638',
  },

  statusOptionSelected: {
    backgroundColor: '#21183A',
    borderColor: '#7C3AED',
  },

  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#1B2130',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  statusIconContainerSelected: {
    backgroundColor: '#7C3AED',
  },

  statusIcon: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '800',
  },

  statusIconSelected: {
    color: '#FFFFFF',
  },

  statusOptionText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '600',
  },

  statusOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: '#A78BFA',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A78BFA',
  },

  currentStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#151A27',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#202638',
  },

  currentStatusInfo: {
    flex: 1,
  },

  currentStatusLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  currentStatusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  currentStatusIcon: {
    color: '#A78BFA',
    fontSize: 27,
    marginLeft: 15,
  },

  notFoundContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  notFoundIcon: {
    fontSize: 50,
    marginBottom: 18,
  },

  notFoundTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },

  notFoundText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 24,
  },

  backButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});