import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN?.trim(),
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID?.trim(),
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET?.trim(),
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_APP_ID?.trim(),
};

// ✅ Jeśli env nie jest wczytany – dostaniesz jasny błąd zamiast invalid-api-key
if (!firebaseConfig.apiKey) {
  throw new Error(
    "Brak NEXT_PUBLIC_API_KEY. Sprawdź czy plik .env.local jest w root (obok package.json) i zrestartuj npm run dev."
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
