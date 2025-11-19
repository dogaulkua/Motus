# Smile Hair Clinic Capture (Expo + React Native)

An Expo-based prototype that standardizes the 5-angle photo workflow with smart pose guidance, auto shutter, bilingual UX and AI-driven summaries.

## 🚀 Features
- **5-angle flow**: frontal, right/left 45°, vertex, donor; each with its own component and guidance card.
- **Sensor guidance**: `react-native-sensors` + custom scoring for real-time alignment, paired with radar-style beeps and voice prompts.
- **Auto capture**: countdown and Expo Camera shot once the angle locks, persisted per session using `AsyncStorage`.
- **AI mock service**: graft/price estimation, historical comparison cards, and a bilingual chatbot.
- **Sharing & retake**: retake button for every photo plus native share sheet on the session review screen.
- **Dual language**: Turkish + English via i18next.

## 🧱 Project Structure
```
├── App.tsx                # Navigation + providers
├── src
│   ├── components         # Angle guides, capture HUD, AI chat, etc.
│   ├── constants          # Angle definitions, placeholder visuals
│   ├── contexts           # SessionProvider (AsyncStorage sync)
│   ├── hooks              # useOrientation (sensor subscription)
│   ├── screens            # Home, Capture, SessionHistory, SessionReview
│   ├── services           # Storage + mock AI
│   ├── data               # Mock comparisons
│   ├── utils              # Orientation math helpers
│   └── i18n               # Localization setup
```

## 📦 Setup
1. **Dependencies**
   ```bash
   npm install
   npm install --save-dev @types/react @types/react-native @types/react-i18next @types/uuid
   ```
   > Running `expo install` is optional; it double-checks native package compatibility for Expo SDK 51.

2. **Development server**
   ```bash
   npx expo start
   ```
   - Android: `a` tuşu veya `expo start --android`
   - iOS: `i` tuşu veya `expo start --ios`
   - Web: `w` or `expo start --web`

3. **Tests (optional)**
   A Jest scaffold is ready. Run `npm test` and place specs under `__tests__/`.

## ⚙️ Permissions
- **Camera / Microphone / Sensors**: grant these when Expo prompts after `expo start` so Camera, Audio, and sensor APIs function.

## 📱 Usage Flow
1. `HomeScreen` → “Start Capture” (continues from the active session if one exists).
2. Follow the sensor overlay; once locked the countdown auto-captures.
3. On completion head to `SessionReview` for AI estimation, comparison cards, and retakes.
4. Use “Share securely” to open the native share sheet.

## 🔧 Customization Tips
- **Real comparison photos**: populate `src/data/mockComparisons.ts` with actual URIs/base64 content.
- **Media sharing**: swap `Share.share` with `expo-sharing` and file URIs inside `handleShare` to send images.
- **Sensor tolerance**: tweak `getAlignmentScore` in `src/utils/orientation.ts` to adjust strictness.

## ❗️Known Notes
- Type errors about missing modules disappear once the `@types/*` dev dependencies above are installed.
- Placeholder visuals are simple PNGs—replace them in `constants/placeholders.ts` to display actual assets.

## 🤝 Contribution & Testing
- Use the `tsconfig.json` path aliases when adding new modules.
- Run `npm test` to execute Jest once you add specs.

Happy building! 🎯
