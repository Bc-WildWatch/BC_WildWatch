import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
{
  animal:
  {
    type: String,

    required:
    [
      true,
      "Animal type is required."
    ],

    enum:
    [
      "Snake",
      "Bee Swarm",
      "Stray Dog",
      "Lizard",
      "Cockroach",
      "Ant Infestation",
      "Other"
    ],

    trim: true
  },

  animal_type_id:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "animal_types",
  },

  location:
  {
    type: String,

    required:
    [
      true,
      "Location is required."
    ],

    trim: true,

    minlength:
    [
      3,
      "Location must be at least 3 characters."
    ],

    maxlength:
    [
      120,
      "Location cannot exceed 120 characters."
    ]
  },

  location_id:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "locations"
  },

  user_id:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  date:
  {
    type: String,

    required:
    [
      true,
      "Date is required."
    ]
  },

  time:
  {
    type: String,

    required:
    [
      true,
      "Time is required."
    ]
  },

  description:
  {
    type: String,

    required:
    [
      true,
      "Description is required."
    ],

    trim: true,

    minlength:
    [
      10,
      "Description must be at least 10 characters."
    ],

    maxlength:
    [
      500,
      "Description cannot exceed 500 characters."
    ]
  },

  threatLevel:
  {
    type: String,

    required:
    [
      true,
      "Threat level is required."
    ],

    enum:
    [
      "🟢 Benign — Non-threatening observation",
      "🔵 Informational — Monitor only",
      "🟡 Priority — Requires response",
      "🔴 Extreme — Immediate danger"
    ]
  },

  status:
  {
    type: String,

    enum:
    [
      "Active",
      "Investigating",
      "Resolved"
    ],

    default: "Active"
  },

  reportedAt:
  {
    type: Date,

    default: Date.now
  }
}); //incidentSchema

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;