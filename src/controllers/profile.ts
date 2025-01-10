import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import z from "zod";

const prisma = new PrismaClient();

export const GetMyProfileHandler = async (req: Request, res: Response) => {
  const myEmail = z.string().trim().email().safeParse(req.body.email);
  if (!myEmail.success) {
    res.status(400).json({
      maessage: "Invalid email provided",
    });
    return;
  }

  try {
    const myProfile = await prisma.user.findUnique({
      where: {
        email: myEmail.data,
      },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        profilePictureURL: true,
        myReferralCode: true,
        streak: true,
        Achivements: {
          select: {
            id: true,
            badge: true,
            createdAt: true,
          },
        },
        FoodDonation: {
          select: {
            id: true,
            content: true,
            approval: true,
            receivedFood: true,
            receiverBankId: true,
          },
        },
        totalPoints: true,
        Points: {
          select: {
            id: true,
            point: true,
            createdAt: true,
          },
        },
        Referrals: {
          select: {
            id: true,
            joineeId: true,
          },
        },
      },
    });
    if (!myProfile) {
      res.status(404).json({
        message: "Profile not found",
      });
      return;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: myProfile,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "An error occured while fetching your profile",
    });
    return;
  }
};

export const GetMyBankProfileHandler = async (req: Request, res: Response) => {
  const bankEmail = z.string().trim().email().safeParse(req.body.email);
  if (!bankEmail.success) {
    res.status(400).json({
      message: "Invalid email provided",
    });
    return;
  }

  try {
    const bankProfile = await prisma.bank.findUnique({
      where: {
        email: bankEmail,
      },
      select: {
        bankName: true,
        email: true,
        FoodDonation: {
          select: {
            id: true,
            content: true,
            approval: true,
            receivedFood: true,
            receiverBankId: true,
          },
        },
      },
    });
    if (!bankProfile) {
      res.status(404).json({
        message: "Profile not found",
      });
      return;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: bankProfile,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "An error occured while fetching Food Bank profile",
    });
    return;
  }
};

// TODO: If time permits
export const VisitProfileHandler = async (req: Request, res: Response) => {
  const userName = z.string().trim().min(3).max(20).safeParse(req.body.username);
  if (!userName.success) {
    res.status(400).json({
      message: "Invalid username provided",
    });
    return;
  }

  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        username: userName.data,
      },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        profilePictureURL: true,
        streak: true,
        Achivements: {
          select: {
            id: true,
            badge: true,
            createdAt: true,
          },
        },
        FoodDonation: {
          select: {
            id: true,
            content: true,
            approval: true,
            receivedFood: true,
            receiverBankId: true,
          },
        },
        totalPoints: true,
        Points: {
          select: {
            id: true,
            point: true,
            createdAt: true,
          },
        },
      },
    });
    if (!userProfile) {
      res.status(404).json({
        message: "Profile not found",
      });
      return;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: userProfile,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "An error occured while fetching user profile",
    });
    return;
  }
};
