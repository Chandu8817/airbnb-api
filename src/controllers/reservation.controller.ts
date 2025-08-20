import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

export const createReservation = async (req: Request, res: Response) => {
    try {
        const { listingId, checkIn, checkOut, totalPrice, guests } = req.body;
        const userId = (req as any).user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role !== Role.GUEST) {
            return res.status(403).json({ error: "Only guests can make reservations" });
        }

        // Check overlapping reservations
        const overlap = await prisma.reservation.findFirst({
            where: {
                listingId,
                OR: [
                    {
                        checkIn: { lte: new Date(checkIn) },
                        checkOut: { gte: new Date(checkOut) },
                    },
                ],
            },
        });

        if (overlap) {
            return res.status(400).json({ error: "Dates overlap with another booking" });
        }

        // check max guests
        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        });
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (guests > listing.maxGuests) {
            return res.status(400).json({ error: "Number of guests exceeds maximum allowed" });
        }


        const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24);
        if (nights <= 0) {
            return res.status(400).json({ error: "Invalid reservation dates" });
        }


        const reservation = await prisma.reservation.create({
            data: {
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                userId,
                listingId,
                totalPrice,
                guests
            },
        });

        res.json(reservation);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getUserReservations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const reservations = await prisma.reservation.findMany({
            where: { userId },
            include: { listing: true },
        });

        res.json(reservations);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const cancelReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const reservation = await prisma.reservation.findUnique({ where: { id: id } });

        if (!reservation || reservation.userId !== userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await prisma.reservation.delete({ where: { id: id } });

        res.json({ message: "Reservation cancelled" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
