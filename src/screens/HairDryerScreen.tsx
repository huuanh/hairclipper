import React, { useState, useEffect } from 'react';
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
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton, NeedVipModal, IAPModal } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { HAIR_DRYERS } from '../constants/data';
import { SCREEN_NAMES } from '../constants';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import VIPManager from '../utils/VIPManager';
import AdManager, { ADS_UNIT } from '../utils/AdManager';
import { useTranslation } from '../hooks/useTranslation';

const HairDryerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [isVip, setIsVip] = useState(false);
  const [showNeedVipModal, setShowNeedVipModal] = useState(false);
  const [showIAPModal, setShowIAPModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof HAIR_DRYERS[0] | null>(null);
  
  // Use translation hook
  const { t } = useTranslation();
  
  useEffect(() => {
    // Check VIP status when screen loads
    const checkVipStatus = async () => {
      try {
        const vipManager = VIPManager.getInstance();
        const vipStatus = await vipManager.getVipStatusWithRefresh();
        setIsVip(vipStatus);
        
        // Add callback for VIP status changes
        const onVipStatusChange = (newVipStatus: boolean) => {
          setIsVip(newVipStatus);
        };
        vipManager.addVipStatusCallback(onVipStatusChange);
        
        // Cleanup callback on unmount
        return () => {
          vipManager.removeVipStatusCallback(onVipStatusChange);
        };
      } catch (error) {
        console.error('❌ Error checking VIP status:', error);
      }
    };
    
    checkVipStatus();
  }, []);

  const handleDryerPress = async (dryer: typeof HAIR_DRYERS[0]) => {
    // Check if item needs VIP and user is not VIP
    if (dryer.needVip && !isVip) {
      setSelectedItem(dryer);
      setShowNeedVipModal(true);
      return;
    }
    
    // Show interstitial ad before navigation (skip for VIP users)
    if (!isVip) {
      try {
        console.log('🎯 Showing interstitial ad for Hair Dryer item...');
        await AdManager.showInterstitialAd(
          ADS_UNIT.INTERSTITIAL_HAIRDRY,
          () => {
            // Navigate to detail after ad is closed
            console.log('✅ Interstitial ad closed, navigating to Hair Dryer detail');
            navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer });
          },
          (error: any) => {
            // Navigate anyway if ad fails
            console.log('❌ Interstitial ad failed:', error);
            navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer });
          }
        );
      } catch (error) {
        // Fallback navigation if ad system fails
        console.error('❌ Error showing interstitial ad:', error);
        navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer });
      }
    } else {
      // VIP users skip ads and navigate directly
      navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    navigation.navigate(SCREEN_NAMES.SETTINGS);
  };

  const handleWatchAds = async () => {
    // Show rewarded ad first
    try {
      console.log('🎥 Showing rewarded ad for Hair Dryer access...');
      const reward = await AdManager.showRewardedAd();
      
      if (reward) {
        console.log('✅ User watched rewarded ad successfully:', reward);
        // Close modal and navigate to detail on successful ad watch
        setShowNeedVipModal(false);
        if (selectedItem) {
          navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer: selectedItem });
        }
      } else {
        console.log('❌ User did not complete rewarded ad');
        // Optionally show a message or keep modal open
      }
    } catch (error) {
      console.error('❌ Error showing rewarded ad:', error);
      // Fallback: still allow access on error
      setShowNeedVipModal(false);
      if (selectedItem) {
        navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer: selectedItem });
      }
    }
  };

  const handleGoPremium = () => {
    setShowNeedVipModal(false);
    setShowIAPModal(true);
  };

  const handleCloseNeedVipModal = () => {
    setShowNeedVipModal(false);
    setSelectedItem(null);
  };

  const handleCloseIAPModal = () => {
    setShowIAPModal(false);
  };

  const handlePurchaseComplete = () => {
    setShowIAPModal(false);
    // VIP status will be updated automatically via callback
  };

  const getDryerImage = (id: number) => {
    switch (id) {
      case 1: return require('../../assets/hairDry/1.png');
      case 2: return require('../../assets/hairDry/2.png');
      case 3: return require('../../assets/hairDry/3.png');
      case 4: return require('../../assets/hairDry/4.png');
      case 5: return require('../../assets/hairDry/5.png');
      case 6: return require('../../assets/hairDry/6.png');
      case 7: return require('../../assets/hairDry/7.png');
      case 8: return require('../../assets/hairDry/8.png');
      case 9: return require('../../assets/hairDry/9.png');
      case 10: return require('../../assets/hairDry/10.png');
      default: return require('../../assets/hairDry/1.png');
    }
  };

  const renderDryerItem = ({ item, index }: { item: typeof HAIR_DRYERS[0], index: number }) => (
    <TouchableOpacity
      style={styles.dryerItem}
      onPress={() => handleDryerPress(item)}
      activeOpacity={0.8}>
      <ImageBackground
        source={require('../../assets/hairClipper/bg.png')}
        style={styles.dryerBackground}
        resizeMode="cover">
        <View style={styles.dryerContent}>
          <View style={styles.dryerImageContainer}>
            <Image 
              source={getDryerImage(item.id)} 
              style={styles.dryerImage} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.dryerName}>{item.name}</Text>
          {item.needVip && (
            <View style={styles.vipBadge}>
              <Image source={require('../../assets/icon/vip.png')} style={styles.crownIcon} resizeMode="contain" />
            </View>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
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
            <Image source={require('../../assets/icon/back.png')} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('header.hair_dryer', 'Hair Dryer')}</Text>
          <TouchableOpacity style={styles.headerButton} onPress={handleSettingsPress}>
            <Image source={require('../../assets/icon/setting.png')} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={HAIR_DRYERS}
          renderItem={renderDryerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
          style={styles.flatList}
        />
        
        {/* Native Ad at the bottom */}
        <View style={styles.adWrapper}>
          <NativeAdComponent 
            adUnitId={ADS_UNIT.NATIVE_HAIRDRY}/>
        </View>
      </View>

      {/* Need VIP Modal */}
      <NeedVipModal
        visible={showNeedVipModal}
        onClose={handleCloseNeedVipModal}
        onWatchAds={handleWatchAds}
        onGoPremium={handleGoPremium}
        itemType="Hair Dryer"
      />

      {/* IAP Modal */}
      <IAPModal
        visible={showIAPModal}
        onClose={handleCloseIAPModal}
        onPurchase={handlePurchaseComplete}
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // paddingVertical: 15,
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
  dryerItem: {
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
  dryerBackground: {
    // padding: 5,
    minHeight: 140,
  },
  dryerContent: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  dryerImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dryerImage: {
    width: 60,
    height: 60,
  },
  dryerName: {
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

export default HairDryerScreen;
