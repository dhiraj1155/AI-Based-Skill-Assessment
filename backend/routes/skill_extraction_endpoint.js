import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

const router = express.Router();

// Endpoint for extracting skills from a stored resume
router.post('/extract-skills', async (req, res) => {
  const { resumeFileName } = req.body;

  try {
    if (!resumeFileName) {
      return res.status(400).json({ message: 'Resume file name is required.' });
    }

    // Step 1: Check if the file exists in the resumes folder
    const resumeDirectory = path.resolve('resumes'); // Path to the resumes folder
    const resumePath = path.join(resumeDirectory, resumeFileName);

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ message: 'Resume file not found.' });
    }

    // Step 2: Run the Python script as a child process
    const pythonProcess = spawn('python3', ['1.py', resumePath]);

    let result = '';
    let errorOutput = '';

    // Capture output from the Python script
    pythonProcess.stdout.on('data', (data) => {
      console.log('Python Output:', data.toString());  // Log Python output
      result += data.toString();
    });

    // Capture errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      console.error('Python Error:', data.toString());  // Log Python errors
      errorOutput += data.toString();
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Skill extraction completed successfully');
        res.status(200).json({ success: true, skills: JSON.parse(result) });
      } else {
        console.error('Python process failed with code', code, 'and error:', errorOutput);
        res.status(500).json({ success: false, message: 'Error in skill extraction.', error: errorOutput });
      }
    });
  } catch (error) {
    console.error('Error during skill extraction:', error);
    res.status(500).json({ message: 'An error occurred during skill extraction.', error: error.message });
  }
});

export const extractSkillsRoute = router; // Export the router
