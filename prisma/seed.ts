import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Test Host",
      email: "host@test.com",
      password,
      role: "HOST",
    },
  });

  await prisma.listing.create({
    data: {
      ownerId: user.id,
      title: "Cozy Apartment in NYC",
      description: "A nice apartment in Manhattan.",
      pricePerNight: 120,
      location: "New York",
      photos: ["photo1.jpg", "photo2.jpg"],
      amenities: ["wifi", "kitchen"],
      category: "apartment",
      maxGuests: 3,
    },
  });
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Seeding complete");
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
