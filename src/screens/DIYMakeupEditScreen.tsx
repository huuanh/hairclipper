import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';

type DIYMakeupEditRouteProp = RouteProp<RootStackParamList, 'DIYMakeupEdit'>;

const MAKEUP_EFFECTS = [
  { id: 1, name: 'Beard 1', emoji: '🧔', category: 'beard' },
  { id: 2, name: 'Beard 2', emoji: '👴', category: 'beard' },
  { id: 3, name: 'Mustache', emoji: '👨', category: 'beard' },
  { id: 4, name: 'Hair 1', emoji: '👱', category: 'hair' },
  { id: 5, name: 'Hair 2', emoji: '👩', category: 'hair' },
  { id: 6, name: 'Hair 3', emoji: '🧑', category: 'hair' },
];

const DIYMakeupEditScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<DIYMakeupEditRouteProp>();
  const { imageUri } = route.params;
  
  const [selectedEffect, setSelectedEffect] = useState<number | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEffectPress = (effectId: number) => {
    setSelectedEffect(effectId === selectedEffect ? null : effectId);
  };

  const handleSavePress = () => {
    // In a real app, you would save the edited image here
    Alert.alert('Success', 'Photo saved with makeup effects!');
    navigation.goBack();
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
          <Text style={styles.headerTitle}>Edit Photo</Text>
          <CustomButton
            title="Save"
            onPress={handleSavePress}
            size="small"
            style={styles.saveButton}
          />
        </View>

        <View style={styles.content}>
          {/* Photo Preview */}
          <View style={styles.photoContainer}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>🖼️</Text>
              <Text style={styles.photoText}>Photo Preview</Text>
              <Text style={styles.photoNote}>
                Image: {imageUri}
              </Text>
              {selectedEffect && (
                <View style={styles.effectOverlay}>
                  <Text style={styles.effectText}>
                    Effect: {MAKEUP_EFFECTS.find(e => e.id === selectedEffect)?.name}
                  </Text>
                  <Text style={styles.effectEmoji}>
                    {MAKEUP_EFFECTS.find(e => e.id === selectedEffect)?.emoji}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Effects Toolbar */}
          <View style={styles.effectsContainer}>
            <Text style={styles.effectsTitle}>Makeup Effects</Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.effectsScrollView}>
              {MAKEUP_EFFECTS.map((effect) => (
                <TouchableOpacity
                  key={effect.id}
                  style={[
                    styles.effectButton,
                    selectedEffect === effect.id && styles.effectButtonSelected
                  ]}
                  onPress={() => handleEffectPress(effect.id)}
                  activeOpacity={0.8}>
                  <Text style={styles.effectEmoji}>{effect.emoji}</Text>
                  <Text style={styles.effectName}>{effect.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionText}>
              Tap on the effects above to apply them to your photo. 
              You can combine multiple effects for funnier results!
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
  saveButton: {
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  photoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
  },
  photoNote: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
  },
  effectOverlay: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  effectText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  effectsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  effectsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 15,
  },
  effectsScrollView: {
    paddingRight: 20,
  },
  effectButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  effectButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  effectEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  effectName: {
    fontSize: 10,
    color: Colors.white,
    textAlign: 'center',
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DIYMakeupEditScreen;

