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
import { CustomError } from "@src/middleware/errors";
import { newHash } from "@src/encryption/hash";
import { generateOTP } from "@src/middleware/otp";
import { tempToken } from "@src/middleware/token";
import { MailArgs } from "@src/mailer/mailer";

export const userRegisterHandler = async (req: Request, res: Response) => {
  const validBody = VUserRegistration.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  const details: MailArgs = {
    username: "",
    otp: "",
    email: "",
  }

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const userExist = await tx.user.findFirst({
        where: {
          OR: [
            {
              username: validBody.data.username,
            },
            {
              email: validBody.data.email,
            }
          ]
        }
      });
      if (userExist) {
        throw new CustomError(409, "Account already exists with given username or email");
      }

      const registrationExist = await tx.registration.findFirst({
        where: {
          OR: [
            {
              username: validBody.data.username,
            },
            {
              email: validBody.data.email,
            }
          ],
          expiryAt: {
            gt: new Date().toISOString(),
          }
        }
      });
      if (registrationExist) {
        throw new CustomError(303, "Redirect to OTP");
      }

      const creation = new Date();
      creation.setMinutes(creation.getMinutes() + 5);
      const newUser = await tx.registration.create({
        data: {
          firstName: validBody.data.firstName,
          lastName: validBody.data.lastName,
          username: validBody.data.username,
          email: validBody.data.email,
          password: newHash(validBody.data.password),
          otp: generateOTP(),
          expiryAt: creation.toISOString(),
        }
      });

      details.username = newUser.username;
      details.otp = newUser.otp;
      details.email = newUser.email;

      res.status(200).json({
        message: "OTP send to registered email",
        username: newUser.username,
        email: newUser.email,
        tempToken: await tempToken(newUser.email),
        expiryAt: newUser.expiryAt,
      });
      return;

      // TODO: Write down the mailer to send a mail

    });
  } catch (error) {
    res.status(500).json({
      message: "Interval Server Error"
    });
    return;
  }
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
        message: "Bankname unavailable",
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
      message: "Bankname available"
    })
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
