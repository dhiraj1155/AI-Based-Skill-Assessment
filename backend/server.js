// server.js

import express from 'express';
import cors from 'cors';
import { registerRoute } from '../backend/routes/register.js'; // Import the registration route

const app = express();
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes

// Set COOP and CORP Headers to avoid blocking issues
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// Use the registration route
app.use('/api', registerRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
