import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ==========================================
// EVIDÊNCIA 4: Componente reutilizável e Props
// ==========================================
type GameCardProps = {
  id: string;
  name: string;
  backgroundImage: string;
  status: string;
  platformNames: string;
  ratingText: string;
  gridView: boolean;
  onPress: () => void; // Prop que recebe a função de navegação
};

export default function GameCard({
  name,
  backgroundImage,
  status,
  platformNames,
  ratingText,
  gridView,
  onPress,
}: GameCardProps) {
  if (gridView) {
    return (
      <Pressable style={styles.gridCard} onPress={onPress}>
        <View style={styles.gridCoverContainer}>
          <Image source={{ uri: backgroundImage }} style={styles.gridCover} contentFit="cover" transition={300} />
          <BlurView intensity={65} tint="dark" style={styles.gridBlurInfo}>
            <Text style={styles.gridStatus} numberOfLines={1}>{status}</Text>
          </BlurView>
        </View>
        <View style={styles.gridInfo}>
          <Text style={styles.gridTitle} numberOfLines={2}>{name}</Text>
          <View style={styles.gridInfoBottom}>
            <Text style={styles.gridDetails} numberOfLines={1}>{platformNames}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.gameCard} onPress={onPress}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: backgroundImage }} style={styles.cover} contentFit="cover" transition={300} />
        <BlurView intensity={65} tint="dark" style={styles.blurInfo}>
          <Text style={styles.coverTitle} numberOfLines={1}>{name}</Text>
        </BlurView>
      </View>
      <View style={styles.gameInfo}>
        <View style={styles.gameTitleRow}>
          <Text style={styles.gameTitle} numberOfLines={2}>{name}</Text>
        </View>
        <Text style={styles.details}>{ratingText} • {platformNames}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  gridCard: { flex: 1, backgroundColor: '#151A27', borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: '#202638' },
  gridCoverContainer: { width: '100%', aspectRatio: 2 / 3, position: 'relative', backgroundColor: '#1B2130' },
  gridCover: { width: '100%', height: '100%', backgroundColor: '#1B2130' },
  gridBlurInfo: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 9, paddingVertical: 7, overflow: 'hidden' },
  gridStatus: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  gridInfo: { padding: 11 },
  gridTitle: { color: '#FFFFFF', fontSize: 14, lineHeight: 18, fontWeight: '700', minHeight: 36 },
  gridInfoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  gridDetails: { flex: 1, color: '#9CA3AF', fontSize: 11, lineHeight: 15, paddingRight: 5 },
});