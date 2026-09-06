import { getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

const app = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

let auth: Auth | null = null;

if (app) {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    // getReactNativePersistence lives in the RN build of @firebase/auth, which
    // firebase/auth resolves to at runtime via package.json export conditions
    // that TypeScript's declaration resolution doesn't follow — hence require().
    const getReactNativePersistence = require('firebase/auth').getReactNativePersistence as (
      storage: unknown
    ) => Persistence;
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      // initializeAuth throws if it was already called for this app (e.g. Fast Refresh).
      auth = getAuth(app);
    }
  }
}

export const firebaseApp = app;
export const firebaseAuth = auth as Auth;
export const db = app ? getFirestore(app) : null!;
