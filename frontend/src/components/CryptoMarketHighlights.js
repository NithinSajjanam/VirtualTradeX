import React, { useEffect, useState } from 'react';
import axios from 'axios';

const COINS = [
  'bitcoin',
  'ethereum',
  'solana',
  'dogecoin',
  'binancecoin',
  'ripple',
  'cardano',
  'polkadot',
  'tron',
  'litecoin'
];

const TABS = [
  { label: 'Top Gainers', key: 'gainers' },
  { label: 'Top Losers', key: 'losers' },
  { label: 'Most Active', key: 'active' },
];

const CryptoMarketHighlights = ({ className = "" }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: COINS.join(','),
          order: 'market_cap_desc',
          per_page: COINS.length,
          page: 1,
          price_change_percentage: '24h'
        }
      })
      .then(res => {
        setCryptos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load crypto market highlights.');
        setLoading(false);
      });
  }, []);

  // Sorting logic for tabs
  let displayCryptos = [...cryptos];
  if (activeTab === 'gainers') {
    displayCryptos.sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
  } else if (activeTab === 'losers') {
    displayCryptos.sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0));
  }

  return (
    <div className={`bg-[#1E293B] p-6 rounded-xl text-white shadow-lg ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Crypto Market Highlights</h2>
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b border-gray-600">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 font-semibold ${
              activeTab === tab.key ? 'border-b-2 border-[#00BFFF] text-[#00BFFF]' : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2">Crypto</th>
                <th className="py-2">Price</th>
                <th className="py-2">Change</th>
                <th className="py-2">Chg %</th>
              </tr>
            </thead>
            <tbody>
              {displayCryptos.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-700 hover:bg-[#0F172A] cursor-pointer">
                  <td className="py-2 font-bold flex items-center gap-2">
                    <img src={coin.image} alt={coin.symbol} className="w-5 h-5 inline-block" />
                    {coin.symbol.toUpperCase()}
                  </td>
                  <td className="py-2">${coin.current_price !== null ? coin.current_price.toLocaleString() : 'N/A'}</td>
                  <td className={`py-2 ${coin.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.price_change_24h !== null ? coin.price_change_24h.toFixed(2) : 'N/A'}
                  </td>
                  <td className={`py-2 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.price_change_percentage_24h !== null ? coin.price_change_percentage_24h.toFixed(2) : 'N/A'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CryptoMarketHighlights;