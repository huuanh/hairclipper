import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Share, Alert,
  Linking,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, GradientStyles } from '../constants/colors';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import { IAPModal } from '../components';

const { width: screenWidth } = Dimensions.get('window');

interface SettingItem {
  id: string;
  title: string;
  icon: any;
  onPress: () => void;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [showIAPModal, setShowIAPModal] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePremiumUpgrade = () => {
    // Open IAP modal
    console.log('Premium upgrade pressed');
    setShowIAPModal(true);
  };

  const handleCloseIAPModal = () => {
    setShowIAPModal(false);
  };

  const handlePurchase = () => {
    // Handle IAP purchase
    console.log('Purchase initiated');
    // TODO: Integrate with IAP library
    setShowIAPModal(false);
  };

  const handleLanguage = () => {
    // Navigate to language selection
    console.log('Language pressed');
  };

  const handleShare = async () => {
    // Open share functionality
    console.log('Share pressed');
    try {
            const shareOptions = {
                title: 'Share App',
                message: 'Check out this amazing app! ' + 'https://play.google.com/store/apps/details?id=boom.bvr.recorder.pro',
                url: 'https://play.google.com/store/apps/details?id=boom.hairclipper.funnyprank.haircut.sound'
            };

            const result = await Share.share(shareOptions);
            
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('✅ App shared via:', result.activityType);
                } else {
                    console.log('✅ App shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('📱 Share dialog dismissed');
            }
        } catch (error) {
            console.error('❌ Error sharing app:', error);
        }
  };

  const handleVote = () => {
    // Open vote modal
    console.log('Vote pressed');
    setShowVoteModal(true);
  };

  const handleCloseVoteModal = () => {
    setShowVoteModal(false);
  };

  const handleStarPress = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitVote = async () => {
    try {
      // Open Play Store for rating
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=boom.hairclipper.funnyprank.haircut.sound';
      const canOpen = await Linking.canOpenURL(playStoreUrl);
      
      if (canOpen) {
        await Linking.openURL(playStoreUrl);
        console.log('✅ Play Store opened for rating');
        setShowVoteModal(false);
      } else {
        console.log('❌ Cannot open Play Store URL');
      }
    } catch (error) {
      console.error('❌ Error opening Play Store:', error);
    }
  };

  const handlePolicy = async () => {
    // Navigate to policy screen
    console.log('Policy pressed');
    try {
            const privacyUrl = 'https://sites.google.com/boomstudio.vn/privacypolicyforboomgamesjsc';
            const canOpen = await Linking.canOpenURL(privacyUrl);
            
            if (canOpen) {
                await Linking.openURL(privacyUrl);
                console.log('✅ Privacy policy opened successfully');
            } else {
                console.log('❌ Cannot open privacy policy URL');
            }
        } catch (error) {
            console.error('❌ Error opening privacy policy:', error);
        }
  };

  const settingItems: SettingItem[] = [
    {
      id: 'language',
      title: 'Language',
      icon: require('../../assets/setting/language.png'),
      onPress: handleLanguage,
    },
    {
      id: 'share',
      title: 'Share',
      icon: require('../../assets/setting/share.png'),
      onPress: handleShare,
    },
    {
      id: 'vote',
      title: 'Vote',
      icon: require('../../assets/setting/vote.png'),
      onPress: handleVote,
    },
    {
      id: 'policy',
      title: 'Policy',
      icon: require('../../assets/setting/policy.png'),
      onPress: handlePolicy,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <Image source={item.icon} style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      <Image
        source={require('../../assets/setting/right.png')}
        style={styles.rightArrow}
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={GradientStyles.dark.colors}
      start={GradientStyles.dark.start}
      end={GradientStyles.dark.end}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
            <Image
              source={require('../../assets/icon/back.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SETTING</Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Premium Upgrade Card */}
          <TouchableOpacity
            style={styles.premiumCard}
            onPress={handlePremiumUpgrade}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#E879F9', '#A855F7', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumContent}>
                <View style={styles.premiumLeft}>
                  <Text style={styles.premiumTitle}>Premium{'\n'}Upgrade</Text>
                  <Text style={styles.premiumSubtitle}>
                    Enjoy Premium Package{'\n'}with exclusive features.
                  </Text>
                </View>
                <View style={styles.premiumRight}>
                  <Image
                    source={require('../../assets/setting/ic_vip.png')}
                    style={styles.premiumIcon}
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Settings List */}
          <View style={styles.settingsList}>
            {settingItems.map(renderSettingItem)}
          </View>

          {/* Native Ad */}
          <View style={styles.adWrapper}>
            <NativeAdComponent hasMedia={true} />
          </View>
        </ScrollView>
      </View>

      {/* IAP Modal */}
      <IAPModal
        visible={showIAPModal}
        onClose={handleCloseIAPModal}
        onPurchase={handlePurchase}
      />

      {/* Vote Modal */}
      <Modal
        visible={showVoteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseVoteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseVoteModal}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            {/* Vote Icon */}
            <Image
              source={require('../../assets/setting/vote_icon.png')}
              style={styles.voteIcon}
            />

            {/* Title */}
            <Text style={styles.modalTitle}>Thank you for using the app</Text>
            <Text style={styles.modalSubtitle}>We look forward to receiving your comments</Text>

            {/* Rating Stars */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  style={styles.starButton}
                >
                  <Image
                    source={
                      star <= selectedRating
                        ? require('../../assets/setting/star.png')
                        : require('../../assets/setting/empty_star.png')
                    }
                    style={styles.starImage}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Vote Button */}
            <TouchableOpacity
              style={styles.voteButton}
              onPress={handleSubmitVote}
            >
              <Text style={styles.voteButtonText}>VOTE</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  premiumCard: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumLeft: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    lineHeight: 28,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    lineHeight: 18,
  },
  premiumRight: {
    marginLeft: 20,
  },
  premiumIcon: {
    width: 60,
    height: 60,
  },
  settingsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: Colors.white,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  rightArrow: {
    width: 16,
    height: 16,
    tintColor: Colors.gray,
  },
  adWrapper: {
    marginBottom: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: Colors.gray,
    fontSize: 24,
    fontWeight: 'bold',
  },
  voteIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  starButton: {
    padding: 5,
    marginHorizontal: 2,
  },
  starImage: {
    width: 40,
    height: 40,
  },
  voteButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  voteButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SettingsScreen;