import React, { useState, useRef, useEffect } from 'react';
import PortfolioSummary from './PortfolioSummary';
import MarketDataCards from './MarketDataCards';
import AIChatInput from './AIChatInput';
import GeminiChat from './GeminiChat';
import LatestFinancialNews from './LatestFinancialNews';
import TopHoldings from './TopHoldings';
import NewsTopHoldings from './NewsTopHoldings';
import QuickTradeForm from './QuickTradeForm';
import CryptoPriceCard from './CryptoPriceCard';
import CryptoMarketHighlights from './CryptoMarketHighlights';

const Dashboard = () => {
  const storedUserName = localStorage.getItem('userName') || 'John Doe';
  const [userName, setUserName] = useState(storedUserName);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setEditingName(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  const fetchGeminiContent = async (userMessage) => {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCrmtNEfgixC_LUa0ViraM681vwEjFCkAM', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: userMessage }] }] }),
    });
    const data = await response.json();
    if (data.error) return;
    if (!data.candidates || !data.candidates.length) return;
    return data;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#1E293B] shadow-md relative">
        <div className="text-2xl font-bold">
          VirtualTrade-<span className="text-[#00BFFF]">X</span>
        </div>

        {/* Modern Search Bar */}
        <div className="relative w-full max-w-md mx-auto hidden md:block">
          <input
            type="text"
            placeholder="Search for a stock (e.g., AAPL, MSFT)..."
            className="w-full pl-12 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none shadow-md"
          />
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </div>
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
            onClick={() => setMenuOpen((open) => !open)}
            title="User menu"
          >
            <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </span>
            <span>{userName}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg z-50">
              <div className="px-4 py-2 border-b font-semibold flex items-center justify-between">
                {editingName ? (
                  <>
                    <input
                      className="border rounded px-2 py-1 text-black w-28"
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          setUserName(tempName.trim() || 'John Doe');
                          setEditingName(false);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="ml-2 text-green-600 font-bold"
                      onClick={() => {
                        setUserName(tempName.trim() || 'John Doe');
                        setEditingName(false);
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span>{userName}</span>
                    <button
                      className="ml-2 text-blue-600 underline text-xs"
                      onClick={() => {
                        setTempName(userName);
                        setEditingName(true);
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => alert('Settings coming soon!')}
              >
                ⚙️ Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshToken');
                  localStorage.removeItem('userName');
                  window.location.href = '/login';
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Body */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="space-y-6">
          <PortfolioSummary />
          <LatestFinancialNews />
          <CryptoPriceCard />
        </div>

        {/* Middle */}
        <div className="space-y-6">
          <MarketDataCards />
        </div>

        {/* Right */}
        <div className="flex flex-col items-end md:pl-6 space-y-6">
          <div className="w-full md:w-50">
            <CryptoMarketHighlights className="h-full min-h-[400px]" />
          </div>
          <div className="w-full md:w-50">
            <QuickTradeForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
