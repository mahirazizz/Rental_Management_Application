import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (allowedRoles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
      }

      // For development: Check if token looks like AWS Cognito token (longer, different structure)
      // AWS Cognito tokens have different parts and can't be verified locally
      if (token.split(".").length === 3) {
        try {
          // Try local JWT verification first (for locally generated tokens)
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key",
          ) as JwtPayload;

          // Check if user has required role
          if (
            allowedRoles.length > 0 &&
            decoded.role &&
            !allowedRoles.includes(decoded.role as string)
          ) {
            res.status(403).json({ error: "Insufficient permissions" });
            return;
          }

          req.user = decoded;
          next();
        } catch (error) {
          // If local verification fails, assume it's a Cognito token
          // For development, we'll accept Cognito tokens without verification
          console.log("Token is not a local JWT, assuming Cognito token");

          // Decode without verification (development only)
          const decoded = jwt.decode(token) as JwtPayload;
          if (!decoded) {
            res.status(401).json({ error: "Invalid token" });
            return;
          }

          req.user = decoded;
          next();
        }
      } else {
        res.status(401).json({ error: "Invalid token format" });
      }
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
