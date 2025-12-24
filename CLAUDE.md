# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native photo cleanup application built with Expo. The app allows users to swipe through their photo library, mark photos for deletion using a Tinder-style swipe interface, review marked photos, and batch delete them. It includes internationalization (i18n) support for multiple languages and integrates Google Mobile Ads.

## Development Commands

### Starting the development server
```bash
npm start           # Start Expo dev server with options menu
npx expo start      # Alternative command
npm run android     # Start on Android emulator
npm run ios         # Start on iOS simulator
npm run web         # Start web version
```

### Code quality
```bash
npm run lint        # Run ESLint (uses expo/flat config)
```

### Other
```bash
npm run reset-project  # Move starter code to app-example/ and create blank app/
```

## Architecture

### Routing & Navigation
- Uses **Expo Router** (file-based routing) with typed routes enabled
- Routes are defined by file structure in `app/` directory:
  - `app/index.tsx` - Main swiper screen (home)
  - `app/confirmation.tsx` - Review and delete screen (modal presentation)
  - `app/_layout.tsx` - Root layout with providers
  - `app/(tabs)/` - Tab navigation structure (currently unused)

### State Management
- **Context API** for global state:
  - `DeletionContext` (`context/DeletionContext.tsx`) manages the deletion queue
  - Provider wraps the entire app in `app/_layout.tsx`
  - Provides: `markedForDeletion`, `markForDeletion`, `unmarkForDeletion`, `clearDeletionList`

### Custom Hooks
- `usePhotoLibrary` (`hooks/usePhotoLibrary.ts`):
  - Handles photo library permissions using `expo-media-library`
  - Loads photos from device with pagination support
  - Deletes photos and updates local state optimistically
  - Shows permission alerts with settings navigation when needed

### Key Components
- `DeletionSwiper` (`components/DeletionSwiper.tsx`):
  - Wraps `react-native-deck-swiper` for the swipe interface
  - Left swipe = mark for deletion (red overlay)
  - Right swipe = keep (green overlay)
  - Displays photo with creation date overlay

- Themed components (`components/themed-text.tsx`, `components/themed-view.tsx`):
  - Use `useThemeColor` hook to support light/dark mode
  - Theme colors defined in `constants/theme.ts`
  - Support color overrides via `lightColor`/`darkColor` props

### Internationalization (i18n)
- Configuration: `i18n/index.ts`
- Languages supported: English (en), Traditional Chinese (zh-TW), Simplified Chinese (zh-CN), Vietnamese (vi), Thai (th), Indonesian (id)
- Uses `react-i18next` with `expo-localization` to auto-detect device locale
- Translation keys organized by page structure:
  - `common.*` - shared strings
  - `home.*` - main swiper screen
  - `confirmation.*` - review screen
  - `permissions.*` - permission alerts
  - `errors.*` - error messages
- Imported automatically in `app/_layout.tsx`

### Platform-Specific Features
- **Expo New Architecture** enabled (`newArchEnabled: true`)
- **React Compiler** experimental feature enabled
- Photo permissions handled differently per platform (iOS vs Android)
- Google Mobile Ads integration with test IDs in development mode

### Path Aliases
- `@/*` resolves to project root (configured in `tsconfig.json`)
- Example: `import { usePhotoLibrary } from '@/hooks/usePhotoLibrary'`

## Important Implementation Notes

### Photo Library Permissions
- Always check `permissionResponse?.status` before requesting access
- Handle `canAskAgain: false` by showing alert to open Settings
- Use `Linking.openSettings()` to navigate to app settings

### Photo Deletion Flow
1. User swipes left on photo → added to `markedForDeletion` array (Context)
2. User clicks "Review" button → navigates to `/confirmation`
3. Confirmation screen shows all marked photos with option to "Keep" (unmark)
4. User clicks "Confirm Delete" → confirmation alert shown
5. On confirm → `deletePhotos()` called from `usePhotoLibrary` hook
6. Success → clear deletion list, show success alert, navigate back

### Ad Integration
- Uses `react-native-google-mobile-ads`
- Test IDs used in `__DEV__` mode
- Ad unit IDs configured in `app.json` plugins section
- Banner ads anchored at bottom of screens

### TypeScript Configuration
- Strict mode enabled
- Uses Expo's TypeScript base config
- Path aliases supported with `@/*` pattern
- Typed routes enabled in Expo Router experiments

### Styling Approach
- Uses React Native StyleSheet API (not NativeWind, Tamagui, etc.)
- Theme-aware components with light/dark mode support
- Colors centralized in `constants/theme.ts`
- Platform-specific fonts defined in theme

## Testing the App

Since there are no test scripts defined, testing is manual:
1. Run app on device/emulator
2. Grant photo library permissions
3. Test swipe gestures (left to delete, right to keep)
4. Verify marked photos appear in review screen
5. Test removing photos from deletion queue
6. Verify actual deletion works and photos are removed from library
7. Test i18n by changing device language

## Module Resolution

This project uses Expo's module resolution. Key modules:
- Media access: `expo-media-library`
- Navigation: `expo-router` (file-based)
- Internationalization: `react-i18next` + `expo-localization`
- UI Components: `react-native-deck-swiper` (swiper), `react-native-google-mobile-ads` (ads)
- Permissions: `expo-media-library` permissions API
