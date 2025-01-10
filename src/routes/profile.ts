import { GetMyProfileHandler, GetMyBankProfileHandler, VisitProfileHandler } from "@src/controllers/profile";
import { authMiddleware } from "@src/middleware/token";
import { Router } from "express";

const router = Router();

router.get("/user", authMiddleware, GetMyProfileHandler);

router.get("/bank", authMiddleware, GetMyBankProfileHandler);

router.get("/user/visit", authMiddleware, VisitProfileHandler)

export { router as ProfileRouter };
