// services/firebase.ts

import { initializeApp } from 'firebase/app';
// Importamos o módulo de Autenticação (Login) e o de Banco de Dados (Firestore)
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Puxando as variáveis de ambiente que você configurou
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o aplicativo do Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias de Auth e Firestore para usarmos nas telas
export const auth = getAuth(app);
export const db = getFirestore(app);