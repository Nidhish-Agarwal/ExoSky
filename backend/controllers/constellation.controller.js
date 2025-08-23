const ConstellationModel = require("../models/Constellation.model");

const storeConstellation = async (req, res) => {
  try {
    const { name, planet, planet_coords_pc, stars, connections } = req.body;

    if (!name || !planet || !planet_coords_pc || !stars || stars.length < 2) {
      return res.status(400).json({ error: "Incomplete constellation data." });
    }

    const newConstellation = new ConstellationModel({
      name,
      planet,
      planet_coords_pc,
      stars,
      connections: connections || [],
      createdBy: req.userId, // from verifyUser middleware
    });

    const savedConstellation = await newConstellation.save();

    return res.status(201).json({
      message: "Constellation saved successfully.",
      constellation: savedConstellation,
    });
  } catch (error) {
    console.error("Error saving constellation:", error);
    return res
      .status(500)
      .json({ error: "Server error. Could not save constellation." });
  }
};

const getAllConstellations = async (req, res) => {
  try {
    const userId = req.userId; // Assuming your verifyJWT adds user to req

    // Fetch all constellations by this user
    const constellations = await ConstellationModel.find({
      createdBy: userId,
    }).sort({
      createdAt: -1, // Most recent first
    });

    res.status(200).json({ constellations });
  } catch (err) {
    console.error("Error fetching constellations:", err);
    res.status(500).json({ error: "Failed to fetch constellations" });
  }
};

module.exports = { storeConstellation, getAllConstellations };
