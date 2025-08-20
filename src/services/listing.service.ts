import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
type CreateListingInput = {
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  ownerId: string;
  amenities: string[];
  maxGuests: number;
  category: string;
  photos: string[];
}

type GetListingsInput = {
  ownerId?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  guests?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  skip?: number;
  take?: number;
}





export const createListing = async (
  createListingInput: CreateListingInput
) => {
  const { title, description, pricePerNight, location, ownerId, amenities, maxGuests, category, photos } = createListingInput;

  const user = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { role: true },
  });
  if (user?.role !== Role.HOST) {
    throw new Error("Only hosts can create listings");
  }

  return await prisma.listing.create({
    data: { title, description, pricePerNight, location, ownerId, amenities, maxGuests, category, photos },
  });
};

export const getListings = async (input: GetListingsInput) => {
  const {
    location,
    minPrice,
    maxPrice,
    skip = 0,
    take = 10
  } = input;

  return await prisma.listing.findMany({
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
}
export const getListingById = async (id: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id },
  });
  if (!listing) throw new Error("Listing not found");
  return listing;
};
export const updateListing = async (
  id: string,
  userId: string,
  updateData: Partial<CreateListingInput>
) => {
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) throw new Error("Listing not found");
  if (existing.ownerId !== userId) throw new Error("Not authorized");

  return await prisma.listing.update({
    where: { id },
    data: updateData,
  });
};
export const deleteListing = async (id: string, userId: string) => {
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) throw new Error("Listing not found");
  if (existing.ownerId !== userId) throw new Error("Not authorized");
  
  await prisma.listing.delete({
    where: { id },
  });
  
  return { message: "Listing deleted successfully" };
};

export const filterListings = async (filters: GetListingsInput) => {
  const {
    category,
    location,
    minPrice,
    maxPrice,
    amenities,
    guests,
    sortBy = "price",
    sortOrder = "asc",
    skip = 0,
    take = 10
  } = filters;


  const where: any = {
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
  }

  const listings = await prisma.listing.findMany({
    where: where,
    skip: Number(skip),
    take: Number(take),
    orderBy: {
      [String(sortBy)]: sortOrder === "asc" ? "asc" : "desc",
    },
  });

  return listings;
};

