import { PrismaClient } from '@prisma/client';
import redis from '../../utils/redisClient.js';
const prisma = new PrismaClient();

export async function submitScore(req, res) {
  const { gameId, score } = req.body;
  const userId = req.user.userId;

  await prisma.score.create({ data: { gameId, value: score, userId } });
  await redis.zAdd(`leaderboard:${gameId}`, { score, value: userId.toString() });

  res.json({ message: 'Score submitted' });
}

export async function getLeaderboard(req, res) {
  const { gameId } = req.params;

  const result = await redis.zRange(`leaderboard:${gameId}`, 0, 9, { REV: true, WITHSCORES: true });

  const top = [];
  for (let i = 0; i < result.length; i += 2) {
    top.push({
      userId: result[i],
      score: parseFloat(result[i + 1])
    });
  }

  res.json(top);
}

export async function getUserRank(req, res) {
  const { gameId } = req.params;
  const userId = req.user.userId;
  console.log("user id", user)
  const rank = await redis.zRank(`leaderboard:${gameId}`, userId.toString(), { REV: true });
  res.json({ rank: rank !== null ? rank + 1 : 'Unranked' });
}

export async function getUserScoreAndRank(req, res) {
  const { gameId } = req.params;
  const userId = req.user.userId;

  const score = await redis.zScore(`leaderboard:${gameId}`, userId.toString());
  const rank = await redis.zRank(`leaderboard:${gameId}`, userId.toString(), { REV: true });

  if (score === null) {
    return res.status(404).json({ error: 'No score found for this game' });
  }

  res.json({
    userId,
    gameId,
    score: Number(score),
    rank: rank + 1
  });
}
