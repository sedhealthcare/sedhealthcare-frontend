# SedHealthcare

Modern healthcare platform with web and mobile apps. Built with React + Capacitor.

## Features

- Patient portal (login, doctor search, appointment booking, lab tests, pharmacy)
- Admin dashboard (doctor/appointment/lab/pharmacy management)
- Real-time appointment sync between user and admin
- OTP-based authentication
- Mobile apps for Android and iOS

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Mobile**: Capacitor (Android + iOS)
- **Backend**: Express + MongoDB (separate repo: `sedhealthcare-backend`)

## Setup

### Prerequisites
- Node.js 18+
- For Android: Android Studio, Java 21
- For iOS: Xcode, CocoaPods

### Install

```bash
npm install
```

### Run Web (Development)

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Build Android APK

```bash
npm run build
npx cap sync
cd android
./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build for iOS

```bash
npm run build
npx cap sync
cd ios/App
pod install
cd ../..
npx cap open ios
```

Then build/run from Xcode.

## Environment

The app calls the backend at `https://sedhealthcare-backend.onrender.com/api` in production (mobile) and `http://localhost:5001/api` in development (web).

## License

Private. All rights reserved.
