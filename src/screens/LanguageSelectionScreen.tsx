import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, GradientStyles } from '../constants/colors';
import { SCREEN_NAMES, ASYNC_STORAGE_KEYS } from '../constants';
import { NativeAdComponent } from '../utils/NativeAdComponent';
import { ADS_UNIT } from '../utils/AdManager';

const { width, height } = Dimensions.get('window');

type LanguageSelectionRouteProp = RouteProp<
    { LanguageSelection: { fromSettings?: boolean } },
    'LanguageSelection'
>;

interface Language {
    code: string;
    name: string;
    flag: any;
}

const LANGUAGES: Language[] = [
    {
        code: 'en',
        name: 'English',
        flag: require('../../assets/lang/english_us.png'),
    },
    {
        code: 'pt',
        name: 'Português',
        flag: require('../../assets/lang/portugal.png'),
    },
    {
        code: 'es',
        name: 'Español',
        flag: require('../../assets/lang/spain.png'),
    },
    {
        code: 'ru',
        name: 'Русский',
        flag: require('../../assets/lang/russia.png'),
    },
    {
        code: 'fr',
        name: 'Français',
        flag: require('../../assets/lang/france.png'),
    },
    {
        code: 'tr',
        name: 'Türkçe',
        flag: require('../../assets/lang/turkey.png'),
    },
    {
        code: 'id',
        name: 'Indonesia',
        flag: require('../../assets/lang/indonesia.png'),
    },
    {
        code: 'de',
        name: 'Deutsch',
        flag: require('../../assets/lang/gerrmany.png'),
    },
    {
        code: 'nl',
        name: 'Nederlands',
        flag: require('../../assets/lang/holland_netherland.png'),
    },
    {
        code: 'ko',
        name: '한국어',
        flag: require('../../assets/lang/south_korea.png'),
    },
    {
        code: 'th',
        name: 'ไทย',
        flag: require('../../assets/lang/thailand.png'),
    },
    {
        code: 'vi',
        name: 'Tiếng Việt',
        flag: require('../../assets/lang/vietnamese.png'),
    },
];

const LanguageSelectionScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<LanguageSelectionRouteProp>();
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    // Check if we came from Settings screen
    const isFromSettings = route.params?.fromSettings;

    // Load selected language from AsyncStorage
    useEffect(() => {
        const loadSelectedLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.SELECTED_LANGUAGE);
                if (savedLanguage) {
                    setSelectedLanguage(savedLanguage);
                } else {
                    // Default to English if no language saved
                    setSelectedLanguage('en');
                }
            } catch (error) {
                console.error('Error loading selected language:', error);
                // Default to English if error
                setSelectedLanguage('en');
            }
        };

        loadSelectedLanguage();
    }, []);

    const handleLanguageSelect = (languageCode: string) => {
        setSelectedLanguage(languageCode);
    };

    const handleApply = async () => {
        if (!selectedLanguage) {
            console.error('No language selected');
            return;
        }

        try {
            // Save selected language
            await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.SELECTED_LANGUAGE, selectedLanguage);

            if (isFromSettings) {
                // If from settings, go back to settings
                navigation.goBack();
            } else {
                // If first time (from loading), navigate to onboarding
                navigation.navigate(SCREEN_NAMES.ONBOARDING as never);
            }
        } catch (error) {
            console.error('Error saving language:', error);
            // Navigate based on source
            if (isFromSettings) {
                navigation.goBack();
            } else {
                navigation.navigate(SCREEN_NAMES.ONBOARDING as never);
            }
        }
    };

    const renderLanguageItem = (language: Language) => {
        const isSelected = selectedLanguage === language.code;

        return (
            <TouchableOpacity
                key={language.code}
                style={[
                    styles.languageItem,
                    isSelected && styles.languageItemSelected
                ]}
                onPress={() => handleLanguageSelect(language.code)}
                activeOpacity={0.8}
            >
                <View style={styles.languageContent}>
                    <Image source={language.flag} style={styles.flagImage} />
                    <Text style={[
                        styles.languageName,
                        isSelected && styles.languageNameSelected
                    ]}>
                        {language.name}
                    </Text>
                </View>

                <View style={[
                    styles.radioButton,
                    isSelected && styles.radioButtonSelected
                ]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={GradientStyles.dark.colors}
            start={GradientStyles.dark.start}
            end={GradientStyles.dark.end}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>LANGUAGE</Text>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleApply}
                >
                    <Text style={styles.nextButtonText}>Apply</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.languageList}>
                    {LANGUAGES.map(renderLanguageItem)}
                </View>

            </ScrollView>
            {/* Native Ad */}
            <View style={styles.adContainer}>
                <NativeAdComponent
                    adUnitId={ADS_UNIT.NATIVE}
                    hasMedia={true}
                    hasToggleMedia={true}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.background,
        // paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        letterSpacing: 1,
    },
    nextButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 3,
        borderRadius: 20,
    },
    nextButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    languageList: {
        paddingHorizontal: 20,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    languageItemSelected: {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: Colors.primary,
    },
    languageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    flagImage: {
        width: 24,
        height: 24,
        borderRadius: 2,
        marginRight: 12,
    },
    languageName: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '500',
    },
    languageNameSelected: {
        color: Colors.white,
        fontWeight: '600',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: Colors.primary,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },
    adContainer: {
        backgroundColor: Colors.background,
        paddingHorizontal: 10,
        // marginTop: 30,
        paddingBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
        
    },
});

export default LanguageSelectionScreen;