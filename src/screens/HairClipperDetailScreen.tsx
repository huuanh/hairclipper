import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { useSoundPlayer } from '../components/SoundPlayer';
import { Colors, GradientStyles } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SCREEN_NAMES } from '../constants';

type HairClipperDetailRouteProp = RouteProp<RootStackParamList, 'HairClipperDetail'>;

const HairClipperDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<HairClipperDetailRouteProp>();
  const { clipper } = route.params;
  const insets = useSafeAreaInsets();
  
  const [isActive, setIsActive] = useState(false);

  const { playSound, stopSound } = useSoundPlayer({
    soundFile: clipper.sound,
    loop: true,
    vibrate: true,
    vibrationPattern: [0, 100, 50, 100],
  });

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
      playSound();
      setIsActive(true);
    }
  };

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
          <Text style={styles.headerTitle}>{clipper.name}</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.content}>
          <View style={styles.clipperContainer}>
            <TouchableOpacity
              style={[
                styles.clipperButton,
                isActive && styles.clipperButtonActive
              ]}
              onPress={handlePrankToggle}
              activeOpacity={0.8}>
              <LinearGradient
                colors={isActive ? ['#EF4444', '#DC2626'] : GradientStyles.primary.colors}
                start={GradientStyles.primary.start}
                end={GradientStyles.primary.end}
                style={styles.clipperGradient}>
                <Text style={styles.clipperIcon}>✂️</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.imagePlaceholder}>
              Image: {clipper.image}
            </Text>
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionTitle}>
              {isActive ? 'Prank Active!' : 'Tap to Start Prank'}
            </Text>
            <Text style={styles.instructionText}>
              {isActive
                ? 'Touch the screen to simulate hair cutting with realistic sounds and vibration'
                : 'Press the button above to activate the hair clipper prank'
              }
            </Text>
          </View>

          {isActive && (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handlePrankToggle}>
              <CustomButton
                title="Stop Prank"
                onPress={handlePrankToggle}
                variant="secondary"
                size="large"
              />
            </TouchableOpacity>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipperContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  clipperButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  clipperButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  clipperGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipperIcon: {
    fontSize: 80,
  },
  imagePlaceholder: {
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  stopButton: {
    width: '100%',
  },
});

export default HairClipperDetailScreen;
