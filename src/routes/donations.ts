import { Router } from "express";
import { StartDonationHandler, ApproveDonationHandler, ConfirmDonationHandler, RejectDonationHandler } from "@src/controllers/donations";

const router = Router();

router.post("/food", StartDonationHandler);
router.post("/approve/:donationId", ApproveDonationHandler);
router.post("/reject/:donationId", RejectDonationHandler);
router.post("/confirm/:donationId", ConfirmDonationHandler);

export { router as DonationsRouter };
