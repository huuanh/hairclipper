/**
 * Hair Clipper Prank App
 * 
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import RootNavigator from './src/navigation/RootNavigator';

function App() {

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
