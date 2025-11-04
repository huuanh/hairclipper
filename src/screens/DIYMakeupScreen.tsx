import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton, MenuCard } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { SCREEN_NAMES } from '../constants';

const DIY_MAKEUP_OPTIONS = [
  {
    id: 1,
    title: 'Take Photo',
    icon: '📷',
    description: 'Use camera to take a new photo',
    action: 'camera',
  },
  {
    id: 2,
    title: 'Choose from Gallery',
    icon: '🖼️',
    description: 'Select existing photo from gallery',
    action: 'gallery',
  },
];

const DIYMakeupScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOptionPress = (action: string) => {
    if (action === 'camera') {
      navigation.navigate(SCREEN_NAMES.DIY_MAKEUP_CAMERA as never);
    } else if (action === 'gallery') {
      // For now, navigate to camera screen as well
      // In a real app, you would open image picker here
      navigation.navigate(SCREEN_NAMES.DIY_MAKEUP_CAMERA as never);
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
          <Text style={styles.headerTitle}>DIY Makeup</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose Photo Source</Text>
            <Text style={styles.subtitle}>
              Select how you want to get a photo for makeup editing
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {DIY_MAKEUP_OPTIONS.map((option) => (
              <View key={option.id} style={styles.optionItem}>
                <MenuCard
                  title={option.title}
                  icon={option.icon}
                  onPress={() => handleOptionPress(option.action)}
                />
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 After taking or selecting a photo, you'll be able to add various makeup effects, beards, and hairstyles to create funny transformations!
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
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionItem: {
    marginBottom: 30,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DIYMakeupScreen;

