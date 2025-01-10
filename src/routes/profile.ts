import { GetMyProfileHandler, GetMyBankProfileHandler, VisitProfileHandler } from "@src/controllers/profile";
import { authMiddleware } from "@src/middleware/token";
import { Router } from "express";

const router = Router();

router.post("/user", authMiddleware, GetMyProfileHandler);

router.post("/bank", authMiddleware, GetMyBankProfileHandler);

router.post("/user/visit", authMiddleware, VisitProfileHandler);

export { router as ProfileRouter };
