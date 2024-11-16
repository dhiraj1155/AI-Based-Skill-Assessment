// ************WAS WORKING FINE***********
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

    // Step 1: Store the file locally with a unique ID
    const uniqueId = Date.now(); // You can use any unique ID generation method

    // Resolving the path of the 'resumes' folder relative to your project directory
    const resumeDirectory = path.resolve('resumes'); // Resolves to ./resumes in your project folder

    // Check if the 'resumes' folder exists, if not, create it
    if (!fs.existsSync(resumeDirectory)) {
      fs.mkdirSync(resumeDirectory, { recursive: true });
    }

    const localResumePath = path.join(resumeDirectory, `${uniqueId}-${req.file.originalname}`);
    fs.writeFileSync(localResumePath, req.file.buffer); // Save the resume locally

    // Step 2: Upload the file to Firebase Storage
    const blob = bucket.file(`resumes/${uniqueId}-${req.file.originalname}`);
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












// ***************PREVIOUS CODES******************

// // register.js

// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { db, bucket } from '../firebaseAdmin.js'; // Firebase Admin SDK for Firestore and Storage

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

//     const blob = bucket.file(`resumes/${Date.now()}-${req.file.originalname}`);
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

//       // Save student data along with resume URL in Firestore
//       await db.collection('students').add({
//         prn,
//         name,
//         college,
//         department,
//         email,
//         resumeFile: resumeFileUrl,
//       });

//       res.status(201).json({ message: 'Registration successful!' });
//     });

//     blobStream.end(req.file.buffer); // Upload the file from buffer

//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'An error occurred during registration.' });
//   }
// });

// export const registerRoute = router; // Export the router


















// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { execFile } from 'child_process';
// import { db, bucket } from '../firebaseAdmin.js'; // Firebase Admin SDK for Firestore and Storage
// import fs from 'fs';


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

//     const blob = bucket.file(`resumes/${Date.now()}-${req.file.originalname}`);
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

//       // Pass Firebase file path (not local path) to the Python script
//       const firebaseFilePath = blob.name;

//       // Execute Python script for skill extraction with the Firebase path
//       // const pythonProcess = execFile('python3', ['./skill_extraction.py', firebaseFilePath]);
//       const pythonProcess = execFile('python3', ['/Users/apple/Desktop/PW1/AI Based Skill Assessment/backend/routes/skill_extraction.py', firebaseFilePath], (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Error executing Python script: ${error.message}`);
//           return res.status(500).json({ message: 'Error executing skill extraction script.' });
//         }
//         if (stderr) {
//           console.error(`stderr: ${stderr}`);
//         }
        
//         // Handle the stdout here (script output)
//         const outputData = stdout.trim();
//         // Proceed with output processing, as already done earlier
//       });

//       pythonProcess.stdout.on('data', async (data) => {
//         try {
//           // Try to parse the Python script output
//           const outputData = data.toString().trim();  // Ensure it's a string
          
//           // Check if the output is valid JSON
//           if (outputData.startsWith('{') || outputData.startsWith('[')) {
//             const extractedSkills = JSON.parse(outputData);
      
//             // Save student data along with extracted skills in Firestore
//             await db.collection('students').add({
//               prn,
//               name,
//               college,
//               department,
//               email,
//               resumeFile: resumeFileUrl,
//               skills: extractedSkills,
//             });
      
//             // Ensure headers aren't sent again
//             if (!res.headersSent) {
//               res.status(201).json({ message: 'Registration successful!', skills: extractedSkills });
//             }
//           } else {
//             throw new Error('Python script did not return valid JSON');
//           }
//         } catch (error) {
//           console.error('Error parsing Python script output:', error);
//           if (!res.headersSent) {
//             res.status(500).json({ message: 'Error processing resume.' });
//           }
//         }
//       });

//       pythonProcess.on('close', (code) => {
//         if (code !== 0 && !res.headersSent) {
//           console.error(`Python script exited with code ${code}`);
//           res.status(500).json({ message: 'Error executing skill extraction script.' });
//         }
//       });
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