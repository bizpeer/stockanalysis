import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 필수 설정 값이 누락되었는지 확인 (콘솔 경고 표시)
const isConfigValid = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!isConfigValid) {
  console.warn(
    "Firebase config is missing. Please set your Firebase configuration in the .env.local file."
  );
}

// App 초기화 (서버 사이드 렌더링을 고려하여 중복 생성 방지)
const app = isConfigValid 
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)) 
  : undefined;

export const db = app ? getFirestore(app) : ({} as Firestore);
export const auth = app ? getAuth(app) : ({} as Auth);
export const storage = app ? getStorage(app) : ({} as FirebaseStorage);
export default app;
