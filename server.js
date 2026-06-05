import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";
import app from "./src/app.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (_req, res) =>
  res.sendFile(path.join(__dirname, "public", "login.html")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}.\nhttp://localhost:${PORT}`));
