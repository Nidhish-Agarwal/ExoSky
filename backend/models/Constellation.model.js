const mongoose = require("mongoose");

const StarSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // Catalog ID
    name: { type: String, required: true }, // Star name
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
    mag: { type: Number, required: true }, // Apparent magnitude
    color: { type: String }, // Color hex
    bv: { type: Number }, // B-V color index
    spectral_type: { type: String }, // Spectral type
    distance_pc_from_planet: { type: Number }, // Distance from the planet
    catalog_distance_pc: { type: Number }, // Distance from Earth
    catalog_mag: { type: Number }, // Catalog magnitude
  },
  { _id: false }
); // Don't create a separate _id for each star

const ConstellationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Constellation name
    planet: { type: String, required: true }, // Associated planet
    planet_coords_pc: {
      // Planet coordinates
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      z: { type: Number, required: true },
    },
    stars: [StarSchema], // Array of stars
    connections: {
      // Lines connecting stars
      type: [[Number]], // Array of pairs of indices
      default: [],
    },
    createdBy: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    narration: { type: String },
  },
  { timestamps: true }
); // CreatedAt / UpdatedAt

module.exports = mongoose.model("Constellation", ConstellationSchema);
