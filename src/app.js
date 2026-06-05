import express from "express";
import cors from "cors";

import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import AnimalType from "./models/AnimalType.js";

const DEFAULT_ANIMALS = [
  { name: "Snake",           emoji: "🐍" },
  { name: "Bee Swarm",       emoji: "🐝" },
  { name: "Stray Dog",       emoji: "🐕" },
  { name: "Lizard",          emoji: "🦎" },
  { name: "Cockroach",       emoji: "🪳" },
  { name: "Ant Infestation", emoji: "🐜" },
  { name: "Other",           emoji: "⚠" }
];

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/config", (_req, res) => {
  res.json({
    azureClientId: process.env.AZURE_CLIENT_ID || "",
    azureTenantId: process.env.AZURE_TENANT_ID || ""
  });
});

app.get("/api/animals", async (_req, res) => {
  try {
    const docs = await AnimalType.find({}, "name emoji").lean();
    const animals = docs.length > 0 ? docs : DEFAULT_ANIMALS;
    res.json(animals);
  } catch {
    res.json(DEFAULT_ANIMALS);
  }
});

app.use("/api/auth",    authRoutes);
app.use("/api/reports", reportRoutes);

export default app;
