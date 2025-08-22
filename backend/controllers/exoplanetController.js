// controllers/exoplanetController.js
const { generatePlanetNarration } = require('../services/geminiService');

const getExoplanetNarration = async (req, res) => {
  try {
    const { planetName, planetData, userQuestion } = req.body;

    if (!planetName || !planetData) {
      return res.status(400).json({
        error: "Both 'planetName' and 'planetData' are required."
      });
    }

    const prompt = `
You are an AI astrophysics expert. 
Always respond in a formal, professional, and scientific tone. 
Do not include humor, analogies, or unrelated comparisons. 
Stay focused only on astrophysics, astronomy, and planetary science.

Planet details:
- Name: ${planetName}
- Distance from Earth: ${planetData.distance || "unknown"}
- Planet type: ${planetData.type || "unknown"}
- Star system: ${planetData.system || "unknown"}
- Orbital period: ${planetData.orbitalPeriod || "unknown"}
- Radius: ${planetData.radius || "unknown"}
- Mass: ${planetData.mass || "unknown"}
- Notable features: ${planetData.features || "none"}

User’s question: "${userQuestion || "Tell me about this planet."}"

Instructions:
1. Respond only with factual, scientific information relevant to exoplanets and astronomy. 
2. Do not deviate into unrelated domains. 
3. Use clear, concise sentences suitable for an academic or scientific audience. 
4. Provide a direct and professional narration that answers the user’s request.
    `;

    const narration = await generatePlanetNarration(prompt);

    return res.status(200).json({ narration });

  } catch (err) {
    console.error("❌ GenAI API error:", err.message || err);
    res.status(500).json({
      error: "Failed to generate narration. Please try again later."
    });
  }
};

module.exports = { getExoplanetNarration };
