import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file
const afindaapikey = process.env.AFINDA_API_KEY;

export default {
afindaapikey
};

const router = express.Router();

const API_KEY = afindaapikey ;
const RESUMES_DIR = path.resolve('resumes'); // Path to your resumes folder

const findResumeByPRN = (prn) => {
  try {
    const files = fs.readdirSync(RESUMES_DIR); // Get all files in the directory
    const resumeFile = files.find((file) => file.startsWith(`${prn}-`)); // Find the file starting with PRN followed by a dash
    
    if (!resumeFile) {
      console.error(`No resume file found for PRN: ${prn}`);  // Log the error with PRN
      throw new Error('Resume file not found');
    }

    return path.join(RESUMES_DIR, resumeFile); // Return the full path of the resume file
  } catch (error) {
    console.error('Error locating resume file:', error.message);
    throw error;
  }
};

router.post('/extract-skills', async (req, res) => {
  const { prn } = req.body;

  if (!prn) {
    return res.status(400).json({ error: 'PRN is required' });
  }

  let resumePath;
  try {
    resumePath = findResumeByPRN(prn); // Locate the resume file dynamically
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(resumePath));
    formData.append('indices', 'skills');

    const response = await axios.post(
      'https://api.affinda.com/v2/resumes',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const skills = response.data.data.skills.map((skill) => skill.name);
    return res.status(200).json({ skills });
  } catch (error) {
    console.error('Error extracting skills:', error.message);
    return res.status(500).json({ error: 'Failed to extract skills' });
  }
});

export const SkillExtractionRoute = router;
