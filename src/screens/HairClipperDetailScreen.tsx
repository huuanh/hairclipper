import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Vibration,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

import { CustomButton } from '../components';
import { useSoundPlayer } from '../components/SoundPlayer';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import NeedVipModal from '../components/NeedVipModal';
import IAPModal from '../components/IAPModal';
import VIPManager from '../utils/VIPManager';
import AdManager, { ADS_UNIT } from '../utils/AdManager';
import { Colors, GradientStyles } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SCREEN_NAMES } from '../constants';
import { HAIR_CLIPPERS } from '../constants/data';
import { useTranslation } from '../hooks/useTranslation';

const getClipperImage = (id: number) => {
  switch (id) {
    case 1: return require('../../assets/hairClipper/1.png');
    case 2: return require('../../assets/hairClipper/2.png');
    case 3: return require('../../assets/hairClipper/3.png');
    case 4: return require('../../assets/hairClipper/4.png');
    case 5: return require('../../assets/hairClipper/5.png');
    case 6: return require('../../assets/hairClipper/6.png');
    case 7: return require('../../assets/hairClipper/7.png');
    case 8: return require('../../assets/hairClipper/8.png');
    case 9: return require('../../assets/hairClipper/9.png');
    case 10: return require('../../assets/hairClipper/10.png');
    default: return require('../../assets/hairClipper/1.png');
  }
};

type HairClipperDetailRouteProp = RouteProp<RootStackParamList, 'HairClipperDetail'>;

const HairClipperDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<HairClipperDetailRouteProp>();
  const { clipper } = route.params;
  const insets = useSafeAreaInsets();

  const [isActive, setIsActive] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [playAfter, setPlayAfter] = useState(0); // 0 = off, 3, 5, 10 seconds
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showNeedVipModal, setShowNeedVipModal] = useState(false);
  const [showIAPModal, setShowIAPModal] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [pendingSelectedClipper, setPendingSelectedClipper] = useState<any>(null);

  // Use translation hook
  const { t } = useTranslation();

  // Sound player với flash integration  
  const { playSound, stopSound, isFlashing: soundFlashing } = useSoundPlayer({
    soundFile: clipper.sound,
    loop: loopEnabled,
    vibrate: vibrationEnabled,
    vibrationPattern: [0, 100, 50, 100],
    flash: flashEnabled,
  });

  // Debug flash state
  useEffect(() => {
    console.log('Flash state changed:', { flashEnabled, soundFlashing });
  }, [flashEnabled, soundFlashing]);

  // Check VIP status
  useEffect(() => {
    const checkVipStatus = async () => {
      const vipManager = VIPManager.getInstance();
      const vipStatus = vipManager.getIsVip();
      setIsVip(vipStatus);
    };
    checkVipStatus();

    const vipManager = VIPManager.getInstance();
    const handleVipStatusChange = (status: boolean) => {
      setIsVip(status);
    };
    
    vipManager.addVipStatusCallback(handleVipStatusChange);

    return () => {
      vipManager.removeVipStatusCallback(handleVipStatusChange);
    };
  }, []);

  const handlePlayAfterSelect = () => {
    setShowTimeModal(true);
  };

  const handleTimeSelect = (seconds: number) => {
    setPlayAfter(seconds);
    setShowTimeModal(false);

    // Nếu chọn thời gian > 0, bắt đầu đếm ngược ngay lập tức
    if (seconds > 0) {
      setCountdown(seconds);
      // Dừng phát nhạc nếu đang phát
      if (isActive) {
        stopSound();
        setIsActive(false);
      }
    } else {
      setCountdown(0); // Reset countdown khi chọn "off"
    }
  };

  useEffect(() => {
    let interval: any;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            // Khi countdown kết thúc, tự động phát nhạc với flash
            setIsActive(true);
            setPlayAfter(0); // Reset playAfter sau khi phát
            playSound();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      // Cleanup flash khi component unmount
    };
  }, [countdown, playSound]);

  const handleBackPress = () => {
    stopSound();
    setIsActive(false);
    navigation.goBack();
  };

  const handlePrankToggle = () => {
    if (isActive) {
      stopSound();
      setIsActive(false);
    } else {
      if (playAfter > 0) {
        setCountdown(playAfter);
      } else {
        playSound();
        setIsActive(true);
      }
    }
  };

  const handleZoom = () => {
    setIsZoomedIn(!isZoomedIn);
  };

  const handleFlashToggle = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleVibrationToggle = () => {
    setVibrationEnabled(!vibrationEnabled);
  };

  const handleHomePress = () => {
    stopSound();
    setIsActive(false);
    navigation.goBack();
  };

  const handleLoopToggle = () => {
    setLoopEnabled(!loopEnabled);
  };

  const handleClipperSelect = (selectedClipper: any) => {
    console.log('Selected clipper:', selectedClipper.name, 'needVip:', selectedClipper.needVip, 'isVip:', isVip);
    
    // Check if item needs VIP and user is not VIP
    if (selectedClipper.needVip && !isVip) {
      console.log('Setting pending clipper and showing VIP modal');
      setPendingSelectedClipper(selectedClipper);
      setShowNeedVipModal(true);
      return;
    }
    
    console.log('Direct navigation - no VIP check needed');
    // Dừng âm thanh hiện tại nếu đang phát
    if (isActive) {
      stopSound();
      setIsActive(false);
    }
    
    // Reset các state về mặc định
    setCountdown(0);
    setPlayAfter(0);
    setIsZoomedIn(false);
    setShowTimeModal(false);
    
    // Navigate đến detail screen với clipper mới
    navigation.navigate('HairClipperDetail', { clipper: selectedClipper });
  };

  const navigateToPendingClipper = () => {
    console.log('navigateToPendingClipper called with:', pendingSelectedClipper);
    
    if (pendingSelectedClipper) {
      console.log('Navigating to pending clipper:', pendingSelectedClipper.name);
      
      // Dừng âm thanh hiện tại nếu đang phát
      if (isActive) {
        console.log('Stopping current sound');
        stopSound();
        setIsActive(false);
      }
      
      // Reset các state về mặc định
      setCountdown(0);
      setPlayAfter(0);
      setIsZoomedIn(false);
      setShowTimeModal(false);
      
      // Navigate đến detail screen với clipper đã chọn
      console.log('Attempting navigation to HairClipperDetail');
      navigation.navigate('HairClipperDetail', { clipper: pendingSelectedClipper });
      
      // Reset pending clipper
      setPendingSelectedClipper(null);
      console.log('Reset pending clipper to null');
    } else {
      console.log('No pending clipper to navigate to');
    }
  };

  const otherClippers = HAIR_CLIPPERS.filter(c => c.id !== clipper.id);

  return (
    <LinearGradient
      colors={GradientStyles.dark.colors}
      start={GradientStyles.dark.start}
      end={GradientStyles.dark.end}
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <ImageBackground
          source={require('../../assets/hairClipper/bigbg.png')}
          style={[
            styles.sectionsBackground,
            isZoomedIn && styles.sectionsBackgroundZoomed
          ]}
          resizeMode="cover">

          {/* Section 1: Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
              <Image
                source={require('../../assets/icon/back.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{clipper.name}</Text>
            <View style={styles.headerSpace} />
          </View>

          {/* Section 2: Image Item */}
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={handlePrankToggle} activeOpacity={0.8}>
              <Image
                source={getClipperImage(clipper.id)}
                style={[
                  styles.clipperImage,
                  isZoomedIn && styles.clipperImageZoomed
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {countdown > 0 && (
              <View style={styles.countdownOverlay}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            )}
          </View>

          {/* Section 3: Action Buttons */}
          <View style={styles.actionButtonsSection}>
            <TouchableOpacity style={styles.actionButton} onPress={handleZoom}>
              <Image
                source={isZoomedIn ? require('../../assets/icon/zoom_out.png') : require('../../assets/icon/zoom_in.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleFlashToggle}>
              <Image
                source={flashEnabled ? require('../../assets/icon/flash_on.png') : require('../../assets/icon/flash_off.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleVibrationToggle}>
              <Image
                source={vibrationEnabled ? require('../../assets/icon/vibrate_on.png') : require('../../assets/icon/vibrate_off.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleHomePress}>
              <Image
                source={require('../../assets/icon/home.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Section 4: Play After & Loop Controls */}
        {!isZoomedIn && (
          <View style={styles.controlsSection}>
            <View style={styles.playAfterContainer}>
              <Text style={styles.controlLabel}>{t('control.play_after', 'Play after')}</Text>
              <TouchableOpacity
                style={styles.playAfterSelector}
                onPress={handlePlayAfterSelect}>
                <Text style={styles.playAfterSelectorText}>
                  {countdown > 0 ? `${countdown}s` : (playAfter === 0 ? t('modal.off', 'Off') : `${playAfter}s`)}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.loopButton, loopEnabled && styles.loopButtonActive]}
              onPress={handleLoopToggle}>
              <View style={styles.loopContent}>
                <Text style={[styles.loopText, loopEnabled && styles.loopTextActive]}>
                  {t('control.loop', 'Loop')}
                </Text>
                <Image
                  source={loopEnabled ? require('../../assets/icon/loop_on.png') : require('../../assets/icon/loop_off.png')}
                  style={styles.loopIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Section 5: Other Clippers List */}
        {!isZoomedIn && (
          <View style={styles.otherClippersSection}>
            <FlatList
              data={otherClippers}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.otherClipperItem}
                  onPress={() => handleClipperSelect(item)}>
                  <ImageBackground
                    source={require('../../assets/hairClipper/bg.png')}
                    style={styles.otherClipperBackground}
                    resizeMode="cover">
                    <Image
                      source={getClipperImage(item.id)}
                      style={styles.otherClipperImage}
                      resizeMode="contain"
                    />
                    {item.needVip && (
                      <View style={styles.otherClipperVipBadge}>
                        <Image 
                          source={require('../../assets/icon/vip.png')} 
                          style={styles.otherClipperVipIcon} 
                          resizeMode="contain" 
                        />
                      </View>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.otherClippersList}
            />
          </View>
        )}
      </View>

      {/* Ad Section - Moved outside main container */}
        <View style={styles.adWrapper}>
          <NativeAdComponent 
            adUnitId={ADS_UNIT.NATIVE_HAIRCLIPPER_ITEM}/>
        </View>

      {/* Flash Overlay */}
      {soundFlashing && flashEnabled && (
        <View style={styles.flashOverlay} />
      )}

      {/* Need VIP Modal */}
      <NeedVipModal
        visible={showNeedVipModal}
        onClose={() => {
          setShowNeedVipModal(false);
          setPendingSelectedClipper(null);
        }}
        onWatchAds={async () => {
          try {
            console.log('Watch ads clicked, pending clipper:', pendingSelectedClipper?.name);
            setShowNeedVipModal(false);
            
            const result = await AdManager.showRewardedAd();
            console.log('Rewarded ad result:', result);
            
            if (result) {
              console.log('Rewarded ad completed successfully');
              // Grant temporary access to the selected item
              setTimeout(() => {
                navigateToPendingClipper();
              }, 100); // Small delay to ensure modal is closed
            } else {
              console.log('Rewarded ad was not completed');
              // Reset pending clipper since ad wasn't completed
              setPendingSelectedClipper(null);
            }
          } catch (error) {
            console.error('Error showing rewarded ad:', error);
            // Reset pending clipper on error
            setPendingSelectedClipper(null);
          }
        }}
        onGoPremium={() => {
          console.log('Go premium clicked');
          setShowNeedVipModal(false);
          setShowIAPModal(true);
        }}
        itemType="Hair Clipper"
      />

      {/* IAP Modal */}
      <IAPModal
        visible={showIAPModal}
        onClose={() => {
          setShowIAPModal(false);
          // Clear pending clipper if user closes IAP modal without purchasing
          setPendingSelectedClipper(null);
        }}
        onPurchase={() => {
          console.log('Purchase completed');
          setShowIAPModal(false);
          // VIP status will be updated automatically via VIPManager callback
          // Also navigate to the pending clipper if there is one
          if (pendingSelectedClipper) {
            console.log('IAP completed, navigating to pending clipper');
            navigateToPendingClipper();
          }
        }}
      />

      {/* Time Selection Modal */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('modal.select_play_after_time', 'Select Play After Time')}</Text>

            {[
              { label: t('modal.off', 'Off'), value: 0 },
              { label: `3 ${t('modal.seconds', 'seconds')}`, value: 3 },
              { label: `5 ${t('modal.seconds', 'seconds')}`, value: 5 },
              { label: `10 ${t('modal.seconds', 'seconds')}`, value: 10 },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  playAfter === option.value && styles.modalOptionSelected
                ]}
                onPress={() => handleTimeSelect(option.value)}>
                <Text style={[
                  styles.modalOptionText,
                  playAfter === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowTimeModal(false);
              }}>
              <Text style={styles.modalCloseText}>{t('modal.cancel', 'Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionsBackground: {
    flex: 15,
    borderRadius: 20,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  sectionsBackgroundZoomed: {
    flex: 1,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 20,
    // paddingVertical: 15,
    marginBottom: 10,
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
  headerSpace: {
    width: 40,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  clipperImage: {
    width: Dimensions.get('window').width * 0.68,
    height: Dimensions.get('window').height * 0.4,
  },
  clipperImageZoomed: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.6,
  },
  countdownOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.white,
  },
  actionButtonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 60,
    // paddingVertical: 15,
    bottom: 0,
  },
  actionButton: {
    width: 40,
    height: 40,
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 32,
    height: 32,
    // tintColor: Colors.white,
  },

  controlsSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 15,
    marginBottom: 10,
  },
  playAfterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    color: Colors.white,
    // marginBottom: 8,
  },
  playAfterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
    marginLeft: 10,
  },
  playAfterSelectorText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: Colors.white,
    marginLeft: 8,
  },
  loopButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginLeft: 15,
  },
  loopButtonActive: {
    // backgroundColor: Colors.primary,
  },
  loopText: {
    fontSize: 14,
    color: Colors.white,
  },
  loopTextActive: {
    fontWeight: 'bold',
  },
  loopIcon: {
    width: 32,
    height: 32,
    // tintColor: Colors.white,
    marginLeft: 6,
  },
  loopContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherClippersSection: {
    height: 80, // Fixed height để đảm bảo scroll hoạt động
    marginBottom: 10,
  },
  otherClippersList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  otherClipperItem: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  otherClipperBackground: {
    flex: 1,
    padding: 8,
    position: 'relative',
  },
  otherClipperImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  otherClipperVipBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherClipperVipIcon: {
    width: 12,
    height: 12,
  },
  adWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    // backgroundColor: 'transparent',
    backgroundColor: Colors.background,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOptionSelected: {
    backgroundColor: Colors.primary || '#007AFF',
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    fontWeight: 'bold',
  },
  modalCloseButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalCloseText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Flash overlay style
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 1000,
    pointerEvents: 'none', // Cho phép touch events đi qua
    opacity: 1,
  },
});

export default HairClipperDetailScreen;
