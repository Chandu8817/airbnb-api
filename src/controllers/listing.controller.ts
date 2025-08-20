import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";
const prisma = new PrismaClient();



export const createListing = async (req: Request, res: Response) => {
    try {
        const { title, description, pricePerNight, location, amenities, category, maxGuests, photos } = req.body;
        const userId = (req as any).user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (user?.role !== Role.HOST) {
            return res.status(403).json({ error: "Only hosts can create listings" });
        }

        const listing = await prisma.listing.create({
            data: { title, description, pricePerNight, location, ownerId: userId, amenities, maxGuests, category, photos },
        });

        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: "Failed to create listing" });
    }
};

export const getListings = async (req: Request, res: Response) => {
    try {
        const { minPrice, maxPrice, location, skip = 0, take = 10 } = req.query;

        const listings = await prisma.listing.findMany({
            where: {
                pricePerNight: {
                    gte: minPrice ? Number(minPrice) : undefined,
                    lte: maxPrice ? Number(maxPrice) : undefined,
                },
                location: location ? { contains: String(location) } : undefined,
            },
            skip: Number(skip),
            take: Number(take),
        });

        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
};

export const getListingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const listing = await prisma.listing.findUnique({ where: { id: id } });

        if (!listing) return res.status(404).json({ error: "Listing not found" });

        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listing" });
    }
};

export const updateListing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const existing = await prisma.listing.findUnique({ where: { id: id } });
        if (!existing) return res.status(404).json({ error: "Listing not found" });
        if (existing.ownerId !== userId) return res.status(403).json({ error: "Not authorized" });

        const updated = await prisma.listing.update({
            where: { id: id },
            data: req.body,
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update listing" });
    }
};

export const deleteListing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const existing = await prisma.listing.findUnique({ where: { id: id } });
        if (!existing) return res.status(404).json({ error: "Listing not found" });
        if (existing.ownerId !== userId) return res.status(403).json({ error: "Not authorized" });

        await prisma.listing.delete({ where: { id: id } });

        res.json({ message: "Listing deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete listing" });
    }
};

export const filterListings = async (req: Request, res: Response) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      location, 
      category, 
      amenities, 
      guests, 
      skip = 0, 
      take = 10, 
      sortBy = "createdAt", 
      order = "desc" 
    } = req.query;

    const listings = await prisma.listing.findMany({
      where: {
        pricePerNight: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
        location: location ? { contains: String(location), mode: "insensitive" } : undefined,
        category: category ? { equals: String(category), mode: "insensitive" } : undefined,
        maxGuests: guests ? { gte: Number(guests) } : undefined,
        amenities: amenities
          ? {
              hasEvery: String(amenities).split(",").map((a) => a.trim()), // filter by multiple amenities
            }
          : undefined,
      },
      skip: Number(skip),
      take: Number(take),
      orderBy: {
        [String(sortBy)]: order === "asc" ? "asc" : "desc",
      },
    });

    

    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to filter listings" });
  }
};

