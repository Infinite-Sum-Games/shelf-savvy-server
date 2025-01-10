import { GetWeeklyLeaderboard, GetMonthlyLeaderboard, GetLifetimeLeaderboard } from "@src/controllers/leaderboard";
import { Router } from "express";

const router = Router();

router.post("/weekly", GetWeeklyLeaderboard);
router.post("/montly", GetMonthlyLeaderboard);
router.post("/lifetime", GetLifetimeLeaderboard);

export { router as LeaderboardRouter };
