// server.js

import express from 'express';
import cors from 'cors';
import { registerRoute } from './routes/register.js'; // Import the registration route
import { extractSkillsRoute } from './routes/skill_extraction_endpoint.js';
import {authRoutes} from './routes/authRoutes.js'

const app = express();
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes

// Set COOP and CORP Headers to avoid blocking issues
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.get('/skills', (req, res) => {
//   const filePath = path.resolve(__dirname, './client/public/extracted_skills.json'); // Adjust path as needed
//   res.sendFile(filePath);
// });


// Use the registration route
app.use('/api', registerRoute);
app.use('/api', extractSkillsRoute);
app.use('/api', authRoutes); // Add PRN verification route


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
