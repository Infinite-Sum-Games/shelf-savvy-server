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
import { MailArgs, MailRegistrationOTP } from "@src/mailer/mailer";

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
  };

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
            },
          ],
        },
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
            },
          ],
          expiryAt: {
            gt: new Date().toISOString(),
          },
        },
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
        },
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

      // Mailer
      const mailConfirm = await MailRegistrationOTP(details);
      if (!mailConfirm) {
        console.log("Mail sending failed");
      }
      return;
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        messsage: error.message,
      });
      return;
    }
    res.status(500).json({
      message: "Interval Server Error",
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
        password: newHash(validBody.data.password),
      },
    });
    if (!user) {
      res.status(404).json({
        message: "Invalid username or password",
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
      email: user.email,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const userRegistrationOTPVerifyHandler = async (req: Request, res: Response) => {
  const validBody = VUserRegistrationOTP.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const verifyOTP = await tx.registration.findFirst({
        where: {
          username: validBody.data.username,
          email: validBody.data.email,
          otp: validBody.data.otp,
          expiryAt: {
            gt: new Date().toISOString(),
          },
        },
      });
      if (!verifyOTP) {
        throw new CustomError(401, "OTP Invalid");
      }

      await tx.registration.deleteMany({
        where: {
          username: validBody.data.username,
        },
      });

      await tx.user.create({
        data: {
          firstName: verifyOTP.firstName,
          lastName: verifyOTP.lastName,
          username: verifyOTP.username,
          email: verifyOTP.email,
          password: verifyOTP.password,
          myReferralCode: generateOTP(),
          streak: 1,
          totalPoints: 0,
        },
      });
      res.status(200).json({
        message: "Registration successful",
      });
    });
    return;
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const bankRegisterHandler = async (req: Request, res: Response) => {
  const validBody = VBankRegistration.safeParse(req.body);
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
  };

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const bankExist = await tx.bank.findFirst({
        where: {
          OR: [
            {
              bankName: validBody.data.bankname,
            },
            {
              email: validBody.data.email,
            },
          ],
        },
      });
      if (bankExist) {
        throw new CustomError(409, "Account already exists");
      }

      const registrationExist = await tx.bankRegistration.findFirst({
        where: {
          OR: [
            {
              bankName: validBody.data.bankname,
            },
            {
              email: validBody.data.email,
            },
          ],
        },
      });
      if (registrationExist) {
        throw new CustomError(303, "Redirect to OTP");
      }

      const creation = new Date();
      creation.setMinutes(creation.getMinutes() + 5);
      const newBank = await tx.bankRegistration.create({
        data: {
          bankName: validBody.data.bankname,
          email: validBody.data.email,
          password: newHash(validBody.data.password),
          otp: generateOTP(),
          expiryAt: creation.toISOString(),
        },
      });

      details.username = newBank.bankName;
      details.otp = newBank.otp;
      details.email = newBank.email;

      res.status(200).json({
        message: "OTP send to registered email",
        username: newBank.bankName,
        email: newBank.email,
        tempToken: await tempToken(newBank.email),
        expiryAt: newBank.expiryAt,
      });

      // Mailer
      const mailConfirm = await MailRegistrationOTP(details);
      if (!mailConfirm) {
        console.log("Mail sending failed");
      }
      return;
    });
    return;
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const bankLoginHandler = async (req: Request, res: Response) => {
  const validBody = VBankLogin.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    const bank = await db.bank.findFirst({
      where: {
        bankName: validBody.data.bankname,
        password: newHash(validBody.data.password),
      },
    });
    if (!bank) {
      res.status(404).json({
        message: "Invalid username or password",
      });
      return;
    }

    const token = await createToken(bank.email);
    // If username or password is valid, then return token along with details
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};

export const bankRegistrationOTPHandler = async (req: Request, res: Response) => {
  const validBody = VBankRegistrationOTP.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const verifyOTP = await tx.bankRegistration.findFirst({
        where: {},
      });
      if (!verifyOTP) {
        throw new CustomError(401, "OTP Invalid");
      }

      await tx.bankRegistration.deleteMany({
        where: {
          bankName: validBody.data.bankname,
        },
      });

      await tx.bank.create({
        data: {
          bankName: validBody.data.bankname,
          email: verifyOTP.email,
          password: verifyOTP.password,
        },
      });

      res.status(200).json({
        message: "Registration successful",
      });
    });
    return;
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      message: "Internal Server Error",
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
      },
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
        },
      },
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
      message: "Username available",
    });
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
      },
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
        },
      },
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
      message: "Bankname available",
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
};
