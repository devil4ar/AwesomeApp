# Quick Start Guide

## 🚀 Getting Started

### 1. Installation

```bash
# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

### 2. Run the App

**iOS:**

```bash
npm run ios
```

**Android:**

```bash
npm run android
```

## 📱 Testing the Features

### Task 1: OCR Scanner

1. Navigate to "OCR ID Scanner" from home
2. Tap "Capture Image" or "Upload Image"
3. Select/capture an image
4. Wait for processing (2 seconds)
5. Review and edit extracted fields
6. Observe confidence scores
7. Tap "Save Data"

### Task 2: AI Lead Chat

1. Navigate to "AI Lead Assistant"
2. Try these queries:
   - "Show me nearby leads"
   - "Find high score leads"
   - "Show leads in San Francisco"
   - "Show all leads"
3. Observe lead cards in chat bubbles
4. Notice highlighting for 80%+ scores

### Task 3: Full-Screen Notification

1. From home, tap "Simulate Notification"
2. View full-screen notification with lead details
3. Tap "Accept" to view lead details
4. OR tap "Reject" to decline (saved to AsyncStorage)
5. Wait 30 seconds for auto-dismiss

### Task 4: Location Tracker

1. Navigate to "Location Tracker"
2. Allow location permissions
3. View your location on map
4. See nearest lead highlighted with ⭐
5. Toggle "Pause/Start Tracking"
6. Toggle "Battery Saver Mode" (5 min intervals)
7. Observe distance calculations

### Task 5: Lead Dashboard

1. Navigate to "Lead Dashboard"
2. View all leads with distances
3. Try sorting:
   - Tap "📍 Distance"
   - Tap "⭐ Score"
4. Toggle filter: "🔍 All Leads" ↔ "✓ 70%+ Only"
5. Pull down to refresh
6. Observe "Best Match" badge on top lead
7. Tap any card to view details

## 🎨 Key UI Elements

### Color Coding

- **Green (#10B981)**: High confidence (90%+), High score (80%+)
- **Yellow (#F59E0B)**: Medium confidence (70-90%), Best match
- **Red (#EF4444)**: Low confidence (<70%), Reject action
- **Blue (#3B82F6)**: Primary actions, user location

### Icons

- 📷 Camera/OCR
- 💬 Chat/AI
- 🔔 Notifications
- 🗺️ Maps/Location
- 📊 Dashboard
- ⭐ Best/Featured
- 📍 Location pin

## 🔧 Troubleshooting

### iOS Build Issues

```bash
# Clean build
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

### Android Build Issues

```bash
cd android && ./gradlew clean && cd ..
```

### Metro Bundler Issues

```bash
# Reset cache
npm start -- --reset-cache
```

### Location Not Working

- Check device settings: Settings > Privacy > Location Services
- Ensure permissions granted in app settings
- Try on physical device (simulator may have limited GPS)

### Maps Not Displaying

- Maps require Google Maps API key for production
- Current implementation uses default map provider

## 📝 Mock Data

### Available Leads

- 10 leads in San Francisco Bay Area
- Match scores: 68% - 95%
- Realistic names, locations, and contact info
- Coordinates for distance calculations

### OCR Mock Behavior

- Simulates 2-second processing
- Random confidence scores (75-100%)
- Generates sample data: "John Doe", "ID-######", "01/15/1990"

### AI Query Keywords

- "nearby", "near" → First 5 leads
- "high score", "best" → Leads with 80%+ score
- "san francisco", "sf" → SF-area leads
- "all", "show" → All leads

## 🎯 Next Steps

1. **Add Real OCR**: Integrate Google ML Kit or Tesseract
2. **Push Notifications**: Setup Firebase Cloud Messaging
3. **Backend Integration**: Replace mock data with API calls
4. **Maps API**: Add Google Maps API key
5. **Analytics**: Track user interactions
6. **Testing**: Add unit and E2E tests

## 📚 Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Geolocation Service](https://github.com/Agontuk/react-native-geolocation-service)
- [Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)

---

Happy coding! 🚀
