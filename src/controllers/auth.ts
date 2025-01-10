import { Request, Response } from "express";
import {
  VUserRegistration,
  VUserLogin,
  VUserRegistrationOTP,
  VBankLogin,
  VBankRegistration,
  VBankRegistrationOTP,
  VCheckUsername,
  VCheckBankUsername
} from "../types/auth";

export const userRegisterHandler = (req: Request, res: Response) => {
  const validBody = VUserRegistration.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};

export const userLoginHandler = (req: Request, res: Response) => {
  const validBody = VUserLogin.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};

export const userRegistrationOTPVerifyHandler = (req: Request, res: Response) => {
  const validBody = VUserRegistrationOTP.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};

export const userGoogleOAuthHandler = (_req: Request, _res: Response) => { };

export const bankRegisterHandler = (req: Request, res: Response) => {
  const validBody = VBankRegistration.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};

export const bankLoginHandler = (req: Request, res: Response) => {
  const validBody = VBankLogin.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};

export const bankRegistrationOTPHandler = (req: Request, res: Response) => {
  const validBody = VBankRegistrationOTP.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};

export const checkUsernameHandler = (req: Request, res: Response) => {
  const validBody = VCheckUsername.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};

export const checkBankUsernameHandler = (req: Request, res: Response) => {
  const validBody = VCheckBankUsername.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }
};
