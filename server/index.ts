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

  // Health check endpoints (useful for deployment monitoring)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", api: "running", timestamp: new Date().toISOString() });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
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

  // API 404 handler - only for /api routes
  app.use("/api", (req: Request, res: Response) => {
    res.status(404).json({
      error: "API endpoint not found",
      path: req.path,
      method: req.method,
    });
  });

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[ERROR]", err);
    res.status(err.status || 500).json({
      error: isDev ? err.message : "Internal server error",
      ...(isDev && { stack: err.stack }),
    });
  });

  // WebSocket support will be handled by the dev server
  // For production, you may need to use ws library or similar

  return app;
}
