import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

type CreateReservationInput = {
  listingId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guests: number;
};



export const createReservation = async (
  createReservationInput: CreateReservationInput,
  userId: string
) => {
  const { listingId, checkIn, checkOut, totalPrice, guests } = createReservationInput;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.role !== Role.GUEST) {
    throw new Error("Only guests can make reservations");
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
    throw new Error("Dates overlap with another booking");
  }

  // Check max guests
  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (guests > listing.maxGuests) {
    throw new Error("Number of guests exceeds maximum allowed");
  }

 

  return await prisma.reservation.create({
    data: {
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      userId,
      listingId,
      totalPrice,
      guests
    },
    include: {
      listing: true
    }
  });
};

export const getUserReservations = async (userId: string) => {
  return await prisma.reservation.findMany({
    where: { userId },
    include: {
      listing: true
    },
    orderBy: {
      checkIn: 'asc'
    }
  });
};

export const cancelReservation = async (id: string, userId: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id }
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  if (reservation.userId !== userId) {
    throw new Error("Not authorized to cancel this reservation");
  }

  await prisma.reservation.delete({
    where: { id }
  });

  return {
    message: "Reservation cancelled successfully",
    id
  };
};


