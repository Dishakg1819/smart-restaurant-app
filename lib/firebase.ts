import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyD-2c5qziV5i_d8jddpL9qCxZuyl4jpY",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "smart-restaurant-app-ed272.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "smart-restaurant-app-ed272",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "smart-restaurant-app-ed272.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "258767585433",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:258767585433:web:d59d0e31fab354f7c33808",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    "G-HTM1RNM3V6",
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)