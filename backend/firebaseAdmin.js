// firebaseAdmin.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import serviceAccountKey from '../serviceAccountKey.json' assert { type: 'json' }; // Add 'assert' for JSON import

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccountKey),
  storageBucket: 'gs://ai-based-skill-assessment.appspot.com' // Replace with your actual Firebase Storage bucket name
});

const db = getFirestore();
const bucket = getStorage().bucket();

export { db, bucket };
