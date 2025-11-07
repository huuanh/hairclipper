import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { useSoundPlayer } from '../components/SoundPlayer';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import { Colors, GradientStyles } from '../constants/colors';
import { FUNNY_SOUNDS } from '../constants/data';
import { SCREEN_NAMES } from '../constants';
import type { RootStackParamList } from '../navigation/RootNavigator';

const getSoundImage = (id: number) => {
  switch (id) {
    case 1: return require('../../assets/funnySound/1.png');
    case 2: return require('../../assets/funnySound/2.png');
    case 3: return require('../../assets/funnySound/3.png');
    case 4: return require('../../assets/funnySound/4.png');
    case 5: return require('../../assets/funnySound/5.png');
    case 6: return require('../../assets/funnySound/6.png');
    case 7: return require('../../assets/funnySound/7.png');
    case 8: return require('../../assets/funnySound/8.png');
    case 9: return require('../../assets/funnySound/9.png');
    case 10: return require('../../assets/funnySound/10.png');
    default: return require('../../assets/funnySound/1.png');
  }
};

const FunnySoundScreen: React.FC = () => {
  const navigation = useNavigation<any>();
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
      navigation.navigate(SCREEN_NAMES.FUNNY_SOUND_DETAIL, { sound: item });
    };

    const isVip = item.id > 2; // Items 3+ are VIP

    return (
      <TouchableOpacity
        style={styles.soundItem}
        onPress={handleSoundPress}
        activeOpacity={0.8}>
        <ImageBackground
          source={require('../../assets/hairClipper/bg.png')}
          style={styles.soundBackground}
          resizeMode="cover">
          <View style={styles.soundContent}>
            {isVip && (
              <View style={styles.vipBadge}>
                <Image
                  source={require('../../assets/icon/vip.png')}
                  style={styles.crownIcon}
                />
              </View>
            )}
            <View style={styles.soundImageContainer}>
              <Image
                source={getSoundImage(item.id)}
                style={styles.soundImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.soundName}>{item.name}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderSoundItem = ({ item }: { item: typeof FUNNY_SOUNDS[0] }) => (
    <SoundItem item={item} />
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
          <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
            <Image
              source={require('../../assets/icon/back.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Funny Sound</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Image
              source={require('../../assets/icon/setting.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={FUNNY_SOUNDS}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          style={styles.flatList}
        />
        
        <View style={styles.adWrapper}>
          <NativeAdComponent />
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
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  soundItem: {
    width: '48%',
    marginBottom: 15,
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
  soundBackground: {
    padding: 15,
    minHeight: 140,
  },
  soundContent: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  soundImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  soundImage: {
    width: 60,
    height: 60,
  },
  soundName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  vipBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownIcon: {
    width: 16,
    height: 16,
  },
  flatList: {
    flex: 1,
  },
  adWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});

export default FunnySoundScreen;
