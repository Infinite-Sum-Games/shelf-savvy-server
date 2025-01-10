import { Request, Response } from "express";
import { VstartDonation } from "@src/types/donation";
import { PrismaClient } from "@prisma/client";
import z from "zod";
import { pointMap } from "@src/config/points"

const prisma = new PrismaClient();

export const StartDonationHandler = async (req: Request, res: Response) => {
    const VfoodDonation = VstartDonation.safeParse(req.body);
    if (!VfoodDonation.success) {
        res.status(400).json({
            message: "Invalid donation data",
        });
        return;
    }

    try {
            const createdFoodDonation = await prisma.foodDonation.create({
                data: {
                    senderId: VfoodDonation.data.senderId,
                    receiverBankId: VfoodDonation.data.receiverId,
                    content: VfoodDonation.data.content,
                },
            });
            res.status(200).json({
                createdFoodDonation
            });
            return;
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
        return;
    }
}

export const ApproveDonationHandler = async (req: Request, res: Response) => {
    const id = z.number().positive().safeParse(Number(req.params.donationId));
    if (!id.success) {
        res.status(400).json({
            message: "Invalid donation id",
        });
        return;
    }

    try {
        await prisma.$transaction(async(tx) => {
            const approvedDonation = await tx.foodDonation.update({
                where: {
                    id: id.data,
                },
                data: {
                    approval: true,
                }
            });
            res.status(200).json({
                approvedDonation
            });
            return;
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
        return;
    }
}

export const ConfirmDonationHandler = async (req: Request, res: Response) => {
    const id = z.number().positive().safeParse(Number(req.params.donationId));
    if (!id.success) {
        res.status(400).json({
            message: "Invalid donation id",
        });
        return;
    }

    const donation = await prisma.foodDonation.findUnique({
        where: {
            id: id.data,
        }
    })

    if (!donation) {
        res.status(404).json({
            message: "Donation not found",
        });
        return;
    }

    if (donation.approval === false) {
        res.status(400).json({
            message: "Donation not approved",
        });
        return;
    }

    const pointvar = z.enum(["loaf", "prince", "king"]).safeParse(req.body.point);
    if(!pointvar.success) {
        res.status(400).json({
            message: "Invalid point value",
        });
        return;
    }

    try {
        await prisma.$transaction(async(tx) => {
            const confirmedDonation = await tx.foodDonation.update({
                where: {
                    id: id.data,
                },
                data: {
                    receivedFood: true,
                }
            });

            await tx.points.create({
                data: {
                    userId: confirmedDonation.senderId,
                    point: pointMap.donation[pointvar.data],
                }
            });

            await tx.user.update({
                where: {
                    id: confirmedDonation.senderId,
                },
                data: {
                    totalPoints: {
                        increment: pointMap.donation[pointvar.data],
                    }
                }
            })
            res.status(200).json({
                message: "Donation confirmed",
                id: confirmedDonation.id,
            });
            return;
            });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
        return;
    }
}
