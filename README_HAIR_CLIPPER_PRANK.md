# Hair Clipper Prank App

Một ứng dụng React Native hoàn chỉnh để tạo các trò đùa vui nhộn với âm thanh và hiệu ứng rung.

## 🎯 Tính năng

- **Loading Screen**: Màn hình chào với animation xoay logo
- **Onboarding**: 3 màn hình giới thiệu với swipe navigation
- **Main Menu**: 4 tính năng chính với thiết kế gradient đẹp mắt
- **Hair Clipper Prank**: Mô phỏng âm thanh tông đơ với rung
- **DIY Makeup**: Chụp ảnh và thêm hiệu ứng makeup
- **Funny Sound**: Phát các âm thanh vui nhộn
- **Hair Dryer**: Mô phỏng âm thanh máy sấy tóc

## 🚀 Cài đặt

```bash
# Clone project
git clone <repository-url>
cd HairClipper

# Cài đặt dependencies
npm install

# Chạy trên Android
npm run android

# Chạy trên iOS (Mac only)
npm run ios
```

## 🏗️ Cấu trúc thư mục

```
src/
├── components/          # Reusable components
│   ├── CustomButton.tsx
│   ├── MenuCard.tsx
│   ├── SoundPlayer.tsx
│   └── index.ts
├── screens/            # Các màn hình
│   ├── LoadingScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   ├── HairClipperScreen.tsx
│   ├── HairClipperDetailScreen.tsx
│   ├── DIYMakeupScreen.tsx
│   ├── DIYMakeupCameraScreen.tsx
│   ├── DIYMakeupEditScreen.tsx
│   ├── FunnySoundScreen.tsx
│   ├── HairDryerScreen.tsx
│   ├── HairDryerDetailScreen.tsx
│   └── index.ts
├── navigation/         # Navigation setup
│   ├── RootNavigator.tsx
│   └── MainTabNavigator.tsx
├── constants/          # Constants và data
│   ├── colors.ts
│   ├── data.ts
│   └── index.ts
└── utils/             # Utility functions
assets/
├── sounds/            # File âm thanh
├── diyMaker/          # Ảnh cho makeup
├── funnySound/        # Icon âm thanh vui
├── hairClipper/       # Ảnh tông đơ
├── hairDry/          # Ảnh máy sấy
├── loading/          # Ảnh loading
└── onboard/          # Ảnh onboarding
```

## 📱 Luồng màn hình

1. **Loading** (2s) → **Onboarding** (3 màn) → **Main Menu**
2. Từ Main Menu:
   - **Hair Clipper** → List → Detail (có sound + rung)
   - **DIY Makeup** → Camera → Edit (overlay effects)
   - **Funny Sound** → Grid sounds
   - **Hair Dryer** → List → Detail (có sound + rung)

## 🎨 Thiết kế

- **Theme**: Gradient tím đậm với nền dark
- **Colors**: Primary #8B5CF6, Background #1A1A2E
- **Typography**: Clean, modern fonts
- **Animation**: Smooth transitions và loading animations

## 🔧 Dependencies chính

- **react-navigation**: Navigation system
- **react-native-reanimated**: Animations
- **react-native-sound**: Audio playback
- **react-native-linear-gradient**: Gradient effects
- **@react-native-async-storage/async-storage**: Local storage
- **react-native-pager-view**: Swipe navigation
- **react-native-gesture-handler**: Gesture handling

## 📝 Ghi chú

### Sound Files
Đặt các file âm thanh (.mp3) vào `assets/sounds/`:
- clipper1.mp3, clipper2.mp3, clipper3.mp3, clipper4.mp3
- dryer1.mp3, dryer2.mp3, dryer3.mp3
- dog_bark.mp3, cat_meow.mp3, fart.mp3, clown_horn.mp3, cow_moo.mp3, duck_quack.mp3

### Images
Đặt các hình ảnh vào thư mục tương ứng trong `assets/`.

### Build Android
```bash
# Debug build
npm run android

# Release build
cd android
./gradlew assembleRelease
```

## 🎯 Tính năng nâng cao có thể thêm

- [ ] Tích hợp camera thật với `react-native-camera`
- [ ] Thêm nhiều hiệu ứng makeup hơn
- [ ] Lưu và chia sẻ ảnh đã edit
- [ ] Thêm settings để tùy chỉnh âm lượng, rung
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Analytics tracking

## 🐛 Known Issues

- Sound files cần được đặt đúng định dạng và path
- Cần permission cho camera và microphone
- Testing trên device thật để kiểm tra rung và âm thanh

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.