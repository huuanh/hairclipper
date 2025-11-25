export const SCREEN_NAMES = {
  // Main Stack
  LOADING: 'Loading',
  LANGUAGE_SELECTION: 'LanguageSelection',
  ONBOARDING: 'Onboarding',
  MAIN_TABS: 'MainTabs',
  
  // Main Tabs
  HOME: 'Home',
  SETTINGS: 'Settings',
  
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

export const ASYNC_STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@hair_clipper_onboarding_completed',
  SELECTED_LANGUAGE: '@hair_clipper_selected_language',
} as const;