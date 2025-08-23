const ConstellationModel = require("../models/Constellation.model");
const User = require("../models/User");
const { generatePlanetNarration } = require("../services/geminiService");


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
      createdBy: req.userId, 
    });

    const savedConstellation = await newConstellation.save();

    const user = await User.findById(req.userId);
    const onboardingData = user?.onboardingData || {};
    const storyStyle = Object.values(onboardingData).join(", ")
    const starsInfo = stars
  .map(
    (s, i) =>
      `"${s.name}" at coordinates (x:${s.x}, y:${s.y}, z:${s.z}) with magnitude ${s.mag}`
  )
  .join("; ");

const connectionsInfo = connections?.length
  ? connections.map(c => `[${c[0]}-${c[1]}]`).join(", ")
  : "none";

const prompt = `
You are a normal, non-cringy storyteller.

A student has created a constellation called **"${name}"** linked to the planet **"${planet}"**.
This constellation has ${stars.length} stars.

Technical details for you (DO NOT list them literally in the story, just use them for inspiration):
- Stars: ${starsInfo}
- Connections (by star index): ${connectionsInfo}

The student's preferred story style: "${storyStyle}".

TASK:
- Create a **mythological origin story** explaining how this constellation was formed. 
- The story should reflect the constellation’s shape or pattern, as suggested by the star positions and connections.
- Make it **fun and imaginative**, but not cringy ("look young explorer" type of writing is forbidden).
- Connect it naturally to the planet "${planet}".
- Include **one clear educational insight about astronomy** (like habitable zones, star types, or exoplanets).
- Narrate from a first-person perspective as if the **universe itself** is guiding the student.
- Keep it around **250-300 words**, in **very simple, clear language**.
- Output plain text only.

IMPORTANT:
- Use the **pattern of connections** and star positions to imagine a shape (animal, object, figure, etc.).
- Do NOT dump coordinates or magnitudes; **translate them into imagery** in the story.
`;


    console.log("Generating narration with prompt:", prompt);
    const narration = await generatePlanetNarration(prompt);

    savedConstellation.narration = narration;
    await savedConstellation.save();
    console.log("Narration result:", narration);


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
