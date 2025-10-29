import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type ExtraEnv = {
  EXPO_PUBLIC_FIREBASE_API_KEY: string;
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  EXPO_PUBLIC_FIREBASE_APP_ID: string;
};

const extra = Constants.expoConfig?.extra as ExtraEnv;

const firebaseConfig = {
  apiKey: extra.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;
