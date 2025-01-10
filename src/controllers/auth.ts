import { Request, Response } from "express";
import {
  VUserRegistration,
  VUserLogin,
  VUserRegistrationOTP,
  VBankLogin,
  VBankRegistration,
  VBankRegistrationOTP,
  VCheckUsername,
  VCheckBankUsername,
} from "../types/auth";
import { db } from "@src/app";
import { Prisma } from "@prisma/client";
import { createToken } from "@src/middleware/token";

export const userRegisterHandler = async (req: Request, res: Response) => {
  const validBody = VUserRegistration.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const newRegistration = await tx.registration
  });
};

export const userLoginHandler = async (req: Request, res: Response) => {
  const validBody = VUserLogin.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    const user = await db.user.findFirst({
      where: {
        username: validBody.data.username,
        password: validBody.data.password,
      }
    });
    if (!user) {
      res.status(404).json({
        message: "Invalid username or password"
      });
      return;
    }

    const token = await createToken(user.email);
    // If username or password is valid, then return token along with details 
    res.status(200).json({
      message: "Login successful",
      token: token,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureURL: user.profilePictureURL,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
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

export const checkUsernameHandler = async (req: Request, res: Response) => {
  const validBody = VCheckUsername.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    // Check if user exist
    const userExist = await db.user.findFirst({
      where: {
        username: validBody.data.username,
      }
    });
    if (userExist) {
      res.status(409).json({
        available: false,
        message: "Username unavailable",
      });
      return;
    }

    // Check if user is under registration
    const underRegistration = await db.registration.findFirst({
      where: {
        username: validBody.data.username,
        expiryAt: {
          gt: new Date().toISOString(),
        }
      }
    });
    if (underRegistration) {
      res.status(409).json({
        available: false,
        message: "Username unavailable",
      });
      return;
    }

    // Otherwise username available
    res.status(200).json({
      available: true,
      message: "Username available"
    })
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const checkBankUsernameHandler = async (req: Request, res: Response) => {
  const validBody = VCheckBankUsername.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    // Check if bank exist
    const bankExist = await db.bank.findFirst({
      where: {
        bankName: validBody.data.bankname,
      }
    });
    if (bankExist) {
      res.status(409).json({
        available: false,
        message: "Username unavailable",
      });
      return;
    }

    // Check if user is under registration
    const underRegistration = await db.bankRegistration.findFirst({
      where: {
        bankName: validBody.data.bankname,
        expiryAt: {
          gt: new Date().toISOString(),
        }
      }
    });
    if (underRegistration) {
      res.status(409).json({
        available: false,
        message: "Bankname unavailable",
      });
      return;
    }

    // Otherwise username available
    res.status(200).json({
      available: true,
      message: "Username available"
    })
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
