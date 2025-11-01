import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  fetchClaims,
  fetchClaimDetail,
  reassignClaim,
  uploadClaim,
} from "./routes/claims";
import { fetchQueues } from "./routes/queues";

export function createServer() {
  const app = express();

  // Environment
  const isDev = process.env.NODE_ENV === "development";

  // Middleware - CORS configuration
  // In production, you may want to restrict this to specific origins
  const corsOptions = {
    origin: isDev ? "*" : process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Request logging middleware (optional)
  if (isDev) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  // Error handling for unproven JSON
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
    next(err);
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Claims routes
  app.get("/api/claims", fetchClaims);
  app.get("/api/claims/:id", fetchClaimDetail);
  app.post("/api/claims/:id/reassign", reassignClaim);
  app.post("/api/claims/upload", uploadClaim);

  // Queues route
  app.get("/api/queues", fetchQueues);

  // WebSocket support will be handled by the dev server
  // For production, you may need to use ws library or similar

  return app;
}
