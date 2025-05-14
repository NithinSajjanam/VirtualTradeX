import React, { useState } from 'react';
import axios from 'axios';

function QuickTradeForm() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/trades', {
        stockSymbol,
        quantity: Number(quantity),
        tradeType,
      });
      setMessage('Trade successful!');
      setStockSymbol('');
      setQuantity('');
    } catch (error) {
      console.error('Error executing trade:', error);
      setMessage('Trade failed. Please try again.');
    }
  };

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl text-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Quick Trade</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Stock Symbol</label>
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
            className="w-full bg-gray-700 text-white p-2 rounded-md mt-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded-md mt-2"
            required
            min="1"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Trade Type</label>
          <select
            value={tradeType}
            onChange={(e) => setTradeType(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded-md mt-2"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:opacity-80 transition-all duration-300 text-white px-4 py-2 rounded-md w-full"
        >
          Execute Trade
        </button>
      </form>
      {message && <p className="mt-4 text-gray-300">{message}</p>}
    </div>
  );
}

export default QuickTradeForm;
