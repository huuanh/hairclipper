import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { HAIR_DRYERS } from '../constants/data';
import { SCREEN_NAMES } from '../constants';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NativeAdComponent } from '../utils/NativeAdComponent';

const HairDryerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handleDryerPress = (dryer: typeof HAIR_DRYERS[0]) => {
    navigation.navigate(SCREEN_NAMES.HAIR_DRYER_DETAIL, { dryer });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getDryerImage = (id: number) => {
    switch (id) {
      case 1: return require('../../assets/hairDry/1.png');
      case 2: return require('../../assets/hairDry/2.png');
      case 3: return require('../../assets/hairDry/3.png');
      case 4: return require('../../assets/hairDry/4.png');
      case 5: return require('../../assets/hairDry/5.png');
      case 6: return require('../../assets/hairDry/6.png');
      case 7: return require('../../assets/hairDry/7.png');
      case 8: return require('../../assets/hairDry/8.png');
      case 9: return require('../../assets/hairDry/9.png');
      case 10: return require('../../assets/hairDry/10.png');
      default: return require('../../assets/hairDry/1.png');
    }
  };

  const renderDryerItem = ({ item, index }: { item: typeof HAIR_DRYERS[0], index: number }) => (
    <TouchableOpacity
      style={styles.dryerItem}
      onPress={() => handleDryerPress(item)}
      activeOpacity={0.8}>
      <ImageBackground
        source={require('../../assets/hairClipper/bg.png')}
        style={styles.dryerBackground}
        resizeMode="cover">
        <View style={styles.dryerContent}>
          <View style={styles.dryerImageContainer}>
            <Image 
              source={getDryerImage(item.id)} 
              style={styles.dryerImage} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.dryerName}>{item.name}</Text>
          <View style={styles.vipBadge}>
            <Image source={require('../../assets/icon/vip.png')} style={styles.crownIcon} resizeMode="contain" />
          </View>
        </View>
      </ImageBackground>
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
            <Image source={require('../../assets/icon/back.png')} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hair Dryer</Text>
          <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
            <Image source={require('../../assets/icon/setting.png')} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={HAIR_DRYERS}
          renderItem={renderDryerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
          style={styles.flatList}
        />
        
        {/* Native Ad at the bottom */}
        <View style={styles.adWrapper}>
          <NativeAdComponent />
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
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  dryerItem: {
    width: '48%',
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
  dryerBackground: {
    padding: 15,
    minHeight: 140,
  },
  dryerContent: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  dryerImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dryerImage: {
    width: 60,
    height: 60,
  },
  dryerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  vipBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownIcon: {
    width: 16,
    height: 16,
  },
  flatList: {
    flex: 1,
  },
  adWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});

export default HairDryerScreen;
