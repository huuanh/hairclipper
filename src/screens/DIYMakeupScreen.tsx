import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

import { CustomButton, MenuCard } from '../components';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import { Colors, GradientStyles } from '../constants/colors';
import { SCREEN_NAMES } from '../constants';
import { useTranslation } from '../hooks/useTranslation';
import { ADS_UNIT } from '../utils/AdManager';

const DIYMakeupScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const DIY_MAKEUP_OPTIONS = [
    {
      id: 1,
      title: t('diy.upload_photo'),
      icon: require('../../assets/icon/gallery.png'),
      action: 'gallery',
    },
    {
      id: 2,
      title: t('diy.capture_camera'),
      icon: require('../../assets/icon/camera.png'),
      action: 'camera',
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    navigation.navigate(SCREEN_NAMES.SETTINGS as never);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const navigateToEdit = (imageUri: string) => {
    (navigation as any).navigate(SCREEN_NAMES.DIY_MAKEUP_EDIT, { imageUri });
  };

  const handleCameraLaunch = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          navigateToEdit(imageUri);
        }
      }
    });
  };

  const handleGalleryLaunch = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorMessage) {
        console.log('Gallery Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select photo. Please try again.');
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          navigateToEdit(imageUri);
        }
      }
    });
  };

  const handleOptionPress = (action: string) => {
    if (action === 'camera') {
      handleCameraLaunch();
    } else if (action === 'gallery') {
      handleGalleryLaunch();
    }
  };

  const OptionCard: React.FC<{ option: typeof DIY_MAKEUP_OPTIONS[0] }> = ({ option }) => (
    <TouchableOpacity
      style={styles.optionCard}
      onPress={() => handleOptionPress(option.action)}
      activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <View style={styles.iconContainer}>
          <Image source={option.icon} style={styles.optionIcon} />
        </View>
      </View>
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
            <Image
              source={require('../../assets/icon/back.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('header.diy_makeup')}</Text>
          <TouchableOpacity style={styles.headerButton} onPress={handleSettingsPress}>
            <Image
              source={require('../../assets/icon/setting.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.optionsContainer}>
            {DIY_MAKEUP_OPTIONS.map((option) => (
              <OptionCard key={option.id} option={option} />
            ))}
          </View>
        </View>

        <View style={styles.adWrapper}>
          <NativeAdComponent 
            adUnitId={ADS_UNIT.NATIVE_DIYMAKER}
            hasMedia={true} />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIcon: {
    width: 30,
    height: 30,
    // tintColor: Colors.white,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'left',
    lineHeight: 30,
  },
  adWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});

export default DIYMakeupScreen;

