import React, { useState, useRef } from 'react';
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
  Dimensions,
  PermissionsAndroid,
  Platform,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State
} from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';
import * as ImageManipulator from 'expo-image-manipulator';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';

import { CustomButton } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NativeAdComponent } from '../utils/NativeAdComponent';

type DIYMakeupEditRouteProp = RouteProp<RootStackParamList, 'DIYMakeupEdit'>;

type TabType = 'hair' | 'beard' | 'baldHead';

interface MakeupItem {
  id: number;
  image: any;
  category: TabType;
}

interface PlacedItem {
  id: string;
  category: TabType;
  itemId: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  initialX?: number;
  initialY?: number;
  initialScale?: number;
  initialRotation?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

  const viewShotRef = useRef<ViewShot>(null);
  const [activeTab, setActiveTab] = useState<TabType>('hair');
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isGesturing, setIsGesturing] = useState<boolean>(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [savedImageUri, setSavedImageUri] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleItemPress = (itemId: number) => {
    // Calculate position to avoid overlapping with existing items
    const existingItemsCount = placedItems.length;
    const offsetX = (existingItemsCount % 3) * 30; // Stagger horizontally
    const offsetY = Math.floor(existingItemsCount / 3) * 30; // Stagger vertically

    const newItem: PlacedItem = {
      id: `${activeTab}-${itemId}-${Date.now()}`,
      category: activeTab,
      itemId: itemId,
      x: (screenWidth / 2 - 50) + offsetX,
      y: 150 + offsetY,
      scale: 1,
      rotation: 0,
    };
    setPlacedItems(prev => [...prev, newItem]);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // For Android 13+ (API 33+), we need different permissions
        const androidVersion = Platform.Version as number;
        const permission = androidVersion >= 33
          ? 'android.permission.READ_MEDIA_IMAGES'
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(
          permission,
          {
            title: 'Storage Permission',
            message: 'App needs storage permission to save photos to gallery',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleSavePress = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Storage permission is required to save photos.');
        return;
      }

      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();

        // Save to device gallery
        await CameraRoll.save(uri, { type: 'photo' });

        // Show success popup with saved image
        setSavedImageUri(uri);
        setShowSaveSuccess(true);
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  const handleEditMore = () => {
    setShowSaveSuccess(false);
    navigation.goBack(); // Back to DIYMakeupScreen
  };

  const handleContinueEditing = () => {
    setShowSaveSuccess(false);
    // Continue editing current photo
  };

  const handleBackToHome = () => {
    setShowSaveSuccess(false);
    navigation.navigate('Home' as never);
  };

  const handleShare = async () => {
    try {
      if (!savedImageUri) {
        Alert.alert('Error', 'No image to share');
        return;
      }

      const shareOptions = {
        title: 'Hair Makeover',
        message: 'Check out my awesome hair makeover created with Hair Clipper App! 💇‍♂️✨',
        url: savedImageUri,
        type: 'image/jpeg',
        subject: 'Hair Makeover from Hair Clipper App',
        failOnCancel: false,
        showAppsToView: true,
      };

      await Share.open(shareOptions);
      console.log('Share dialog opened successfully');
    } catch (error: any) {
      // Don't show error if user simply cancelled the share
      if (error?.message && !error.message.includes('User did not share') && !error.message.includes('cancelled')) {
        console.error('Error sharing:', error);
        Alert.alert('Error', 'Failed to share image. Please try again.');
      }
    }
  };

  const handleGestureEvent = (itemId: string) => (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    setPlacedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const initialX = item.initialX !== undefined ? item.initialX : item.x;
        const initialY = item.initialY !== undefined ? item.initialY : item.y;
        return {
          ...item,
          x: initialX + translationX,
          y: initialY + translationY,
          initialX,
          initialY,
        };
      }
      return item;
    }));
  };

  const handleGestureStateChange = (itemId: string) => (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      // Gesture started - save initial position
      setPlacedItems(prev => prev.map(item =>
        item.id === itemId
          ? {
            ...item,
            initialX: item.x,
            initialY: item.y,
            initialScale: item.scale,
            initialRotation: item.rotation
          }
          : item
      ));
      setSelectedItemId(itemId);
    } else if (event.nativeEvent.state === State.END) {
      // Gesture ended - finalize position
      const { translationX, translationY } = event.nativeEvent;
      setPlacedItems(prev => prev.map(item => {
        if (item.id === itemId) {
          const initialX = item.initialX !== undefined ? item.initialX : item.x;
          const initialY = item.initialY !== undefined ? item.initialY : item.y;
          return {
            ...item,
            x: initialX + translationX,
            y: initialY + translationY,
            initialX: undefined,
            initialY: undefined,
            initialScale: undefined,
            initialRotation: undefined,
          };
        }
        return item;
      }));
      setSelectedItemId(null);
    }
  };

  const handlePinchEvent = (itemId: string) => (event: any) => {
    const { scale } = event.nativeEvent;
    setIsGesturing(true);
    setPlacedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const initialScale = item.initialScale !== undefined ? item.initialScale : item.scale;
        const newScale = Math.max(0.5, Math.min(3, initialScale * scale)); // Limit scale between 0.5x and 3x
        return {
          ...item,
          scale: newScale,
          initialScale,
        };
      }
      return item;
    }));
  };

  const handlePinchStateChange = (itemId: string) => (event: any) => {
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      setIsGesturing(false);
    }
  };

  const handleRotationEvent = (itemId: string) => (event: any) => {
    const { rotation } = event.nativeEvent;
    setIsGesturing(true);
    setPlacedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const initialRotation = item.initialRotation !== undefined ? item.initialRotation : item.rotation;
        const newRotation = initialRotation + (rotation * 180) / Math.PI; // Convert to degrees
        return {
          ...item,
          rotation: newRotation,
          initialRotation,
        };
      }
      return item;
    }));
  };

  const handleRotationStateChange = (itemId: string) => (event: any) => {
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      setIsGesturing(false);
    }
  };

  const removeItem = (itemId: string) => {
    setPlacedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleZoomGestureEvent = (itemId: string) => (event: any) => {
    const { translationY } = event.nativeEvent;
    setPlacedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const initialScale = item.initialScale !== undefined ? item.initialScale : item.scale;
        // Kéo lên = zoom in (scale tăng), kéo xuống = zoom out (scale giảm)
        const scaleDelta = -translationY * 0.01; // Negative để kéo lên là zoom in
        const newScale = Math.max(0.5, Math.min(3, initialScale + scaleDelta));
        return {
          ...item,
          scale: newScale,
          initialScale,
        };
      }
      return item;
    }));
  };

  const handleZoomGestureStateChange = (itemId: string) => (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setPlacedItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, initialScale: item.scale }
          : item
      ));
      setIsGesturing(true);
    } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      const { translationY } = event.nativeEvent;
      setPlacedItems(prev => prev.map(item => {
        if (item.id === itemId) {
          const initialScale = item.initialScale !== undefined ? item.initialScale : item.scale;
          const scaleDelta = -translationY * 0.01;
          const finalScale = Math.max(0.5, Math.min(3, initialScale + scaleDelta));
          return {
            ...item,
            scale: finalScale,
            initialScale: undefined,
          };
        }
        return item;
      }));
      setIsGesturing(false);
    }
  };

  const handleRotateGestureEvent = (itemId: string) => (event: any) => {
    const { translationX } = event.nativeEvent;
    setPlacedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const initialRotation = item.initialRotation !== undefined ? item.initialRotation : item.rotation;
        // Kéo phải = xoay thuận (tăng), kéo trái = xoay ngược (giảm)
        const rotationDelta = translationX * 0.5; // 0.5 để điều khiển tốc độ xoay
        const newRotation = initialRotation + rotationDelta;
        return {
          ...item,
          rotation: newRotation,
          initialRotation,
        };
      }
      return item;
    }));
  };

  const handleRotateGestureStateChange = (itemId: string) => (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setPlacedItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, initialRotation: item.rotation }
          : item
      ));
      setIsGesturing(true);
    } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      const { translationX } = event.nativeEvent;
      setPlacedItems(prev => prev.map(item => {
        if (item.id === itemId) {
          const initialRotation = item.initialRotation !== undefined ? item.initialRotation : item.rotation;
          const rotationDelta = translationX * 0.5;
          const finalRotation = initialRotation + rotationDelta;
          return {
            ...item,
            rotation: finalRotation,
            initialRotation: undefined,
          };
        }
        return item;
      }));
      setIsGesturing(false);
    }
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
          <ViewShot ref={viewShotRef} style={styles.photoContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.photoImage}
              resizeMode="cover"
            />
            {/* Render placed makeup items */}
            {placedItems.map((item) => {
              let overlayImage;
              switch (item.category) {
                case 'hair': overlayImage = getHairImage(item.itemId); break;
                case 'beard': overlayImage = getBeardImage(item.itemId); break;
                case 'baldHead': overlayImage = getBaldHeadImage(item.itemId); break;
                default: return null;
              }

              return (
                <PanGestureHandler
                  key={item.id}
                  onGestureEvent={handleGestureEvent(item.id)}
                  onHandlerStateChange={handleGestureStateChange(item.id)}
                >
                  <PinchGestureHandler
                    onGestureEvent={handlePinchEvent(item.id)}
                    onHandlerStateChange={handlePinchStateChange(item.id)}
                  >
                    <RotationGestureHandler
                      onGestureEvent={handleRotationEvent(item.id)}
                      onHandlerStateChange={handleRotationStateChange(item.id)}
                    >
                      <View
                        style={[
                          styles.draggableItem,
                          selectedItemId === item.id && styles.selectedItem,
                          isGesturing && selectedItemId === item.id && styles.gesturingItem,
                          {
                            left: item.x,
                            top: item.y,
                            transform: [
                              { scale: item.scale },
                              { rotate: `${item.rotation}deg` }
                            ]
                          }
                        ]}
                      >
                        {/* Control buttons - only show when selected */}
                        {selectedItemId === item.id && (
                          <>
                            <TouchableOpacity
                              style={[styles.controlButton, styles.removeButton]}
                              onPress={() => removeItem(item.id)}
                            >
                              <Image
                                source={require('../../assets/icon/item_del.png')}
                                style={styles.controlButtonIcon}
                              />
                            </TouchableOpacity>

                            <PanGestureHandler
                              onGestureEvent={handleZoomGestureEvent(item.id)}
                              onHandlerStateChange={handleZoomGestureStateChange(item.id)}
                            >
                              <View style={[styles.controlButton, styles.zoomButton]}>
                                <Image
                                  source={require('../../assets/icon/item_zoom.png')}
                                  style={styles.controlButtonIcon}
                                />
                              </View>
                            </PanGestureHandler>

                            <PanGestureHandler
                              onGestureEvent={handleRotateGestureEvent(item.id)}
                              onHandlerStateChange={handleRotateGestureStateChange(item.id)}
                            >
                              <View style={[styles.controlButton, styles.rotateButton]}>
                                <Image
                                  source={require('../../assets/icon/item_rotate.png')}
                                  style={styles.controlButtonIcon}
                                />
                              </View>
                            </PanGestureHandler>
                          </>
                        )}

                        <Image
                          source={overlayImage}
                          style={styles.placedItemImage}
                          resizeMode="contain"
                        />
                      </View>
                    </RotationGestureHandler>
                  </PinchGestureHandler>
                </PanGestureHandler>
              );
            })}
          </ViewShot>

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
                  style={styles.itemButton}
                  onPress={() => handleItemPress(item.id)}
                  activeOpacity={0.8}>
                  <Image source={item.image} style={styles.itemImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Save Success Popup */}
      <Modal
        visible={showSaveSuccess}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSaveSuccess(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Image saved successfully!!!</Text>

            <View style={styles.popupTop}>
              {savedImageUri && (
                <Image
                  source={{ uri: savedImageUri }}
                  style={styles.popupImage}
                  resizeMode="cover"
                />

              )}
              <View style={styles.popupTopRight}>
                <TouchableOpacity
                  style={[styles.popupButton, styles.editMoreButton]}
                  onPress={handleEditMore}
                >
                  <Text style={styles.editMoreButtonText}>Edit more</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.popupButton, styles.continueButton]}
                  onPress={handleContinueEditing}
                >
                  <Text style={styles.continueButtonText}>Continue editing</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.adWrapper}>
              <NativeAdComponent hasMedia={true} />
            </View>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.popupButton, styles.backToHomeButton]}
              onPress={handleBackToHome}
            >
              <Text style={styles.backToHomeButtonText}>Back to home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  draggableItem: {
    position: 'absolute',
    width: 100,
    height: 100,
    zIndex: 1000,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  gesturingItem: {
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  controlButton: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  removeButton: {
    top: -14,
    right: -14,
    // backgroundColor: '#FF4444',
  },
  zoomButton: {
    top: -14,
    left: -14,
    // backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateButton: {
    bottom: -14,
    right: -14,
    // backgroundColor: '#2196F3',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlButtonIcon: {
    width: 20,
    height: 20,
    // tintColor: 'white',
  },
  placedItemImage: {
    width: '100%',
    height: '100%',
  },
  // Popup styles
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(214, 32, 32, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  popupContainer: {
    backgroundColor: Colors.background,
    // borderRadius: 20,
    padding: 20,
    width: screenWidth,
    height: screenHeight,
    alignItems: 'center',
  },
  popupTop: {
    flexDirection: 'row',
    // height: 2,
  },
  popupTopRight: {
    flex: 2,
    paddingLeft: 20,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700', // Yellow color like in image
    marginBottom: 20,
    textAlign: 'center',
  },
  popupImage: {
    flex: 1,
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 20,
  },
  popupButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 5,
  },
  editMoreButton: {
    backgroundColor: '#8B5CF6', // Purple like in image
  },
  editMoreButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  adWrapper: {
    width: '100%',
    paddingVertical: 10,
  },
  continueButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  shareButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  backToHomeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  backToHomeButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DIYMakeupEditScreen;

