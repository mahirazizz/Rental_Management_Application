import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../db/index";
import { wktToGeoJSON } from "@terraformer/wkt";

const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: true,
      },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: `Error retrieving tenant: ${error.message}`,
    });
  }
};

const createTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;

    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(tenant);
  } catch (error: any) {
    res.status(500).json({
      message: `Error creating tenant: ${error.message}`,
    });
  }
};

const updateTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    const updateTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(updateTenant);
  } catch (error: any) {
    res.status(500).json({
      message: `Error updating tenant: ${error.message}`,
    });
  }
};

const deleteTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: { select: { id: true } },
        properties: { select: { id: true } },
      },
    });

    if (!tenant) {
      res.status(404).json({ message: "Tenant not found" });
      return;
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (tenant.favorites.length > 0) {
        await tx.tenant.update({
          where: { cognitoId },
          data: {
            favorites: {
              disconnect: tenant.favorites.map((property) => ({
                id: property.id,
              })),
            },
          },
        });
      }

      if (tenant.properties.length > 0) {
        await tx.tenant.update({
          where: { cognitoId },
          data: {
            properties: {
              disconnect: tenant.properties.map(
                (property: (typeof tenant.properties)[number]) => ({
                  id: property.id,
                }),
              ),
            },
          },
        });
      }

      await tx.tenant.delete({
        where: { cognitoId },
      });
    });

    res.json({ message: "Tenant account deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting tenant account: ${error.message}` });
  }
};

const getCurrentResidences = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const properties = await prisma.property.findMany({
      where: { tenants: { some: { cognitoId } } },
      include: {
        location: true,
      },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property: (typeof properties)[number]) => {
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      }),
    );

    res.json(residencesWithFormattedLocation);
  } catch (err: any) {
    res.status(500).json({
      message: `Error retrieving manager properties: ${err.message}`,
    });
  }
};

const addFavoriteProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    });

    if (!tenant) {
      res.status(404).json({ message: "Tenant not found" });
      return;
    }

    const propertyIdNumber = Number(propertyId);
    const existingFavorites = tenant.favorites || [];

    if (
      !existingFavorites.some(
        (fav: (typeof existingFavorites)[number]) =>
          fav.id === propertyIdNumber,
      )
    ) {
      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: {
          favorites: {
            connect: { id: propertyIdNumber },
          },
        },
        include: { favorites: true },
      });
      res.json(updatedTenant);
    } else {
      res.status(409).json({ message: "Property already added as favorite" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: `Error adding favorite property: ${error.message}`,
    });
  }
};

const removeFavoriteProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;
    const propertyIdNumber = Number(propertyId);

    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        favorites: {
          disconnect: { id: propertyIdNumber },
        },
      },
      include: { favorites: true },
    });

    res.json(updatedTenant);
  } catch (err: any) {
    res.status(500).json({
      message: `Error removing favorite property: ${err.message}`,
    });
  }
};

export {
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
  getCurrentResidences,
  addFavoriteProperty,
  removeFavoriteProperty,
};
