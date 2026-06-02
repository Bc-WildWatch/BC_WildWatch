import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {},
    { strict: false });

export default mongoose.model("users", userSchema);