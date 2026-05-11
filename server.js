// Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import reportRoutes from "./src/routes/reportRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/",(req,res) =>
{
    res.send("BC-WildWatch API running.");
});

// Report route
app.use("/api/reports",reportRoutes);

const PORT = 3000;

app.listen(PORT,() =>
{
    console.log(`Server running on port ${PORT}.`);
});