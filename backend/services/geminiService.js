const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePlanetNarration = async (prompt) => {
  try {
    // Pick the model first
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate response
    const result = await model.generateContent(prompt);

    // Extract text properly
    const text = result.response.text();

    if (!text) throw new Error("No narration received from Gemini API");

    return text.trim();
  } catch (err) {
    console.error("GenAIService error:", err);
    throw err;
  }
};



module.exports = { generatePlanetNarration };
