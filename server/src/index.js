import express from 'express';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth.js';
import { register,login } from './controller/auth/authController.js';
import { submitScore, getUserScoreAndRank ,getLeaderboard} from './controller/user/leaderboardController.js';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/register', register);
app.post('/login', login);

app.post('/submit-score', authMiddleware, submitScore);
app.get('/leaderboard/:gameId', getLeaderboard); // ← this is what's missing
app.get('/leaderboard/:gameId/user', authMiddleware, getUserScoreAndRank);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
