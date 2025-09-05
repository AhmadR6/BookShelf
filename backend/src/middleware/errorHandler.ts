import type { Request, Response, NextFunction } from "express";

/**
 * Custom error class for API errors
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Prisma errors
 */
function handlePrismaError(error: any): AppError {
  console.error("Prisma Error:", error);

  // Unique constraint violation
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0] || "field";
    return new AppError(`${field} already exists`, 409, "DUPLICATE_ENTRY");
  }

  // Record not found
  if (error.code === "P2025") {
    return new AppError("Record not found", 404, "RECORD_NOT_FOUND");
  }

  // Foreign key constraint violation
  if (error.code === "P2003") {
    return new AppError(
      "Invalid reference to related record",
      400,
      "INVALID_REFERENCE"
    );
  }

  // Connection error
  if (error.code === "P1001") {
    return new AppError("Database connection failed", 503, "DATABASE_ERROR");
  }

  // Generic Prisma error
  return new AppError("Database operation failed", 500, "DATABASE_ERROR");
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let appError: AppError;

  // If it's already an AppError, use it
  if (error instanceof AppError) {
    appError = error;
  }
  // Handle Prisma errors
  else if (
    error.name === "PrismaClientKnownRequestError" ||
    error.name === "PrismaClientUnknownRequestError" ||
    error.name === "PrismaClientValidationError"
  ) {
    appError = handlePrismaError(error);
  }
  // Handle JWT errors
  else if (error.name === "JsonWebTokenError") {
    appError = new AppError("Invalid token", 401, "INVALID_TOKEN");
  } else if (error.name === "TokenExpiredError") {
    appError = new AppError("Token has expired", 401, "TOKEN_EXPIRED");
  }
  // Handle validation errors
  else if (error.name === "ValidationError") {
    appError = new AppError(error.message, 400, "VALIDATION_ERROR");
  }
  // Handle syntax errors (malformed JSON)
  else if (error instanceof SyntaxError && "body" in error) {
    appError = new AppError("Invalid JSON format", 400, "INVALID_JSON");
  }
  // Generic error
  else {
    appError = new AppError(
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message,
      500,
      "INTERNAL_ERROR"
    );
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  // Send error response
  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    code: appError.code,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
}

/**
 * Handle 404 errors
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND"
  );
  next(error);
}

/**
 * Async error wrapper to catch async errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
