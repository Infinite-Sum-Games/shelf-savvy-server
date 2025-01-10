import { GetWeeklyLeaderboard, GetMonthlyLeaderboard, GetLifetimeLeaderboard } from "@src/controllers/leaderboard";
import { authMiddleware } from "@src/middleware/token";
import { Router } from "express";

const router = Router();

router.post("/weekly", authMiddleware, GetWeeklyLeaderboard);
router.post("/montly", authMiddleware, GetMonthlyLeaderboard);
router.post("/lifetime", authMiddleware, GetLifetimeLeaderboard);

export { router as LeaderboardRouter };
