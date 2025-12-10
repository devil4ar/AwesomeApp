# Lead Management System - React Native App

A comprehensive React Native application featuring OCR ID scanning, AI-powered lead search, location tracking, and intelligent lead management.

## 🎯 Features

### Task 1: OCR Capture & Validation

- **Image Capture/Upload**: Take photos or select from gallery
- **Text Extraction**: Mock OCR processing to extract ID information
- **Editable Fields**: Review and edit extracted data (Name, ID Number, DOB)
- **Confidence Scores**: Visual indicators showing extraction confidence
- **Validation**: Real-time form validation before saving

### Task 2: AI Chat-Style Lead Interface

- **Conversational UI**: Chat-based interface for querying leads
- **Smart Search**: Natural language queries like "Show me nearby leads"
- **Lead Cards**: Beautiful cards displaying lead information
- **Highlighting**: Special styling for leads with 80%+ match scores
- **Mock AI API**: Simulated AI responses based on keywords

### Task 3: Full-Screen Notification Flow

- **Immersive Experience**: Full-page notification display
- **Rich Details**: Lead name, location, match score, and map preview
- **Action Buttons**: Accept (navigate to details) or Reject (save to declined list)
- **Auto-Dismiss**: Automatically closes after 30 seconds
- **Persistent Storage**: Declined leads saved using AsyncStorage

### Task 4: Location Tracking with Battery Optimization

- **Live Location**: Real-time GPS tracking
- **Battery Modes**:
  - Normal: Updates every 2 minutes
  - Battery Saver: Updates every 5 minutes
- **Map View**: Interactive map with user and lead markers
- **Nearest Lead**: Automatically calculates and highlights closest lead
- **Distance Calculation**: Haversine formula for accurate distances
- **Permission Handling**: Proper Android/iOS location permissions

### Task 5: Lead Allocation Dashboard

- **Comprehensive List**: All leads with detailed information
- **Sorting**: Sort by distance or match score
- **Filtering**: Show only leads with 70%+ match score
- **Best Match**: Highlighted lead with optimal distance + score combination
- **Pull-to-Refresh**: Refresh lead data
- **Interactive Cards**: Tap to view full lead details

## 📱 Screens

1. **Home Screen** - Main menu with all feature access
2. **OCR Capture** - ID card scanning and data extraction
3. **AI Lead Chat** - Conversational lead search
4. **Location Map** - Interactive map with lead tracking
5. **Lead Dashboard** - Comprehensive lead management
6. **Full-Screen Notification** - Immersive notification experience
7. **Lead Details** - Complete lead information and contact options

## 🛠️ Technology Stack

- **React Native 0.82.1**
- **TypeScript** - Type-safe development
- **React Navigation** - Stack & modal navigation
- **React Native Maps** - Interactive map views
- **Geolocation Service** - Location tracking
- **AsyncStorage** - Local data persistence
- **Image Picker** - Camera and gallery access
- **Vision Camera** - High-performance camera features

## 📦 Installation

### Prerequisites

- Node.js >= 20
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Install iOS pods:**

```bash
cd ios && pod install && cd ..
```

3. **Run on iOS:**

```bash
npm run ios
```

4. **Run on Android:**

```bash
npm run android
```

## 🔑 Key Features Implementation

### Location Services

- Battery-optimized tracking with configurable intervals
- Background location support (when needed)
- Accurate distance calculations using Haversine formula

### Data Management

- 10+ mock leads with realistic data
- Real-time distance calculations
- Persistent storage for declined leads
- Smart filtering and sorting

### UI/UX

- Modern, clean design
- Color-coded confidence scores
- Interactive map markers
- Smooth animations and transitions
- Empty states and loading indicators

## 📂 Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript interfaces
├── utils/
│   ├── location.ts           # Distance calculations
│   ├── mockData.ts           # Mock leads and AI API
│   └── ocr.ts                # OCR processing utilities
├── components/
│   ├── LeadCard.tsx          # Reusable lead card
│   └── ConfidenceScore.tsx   # Score indicator
└── screens/
    ├── HomeScreen.tsx
    ├── OCRCaptureScreen.tsx
    ├── LeadChatScreen.tsx
    ├── LocationMapScreen.tsx
    ├── LeadDashboard.tsx
    ├── FullScreenNotificationScreen.tsx
    └── LeadDetailsScreen.tsx
```

## 🔐 Permissions

### iOS (Info.plist)

- Camera access
- Photo library access
- Location (when in use & always)

### Android (AndroidManifest.xml)

- Camera
- Fine/Coarse location
- Read/Write external storage
- Internet access

## 🎨 Design Highlights

- **Color Scheme**: Blue (#3B82F6) primary, with green (#10B981) for high scores
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent 16px base unit
- **Shadows**: Subtle elevation for depth
- **Icons**: Emoji-based for cross-platform consistency

## 🚀 Future Enhancements

- Real OCR integration (Google ML Kit, Tesseract)
- Actual push notification service
- Real-time location streaming
- Lead analytics and reporting
- Export functionality
- Dark mode support
- Biometric authentication
- Offline-first architecture

## 📝 Notes

- All OCR processing is currently mocked for demonstration
- Mock data includes 10 realistic leads in San Francisco Bay Area
- Location tracking uses balanced accuracy for battery efficiency
- Maps require Google Maps API key for production use

## 🤝 Contributing

This is a demonstration project showcasing React Native capabilities. Feel free to extend and customize for your needs.

## 📄 License

MIT License - Feel free to use this project as a template for your applications.

---

Built with ❤️ using React Native
