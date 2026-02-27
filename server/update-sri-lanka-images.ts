import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function updateSriLankanImages() {
  try {
    const filePath = path.join(
      __dirname,
      "seedData",
      "sri-lanka-properties.json",
    );
    const properties = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log("🖼️  Updating Sri Lankan property images...\n");

    for (const property of properties) {
      await prisma.property.update({
        where: { id: property.id },
        data: { photoUrls: property.photoUrls },
      });
      console.log(`✅ Updated images for: ${property.name}`);
    }

    console.log(
      `\n✨ Successfully updated images for ${properties.length} properties!`,
    );
    console.log("\n📝 Image updates:");
    console.log("   - Colombo: Modern Asian urban architecture");
    console.log("   - Kandy: Tropical hillside villa");
    console.log("   - Galle: Colonial heritage architecture");
    console.log("   - Negombo: Tropical beachfront");
    console.log("   - Jaffna: Traditional South Asian home");
    console.log("   - Nuwara Eliya: Hill country cottage");
    console.log("   - Batticaloa: Coastal lagoon view");
    console.log("   - Trincomalee: Luxury beach villa");
    console.log("   - Matara: Tropical city apartment");
    console.log("   - Anuradhapura: Heritage home");
  } catch (error) {
    console.error("❌ Error updating images:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateSriLankanImages();
