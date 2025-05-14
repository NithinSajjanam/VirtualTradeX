import React from 'react';
import PortfolioSummary from './PortfolioSummary';
import MarketDataCards from './MarketDataCards';
import AIChatInput from './AIChatInput';
import LatestFinancialNews from './LatestFinancialNews';
import TopHoldings from './TopHoldings';
import NewsTopHoldings from './NewsTopHoldings';
import QuickTradeForm from './QuickTradeForm';

const Dashboard = () => {
  const userName = localStorage.getItem('userName') || 'John Doe';
  const virtualBalance = '98,765.43'; // This can be dynamic if available

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#1E293B] shadow-md">
        <div className="text-2xl font-bold">
          VirtualTrade-<span className="text-[#00BFFF]">X</span>
        </div>
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search for a stock (e.g., AAPL, MSFT)..."
            className="w-full rounded-md px-4 py-2 text-black focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm">Virtual USD Balance</div>
            <div className="text-lg font-semibold">{virtualBalance} Virtual USD</div>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>{userName}</div>
          </div>
        </div>
      </nav>

      {/* Dashboard Sections */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* My Portfolio Card */}
          <PortfolioSummary />

          {/* Top Holdings Card */}
          <TopHoldings />
          {/* News Top Holdings Card */}
          <NewsTopHoldings />
        </div>

        {/* Center Column */}
        <div className="space-y-6">
          {/* Market Highlights Card */}
          <MarketDataCards />

          {/* Latest Financial News Card */}
          <LatestFinancialNews />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* VirtualTradeX AI Card */}
          <div className="bg-[#1E293B] rounded-lg shadow-lg p-3 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-2">VirtualTradeX AI</h2>
            <AIChatInput />
          </div>

          {/* Quick Trade Card */}
          <QuickTradeForm />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
