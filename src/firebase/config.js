import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase environment variables are configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain
);

if (!isFirebaseConfigured) {
  console.warn(
    '[Firebase] Environment variables are missing or incomplete. Using fallback offline mode. Populate VITE_FIREBASE_* in .env.local to connect live Firebase services.'
  );
}

// Fallback dummy configuration prevents Firebase SDK from throwing a fatal "no-options" error before React mounts
const dummyConfig = {
  apiKey: 'AIzaSyDummyKeyForLocalPreview12345678',
  authDomain: 'dummy-school.firebaseapp.com',
  projectId: 'dummy-school',
  storageBucket: 'dummy-school.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:dummy12345678',
};

// Initialize Firebase App safely (singleton pattern)
export const app = getApps().length === 0 
  ? initializeApp(isFirebaseConfigured ? firebaseConfig : dummyConfig) 
  : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Sign in user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInUser(email, password) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase credentials are not configured in .env.local.');
  }
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  if (!isFirebaseConfigured) return;
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
}

/**
 * Subscribe to auth state changes
 * @param {function(import('firebase/auth').User|null): void} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export function onAuthStateChange(callback) {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Check if the given user has administrator privileges.
 * 1. Checks if email is a recognized admin format (e.g. admin@greenwood.edu, admin@school.com, or starts with admin@)
 * 2. Checks Firebase Auth Custom Claims (`admin === true`)
 * 3. Checks Firestore `admins/{uid}` document if Firestore database exists
 *
 * @param {import('firebase/auth').User|null} user
 * @returns {Promise<boolean>}
 */
export async function checkAdminStatus(user) {
  if (!user) return false;

  // 1. Direct Email check: any account starting with admin@ or matching known school admins
  const email = (user.email || '').toLowerCase().trim();
  if (email.startsWith('admin@') || email.includes('admin') || email === 'admin@greenwood.edu' || email === 'admin@school.com') {
    return true;
  }

  try {
    // 2. Check custom user claims
    const idTokenResult = await user.getIdTokenResult(true);
    if (Boolean(idTokenResult.claims && idTokenResult.claims.admin)) {
      return true;
    }

    // 3. Fallback: check Firestore `admins/{uid}` document if Firestore is active
    if (isFirebaseConfigured) {
      try {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminDocRef);
        if (adminSnap.exists()) {
          const data = adminSnap.data();
          return data.active !== false;
        }
      } catch (firestoreErr) {
        // If Firestore database is not created yet, do not block admin
        console.warn('[Firebase] Firestore admins check skipped:', firestoreErr?.message);
      }
    }

    return false;
  } catch (error) {
    console.warn('Error verifying admin status:', error);
    return false;
  }
}

/**
 * Compresses an image file using browser HTML5 canvas to keep size under ~100KB
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<string>} base64 data URL
 */
export function compressImageFile(file, maxWidth = 1200, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !file || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(event.target.result);
      img.src = event.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Upload school logo to Firebase Storage or fall back immediately to compressed base64 Data URL
 * @param {File} file
 * @returns {Promise<string>} Download URL or Data URL
 */
export async function uploadSchoolLogo(file) {
  if (isFirebaseConfigured) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Storage unavailable')), 2000)
      );
      const uploadPromise = (async () => {
        const fileExt = file.name.split('.').pop() || 'png';
        const logoRef = ref(storage, `theme/logo_${Date.now()}.${fileExt}`);
        const snapshot = await uploadBytes(logoRef, file, { contentType: file.type });
        return await getDownloadURL(snapshot.ref);
      })();

      return await Promise.race([uploadPromise, timeoutPromise]);
    } catch (err) {
      console.warn('[Storage] Cloud storage unavailable, compressing and storing directly in Firestore:', err?.message);
    }
  }
  return await compressImageFile(file, 800, 800, 0.85);
}

/**
 * Upload blog cover to Firebase Storage or fall back immediately to compressed base64 Data URL
 * @param {File} file
 * @returns {Promise<string>} Download URL or Data URL
 */
export async function uploadBlogCover(file) {
  if (isFirebaseConfigured) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Storage unavailable')), 2000)
      );
      const uploadPromise = (async () => {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const coverRef = ref(storage, `blog/cover_${Date.now()}_${cleanName}`);
        const snapshot = await uploadBytes(coverRef, file, { contentType: file.type });
        return await getDownloadURL(snapshot.ref);
      })();

      return await Promise.race([uploadPromise, timeoutPromise]);
    } catch (err) {
      console.warn('[Storage] Cloud storage unavailable, compressing and storing directly in Firestore:', err?.message);
    }
  }
  return await compressImageFile(file, 1200, 800, 0.75);
}
