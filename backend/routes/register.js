//register.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Save file with unique name
  }
});

// Multer middleware for handling file upload
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
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

// Registration route after Google OAuth
router.post('/register', upload.single('resumeFile'), async (req, res) => {
  const { prn, name, email, college, department } = req.body;

  try {
    // Check if the student is already registered
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already registered.' });
    }

    // Ensure that the file upload was successful
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    // Save the resume URL (local path for now)
    const resumeUrl = `/uploads/${req.file.filename}`; 

    // Create a new student record with the resume URL
    const newStudent = new Student({
      prn,
      name,
      email,
      college,
      department,
      resumeUrl, // Save the resume URL in the database
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
