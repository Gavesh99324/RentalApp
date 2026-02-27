import { Request, Response } from "express";
import { PrismaClient, Location } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

/**
 * Bulk Import Locations from External API or JSON payload
 * POST /api/bulk/locations
 *
 * Request body can be:
 * 1. Direct array of locations
 * 2. URL to fetch locations from external API
 *
 * Example payload (direct):
 * {
 *   "locations": [
 *     {
 *       "address": "123 Main St",
 *       "city": "Chicago",
 *       "state": "IL",
 *       "country": "United States",
 *       "postalCode": "60601"
 *     }
 *   ]
 * }
 *
 * Example payload (from URL):
 * {
 *   "sourceUrl": "https://api.example.com/locations",
 *   "apiKey": "optional-api-key"
 * }
 */
export const bulkImportLocations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { locations, sourceUrl, apiKey } = req.body;
    let locationsData: any[] = [];

    // If sourceUrl is provided, fetch from external API
    if (sourceUrl) {
      try {
        const headers: any = {
          "Content-Type": "application/json",
        };
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`;
        }

        const response = await axios.get(sourceUrl, { headers });
        locationsData = Array.isArray(response.data)
          ? response.data
          : response.data.locations || [];
      } catch (error: any) {
        res.status(400).json({
          message: `Failed to fetch from external API: ${error.message}`,
        });
        return;
      }
    } else if (locations && Array.isArray(locations)) {
      locationsData = locations;
    } else {
      res.status(400).json({
        message:
          "Invalid request. Provide either 'locations' array or 'sourceUrl'",
      });
      return;
    }

    if (locationsData.length === 0) {
      res.status(400).json({ message: "No locations provided to import" });
      return;
    }

    const createdLocations: Location[] = [];
    const errors: any[] = [];

    // Process each location
    for (const locationData of locationsData) {
      try {
        const {
          address,
          city,
          state,
          country,
          postalCode,
          latitude,
          longitude,
        } = locationData;

        // Validate required fields
        if (!address || !city || !country || !postalCode) {
          errors.push({
            location: locationData,
            error:
              "Missing required fields (address, city, country, postalCode)",
          });
          continue;
        }

        let lat = latitude;
        let lng = longitude;

        // If coordinates not provided, geocode the address
        if (!lat || !lng) {
          try {
            const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
              {
                street: address,
                city,
                country,
                postalcode: postalCode,
                format: "json",
                limit: "1",
              },
            ).toString()}`;

            const geocodingResponse = await axios.get(geocodingUrl, {
              headers: {
                "User-Agent": "RealEstateApp (contact@rentalapp.com)",
              },
            });

            if (
              geocodingResponse.data[0]?.lon &&
              geocodingResponse.data[0]?.lat
            ) {
              lng = parseFloat(geocodingResponse.data[0].lon);
              lat = parseFloat(geocodingResponse.data[0].lat);
            } else {
              // Default to 0,0 if geocoding fails
              lng = 0;
              lat = 0;
            }

            // Rate limiting for OpenStreetMap (1 request per second)
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (geocodeError) {
            console.warn(
              `Geocoding failed for ${address}, ${city}. Using default coordinates.`,
            );
            lng = 0;
            lat = 0;
          }
        }

        // Create location in database
        const [newLocation] = await prisma.$queryRaw<Location[]>`
          INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
          VALUES (
            ${address}, 
            ${city}, 
            ${state || ""}, 
            ${country}, 
            ${postalCode}, 
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
          )
          RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
        `;

        createdLocations.push(newLocation);
      } catch (error: any) {
        errors.push({
          location: locationData,
          error: error.message,
        });
      }
    }

    res.status(201).json({
      message: `Successfully imported ${createdLocations.length} locations`,
      created: createdLocations.length,
      failed: errors.length,
      locations: createdLocations,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    res.status(500).json({
      message: `Error during bulk import: ${error.message}`,
    });
  }
};

/**
 * Bulk Import Properties from External API or JSON payload
 * POST /api/bulk/properties
 *
 * Request body structure:
 * {
 *   "properties": [
 *     {
 *       "name": "Property Name",
 *       "description": "Description",
 *       "pricePerMonth": 2000,
 *       "securityDeposit": 2000,
 *       "applicationFee": 50,
 *       "photoUrls": ["url1", "url2"],
 *       "amenities": ["WiFi", "Parking"],
 *       "highlights": ["GreatView"],
 *       "isPetsAllowed": true,
 *       "isParkingIncluded": true,
 *       "beds": 2,
 *       "baths": 2,
 *       "squareFeet": 1200,
 *       "propertyType": "Apartment",
 *       "location": {
 *         "address": "123 Main St",
 *         "city": "Chicago",
 *         "state": "IL",
 *         "country": "United States",
 *         "postalCode": "60601"
 *       },
 *       "managerCognitoId": "manager-id"
 *     }
 *   ]
 * }
 *
 * Or fetch from URL:
 * {
 *   "sourceUrl": "https://api.example.com/properties",
 *   "apiKey": "optional-api-key"
 * }
 */
