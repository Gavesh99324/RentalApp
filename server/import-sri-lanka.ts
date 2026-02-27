import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function insertLocationData(locations: any[]) {
  for (const location of locations) {
    const { id, country, city, state, address, postalCode, coordinates } =
      location;
    try {
      // Check if location already exists
      const existing = await prisma.location.findUnique({ where: { id } });
      if (existing) {
        console.log(
          `⚠️  Location ${city} (ID: ${id}) already exists, skipping...`,
        );
        continue;
      }

      await prisma.$executeRaw`
        INSERT INTO "Location" ("id", "country", "city", "state", "address", "postalCode", "coordinates") 
        VALUES (${id}, ${country}, ${city}, ${state}, ${address}, ${postalCode}, ST_GeomFromText(${coordinates}, 4326));
      `;
      console.log(`✅ Inserted location: ${city}, ${state}`);
    } catch (error: any) {
      console.error(`❌ Error inserting location for ${city}:`, error.message);
    }
  }
}

async function insertPropertyData(properties: any[], defaultManagerId: string) {
  for (const property of properties) {
    try {
      // Check if property already exists
      const existing = await prisma.property.findUnique({
        where: { id: property.id },
      });

      if (existing) {
        console.log(
          `⚠️  Property "${property.name}" (ID: ${property.id}) already exists, skipping...`,
        );
        continue;
      }

      const propertyData = {
        ...property,
        managerCognitoId: property.managerCognitoId || defaultManagerId,
      };

      await prisma.property.create({
        data: propertyData,
      });

      console.log(
        `✅ Inserted property: ${property.name} in ${property.locationId}`,
      );
    } catch (error: any) {
      console.error(
        `❌ Error inserting property "${property.name}":`,
        error.message,
      );
    }
  }
}

async function importSriLankanData() {
  console.log("🇱🇰 Starting Sri Lankan data import...\n");

  try {
    // Step 1: Import Locations
    console.log("📍 Step 1: Importing Sri Lankan Locations...");
    const locationsPath = path.join(
      __dirname,
      "seedData",
      "sri-lanka-locations.json",
    );
    const locations = JSON.parse(fs.readFileSync(locationsPath, "utf-8"));
    await insertLocationData(locations);
    console.log(`\n✅ Completed importing ${locations.length} locations\n`);

    // Step 2: Import Properties
    console.log("🏠 Step 2: Importing Sri Lankan Properties...");
    const propertiesPath = path.join(
      __dirname,
      "seedData",
      "sri-lanka-properties.json",
    );
    const properties = JSON.parse(fs.readFileSync(propertiesPath, "utf-8"));

    // Get a manager from the database to assign properties to
    const manager = await prisma.manager.findFirst();
    if (!manager) {
      throw new Error(
        "No manager found in database. Please seed managers first.",
      );
    }

    console.log(`📋 Using manager: ${manager.name} (${manager.cognitoId})\n`);
    await insertPropertyData(properties, manager.cognitoId);
    console.log(`\n✅ Completed importing ${properties.length} properties\n`);

    // Step 3: Show summary
    console.log("📊 Import Summary:");
    const totalLocations = await prisma.location.count();
    const totalProperties = await prisma.property.count();
    const sriLankanLocations = await prisma.location.count({
      where: { country: "Sri Lanka" },
    });
    const sriLankanProperties = await prisma.property.count({
      where: {
        location: {
          country: "Sri Lanka",
        },
      },
    });

    console.log(
      `   Total Locations: ${totalLocations} (${sriLankanLocations} in Sri Lanka)`,
    );
    console.log(
      `   Total Properties: ${totalProperties} (${sriLankanProperties} in Sri Lanka)`,
    );

    console.log("\n✨ Sri Lankan data import completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Start your backend: cd server && npm run dev");
    console.log("   2. Start your frontend: cd client && npm run dev");
    console.log(
      '   3. Search for "Colombo", "Kandy", or "Galle" to see Sri Lankan properties',
    );
  } catch (error: any) {
    console.error("\n❌ Import failed:", error.message);
    throw error;
  }
}

importSriLankanData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
