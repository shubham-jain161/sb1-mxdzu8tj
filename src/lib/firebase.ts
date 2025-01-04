import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBJdEAptW8me9WvenwuL1DJjGc81_fUrtk",
  authDomain: "ai-agents-saas.firebaseapp.com",
  projectId: "ai-agents-saas",
  storageBucket: "ai-agents-saas.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);