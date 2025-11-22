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
import LinearGradient from 'react-native-linear-gradient';
import { Colors, GradientStyles } from '../constants/colors';
import AdManager from '../utils/AdManager';
import RemoteConfigManager from '../utils/RemoteConfigManager';
import { SCREEN_NAMES } from '../constants';

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation();
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        // Initialize AdMob
        await AdManager.initialize();
        console.log('AdMob initialized successfully');
        
        // Initialize Firebase Remote Config
        await RemoteConfigManager.initialize();
        console.log('Remote Config initialized successfully');
      } catch (error) {
        console.error('Failed to initialize services:', error);
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

    // Navigate to onboarding after 2 seconds
    const timer = setTimeout(() => {
      navigation.navigate(SCREEN_NAMES.ONBOARDING as never);
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
