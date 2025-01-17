import {
  bankLoginHandler,
  bankRegisterHandler,
  bankRegistrationOTPHandler,
  checkBankUsernameHandler,
  checkUsernameHandler,
  userLoginHandler,
  userRegisterHandler,
  userRegistrationOTPVerifyHandler,
} from "@src/controllers/auth";
import { Router } from "express";

const router = Router();

// Check username
router.get("/user/checkusername", checkUsernameHandler);
router.get("/bank/checkusername", checkBankUsernameHandler);

// Usual login flow
router.post("/user/login", userLoginHandler);
router.post("/user/register", userRegisterHandler);
router.post("/user/register/otp/verify", userRegistrationOTPVerifyHandler);

router.post("/bank/login", bankLoginHandler);
router.post("/bank/register", bankRegisterHandler);
router.post("/bank/register/otp/verify", bankRegistrationOTPHandler);

export { router as AuthRouter };