export const bulkImportProperties = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { properties, sourceUrl, apiKey, defaultManagerId } = req.body;
    let propertiesData: any[] = [];

    // If sourceUrl is provided, fetch from external API
    if (sourceUrl) {
      try {
        const headers: any = {
          "Content-Type": "application/json",
        };
        if (apiKey) {
          headers["Authorization"] = `Bearer ${apiKey}`;
        }

        const response = await axios.get(sourceUrl, { headers });
        propertiesData = Array.isArray(response.data)
          ? response.data
          : response.data.properties || [];
      } catch (error: any) {
        res.status(400).json({
          message: `Failed to fetch from external API: ${error.message}`,
        });
        return;
      }
    } else if (properties && Array.isArray(properties)) {
      propertiesData = properties;
    } else {
      res.status(400).json({
        message:
          "Invalid request. Provide either 'properties' array or 'sourceUrl'",
      });
      return;
    }

    if (propertiesData.length === 0) {
      res.status(400).json({ message: "No properties provided to import" });
      return;
    }

    const createdProperties: any[] = [];
    const errors: any[] = [];

    // Process each property
    for (const propertyData of propertiesData) {
      try {
        const {
          name,
          description,
          pricePerMonth,
          securityDeposit,
          applicationFee,
          photoUrls,
          amenities,
          highlights,
          isPetsAllowed,
          isParkingIncluded,
          beds,
          baths,
          squareFeet,
          propertyType,
          location,
          locationId,
          managerCognitoId,
        } = propertyData;

        // Validate required fields
        if (
          !name ||
          !description ||
          pricePerMonth === undefined ||
          !propertyType
        ) {
          errors.push({
            property: propertyData,
            error:
              "Missing required fields (name, description, pricePerMonth, propertyType)",
          });
          continue;
        }

        let finalLocationId = locationId;

        // If location object provided and no locationId, create the location
        if (!finalLocationId && location) {
          try {
            const { address, city, state, country, postalCode } = location;

            if (!address || !city || !country || !postalCode) {
              errors.push({
                property: propertyData,
                error: "Invalid location data",
              });
              continue;
            }

            // Geocode the address
            const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
              {
                street: address,
                city,
                country,
                postalcode: postalCode,
                format: "json",
                limit: "1",
              },
            ).toString()}`;

            const geocodingResponse = await axios.get(geocodingUrl, {
              headers: {
                "User-Agent": "RealEstateApp (contact@rentalapp.com)",
              },
            });

            const [lng, lat] =
              geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat
                ? [
                    parseFloat(geocodingResponse.data[0].lon),
                    parseFloat(geocodingResponse.data[0].lat),
                  ]
                : [0, 0];

            // Rate limiting
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create location
            const [newLocation] = await prisma.$queryRaw<Location[]>`
              INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
              VALUES (${address}, ${city}, ${state || ""}, ${country}, ${postalCode}, 
                ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
              RETURNING id;
            `;

            finalLocationId = newLocation.id;
          } catch (locationError: any) {
            errors.push({
              property: propertyData,
              error: `Failed to create location: ${locationError.message}`,
            });
            continue;
          }
        }

        if (!finalLocationId) {
          errors.push({
            property: propertyData,
            error: "No locationId or location data provided",
          });
          continue;
        }

        // Determine managerCognitoId
        const managerId = managerCognitoId || defaultManagerId;
        if (!managerId) {
          errors.push({
            property: propertyData,
            error: "No managerCognitoId or defaultManagerId provided",
          });
          continue;
        }

        // Create property
        const newProperty = await prisma.property.create({
          data: {
            name,
            description,
            pricePerMonth: parseFloat(pricePerMonth),
            securityDeposit: parseFloat(securityDeposit || pricePerMonth),
            applicationFee: parseFloat(applicationFee || 50),
            photoUrls: photoUrls || [],
            amenities: amenities || [],
            highlights: highlights || [],
            isPetsAllowed: isPetsAllowed ?? false,
            isParkingIncluded: isParkingIncluded ?? false,
            beds: parseInt(beds || 1),
            baths: parseFloat(baths || 1),
            squareFeet: parseInt(squareFeet || 500),
            propertyType,
            locationId: finalLocationId,
            managerCognitoId: managerId,
          },
          include: {
            location: true,
          },
        });

        createdProperties.push(newProperty);
      } catch (error: any) {
        errors.push({
          property: propertyData,
          error: error.message,
        });
      }
    }

    res.status(201).json({
      message: `Successfully imported ${createdProperties.length} properties`,
      created: createdProperties.length,
      failed: errors.length,
      properties: createdProperties,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    res.status(500).json({
      message: `Error during bulk import: ${error.message}`,
    });
  }
};

/**
 * Get bulk import statistics
 * GET /api/bulk/stats
 */
export const getBulkImportStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const locationCount = await prisma.location.count();
    const propertyCount = await prisma.property.count();

    const locationsByCity = await prisma.location.groupBy({
      by: ["city", "state"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    res.json({
      totalLocations: locationCount,
      totalProperties: propertyCount,
      locationsByCity,
    });
  } catch (error: any) {
    res.status(500).json({
      message: `Error fetching stats: ${error.message}`,
    });
  }
};
