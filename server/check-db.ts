import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const propertyCount = await prisma.property.count();
    const locationCount = await prisma.location.count();

    console.log("=== Database Status ===");
    console.log(`Total Properties: ${propertyCount}`);
    console.log(`Total Locations: ${locationCount}`);

    if (propertyCount > 0) {
      const sampleProperties = await prisma.property.findMany({
        take: 3,
        include: {
          location: true,
        },
      });

      console.log("\n=== Sample Properties ===");
      sampleProperties.forEach((prop) => {
        console.log(
          `- ${prop.name} in ${prop.location.city}, ${prop.location.state}`,
        );
      });
    }

    if (locationCount > 0) {
      const locations = await prisma.location.findMany({
        select: {
          city: true,
          state: true,
          country: true,
        },
      });

      console.log("\n=== All Locations ===");
      locations.forEach((loc) => {
        console.log(`- ${loc.city}, ${loc.state}, ${loc.country}`);
      });
    }
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
