import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { SCREEN_NAMES } from '../constants';
import { RootStackParamList } from '../navigation/RootNavigator';

const DIYMakeupCameraScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTakePhoto = () => {
    // Simulate taking a photo
    // In a real app, you would use react-native-camera here
    const simulatedImageUri = 'simulated_photo.jpg';
    navigation.navigate(SCREEN_NAMES.DIY_MAKEUP_EDIT, { imageUri: simulatedImageUri });
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
          <Text style={styles.headerTitle}>Take Photo</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.content}>
          {/* Camera Preview Placeholder */}
          <View style={styles.cameraContainer}>
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>Camera Preview</Text>
              <Text style={styles.cameraNote}>
                In a real app, this would show the camera preview using react-native-camera
              </Text>
            </View>
          </View>

          {/* Camera Controls */}
          <View style={styles.controlsContainer}>
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleTakePhoto}
                activeOpacity={0.8}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>

            <Text style={styles.instructionText}>
              Tap the button to take a photo
            </Text>
          </View>
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
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  cameraIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  cameraText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 15,
  },
  cameraNote: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  controlsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default DIYMakeupCameraScreen;

