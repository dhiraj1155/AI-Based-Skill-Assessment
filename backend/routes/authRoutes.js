import express from 'express';
import { db } from '../firebaseAdmin.js'; // Firebase Admin SDK for Firestore

const router = express.Router();

// Verify PRN API
router.post('/verify-prn', async (req, res) => {
  const { prn, email } = req.body;

  try {
    // Query Firestore to find a student with the given PRN and email
    const studentSnapshot = await db
      .collection('students')
      .where('prn', '==', prn)
      .where('email', '==', email)
      .get();

    if (studentSnapshot.empty) {
      return res.status(400).json({ success: false, message: 'Invalid PRN or PRN not associated with this user.' });
    }

    // If a matching student is found
    res.json({ success: true, message: 'PRN verified successfully.' });
  } catch (error) {
    console.error('Error verifying PRN:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export const authRoutes = router; // Export the router
