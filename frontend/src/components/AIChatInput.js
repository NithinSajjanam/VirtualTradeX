import React, { useState } from 'react';
import axios from 'axios';

function AIChatInput() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/ai/generate', { query: input });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error communicating with AI service:', error);
      setResponse('Error communicating with AI service.');
    }
  };

  const samplePrompts = [
    "Why is TSLA up today?",
    "What are some tech stocks to watch?",
    "Explain 'short selling'."
  ];

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    setResponse('');
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          className="w-full bg-gray-700 text-white p-2 rounded-md mb-2"
          placeholder="Ask me anything about..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:opacity-80 transition-all duration-300 text-white px-4 py-2 rounded-md w-full"
        >
          Send
        </button>
      </form>
      {response && <p className="mt-4 text-gray-300">{response}</p>}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Sample AI prompts:</p>
        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 cursor-pointer">
          {samplePrompts.map((prompt) => (
            <li key={prompt} onClick={() => handlePromptClick(prompt)} className="hover:underline">
              {prompt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AIChatInput;
