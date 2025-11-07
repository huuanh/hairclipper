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
        <ScrollView key={item.id} style={styles.page} contentContainerStyle={styles.pageContent}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    source={item.image}
                    style={styles.onboardingImage}
                    resizeMode="contain"
                />
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
        </ScrollView>
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

            {renderPagination()}

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
    },
    page: {
        flex: 1,
    },
    pageContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    onboardingImage: {
        width: width * 0.99,
        height: height * 0.35,
        resizeMode: 'contain',
    },
    contentContainer: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        marginBottom: 20,
    },
    nativeAdsContainer: {
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
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
        paddingVertical: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    footer: {
        paddingHorizontal: 40,
        paddingBottom: 10,
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
