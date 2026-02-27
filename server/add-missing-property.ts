import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addMissingProperty() {
  console.log("🏠 Adding missing Nuwara Eliya Cottage property...\n");

  try {
    // Check if property already exists
    const existing = await prisma.property.findUnique({
      where: { id: 31 },
    });

    if (existing) {
      console.log(
        `⚠️  Property "Nuwara Eliya Cottage" (ID: 31) already exists!`,
      );
      console.log(
        `   Deleting old version and recreating with corrected amenities...`,
      );
      await prisma.property.delete({ where: { id: 31 } });
    }

    // Get a manager from the database
    const manager = await prisma.manager.findFirst();
    if (!manager) {
      throw new Error(
        "No manager found in database. Please seed managers first.",
      );
    }

    // Insert the corrected property
    const property = await prisma.property.create({
      data: {
        id: 31,
        name: "Nuwara Eliya Cottage",
        description:
          "Charming cottage in Little England with cool climate, perfect for tea lovers and hikers.",
        pricePerMonth: 60000.0,
        securityDeposit: 120000.0,
        applicationFee: 4500.0,
        photoUrls: [
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
          "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
        ],
        amenities: ["WasherDryer", "Parking", "HighSpeedInternet"],
        highlights: ["GreatView", "QuietNeighborhood", "SmokeFree", "Heating"],
        isPetsAllowed: true,
        isParkingIncluded: true,
        beds: 2,
        baths: 1,
        squareFeet: 1000,
        propertyType: "Cottage",
        postedDate: "2024-02-08T00:00:00Z",
        averageRating: 4.9,
        numberOfReviews: 14,
        locationId: 31,
        managerCognitoId: manager.cognitoId,
      },
    });

    console.log(`✅ Successfully added: ${property.name}`);

    // Show final summary
    const totalProperties = await prisma.property.count();
    const sriLankanProperties = await prisma.property.count({
      where: {
        location: {
          country: "Sri Lanka",
        },
      },
    });

    console.log(`\n📊 Final Summary:`);
    console.log(
      `   Total Properties: ${totalProperties} (${sriLankanProperties} in Sri Lanka)`,
    );
    console.log("\n✨ All Sri Lankan properties imported successfully!");
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    throw error;
  }
}

addMissingProperty()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
