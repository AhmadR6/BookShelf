import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * Authentication middleware that verifies JWT tokens
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
        code: "MISSING_TOKEN",
      });
      return;
    }

    // Verify the token
    const decoded = verifyToken(token);

    // Check if user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    let message = "Authentication failed";
    let code = "AUTH_FAILED";

    if (error instanceof Error) {
      if (error.message === "Token has expired") {
        message = "Token has expired";
        code = "TOKEN_EXPIRED";
      } else if (error.message === "Invalid token") {
        message = "Invalid token";
        code = "INVALID_TOKEN";
      }
    }

    res.status(401).json({
      success: false,
      message,
      code,
    });
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token
 * Useful for endpoints that work with or without authentication
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without user
      next();
      return;
    }

    // Try to verify token and set user if valid
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
      };
    }

    next();
  } catch (error) {
    // Token is invalid, but we don't fail - just continue without user
    console.warn("Optional auth failed:", error);
    next();
  }
}

/**
 * Middleware to check if user owns a resource
 * Use this after authenticateToken to verify ownership
 */
export function requireOwnership(resourceUserIdField: string = "userId") {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
      return;
    }

    // Get the resource's userId from the request (could be from params, body, or query)
    const resourceUserId =
      req.params[resourceUserIdField] ||
      req.body[resourceUserIdField] ||
      req.query[resourceUserIdField];

    if (!resourceUserId) {
      res.status(400).json({
        success: false,
        message: `Resource ${resourceUserIdField} not found`,
        code: "RESOURCE_NOT_FOUND",
      });
      return;
    }

    if (resourceUserId !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own resources.",
        code: "ACCESS_DENIED",
      });
      return;
    }

    next();
  };
}
