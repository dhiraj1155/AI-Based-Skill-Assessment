// quiz.js
import express from 'express';
import { db } from '../firebaseAdmin.js'; // Firebase Admin SDK for Firestore

const router = express.Router();

// Quiz submission endpoint
router.post('/submit-quiz', async (req, res) => {
  const { prn, quizName, score } = req.body;

  try {
    if (!prn || !quizName || score === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Quiz data to be added
    const quizData = {
      quizName,
      score,
      timestamp: new Date().toISOString(), // Add timestamp
    };

    // Fetch the student document by PRN
    const studentRef = db.collection('students').where('prn', '==', prn);
    const studentSnapshot = await studentRef.get();

    if (studentSnapshot.empty) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const studentDocId = studentSnapshot.docs[0].id; // Get the document ID of the student
    const studentDocRef = db.collection('students').doc(studentDocId);

    // Update the student's document with the new quiz history
    await studentDocRef.update({
      quizHistory: admin.firestore.FieldValue.arrayUnion(quizData), // Append to the quizHistory array
    });

    res.status(201).json({ message: 'Quiz submitted successfully.' });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'An error occurred while submitting the quiz.' });
  }
});

export const quizRoute = router;