// server.js

import express from 'express';
import cors from 'cors';
import { registerRoute } from './routes/register.js'; // Import the registration route
import { extractSkillsRoute } from './routes/skill_extraction_endpoint.js';

const app = express();
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes

// Set COOP and CORP Headers to avoid blocking issues
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

app.get('/skills', (req, res) => {
  const filePath = path.resolve('/Users/apple/Desktop/PW1/AI Based Skill Assessment/client/public/extracted_skills.json');
  res.sendFile(filePath);
});


// Use the registration route
app.use('/api', registerRoute);
app.use('/api', extractSkillsRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
