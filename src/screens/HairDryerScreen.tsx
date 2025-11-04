import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { HAIR_DRYERS } from '../constants/data';
import { SCREEN_NAMES } from '../constants';
import { RootStackParamList } from '../navigation/RootNavigator';

const HairDryerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handleDryerPress = (dryer: typeof HAIR_DRYERS[0]) => {
    navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderDryerItem = ({ item }: { item: typeof HAIR_DRYERS[0] }) => (
    <TouchableOpacity
      style={styles.dryerItem}
      onPress={() => handleDryerPress(item)}
      activeOpacity={0.8}>
      <LinearGradient
        colors={GradientStyles.primary.colors}
        start={GradientStyles.primary.start}
        end={GradientStyles.primary.end}
        style={styles.dryerGradient}>
        <View style={styles.dryerContent}>
          <View style={styles.dryerImageContainer}>
            <Text style={styles.dryerIcon}>💨</Text>
            <Text style={styles.imagePlaceholder}>
              {item.image}
            </Text>
          </View>
          <Text style={styles.dryerName}>{item.name}</Text>
        </View>
      </LinearGradient>
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
          <CustomButton
            title="← Back"
            onPress={handleBackPress}
            variant="outline"
            size="small"
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Hair Dryers</Text>
          <View style={styles.headerSpace} />
        </View>

        <FlatList
          data={HAIR_DRYERS}
          renderItem={renderDryerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
  listContainer: {
    padding: 20,
  },
  dryerItem: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dryerGradient: {
    padding: 20,
  },
  dryerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dryerImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  dryerIcon: {
    fontSize: 30,
  },
  imagePlaceholder: {
    color: Colors.white,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  dryerName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default HairDryerScreen;
