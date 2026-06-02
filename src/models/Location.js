import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {},
    { strict: false });

export default mongoose.model("locations", locationSchema);