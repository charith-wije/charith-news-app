# Finance Digest

A simple mobile app that lets you sign up, secure your account with a PIN (and optionally Face ID), and read a feed of general news. Built with React Native and Expo.

## What it does

When you first open the app, you can create an account with your email and a password, then set a 4-digit PIN. You’ll be asked if you want to use Face ID (or Touch ID) for faster sign-in next time. After that, you land on a news feed where you can tap articles to read more.

If you’ve already signed up, opening the app again takes you to a welcome screen where you can either enter your PIN or use the “Use Face ID” button to sign in. Once you’re in, you see the same news feed.

## Getting started

You’ll need Node.js installed. Clone the repo, then from the project folder run:

```bash
npm install
```

Copy the example env file and add your own API key for the news feed:

```bash
cp .env.example .env
```

Edit `.env` and set `EXPO_PUBLIC_FINNHUB_API_KEY` to your [Finnhub](https://finnhub.io) API key (free tier is enough).

Start the app:

```bash
npm start
```

From the Expo dev tools you can open the app in a simulator or scan the QR code with Expo Go on your device. To build and run on iOS or Android directly:

```bash
npm run ios
npm run android
```

## Tech stack

- **Expo** (SDK 55) and **React Native** for the app
- **React Navigation** for screens (sign up, PIN entry, welcome/PIN or Face ID, news feed)
- **expo-secure-store** for saving email, PIN, and preferences
- **expo-local-authentication** for Face ID / Touch ID
- **Gluestack UI** for layout and components
- **Finnhub API** for the news feed
