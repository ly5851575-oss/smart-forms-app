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
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { getAnalytics, logEvent } from 'firebase/analytics';

// User data interface
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

// Create user document in Firestore
export const createUserDocument = async (user: User, provider: 'google' | 'email'): Promise<UserData> => {
  const now = Timestamp.now();
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 3); // 3 days trial

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

  try {
    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

// Get user document from Firestore
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

// Update last login time
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

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    // await updateProfile(user, { displayName });

    // Create user document
    await createUserDocument(user, 'email');

    // Send verification email
    await sendEmailVerification(user);

    // Log analytics event
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, 'signup_email', {
        email: email,
        timestamp: new Date().toISOString(),
      });
    }

    return user;
  } catch (error) {
    console.error('Error registering with email:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    await updateLastLogin(user.uid);

    // Log analytics event
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, 'login_email', {
        email: email,
        timestamp: new Date().toISOString(),
      });
    }

    return user;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (idToken: string): Promise<User> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Check if user exists in Firestore
    const existingUser = await getUserDocument(user.uid);

    if (!existingUser) {
      // Create new user document
      await createUserDocument(user, 'google');
    } else {
      // Update last login
      await updateLastLogin(user.uid);
    }

    // Log analytics event
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, 'login_google', {
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);

    // Log analytics event
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, 'password_reset_sent', {
        email: email,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (user: User): Promise<void> => {
  try {
    await sendEmailVerification(user);

    // Log analytics event
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, 'email_verification_sent', {
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Log email verified event
export const logEmailVerified = async (email: string): Promise<void> => {
  try {
    const analytics = await getAnalytics();
    if (analytics) {
      logEvent(analytics, 'email_verified', {
        email: email,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error logging email verified:', error);
  }
};

// Sign out
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
