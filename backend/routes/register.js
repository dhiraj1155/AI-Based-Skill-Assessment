// register.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { db, bucket } from '../firebaseAdmin.js'; // Firebase Admin SDK for Firestore and Storage

const router = express.Router();

// Multer Configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory buffer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc, or .docx files are allowed'));
    }
  }
});

// Registration endpoint for handling student data and file upload
router.post('/register', upload.single('resumeFile'), async (req, res) => {
  const { prn, name, college, department, email } = req.body;

  try {
    // Check if a student with the same PRN already exists in Firestore
    const studentSnapshot = await db.collection('students').where('prn', '==', prn).get();

    if (!studentSnapshot.empty) {
      return res.status(400).json({ message: 'A student with this PRN already exists.' });
    }

    // Handle resume file upload to Firebase Storage
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    // Step 1: Store the file locally with a PRN-based unique filename
    const resumeFilename = `${prn}-${Date.now()}-${req.file.originalname}`;
    const resumeDirectory = path.resolve('resumes'); // Resolves to ./resumes in your project folder

    // Check if the 'resumes' folder exists, if not, create it
    if (!fs.existsSync(resumeDirectory)) {
      fs.mkdirSync(resumeDirectory, { recursive: true });
    }

    const localResumePath = path.join(resumeDirectory, resumeFilename);
    fs.writeFileSync(localResumePath, req.file.buffer); // Save the resume locally

    // Step 2: Upload the file to Firebase Storage
    const blob = bucket.file(`resumes/${resumeFilename}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (error) => {
      console.error('Error uploading file:', error);
      return res.status(500).json({ message: 'Failed to upload file.' });
    });

    blobStream.on('finish', async () => {
      // Get the public URL of the uploaded file
      const resumeFileUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // Save student data (without skill extraction) in Firestore
      await db.collection('students').add({
        prn,
        name,
        college,
        department,
        email,
        resumeFile: resumeFileUrl, // Store the Firebase URL of the resume
      });

      // Send a response once everything is done
      res.status(201).json({ message: 'Registration successful!', resumeFileUrl });
    });

    blobStream.end(req.file.buffer); // Upload the file from buffer
  } catch (error) {
    console.error('Error during registration:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'An error occurred during registration.' });
    }
  }
});


export const registerRoute = router; // Export the router



// ***************AFINDA***************
// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import axios from 'axios';
// import { db, bucket } from '../firebaseAdmin.js'; // Firebase Admin SDK for Firestore and Storage
// // import conf from '../../client/conf/conf.js';

// import dotenv from 'dotenv';
// dotenv.config();  // Load environment variables from .env file

// const apiKey = process.env.VITE_FIREBASE_APIKEY;
// const authDomain = process.env.VITE_FIREBASE_AUTHDOMAIN;
// const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
// const storageBucket = process.env.VITE_FIREBASE_STORAGEBUCKET_ID;
// const messagingSenderId = process.env.VITE_FIREBASE_MESSAGING_ID;
// const appId = process.env.VITE_FIREBASE_APP_ID;
// const measurementId = process.env.VITE_FIREBASE_APP_ID;
// const afindaapikey = process.env.AFINDA_API_KEY;

// export default {
//   apiKey,authDomain,projectId,storageBucket,messagingSenderId,appId,measurementId,afindaapikey
// };


// const router = express.Router();

// // Multer Configuration for file uploads
// const storage = multer.memoryStorage(); // Store files in memory buffer
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
//   fileFilter: (req, file, cb) => {
//     const filetypes = /pdf|doc|docx/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only .pdf, .doc, or .docx files are allowed'));
//     }
//   }
// });

// // Affinda API Key (Should ideally be in a .env file)
// const AFFINDA_API_KEY = afindaapikey; 

// // Registration endpoint for handling student data and file upload
// router.post('/register', upload.single('resumeFile'), async (req, res) => {
//   const { prn, name, college, department, email } = req.body;

//   try {
//     // Check if a student with the same PRN already exists in Firestore
//     const studentSnapshot = await db.collection('students').where('prn', '==', prn).get();

//     if (!studentSnapshot.empty) {
//       return res.status(400).json({ message: 'A student with this PRN already exists.' });
//     }

//     // Handle resume file upload to Firebase Storage
//     if (!req.file) {
//       return res.status(400).json({ message: 'Resume file is required.' });
//     }

//     // Step 1: Store the file locally with a PRN-based unique filename
//     const resumeFilename = `${prn}-${Date.now()}-${req.file.originalname}`;
//     const resumeDirectory = path.resolve('resumes'); // Resolves to ./resumes in your project folder

//     // Check if the 'resumes' folder exists, if not, create it
//     if (!fs.existsSync(resumeDirectory)) {
//       fs.mkdirSync(resumeDirectory, { recursive: true });
//     }

//     const localResumePath = path.join(resumeDirectory, resumeFilename);
//     fs.writeFileSync(localResumePath, req.file.buffer); // Save the resume locally

//     // Step 2: Upload the file to Firebase Storage
//     const blob = bucket.file(`resumes/${resumeFilename}`);
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//     });

//     blobStream.on('error', (error) => {
//       console.error('Error uploading file:', error);
//       return res.status(500).json({ message: 'Failed to upload file.' });
//     });

//     blobStream.on('finish', async () => {
//       // Get the public URL of the uploaded file
//       const resumeFileUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

//       // Step 3: Send the resume to Affinda API for parsing
//       try {
//         const file = fs.createReadStream(localResumePath); // Local file path to send to Affinda
//         console.log(file);
//         const response = await axios.post('https://api.affinda.com/v3/resume_parser', file, {
//           headers: {
//             'Authorization': `Bearer ${AFFINDA_API_KEY}`,
//             'Content-Type': 'application/pdf',
//           }
//         });

//         // Extract skills and ATS score from the API response
//         const { skills, ats_score } = response.data;

//         // Save student data with skills and ATS score in Firestore
//         await db.collection('students').add({
//           prn,
//           name,
//           college,
//           department,
//           email,
//           resumeFile: resumeFileUrl, // Store the Firebase URL of the resume
//           skills: skills || 'No skills found',
//           ats_score: ats_score || 'No ATS score available',
//         });

//         // Send a response once everything is done
//         res.status(201).json({
//           message: 'Registration successful!',
//           resumeFileUrl,
//           skills: skills || 'No skills found',
//           ats_score: ats_score || 'No ATS score available',
//         });

//       } catch (affindaError) {
//         console.error('Error during Affinda resume parsing:', affindaError);
//         res.status(500).json({ message: 'Error processing the resume with Affinda API' });
//       }
//     });

//     blobStream.end(req.file.buffer); // Upload the file from buffer
//   } catch (error) {
//     console.error('Error during registration:', error);
//     if (!res.headersSent) {
//       res.status(500).json({ message: 'An error occurred during registration.' });
//     }
//   }
// });

// export const registerRoute = router; // Export the router
