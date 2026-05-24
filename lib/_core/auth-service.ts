import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db, logAnalyticsEvent } from './firebase';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  loginProvider: 'google' | 'email';
  emailVerified: boolean;
  role: 'user' | 'admin';
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialStartAt?: Timestamp;
  trialEndsAt?: Timestamp;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export const createUserDocument = async (user: User, provider: 'google' | 'email'): Promise<UserData> => {
  const now = Timestamp.now();
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 3);

  const userData: UserData = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoUrl: user.photoURL || undefined,
    loginProvider: provider,
    emailVerified: user.emailVerified,
    role: 'user',
    subscriptionStatus: 'trial',
    trialStartAt: now,
    trialEndsAt: Timestamp.fromDate(trialEndsAt),
    createdAt: now,
    lastLoginAt: now,
  };

  await setDoc(doc(db, 'users', user.uid), userData);
  return userData;
};

export const getUserDocument = async (uid: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserData) : null;
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
};

export const updateLastLogin = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      lastLoginAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await createUserDocument(user, 'email');
  await sendEmailVerification(user);

  await logAnalyticsEvent('signup_email', {
    provider: 'email',
    timestamp: new Date().toISOString(),
  });

  return user;
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateLastLogin(user.uid);

  await logAnalyticsEvent('login_email', {
    provider: 'email',
    timestamp: new Date().toISOString(),
  });

  return user;
};

export const signInWithGoogle = async (idToken: string): Promise<User> => {
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  const user = userCredential.user;

  const existingUser = await getUserDocument(user.uid);

  if (!existingUser) {
    await createUserDocument(user, 'google');
  } else {
    await updateLastLogin(user.uid);
  }

  await logAnalyticsEvent('login_google', {
    provider: 'google',
    timestamp: new Date().toISOString(),
  });

  return user;
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);

  await logAnalyticsEvent('password_reset_sent', {
    provider: 'email',
    timestamp: new Date().toISOString(),
  });
};

export const sendVerificationEmail = async (user: User): Promise<void> => {
  await sendEmailVerification(user);

  await logAnalyticsEvent('email_verification_sent', {
    timestamp: new Date().toISOString(),
  });
};

export const logEmailVerified = async (_email: string): Promise<void> => {
  await logAnalyticsEvent('email_verified', {
    timestamp: new Date().toISOString(),
  });
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};
