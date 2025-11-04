import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { useSoundPlayer } from '../components/SoundPlayer';
import { Colors, GradientStyles } from '../constants/colors';
import { FUNNY_SOUNDS } from '../constants/data';

const FunnySoundScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const SoundItem: React.FC<{ item: typeof FUNNY_SOUNDS[0] }> = ({ item }) => {
    const { playSound } = useSoundPlayer({
      soundFile: item.sound,
      loop: false,
      vibrate: false,
    });

    const handleSoundPress = () => {
      playSound();
    };

    return (
      <TouchableOpacity
        style={styles.soundItem}
        onPress={handleSoundPress}
        activeOpacity={0.8}>
        <LinearGradient
          colors={GradientStyles.primary.colors}
          start={GradientStyles.primary.start}
          end={GradientStyles.primary.end}
          style={styles.soundGradient}>
          <Text style={styles.soundEmoji}>{item.emoji}</Text>
          <Text style={styles.soundName}>{item.name}</Text>
          <Text style={styles.soundFile}>
            Sound: {item.sound}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderSoundItem = ({ item }: { item: typeof FUNNY_SOUNDS[0] }) => (
    <View style={styles.gridItem}>
      <SoundItem item={item} />
    </View>
  );

  return (
    <LinearGradient
      colors={GradientStyles.dark.colors}
      start={GradientStyles.dark.start}
      end={GradientStyles.dark.end}
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <CustomButton
            title="← Back"
            onPress={handleBackPress}
            variant="outline"
            size="small"
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Funny Sounds</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Tap any sound to play it and prank your friends!
          </Text>

          <FlatList
            data={FUNNY_SOUNDS}
            renderItem={renderSoundItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSpace: {
    width: 80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '47%',
    marginBottom: 15,
  },
  soundItem: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  soundGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  soundEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  soundName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 5,
  },
  soundFile: {
    fontSize: 10,
    color: Colors.lightGray,
    textAlign: 'center',
  },
});

export default FunnySoundScreen;
