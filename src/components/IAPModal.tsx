import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface IAPModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const IAPModal: React.FC<IAPModalProps> = ({
  visible,
  onClose,
  onPurchase,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background with cover image */}
      <View style={styles.container}>
        <Image
          source={require('../../assets/setting/i_cover.png')}
          style={styles.coverImage}
          resizeMode="cover"
        />
        
        {/* Overlay gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}
        />
        
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.premiumText}>HAIR CLIPPER PRANK</Text>
            <Text style={styles.premiumSubText}>PREMIUM</Text>
          </View>
          
          {/* Main title */}
          <Text style={styles.mainTitle}>BUY ONCE USE FOREVER</Text>
          
          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.checkMark}>✓</Text>
              <Text style={styles.featureText}>Unlock all sounds</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.checkMark}>✓</Text>
              <Text style={styles.featureText}>Remove ads</Text>
            </View>
          </View>
          
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>4.99$</Text>
            <Text style={styles.priceSubText}>One-time purchase</Text>
          </View>
          
          {/* Buy button */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={onPurchase}
          >
            <LinearGradient
              colors={['#E879F9', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyButtonGradient}
            >
              <Text style={styles.buyButtonText}>BUY NOW</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            First My Private PRO allows you to use all the features in our application. Subscriptions will{'\n'}
            be automatically renewed with the same price at your Google Play settings. You can cancel your{'\n'}
            subscription at any time in your Google Play settings.{' '}
            <Text style={styles.linkText}>Terms of use</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2128',
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight * 0.68,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  premiumText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  premiumSubText: {
    color: '#A855F7',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  mainTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkMark: {
    color: '#A855F7',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    width: 20,
  },
  featureText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#A855F7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  priceText: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceSubText: {
    color: Colors.gray,
    fontSize: 14,
  },
  buyButton: {
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buyButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buyButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disclaimer: {
    color: Colors.gray,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: {
    color: '#A855F7',
    textDecorationLine: 'underline',
  },
});

export default IAPModal;