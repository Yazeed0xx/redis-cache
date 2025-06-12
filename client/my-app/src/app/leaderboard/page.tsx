"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/axios";

interface LeaderboardEntry {
  userId: string;
  score: number;
}

interface UserScore {
  userId: string;
  gameId: string;
  score: number;
  rank: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userScore, setUserScore] = useState<UserScore | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchLeaderboardData();
  }, [router]);

  async function fetchLeaderboardData() {
    try {
      // Fetch user's score and rank
      const userResponse = await api.get("/leaderboard/chess/user");
      setUserScore(userResponse.data);

      // Fetch top players
      const leaderboardResponse = await api.get("/leaderboard/chess");
      setLeaderboard(leaderboardResponse.data);
    } catch (error: any) {
      console.error("Leaderboard error:", error);
      setError(error.response?.data?.error || "Failed to fetch leaderboard data");
      toast.error("Failed to fetch leaderboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chess Leaderboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      {userScore && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>Your current rank and score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <p className="text-2xl font-bold">{userScore.rank}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{userScore.score}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
          <CardDescription>Current leaderboard standings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">{index + 1}</span>
                  <span>User {entry.userId}</span>
                </div>
                <span className="font-bold">{entry.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}