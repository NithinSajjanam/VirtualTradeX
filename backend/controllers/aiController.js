
const axios = require("axios");

const processAIQuery = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta";

  if (!geminiApiKey) {
    // Fallback to mock response if Gemini API key is missing
    const mockResponse = 'This is a mock AI response to your query: "' + query + '"';
    return res.json({ response: mockResponse });
  }

  try {
    // Updated model name to gemini-1.0-pro as per feedback
    const url = `${geminiApiUrl}/models/gemini-1.0-pro:generateContent?key=${geminiApiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: query }],
        },
      ],
    };

    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log full response for debugging
    console.log("Gemini API full response:", JSON.stringify(response.data, null, 2));

    let aiText = "No response from Gemini API";
    if (response.data) {
      if (response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          aiText = candidate.content.parts.map((part) => part.text).join(" ");
        } else if (candidate.content && typeof candidate.content === "string") {
          aiText = candidate.content;
        }
      } else if (response.data.content && typeof response.data.content === "string") {
        aiText = response.data.content;
      }
    }

    return res.json({ response: aiText });
  } catch (error) {
    console.error("Error processing AI query with Gemini API:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to process AI query with Gemini API" });
  }
};

const generateAIResponse = async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const reply = response.data.candidates[0]?.content?.parts[0]?.text || "No response";
    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI processing failed", details: error.message });
  }
};

module.exports = {
  processAIQuery,
  generateAIResponse,
};
