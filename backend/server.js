// server.js

import express from 'express';
import cors from 'cors';
import { registerRoute } from './routes/register.js'; // Import the registration route
import {authRoutes} from './routes/authRoutes.js'
import { SkillExtractionRoute } from './routes/SkillExtractionRoute.js';

const app = express();
app.use(express.json()); // Parses JSON body
// app.use(express.static())
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cors()); // Enable CORS for all routes

// Set COOP and CORP Headers to avoid blocking issues
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});



app.use('/api', registerRoute);
app.use('/api', SkillExtractionRoute);
app.use('/api', authRoutes); // Add PRN verification route


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));