import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import type { Request, Response } from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { sendSuccess } from "./utils/response.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  sendSuccess(
    res,
    { status: "ok", timestamp: new Date().toISOString() },
    "Server is healthy"
  );
});

// API routes
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
