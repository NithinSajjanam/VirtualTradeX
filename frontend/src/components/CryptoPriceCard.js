import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoPriceCard = () => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then(res => {
        setPrice(res.data.bitcoin.usd);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load Bitcoin price.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#1E293B] rounded-lg shadow-lg p-4 text-white">
      <h2 className="text-lg font-semibold mb-2">Bitcoin Price (CoinGecko)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-2xl font-bold">${price}</p>
      )}
    </div>
  );
};

export default CryptoPriceCard;