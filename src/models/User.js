import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:       { type: String, default: null },
  role:           { type: String, enum: ["student", "admin"], default: "student" },
  microsoftId:    { type: String, default: null },
  createdAt:      { type: Date, default: Date.now },

  // Brute-force lockout tracking
  failedAttempts: { type: Number, default: 0 },
  lockedUntil:    { type: Date, default: null }
});

export default mongoose.model("users", userSchema);
