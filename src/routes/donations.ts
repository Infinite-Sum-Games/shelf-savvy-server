import { authMiddleware } from "@src/middleware/token";
import { Router } from "express";
import { StartDonationHandler, ApproveDonationHandler, ConfirmDonationHandler } from "@src/controllers/donations";

const router = Router();

router.post("/food", authMiddleware, StartDonationHandler);
router.post("/approve/:donationId", authMiddleware, ApproveDonationHandler);
router.post("/confirm/:donationId", authMiddleware, ConfirmDonationHandler);

export { router as DonationsRouter };
