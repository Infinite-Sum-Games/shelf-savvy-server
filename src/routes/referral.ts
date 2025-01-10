import { EnterReferralHandler } from "@src/controllers/referral";
import { Router } from "express";

const router = Router();

router.post("/enter", EnterReferralHandler);

export { router as ReferralRouter };
