import { Prisma } from "@prisma/client";
import { db } from "@src/app";
import { CustomError } from "@src/middleware/errors";
import { VEnterReferral } from "@src/types/referral";
import { Request, Response } from "express";

export const EnterReferralHandler = async (req: Request, res: Response) => {
  const validBody = VEnterReferral.safeParse(req.body);
  if (!validBody.success) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const check = tx.user.findFirst({
        where: {
          myReferralCode: validBody.data.referralCode,
        },
      });
      if (!check) {
        throw new CustomError(404, "Invalid Referral Code");
      }

      // Referral code is valid -> updateJoineed
      const updateJoinee = await tx.user.update({
        data: {
          wasReferred: validBody.data.referralCode,
        },
        where: {
          email: validBody.data.email,
        },
      });

      await tx.referrals.create({
        data: {
          joineeId: updateJoinee.id,
          referralCode: validBody.data.referralCode,
        },
      });

      // TODO: Add points
    });
    res.status(200).json({
      message: "Referral accepted",
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
      message: "Internal server error! Please try again later",
    });
    return;
  }
};
