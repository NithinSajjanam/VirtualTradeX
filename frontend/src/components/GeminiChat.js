import React, { useState } from "react";

const GeminiChat = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) {
      setResponse("❗ Please enter a message.");
      return;
    }

    setLoading(true);
    setResponse("");
    const apiKey = "AIzaSyCrmtNEfgixC_LUa0ViraM681vwEjFCkAM"; // Updated API key

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      const data = await res.json();
      console.log("Gemini API response:", data);

      if (data.error) {
        setResponse(`❌ Gemini error: ${data.error.message || "Unknown error"}`);
      } else if (!data.candidates || !data.candidates.length) {
        setResponse("❌ No response from Gemini. Please try again later.");
      } else {
        const reply = data.candidates[0]?.content?.parts?.[0]?.text || "No response";
        setResponse(reply);
      }
    } catch (error) {
      console.error("Failed to get response from Gemini API", error);
      setResponse("❌ Failed to get response from Gemini API");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans p-6">
      <div className="max-w-3xl mx-auto bg-[#1E293B] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#4a90e2]">AI Chat</h2>
        <div className="flex">
          <input
            type="text"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow rounded-md px-4 py-2 text-black"
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="ml-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "🚀 Send"}
          </button>
        </div>
        {response && (
          <div className="mt-6 bg-white text-black rounded-md p-4 border border-gray-300 whitespace-pre-wrap">
            <strong className="block mb-2">Gemini says:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiChat;
