import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, GradientStyles } from '../constants/colors';
import AdManager from '../utils/AdManager';
import RemoteConfigManager from '../utils/RemoteConfigManager';
import IAPManager from '../utils/IAPManager';
import VIPManager from '../utils/VIPManager';
import { SCREEN_NAMES, ASYNC_STORAGE_KEYS } from '../constants';

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation();
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        console.log('🚀 Initializing all services...');
        
        // Initialize AdMob
        await AdManager.initialize();
        console.log('✅ AdMob initialized successfully');
        
        // Initialize Firebase Remote Config
        await RemoteConfigManager.initialize();
        console.log('✅ Remote Config initialized successfully');
        
        // Initialize IAP Manager
        const iapManager = IAPManager.getInstance();
        const iapSuccess = await iapManager.initialize();
        
        if (iapSuccess) {
          console.log('✅ IAP Manager initialized successfully');
          // Load user's purchase history
          await iapManager.refreshEntitlements();
        } else {
          console.log('❌ IAP Manager initialization failed');
        }

        // Initialize VIP Manager
        const vipManager = VIPManager.getInstance();
        await vipManager.initialize();
        console.log('✅ VIP Manager initialized successfully');
        
        console.log('✅ All services initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize services:', error);
      }
    };

    const checkNavigationFlow = async () => {
      try {
        // DEVELOPMENT: Uncomment để test clean flow
        // await AsyncStorage.clear();
        
        const onboardingCompleted = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED);
        const languageSelected = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.SELECTED_LANGUAGE);
        
        console.log('Navigation check:', { onboardingCompleted, languageSelected });
        
        if (!languageSelected) {
          navigation.navigate(SCREEN_NAMES.LANGUAGE_SELECTION as never);
        } else {
          navigation.navigate(SCREEN_NAMES.ONBOARDING as never);
        }
      } catch (error) {
        console.error('Error checking navigation flow:', error);
        // Default to language selection if error
        navigation.navigate(SCREEN_NAMES.LANGUAGE_SELECTION as never);
      }
    };

    initializeServices();

    // Start rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // Check navigation flow after 2 seconds
    const timer = setTimeout(() => {
      checkNavigationFlow();
    }, 2000);

    return () => {
      rotateAnimation.stop();
      clearTimeout(timer);
    };
  }, [navigation, rotateValue]);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={GradientStyles.dark.colors}
      start={GradientStyles.dark.start}
      end={GradientStyles.dark.end}
      style={styles.container}>
      <View style={styles.content}>
        {/* <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: spin }],
            },
          ]}>
          <Image source={require('../../assets/icon/icon.png')} />
        </Animated.View> */}
        <Text style={styles.title}>Hair Clipper Prank</Text>
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default LoadingScreen;
