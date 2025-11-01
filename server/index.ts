import "dotenv/config";
import express, { Express } from "express";
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

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
