import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function PortfolioSummary() {
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioGain, setPortfolioGain] = useState(0);
  const [portfolioGainPercent, setPortfolioGainPercent] = useState(0);
  const [timeRange, setTimeRange] = useState('1D');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeRanges = ['1D', '1W', '1M', '3M', 'YTD', 'ALL'];

  useEffect(() => {
    const fetchPortfolioSummary = async () => {
      try {
        // Fetch portfolio value and gain data
        const summaryResponse = await axios.get('http://localhost:5000/api/portfolio/summary');
        setPortfolioValue(summaryResponse.data.value);
        setPortfolioGain(summaryResponse.data.gain);
        setPortfolioGainPercent(summaryResponse.data.gainPercent);

        // Fetch chart data for selected time range
        const chartResponse = await axios.get(`http://localhost:5000/api/portfolio/chart?range=${timeRange}`);
        setChartData({
          labels: chartResponse.data.labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data: chartResponse.data.values,
              fill: false,
              borderColor: '#00BFFF',
              backgroundColor: '#00BFFF',
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 6,
              borderWidth: 2,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio summary:', err);
        setError('Failed to load portfolio summary');
        setLoading(false);
      }
    };

    fetchPortfolioSummary();
  }, [timeRange]);

  if (loading) {
    return <div>Loading portfolio summary...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-[#1E293B] p-6 rounded-xl text-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4">My Portfolio</h2>
      <div className="flex items-center justify-between mb-2">
        <div className="text-3xl font-bold">${portfolioValue.toLocaleString()}</div>
        <div className={`text-lg font-semibold ${portfolioGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {portfolioGain >= 0 ? '+' : '-'}${Math.abs(portfolioGain).toLocaleString()} ({portfolioGainPercent.toFixed(1)}%)
        </div>
      </div>
      <div className="mb-4">
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md font-semibold ${
                timeRange === range ? 'bg-[#00BFFF] text-black shadow-lg' : 'bg-gray-700 text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      {chartData && <Line data={chartData} />}
      <div className="mt-4 flex justify-between text-sm">
        <a href="/holdings" className="text-[#00BFFF] hover:underline">
          View Full Holdings
        </a>
        <a href="/transactions" className="text-[#00BFFF] hover:underline">
          Transaction History
        </a>
      </div>
    </div>
  );
}

export default PortfolioSummary;
