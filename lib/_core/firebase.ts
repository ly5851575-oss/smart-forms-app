import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAsYpyywNrvt3lkZx9F74jbPdlp_y4O6Zo",
  authDomain: "flutter-ai-playground-2e118.firebaseapp.com",
  projectId: "flutter-ai-playground-2e118",
  storageBucket: "flutter-ai-playground-2e118.firebasestorage.app",
  messagingSenderId: "904312838032",
  appId: "1:904312838032:android:7e3a4739a713a1ada30515",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const logAnalyticsEvent = async (
  eventName: string,
  params?: Record<string, unknown>,
): Promise<void> => {
  try {
    if (Platform.OS !== 'web') return;

    const analyticsModule = await import('firebase/analytics');
    const supported = await analyticsModule.isSupported();
    if (!supported) return;

    const analytics = analyticsModule.getAnalytics(app);
    analyticsModule.logEvent(analytics, eventName, params);
  } catch (error) {
    console.warn('Analytics skipped:', error);
  }
};

export default app;
