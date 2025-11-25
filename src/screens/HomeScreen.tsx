import React, { useState, useEffect } from 'react';
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
  BackHandler,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, GradientStyles } from '../constants/colors';
import { SCREEN_NAMES } from '../constants';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import { IAPModal } from '../components';
import { useTranslation } from '../hooks/useTranslation';
import AdManager, { ADS_UNIT } from '../utils/AdManager';
import messaging from '@react-native-firebase/messaging';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  {
    id: 1,
    titleKey: 'home.hair_clipper.title',
    subtitleKey: 'home.hair_clipper.subtitle',
    image: require('../../assets/home/hairclipper.png'),
    screen: SCREEN_NAMES.HAIR_CLIPPER,
  },
  {
    id: 2,
    titleKey: 'home.diy_makeup.title',
    subtitleKey: 'home.diy_makeup.subtitle',
    image: require('../../assets/home/diymakeup.png'),
    screen: SCREEN_NAMES.DIY_MAKEUP,
  },
  {
    id: 3,
    titleKey: 'home.funny_sounds.title',
    subtitleKey: 'home.funny_sounds.subtitle',
    image: require('../../assets/home/funnysound.png'),
    screen: SCREEN_NAMES.FUNNY_SOUND,
  },
  {
    id: 4,
    titleKey: 'home.hair_dryer.title',
    subtitleKey: 'home.hair_dryer.subtitle',
    image: require('../../assets/home/hairdryer.png'),
    screen: SCREEN_NAMES.HAIR_DRYER,
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showIAPModal, setShowIAPModal] = useState(false);

  // Use translation hook
  const { t } = useTranslation();

  async function requestPermission() {
    try {
      // Android 13+ cần POST_NOTIFICATIONS
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission denied (Android 13+)');
          return false;
        }
      }

      // Firebase (iOS + Android)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }


  useEffect(() => {
    // Reset navigation stack to prevent going back
    // navigation.reset({
    //     index: 0,
    //     routes: [{ name: SCREEN_NAMES.ONBOARDING as never }],
    // });

    // Handle hardware back button on Android
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Prevent going back from onboarding
        return true; // Return true to prevent default back behavior
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      requestPermission();
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  const handleMenuPress = async (screen: string) => {
    try {
      // Show interstitial ad before navigation
      console.log('🎯 Showing interstitial ad before navigation to:', screen);
      await AdManager.showInterstitialAd(
        ADS_UNIT.INTERSTITIAL_HOME,
        () => {
          // Navigate after ad is closed
          console.log('📱 Interstitial ad closed, navigating to:', screen);
          navigation.navigate(screen as never);
        },
        (error: any) => {
          // Navigate even if ad fails
          console.log('❌ Interstitial ad failed, navigating anyway:', error);
          navigation.navigate(screen as never);
        }
      );
    } catch (error) {
      // Fallback navigation if ad fails
      console.log('❌ Error showing interstitial ad, navigating anyway:', error);
      navigation.navigate(screen as never);
    }
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
              <Text style={styles.title}>{t('home.title', 'HAIR CLIPPER PRANK')}</Text>
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
                      <Text style={styles.cardTitle}>{t(item.titleKey, item.titleKey)}</Text>
                      <Text style={styles.cardSubtitle}>{t(item.subtitleKey, item.subtitleKey)}</Text>
                      <View style={styles.playButtonContainer}>
                        <TouchableOpacity style={styles.playButton} onPress={() => handleMenuPress(item.screen)}>
                          <Text style={styles.playButtonText}>{t('home.play_now', 'Play now')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Image source={item.image} style={styles.cardImage} />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        {/* Native Ad at the bottom */}
        <View style={styles.adWrapper}>
          <NativeAdComponent
            adUnitId={ADS_UNIT.NATIVE_HOME} />
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
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingBottom: 30,
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
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    // paddingBottom: 10,
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
