import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GetLifetimeLeaderboard = (req: Request, res: Response) => {
    try {
        const leaderboard = prisma.user.findMany({
            select: {
                username: true,
                totalPoints: true,
            },
            orderBy: {
                totalPoints: "desc",
            },
            take: 100,
        });

        res.status(200).json(leaderboard);
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};

export const GetWeeklyLeaderboard = (req: Request, res: Response) => {
    try {
        const leaderboard = prisma.points.groupBy({
            by: ['userId'],
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                }
            },
            _sum: {
                point: true,
            },
            orderBy: {
                _sum: {
                    point: "desc",
                }
            },
            take: 100,
        });

        res.status(200).json(leaderboard);
        return;
    }

    catch(error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

};

export const GetMonthlyLeaderboard = (req: Request, res: Response) => {
    try {
        const leaderboard = prisma.points.groupBy({
            by: ['userId'],
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30)),
                }
            },
            _sum: {
                point: true,
            },
            orderBy: {
                _sum: {
                    point: "desc",
                }
            },
            take: 100,
        });

        res.status(200).json(leaderboard);
        return;
    }
    catch(error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};
