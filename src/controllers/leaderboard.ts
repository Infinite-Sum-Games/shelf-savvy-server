import { Request, Response } from "express";
import { db } from "@src/app";


export const GetLifetimeLeaderboard = async (req: Request, res: Response) => {
    try {
        const leaderboard = await db.user.findMany({
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

export const GetWeeklyLeaderboard = async(req: Request, res: Response) => {
    try {
        const leaderboard = await db.points.groupBy({
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

        const userIds = leaderboard.map(item => item.userId);

        const users = await db.user.findMany({
            where: {
                id: { in: userIds },
            },
            select: {
                id: true,
                username: true,
            },
        });

        // Merge usernames with leaderboard data
        const enrichedLeaderboard = leaderboard.map(entry => {
            const user = users.find(u => u.id === entry.userId);
            return {
                ...entry,
                username: user?.username || "Unknown",
            };
        });

        res.status(200).json(enrichedLeaderboard);
        return;
    }

    catch(error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

};

export const GetMonthlyLeaderboard =async (req: Request, res: Response) => {
    try {
        const leaderboard = await db.points.groupBy({
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

        const userIds = leaderboard.map(item => item.userId);

        const users = await db.user.findMany({
            where: {
                id: { in: userIds },
            },
            select: {
                id: true,
                username: true,
            },
        });

        // Merge usernames with leaderboard data
        const enrichedLeaderboard = leaderboard.map(entry => {
            const user = users.find(u => u.id === entry.userId);
            return {
                ...entry,
                username: user?.username || "Unknown",
            };
        });

        res.status(200).json(enrichedLeaderboard);
        return;
    }
    catch(error) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};
