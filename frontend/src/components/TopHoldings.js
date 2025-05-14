import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TopHoldings() {
  const [topHoldings, setTopHoldings] = useState([]);

  useEffect(() => {
    const fetchTopHoldings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/portfolio/top-holdings');
        setTopHoldings(response.data);
      } catch (error) {
        console.error('Error fetching top holdings:', error);
      }
    };

    fetchTopHoldings();
  }, []);

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl text-white shadow-lg max-h-96 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Top Holdings</h2>
      <ul>
        {topHoldings.length > 0 ? (
          topHoldings.map((holding) => (
            <li key={holding.stockSymbol} className="flex justify-between border-b border-gray-700 py-2">
              <span>{holding.stockSymbol} – {holding.companyName || ''}</span>
              <span className="text-right">${holding.currentValue ? holding.currentValue.toLocaleString() : 'N/A'}</span>
            </li>
          ))
        ) : (
          <li>No top holdings data available.</li>
        )}
      </ul>
      <div className="mt-4 text-right">
        <a href="/top-holdings" className="text-[#00BFFF] hover:underline font-semibold">
          Top Holdings
        </a>
      </div>
    </div>
  );
}

export default TopHoldings;
