import mongoose from "mongoose";

const animalTypeSchema = new mongoose.Schema(
    {},
    { strict: false });

export default mongoose.model("animal_types", animalTypeSchema);