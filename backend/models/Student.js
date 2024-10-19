// models/Student.js

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  prn: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  college: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  skills: {
    type: [String], // Array of strings to store extracted skills
    default: [],
  },
  resumeUrl: {
    type: String, // URL of the uploaded resume in Firebase Storage
  },
  atsScore: {
    type: Number, // To store the ATS score of the resume
    default: 0,
  },
  quizzes: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', // Reference to Quiz model if you have a separate schema for quizzes
      },
      score: Number,
      attemptDate: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
