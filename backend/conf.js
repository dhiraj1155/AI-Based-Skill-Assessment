import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file

const apiKey = process.env.VITE_FIREBASE_APIKEY;
const authDomain = process.env.VITE_FIREBASE_AUTHDOMAIN;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = process.env.VITE_FIREBASE_STORAGEBUCKET_ID;
const messagingSenderId = process.env.VITE_FIREBASE_MESSAGING_ID;
const appId = process.env.VITE_FIREBASE_APP_ID;
const measurementId = process.env.VITE_FIREBASE_APP_ID;
const afindaapikey = process.env.AFINDA_API_KEY;

export default {
  apiKey,authDomain,projectId,storageBucket,messagingSenderId,appId,measurementId,afindaapikey
};
