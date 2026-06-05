/**
 * Seed / upsert all animal types into MongoDB.
 * Safe to run multiple times — uses upsert on `name` so no duplicates are created.
 *
 * Usage:  node src/seed/animalTypes.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import AnimalType from "../models/AnimalType.js";

dotenv.config();

const ANIMALS = [
  { name: "Snake",           emoji: "🐍" },
  { name: "Bee Swarm",       emoji: "🐝" },
  { name: "Stray Dog",       emoji: "🐕" },
  { name: "Cockroach",       emoji: "🪳" },
  { name: "Other",           emoji: "⚠️" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.");

  for (const animal of ANIMALS) {
    const result = await AnimalType.updateOne(
      { name: animal.name },                   // match on name
      { $set: { name: animal.name, emoji: animal.emoji } },
      { upsert: true }
    );

    const status = result.upsertedCount ? "inserted" : "updated";
    console.log(`  ${animal.emoji}  ${animal.name} — ${status}`);
  }

  console.log("\nSeed complete.");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
