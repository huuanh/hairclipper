import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';

type DIYMakeupEditRouteProp = RouteProp<RootStackParamList, 'DIYMakeupEdit'>;

type TabType = 'hair' | 'beard' | 'baldHead';

interface MakeupItem {
  id: number;
  image: any;
  category: TabType;
}

const getHairImage = (id: number) => {
  switch (id) {
    case 1: return require('../../assets/diyMaker/hair/1.png');
    case 2: return require('../../assets/diyMaker/hair/2.png');
    case 3: return require('../../assets/diyMaker/hair/3.png');
    case 4: return require('../../assets/diyMaker/hair/4.png');
    case 5: return require('../../assets/diyMaker/hair/5.png');
    case 6: return require('../../assets/diyMaker/hair/6.png');
    case 7: return require('../../assets/diyMaker/hair/7.png');
    case 8: return require('../../assets/diyMaker/hair/8.png');
    case 9: return require('../../assets/diyMaker/hair/9.png');
    case 10: return require('../../assets/diyMaker/hair/10.png');
    case 11: return require('../../assets/diyMaker/hair/11.png');
    case 12: return require('../../assets/diyMaker/hair/12.png');
    case 13: return require('../../assets/diyMaker/hair/13.png');
    case 14: return require('../../assets/diyMaker/hair/14.png');
    default: return require('../../assets/diyMaker/hair/1.png');
  }
};

const getBeardImage = (id: number) => {
  switch (id) {
    case 1: return require('../../assets/diyMaker/beard/1.png');
    case 2: return require('../../assets/diyMaker/beard/2.png');
    case 3: return require('../../assets/diyMaker/beard/3.png');
    case 4: return require('../../assets/diyMaker/beard/4.png');
    case 5: return require('../../assets/diyMaker/beard/5.png');
    case 6: return require('../../assets/diyMaker/beard/6.png');
    case 7: return require('../../assets/diyMaker/beard/7.png');
    case 8: return require('../../assets/diyMaker/beard/8.png');
    case 9: return require('../../assets/diyMaker/beard/9.png');
    case 10: return require('../../assets/diyMaker/beard/10.png');
    case 11: return require('../../assets/diyMaker/beard/11.png');
    default: return require('../../assets/diyMaker/beard/1.png');
  }
};

const getBaldHeadImage = (id: number) => {
  switch (id) {
    case 1: return require('../../assets/diyMaker/baldHead/1.png');
    case 2: return require('../../assets/diyMaker/baldHead/2.png');
    case 3: return require('../../assets/diyMaker/baldHead/3.png');
    case 4: return require('../../assets/diyMaker/baldHead/4.png');
    case 5: return require('../../assets/diyMaker/baldHead/5.png');
    case 6: return require('../../assets/diyMaker/baldHead/6.png');
    default: return require('../../assets/diyMaker/baldHead/1.png');
  }
};

const HAIR_ITEMS: MakeupItem[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  image: getHairImage(i + 1),
  category: 'hair',
}));

const BEARD_ITEMS: MakeupItem[] = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  image: getBeardImage(i + 1),
  category: 'beard',
}));

const BALD_HEAD_ITEMS: MakeupItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  image: getBaldHeadImage(i + 1),
  category: 'baldHead',
}));

const TABS = [
  { key: 'hair' as TabType, label: 'Hair', icon: require('../../assets/icon/hair.png') },
  { key: 'beard' as TabType, label: 'Beard', icon: require('../../assets/icon/beard.png') },
  { key: 'baldHead' as TabType, label: 'Bald Head', icon: require('../../assets/icon/bald.png') },
];

const DIYMakeupEditScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<DIYMakeupEditRouteProp>();
  const { imageUri } = route.params;
  
  const [activeTab, setActiveTab] = useState<TabType>('hair');
  const [selectedItems, setSelectedItems] = useState<{ [key in TabType]?: number }>({});

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleItemPress = (itemId: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] === itemId ? undefined : itemId,
    }));
  };

  const handleSavePress = () => {
    Alert.alert('Success', 'Photo saved with makeup effects!');
    navigation.goBack();
  };

  const getCurrentItems = (): MakeupItem[] => {
    switch (activeTab) {
      case 'hair': return HAIR_ITEMS;
      case 'beard': return BEARD_ITEMS;
      case 'baldHead': return BALD_HEAD_ITEMS;
      default: return HAIR_ITEMS;
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
          <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
            <Image
              source={require('../../assets/icon/back.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Photo</Text>
          <TouchableOpacity style={styles.headerButton} onPress={handleSavePress}>
            <Image
              source={require('../../assets/icon/download.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Photo Preview */}
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.photoImage}
              resizeMode="cover"
            />
            {/* Overlay selected makeup items */}
            {Object.entries(selectedItems).map(([category, itemId]) => {
              if (!itemId) return null;
              let overlayImage;
              switch (category) {
                case 'hair': overlayImage = getHairImage(itemId); break;
                case 'beard': overlayImage = getBeardImage(itemId); break;
                case 'baldHead': overlayImage = getBaldHeadImage(itemId); break;
                default: return null;
              }
              return (
                <Image
                  key={category}
                  source={overlayImage}
                  style={styles.overlayImage}
                  resizeMode="cover"
                />
              );
            })}
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive
                ]}
                onPress={() => handleTabPress(tab.key)}
                activeOpacity={0.8}>
                <Image 
                  source={tab.icon} 
                  style={[
                    styles.tabIcon,
                    activeTab === tab.key ? styles.tabIconActive : styles.tabIconInactive
                  ]} 
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Items Grid */}
          <View style={styles.itemsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.itemsScrollView}>
              {getCurrentItems().map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemButton,
                    selectedItems[activeTab] === item.id && styles.itemButtonSelected
                  ]}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.8}>
                  <Image source={item.image} style={styles.itemImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  content: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundLight,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabIcon: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  tabIconActive: {
    tintColor: Colors.white,
  },
  tabIconInactive: {
    tintColor: Colors.gray,
  },
  tabText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.white,
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemsScrollView: {
    paddingRight: 20,
  },
  itemButton: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: Colors.backgroundLight,
    marginRight: 12,
    padding: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  itemButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default DIYMakeupEditScreen;

