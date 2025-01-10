import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { DonationsRouter } from "./routes/donations";
import { AuthRouter } from "./routes/auth";
import { LeaderboardRouter } from "./routes/leaderboard";
import { ReferralRouter } from "./routes/referral";
import { RecipeRouter } from "./routes/recipe";
import { ProfileRouter } from "./routes/profile";
import { AchievementsRouter } from "./routes/achievements";

const app: Express = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/api/test", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Works"
  });
  return;
});

app.use("/api/auth", AuthRouter);
app.use("/api/achivements", AchievementsRouter);
app.use("/api/donations", DonationsRouter);
app.use("/api/referral", ReferralRouter);
app.use("/api/leaderboard", LeaderboardRouter)
app.use("/api/recipe", RecipeRouter)
app.use("/api/profile", ProfileRouter)

app.use("*", (_req: Request, res: Response) => {
  res.status(404).json({
    message: "Resource not found at the route"
  });
});

app.listen(8080, () => console.log("Server is up on PORT 8080"))
