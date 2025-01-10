import { GetMyProfileHandler, GetMyBankProfileHandler, VisitProfileHandler } from "@src/controllers/profile";
import { Router } from "express";

const router = Router();

router.post("/user", GetMyProfileHandler);
router.post("/bank", GetMyBankProfileHandler);
router.post("/user/visit", VisitProfileHandler);

export { router as ProfileRouter };
