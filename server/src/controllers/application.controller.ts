import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../db/index";

type AuthenticatedRequest = Request & {
  user?: Record<string, unknown>;
};

const extractPossibleCognitoIds = (
  req: AuthenticatedRequest,
  userIdFromQuery?: string,
): string[] => {
  const tokenUser = req.user ?? {};

  const rawValues = [
    userIdFromQuery,
    tokenUser.sub,
    tokenUser.username,
    tokenUser["cognito:username"],
    tokenUser.userId,
  ];

  return Array.from(
    new Set(
      rawValues.filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      ),
    ),
  );
};

const resolveUserRole = (
  req: AuthenticatedRequest,
  userTypeFromQuery?: string,
): "manager" | "tenant" | null => {
  const tokenUser = req.user ?? {};
  const tokenRole = (
    typeof tokenUser["custom:role"] === "string"
      ? tokenUser["custom:role"]
      : typeof tokenUser.role === "string"
        ? tokenUser.role
        : ""
  )
    .toLowerCase()
    .trim();

  if (tokenRole === "manager" || tokenRole === "tenant") {
    return tokenRole;
  }

  const normalizedQueryRole = (userTypeFromQuery || "").toLowerCase().trim();
  if (normalizedQueryRole === "manager" || normalizedQueryRole === "tenant") {
    return normalizedQueryRole;
  }

  return null;
};

const listApplications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { userId, userType } = req.query;

    const resolvedRole = resolveUserRole(
      req,
      typeof userType === "string" ? userType : undefined,
    );
    const possibleUserIds = extractPossibleCognitoIds(
      req,
      typeof userId === "string" ? userId : undefined,
    );

    if (!resolvedRole) {
      res.status(400).json({
        message:
          "Unable to resolve user identity for application filtering. Please sign in again.",
      });
      return;
    }

    if (possibleUserIds.length === 0) {
      res.status(400).json({
        message:
          "Unable to resolve user identity for application filtering. Please sign in again.",
      });
      return;
    }

    const whereClause: Prisma.ApplicationWhereInput =
      resolvedRole === "tenant"
        ? {
            tenantCognitoId: {
              in: possibleUserIds,
            },
          }
        : {
            property: {
              managerCognitoId: {
                in: possibleUserIds,
              },
            },
          };

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            location: true,
            manager: true,
          },
        },
        tenant: true,
      },
    });

    function calculateNextPaymentDate(startDate: Date): Date {
      const today = new Date();
      const nextPaymentDate = new Date(startDate);
      while (nextPaymentDate <= today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      return nextPaymentDate;
    }

    const formattedApplications = await Promise.all(
      applications.map(async (app: (typeof applications)[number]) => {
        const lease = await prisma.lease.findFirst({
          where: {
            tenant: {
              cognitoId: app.tenantCognitoId,
            },
            propertyId: app.propertyId,
          },
          orderBy: {
            startDate: "desc",
          },
        });

        return {
          ...app,
          property: {
            ...app.property,
            address: app.property.location.address,
          },
          manager: app.property.manager,
          lease: lease
            ? {
                ...lease,
                nextPaymentDate: calculateNextPaymentDate(lease.startDate),
              }
            : null,
        };
      }),
    );

    res.json(formattedApplications);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving applications: ${error.message}` });
  }
};

const createApplication = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      applicationDate,
      status,
      propertyId,
      tenantCognitoId,
      name,
      email,
      phoneNumber,
      message,
    } = req.body;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        pricePerMonth: true,
        securityDeposit: true,
      },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    const newApplication = await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        // Create lease first
        const lease = await prisma.lease.create({
          data: {
            startDate: new Date(), // Today
            endDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1),
            ), // 1 year from today
            rent: property.pricePerMonth,
            deposit: property.securityDeposit,
            property: {
              connect: {
                id: propertyId,
              },
            },
            tenant: {
              connect: {
                cognitoId: tenantCognitoId,
              },
            },
          },
        });

        // Then create application with lease connection
        const application = await prisma.application.create({
          data: {
            applicationDate: new Date(applicationDate),
            status,
            message,
            property: {
              connect: {
                id: propertyId,
              },
            },
            tenant: {
              connect: {
                cognitoId: tenantCognitoId,
              },
            },
            lease: {
              connect: {
                id: lease.id,
              },
            },
          },
          include: {
            property: true,
            tenant: true,
            lease: true,
          },
        });

        return application;
      },
    );

    res.status(201).json(newApplication);
  } catch (error: any) {
    res.status(500).json({
      message: `Error creating application: ${error.message}`,
    });
  }
};

const updateApplicationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("status:", status);

    const application = await prisma.application.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        property: true,
        tenant: true,
      },
    });

    if (!application) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    if (status === "Approved") {
      const newLease = await prisma.lease.create({
        data: {
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          rent: application.property.pricePerMonth,
          deposit: application.property.securityDeposit,
          propertyId: application.propertyId,
          tenantCognitoId: application.tenantCognitoId,
        },
      });

      // Update the property to connect the tenant
      await prisma.property.update({
        where: {
          id: application.propertyId,
        },
        data: {
          tenants: {
            connect: {
              cognitoId: application.tenantCognitoId,
            },
          },
        },
      });

      // Update the application with the new lease ID
      await prisma.application.update({
        where: {
          id: Number(id),
        },
        data: {
          status,
          leaseId: newLease.id,
        },
        include: {
          property: true,
          tenant: true,
          lease: true,
        },
      });
    } else {
      // Update the application status (for both "Denied" and other statuses)
      await prisma.application.update({
        where: {
          id: Number(id),
        },
        data: {
          status,
        },
      });
    }

    // Respond with the updated application details
    const updatedApplication = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: {
        property: true,
        tenant: true,
        lease: true,
      },
    });

    res.json(updatedApplication);
  } catch (error: any) {
    res.status(500).json({
      message: `Error updating application status: ${error.message}`,
    });
  }
};

export { listApplications, createApplication, updateApplicationStatus };
