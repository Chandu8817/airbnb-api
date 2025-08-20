import { Request, Response } from "express";
import * as reservationService from "../services/reservation.service";


/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         listingId:
 *           type: string
 *         checkIn:
 *           type: string
 *           format: date-time
 *         checkOut:
 *           type: string
 *           format: date-time
 *         guests:
 *           type: number
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *           enum: [CONFIRMED, CANCELLED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateReservationInput:
 *       type: object
 *       required:
 *         - listingId
 *         - checkIn
 *         - checkOut
 *         - guests
 *         - totalPrice
 *       properties:
 *         listingId:
 *           type: string
 *         checkIn:
 *           type: string
 *           format: date
 *           example: "2023-12-15"
 *         checkOut:
 *           type: string
 *           format: date
 *           example: "2023-12-20"
 *         guests:
 *           type: number
 *           minimum: 1
 *         totalPrice:
 *           type: number
 *           minimum: 0
 *     ReservationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation (Guest only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationInput'
 *     responses:
 *       200:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input, overlapping dates, or invalid guest count
 *       403:
 *         description: Only guests can make reservations
 *       404:
 *         description: User or listing not found
 */
export const createReservation = async (req: Request, res: Response) => {
    try {
        const { listingId, checkIn, checkOut, totalPrice, guests } = req.body;
        const userId = (req as any).user.id;
        const reservation = await reservationService.createReservation(
            { listingId, checkIn, checkOut, totalPrice, guests }, userId
        )



        res.json(reservation);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations for the current user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch reservations
 */
export const getUserReservations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const reservations = await reservationService.getUserReservations(userId)

        res.json(reservations);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation (Owner of reservation only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       403:
 *         description: Not authorized to cancel this reservation
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to cancel reservation
 */
export const cancelReservation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const cancelled = await reservationService.cancelReservation(id,userId);

        res.json(cancelled);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
