import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authMiddleware from './middleware/auth.js';
import { register, login } from './controller/auth/authController.js';
import { submitScore, getUserScoreAndRank, getLeaderboard } from './controller/user/leaderboardController.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.post('/auth/register', register);
app.post('/auth/login', login);

app.post('/submit-score', authMiddleware, submitScore);
app.get('/leaderboard/:gameId', getLeaderboard);
app.get('/leaderboard/:gameId/user', authMiddleware, getUserScoreAndRank);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
