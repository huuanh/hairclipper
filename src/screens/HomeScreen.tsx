import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, GradientStyles } from '../constants/colors';
import { SCREEN_NAMES } from '../constants';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import { IAPModal } from '../components';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  {
    id: 1,
    title: 'Hair Clipper',
    subtitle: 'Prank your friend right now',
    image: require('../../assets/home/hairclipper.png'),
    screen: SCREEN_NAMES.HAIR_CLIPPER,
  },
  {
    id: 2,
    title: 'DIY Makeup',
    subtitle: 'Prank your friend right now',
    image: require('../../assets/home/diymakeup.png'),
    screen: SCREEN_NAMES.DIY_MAKEUP,
  },
  {
    id: 3,
    title: 'Funny Sounds',
    subtitle: 'Prank your friend right now',
    image: require('../../assets/home/funnysound.png'),
    screen: SCREEN_NAMES.FUNNY_SOUND,
  },
  {
    id: 4,
    title: 'Hair Dryer',
    subtitle: 'Prank your friend right now',
    image: require('../../assets/home/hairdryer.png'),
    screen: SCREEN_NAMES.HAIR_DRYER,
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showIAPModal, setShowIAPModal] = useState(false);

  const handleMenuPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const handleSettingsPress = () => {
    navigation.navigate(SCREEN_NAMES.SETTINGS as never);
  };

  const handleVIPPress = () => {
    setShowIAPModal(true);
  };

  const handleCloseIAPModal = () => {
    setShowIAPModal(false);
  };

  const handlePurchase = () => {
    console.log('Purchase initiated from Home');
    setShowIAPModal(false);
  };

  return (
    <LinearGradient
      colors={GradientStyles.dark.colors}
      start={GradientStyles.dark.start}
      end={GradientStyles.dark.end}
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>HAIR CLIPPER PRANK</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={handleVIPPress}>
                <Image source={require('../../assets/icon/vip.png')} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
                <Image source={require('../../assets/icon/setting.png')} style={styles.iconImage} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.cardsScrollView}
          contentContainerStyle={styles.cardsScrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.cardsContainer}>
            {MENU_ITEMS.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleMenuPress(item.screen)}>
                <ImageBackground
                  source={require('../../assets/home/itembg.png')}
                  style={styles.cardBackground}
                  resizeMode="cover">
                  <View style={styles.cardContent}>
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                      <View style={styles.playButtonContainer}>
                        <TouchableOpacity style={styles.playButton} onPress={() => handleMenuPress(item.screen)}>
                          <Text style={styles.playButtonText}>Play now</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Image source={item.image} style={styles.cardImage}  />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
        
          {/* Native Ad at the bottom */}
          <View style={styles.adWrapper}>
            <NativeAdComponent />
          </View>
      </View>
      
      <IAPModal
        visible={showIAPModal}
        onClose={handleCloseIAPModal}
        onPurchase={handlePurchase}
      />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  menuItem: {
    width: '47%',
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
    // padding: 6,
    paddingBottom: 6,
    // borderRadius: 8,
    // backgroundColor: 'rgba(255,255,255,0.06)'
  },
  iconImage: {
    width: 28,
    height: 28,
  },
  cardsContainer: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardBackground: {
    padding: 12,
    minHeight: 140,
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    color: Colors.black,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: Colors.backgroundLight,
    fontSize: 14,
    marginBottom: 10,
  },
  playButtonContainer: {
    marginTop: 6,
  },
  playButton: {
    backgroundColor: '#FFE66D',
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: Colors.black,
    fontWeight: '700',
  },
  cardImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    position: 'absolute',
    bottom: -24,
    right: -12,
  },
  adWrapper: {
    marginTop: 18,
    marginBottom: 10,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  cardsScrollView: {
    flex: 1,
  },
  cardsScrollContent: {
    paddingHorizontal: 20,
    // paddingBottom: 10,
  },
});

export default HomeScreen;
