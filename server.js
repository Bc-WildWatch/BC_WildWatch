// Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";
import reportRoutes from "./src/routes/reportRoutes.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) =>
{
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Test route
app.get("/",(req,res) =>
{
    //res.send("BC-WildWatch API running.");
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Report route
app.use("/api/reports",reportRoutes);

const PORT = 3000;

app.listen(PORT,() =>
{
    console.log(`Server running on port ${PORT}. \nhttp://localhost:${PORT}`);
});