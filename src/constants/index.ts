export const SCREEN_NAMES = {
  // Main Stack
  LOADING: 'Loading',
  ONBOARDING: 'Onboarding',
  MAIN_TABS: 'MainTabs',
  
  // Main Tabs
  HOME: 'Home',
  
  // Feature Screens
  HAIR_CLIPPER: 'HairClipper',
  HAIR_CLIPPER_DETAIL: 'HairClipperDetail',
  DIY_MAKEUP: 'DIYMakeup',
  DIY_MAKEUP_CAMERA: 'DIYMakeupCamera',
  DIY_MAKEUP_EDIT: 'DIYMakeupEdit',
  FUNNY_SOUND: 'FunnySound',
  HAIR_DRYER: 'HairDryer',
  HAIR_DRYER_DETAIL: 'HairDryerDetail',
  FUNNY_SOUND_DETAIL: 'FunnySoundDetail',
} as const;

export const ONBOARDING_DATA = [
  {
    id: 1,
    title: 'DIY Makeup',
    subtitle: 'Beard It, Wig It, Meme It!',
    image: require('../../assets/onboard/1.png'),
    adText: 'Ưu đãi khủng cho tân thủ!',
    adSubtext: 'game siêu gay hay mấy thằng có android',
  },
  {
    id: 2,
    title: 'Hair Clipper Prank',
    subtitle: 'Buzz It Like a Pro',
    image: require('../../assets/onboard/2.png'),
    adText: 'Ưu đãi khủng cho tân thủ!',
    adSubtext: 'game siêu gay hay mấy thằng có android',
  },
  {
    id: 3,
    title: 'Funny Sounds Prank',
    subtitle: 'Make Some Noise, Break the Silence!',
    image: require('../../assets/onboard/3.png'),
    adText: 'Ưu đãi khủng cho tân thủ!',
    adSubtext: 'game siêu gay hay mấy thằng có android',
  },
];

export const ASYNC_STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@hair_clipper_onboarding_completed',
} as const;