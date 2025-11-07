import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SCREEN_NAMES, ASYNC_STORAGE_KEYS } from '../constants';
import {
  LoadingScreen,
  OnboardingScreen,
  HomeScreen,
  SettingsScreen,
  HairClipperScreen,
  HairClipperDetailScreen,
  DIYMakeupScreen,
  DIYMakeupCameraScreen,
  DIYMakeupEditScreen,
  FunnySoundScreen,
  FunnySoundDetailScreen,
  HairDryerScreen,
  HairDryerDetailScreen,
} from '../screens';

export type RootStackParamList = {
  [SCREEN_NAMES.LOADING]: undefined;
  [SCREEN_NAMES.ONBOARDING]: undefined;
  [SCREEN_NAMES.HOME]: undefined;
  [SCREEN_NAMES.SETTINGS]: undefined;
  [SCREEN_NAMES.HAIR_CLIPPER]: undefined;
  [SCREEN_NAMES.HAIR_CLIPPER_DETAIL]: { clipper: any };
  [SCREEN_NAMES.DIY_MAKEUP]: undefined;
  [SCREEN_NAMES.DIY_MAKEUP_CAMERA]: undefined;
  [SCREEN_NAMES.DIY_MAKEUP_EDIT]: { imageUri: string };
  [SCREEN_NAMES.FUNNY_SOUND]: undefined;
  [SCREEN_NAMES.FUNNY_SOUND_DETAIL]: { sound: any };
  [SCREEN_NAMES.HAIR_DRYER]: undefined;
  [SCREEN_NAMES.HAIR_DRYER_DETAIL]: { dryer: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED);
      if (onboardingCompleted === 'true') {
        setInitialRoute(SCREEN_NAMES.HOME);
      } else {
        setInitialRoute(SCREEN_NAMES.LOADING);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setInitialRoute(SCREEN_NAMES.LOADING);
    }
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A2E' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute as keyof RootStackParamList}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={SCREEN_NAMES.LOADING} component={LoadingScreen} />
        <Stack.Screen name={SCREEN_NAMES.ONBOARDING} component={OnboardingScreen} />
        <Stack.Screen name={SCREEN_NAMES.HOME} component={HomeScreen} />
        <Stack.Screen name={SCREEN_NAMES.SETTINGS} component={SettingsScreen} />
        <Stack.Screen name={SCREEN_NAMES.HAIR_CLIPPER} component={HairClipperScreen} />
        <Stack.Screen name={SCREEN_NAMES.HAIR_CLIPPER_DETAIL} component={HairClipperDetailScreen} />
        <Stack.Screen name={SCREEN_NAMES.DIY_MAKEUP} component={DIYMakeupScreen} />
        <Stack.Screen name={SCREEN_NAMES.DIY_MAKEUP_CAMERA} component={DIYMakeupCameraScreen} />
        <Stack.Screen name={SCREEN_NAMES.DIY_MAKEUP_EDIT} component={DIYMakeupEditScreen} />
        <Stack.Screen name={SCREEN_NAMES.FUNNY_SOUND} component={FunnySoundScreen} />
        <Stack.Screen name={SCREEN_NAMES.FUNNY_SOUND_DETAIL} component={FunnySoundDetailScreen} />
        <Stack.Screen name={SCREEN_NAMES.HAIR_DRYER} component={HairDryerScreen} />
        <Stack.Screen name={SCREEN_NAMES.HAIR_DRYER_DETAIL} component={HairDryerDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;