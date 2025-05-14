import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MarketDataCards() {
  const [marketData, setMarketData] = useState([]);
  const [activeTab, setActiveTab] = useState('Top Gainers');
  const tabs = ['Top Gainers', 'Top Losers', 'Most Active'];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const symbols = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'FB', 'NVDA', 'NFLX', 'BABA', 'INTC'];
        const apiKey = 'd0fn8qhr01qr6dbt4n3gd0fn8qhr01qr6dbt4n40';
        const requests = symbols.map(symbol =>
          axios.get(`https://finnhub.io/api/v1/quote`, {
            params: { symbol, token: apiKey }
          })
          .then(response => ({
            stockSymbol: symbol,
            price: response.data.c,
            change: response.data.d,
            percentChange: response.data.dp,
            volume: response.data.v // Assuming volume is available here
          }))
        );
        const results = await Promise.all(requests);
        setMarketData(results);
      } catch (error) {
        console.error('Error fetching market data from Finnhub:', error);
      }
    };

    fetchMarketData();
  }, []);

  const filterData = () => {
    switch (activeTab) {
      case 'Top Gainers':
        return [...marketData].sort((a, b) => b.percentChange - a.percentChange);
      case 'Top Losers':
        return [...marketData].sort((a, b) => a.percentChange - b.percentChange);
      case 'Most Active':
        return [...marketData].sort((a, b) => (b.volume || 0) - (a.volume || 0));
      default:
        return marketData;
    }
  };

  const filteredData = filterData();

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl text-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Market Highlights</h2>
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b border-gray-600">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-semibold ${
              activeTab === tab ? 'border-b-2 border-[#00BFFF] text-[#00BFFF]' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-2">Stock</th>
            <th className="py-2">Price</th>
            <th className="py-2">Change</th>
            <th className="py-2">Chg %</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.stockSymbol} className="border-b border-gray-700 hover:bg-[#0F172A] cursor-pointer">
              <td className="py-2 font-bold">{item.stockSymbol}</td>
              <td className="py-2">${item.price !== null ? item.price.toFixed(2) : 'N/A'}</td>
              <td className={`py-2 ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.change !== null ? item.change.toFixed(2) : 'N/A'}
              </td>
              <td className={`py-2 ${item.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.percentChange !== null ? item.percentChange.toFixed(2) : 'N/A'}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarketDataCards;
