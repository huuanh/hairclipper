import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';
import LinearGradient from 'react-native-linear-gradient';

import { CustomButton } from '../components';
import { Colors, GradientStyles } from '../constants/colors';
import { SCREEN_NAMES, ONBOARDING_DATA, ASYNC_STORAGE_KEYS } from '../constants';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import { ADS_UNIT } from '../utils/AdManager';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
    const navigation = useNavigation();
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef<PagerView>(null);

    const handleNext = async () => {
        if (currentPage < ONBOARDING_DATA.length - 1) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            pagerRef.current?.setPage(nextPage);
        } else {
            await handleGetStarted();
        }
    };

    const handleGetStarted = async () => {
        try {
            await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
            navigation.navigate(SCREEN_NAMES.HOME as never);
        } catch (error) {
            console.error('Error saving onboarding status:', error);
            navigation.navigate(SCREEN_NAMES.HOME as never);
        }
    };

    const handleSkip = async () => {
        await handleGetStarted();
    };

    const renderPage = (item: typeof ONBOARDING_DATA[0]) => (
        <View key={item.id} style={styles.page}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    source={item.image}
                    style={styles.onboardingImage}
                    resizeMode="cover"
                />
                {/* Content Section - Overlaid on image */}
                <View style={styles.contentContainer}>
                    {renderPagination()}
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
            </View>
        </View>
    );

    const renderPagination = () => (
        <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            backgroundColor: index === currentPage ? Colors.primary : Colors.gray,
                            width: index === currentPage ? 22 : 6,
                        },
                    ]}
                />
            ))}
        </View>
    );

    return (
        <LinearGradient
            colors={GradientStyles.dark.colors}
            start={GradientStyles.dark.start}
            end={GradientStyles.dark.end}
            style={styles.container}>

            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
                {ONBOARDING_DATA.map(renderPage)}
            </PagerView>

            {currentPage === ONBOARDING_DATA.length - 1 && (
                <View style={styles.footer}>
                    <CustomButton
                        title={currentPage === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
                        onPress={handleNext}
                        size="large"
                        variant="outline"
                        style={styles.nextButton}
                        textStyle={styles.nextButtonText}
                    />
                </View>)}
            {/* Native Ads Section */}
            <View style={styles.nativeAdsContainer}>
                <NativeAdComponent adUnitId={ADS_UNIT.NATIVE} hasMedia={true} />
            </View>
            {currentPage !== ONBOARDING_DATA.length - 1 && (
                <View style={styles.footer}>
                    <CustomButton
                        title={currentPage === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
                        onPress={handleNext}
                        size="large"
                        variant="outline"
                        style={styles.nextButton}
                        textStyle={styles.nextButtonText}
                    />
                </View>)}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pagerView: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    page: {
        flex: 1,
        width: width,
        height: height * 0.5,
        // backgroundColor: Colors.background,
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
        width: width,
        height: height * 0.5,
        // backgroundColor: Colors.background,
    },
    onboardingImage: {
        width: width,
        height: height * 0.5,
        // backgroundColor: Colors.background,
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: Colors.lightGray,
        textAlign: 'center',
        lineHeight: 24,
    },
    nativeAdsContainer: {
        width: '100%',
        paddingBottom: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.background,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    adRating: {
        fontSize: 10,
        color: Colors.white,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
        overflow: 'hidden',
    },
    ratingStars: {
        fontSize: 12,
        color: '#FFD700',
    },
    adButton: {
        backgroundColor: Colors.white,
        paddingVertical: 12,
        borderRadius: 8,
    },
    adButtonText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    pageNextButton: {
        borderColor: Colors.white,
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingVertical: 20,
    },
    dot: {
        width: 10,
        height: 6,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    footer: {
        paddingHorizontal: 40,
        // paddingBottom: 10,
        backgroundColor: Colors.background,
    },
    nextButton: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    nextButtonText: {
        textDecorationLine: 'underline',
        color: Colors.white,
    },
});

export default OnboardingScreen;
