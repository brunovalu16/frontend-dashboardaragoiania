import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔹 Configuração do Firebase do Fokus360
const firebaseConfigFokus360 = {
  apiKey: import.meta.env.VITE_FOKUS360_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FOKUS360_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FOKUS360_PROJECTID,
  storageBucket: import.meta.env.VITE_FOKUS360_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FOKUS360_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FOKUS360_APPID,
  databaseURL: import.meta.env.VITE_FOKUS360_DATABASEURL,
};

// 🔹 Configuração do Firebase do GPS-Tracker
const firebaseConfigGpsTracker = {
  apiKey: import.meta.env.VITE_GPSTRACKER_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_GPSTRACKER_AUTHDOMAIN,
  projectId: import.meta.env.VITE_GPSTRACKER_PROJECTID,
  storageBucket: import.meta.env.VITE_GPSTRACKER_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_GPSTRACKER_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_GPSTRACKER_APPID,
};

// ✅ NOVO: Firebase do APP RN (Prefeitura Aragoiânia)
const firebaseConfigArago = {
  apiKey: import.meta.env.VITE_ARAGO_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_ARAGO_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_ARAGO_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_ARAGO_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_ARAGO_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_ARAGO_FIREBASE_APP_ID,
};

// ✅ evita erro no HMR: "Firebase App named 'X' already exists"
function getOrInitApp(name, config) {
  const existing = getApps().find((a) => a.name === name);
  return existing || initializeApp(config, name);
}

// Apps
const appFokus360 = getOrInitApp("Fokus360", firebaseConfigFokus360);
const appGpsTracker = getOrInitApp("GpsTracker", firebaseConfigGpsTracker);
const appArago = getOrInitApp("AragoApp", firebaseConfigArago);

// Instâncias Fokus360
const authFokus360 = getAuth(appFokus360);
const dbFokus360 = getFirestore(appFokus360);
const storageFokus360 = getStorage(appFokus360);

// Instâncias GPS
const authGpsTracker = getAuth(appGpsTracker);
const dbGpsTracker = getFirestore(appGpsTracker);
const storageGpsTracker = getStorage(appGpsTracker);

// ✅ Instâncias APP RN
const authArago = getAuth(appArago);
const dbArago = getFirestore(appArago);
const storageArago = getStorage(appArago);

export {
  authFokus360,
  dbFokus360,
  storageFokus360,
  authGpsTracker,
  dbGpsTracker,
  storageGpsTracker,

  // ✅ APP RN
  authArago,
  dbArago,
  storageArago,
};
