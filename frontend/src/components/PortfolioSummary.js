import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const TIME_RANGES = [
  { label: '1D', key: '1D' },
  { label: '1W', key: '1W' },
  { label: '1M', key: '1M' },
  { label: '3M', key: '3M' },
  { label: 'YTD', key: 'YTD' },
  { label: 'ALL', key: 'ALL' },
];

const STOCKS = [
  { label: 'AAPL', value: 'AAPL' },
  { label: 'MSFT', value: 'MSFT' },
  { label: 'GOOGL', value: 'GOOGL' },
  { label: 'TSLA', value: 'TSLA' },
  { label: 'AMZN', value: 'AMZN' },
];

const CRYPTOS = [
  { label: 'Bitcoin', value: 'bitcoin' },
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Solana', value: 'solana' },
  { label: 'Dogecoin', value: 'dogecoin' },
];

const COINS = ['bitcoin', 'ethereum', 'solana', 'dogecoin', 'binancecoin', 'ripple', 'cardano'];

const PortfolioSummary = () => {
  const [assetType, setAssetType] = useState('stock');
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const [activeRange, setActiveRange] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (assetType === 'stock') {
          const token = import.meta.env.VITE_FINNHUB_API_KEY || process.env.VITE_FINNHUB_API_KEY;
          let resolution = '5';
          let from = Math.floor(Date.now() / 1000) - 60 * 60 * 24;
          if (activeRange === '1W') {
            resolution = '30';
            from = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7;
          } else if (activeRange === '1M') {
            resolution = '60';
            from = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
          } else if (activeRange === '3M') {
            resolution = 'D';
            from = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90;
          } else if (activeRange === 'YTD' || activeRange === 'ALL') {
            resolution = 'D';
            from = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365;
          }
          const to = Math.floor(Date.now() / 1000);
          const url = `https://finnhub.io/api/v1/stock/candle?symbol=${selectedAsset}&resolution=${resolution}&from=${from}&to=${to}&token=${token}`;
          const res = await axios.get(url);
          if (res.data && res.data.s === 'ok' && res.data.c && res.data.c.length > 1) {
            const prices = res.data.c;
            const latest = prices[prices.length - 1];
            const prev = prices[0];
            setChartData(prices);
            setCurrentPrice(latest);
            setChange(latest - prev);
            setChangePercent(((latest - prev) / prev) * 100);
          } else {
            setChartData([]);
            setCurrentPrice(0);
            setChange(0);
            setChangePercent(0);
          }
        }
      } catch (e) {
        setChartData([]);
        setCurrentPrice(0);
        setChange(0);
        setChangePercent(0);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [assetType, selectedAsset, activeRange]);

  useEffect(() => {
    if (assetType === 'crypto') {
      setLoading(true);
      let days = '1';
      if (activeRange === '1W') days = '7';
      else if (activeRange === '1M') days = '30';
      else if (activeRange === '3M') days = '90';
      else if (activeRange === 'YTD' || activeRange === 'ALL') days = 'max';
      const url = `https://api.coingecko.com/api/v3/coins/${selectedAsset}/market_chart?vs_currency=usd&days=${days}`;
      axios.get(url).then(res => {
        console.log('CoinGecko response:', res.data); // Debug
        if (res.data && res.data.prices && res.data.prices.length > 1) {
          const prices = res.data.prices.map(p => p[1]);
          const latest = prices[prices.length - 1];
          const prev = prices[0];
          setChartData(prices);
          setCurrentPrice(latest);
          setChange(latest - prev);
          setChangePercent(((latest - prev) / prev) * 100);
        } else {
          setChartData([]);
          setCurrentPrice(0);
          setChange(0);
          setChangePercent(0);
        }
        setLoading(false);
      }).catch(() => {
        setChartData([]);
        setCurrentPrice(0);
        setChange(0);
        setChangePercent(0);
        setLoading(false);
      });
    }
  }, [assetType, selectedAsset, activeRange]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const COINS = CRYPTOS.map(crypto => crypto.value);
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            ids: COINS.join(','), // This should be a comma-separated string
            order: 'market_cap_desc',
            per_page: COINS.length,
            page: 1,
            price_change_percentage: '24h'
          }
        });
        console.log(res.data);
      } catch (e) {
        console.error('Error fetching market data', e);
      }
    };
    fetchMarketData()
      .catch((err) => {
        console.error(err); // Add this line
        setError('Failed to load crypto market highlights.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-lg font-semibold">My Portfolio</div>
          <div className="text-2xl font-bold mt-1">${currentPrice ? currentPrice.toLocaleString(undefined, {maximumFractionDigits: 2}) : 0}</div>
          <div className={change >= 0 ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
            {change >= 0 ? '+' : ''}{change ? change.toFixed(2) : 0} ({changePercent ? changePercent.toFixed(2) : 0}%)
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <select
            className="bg-[#334155] text-white rounded px-2 py-1 text-xs font-medium"
            value={assetType}
            onChange={e => {
              setAssetType(e.target.value);
              setSelectedAsset(e.target.value === 'stock' ? 'AAPL' : 'bitcoin');
            }}
          >
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>
          </select>
          <select
            className="bg-[#334155] text-white rounded px-2 py-1 text-xs font-medium"
            value={selectedAsset}
            onChange={e => setSelectedAsset(e.target.value)}
          >
            {(assetType === 'stock' ? STOCKS : CRYPTOS).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-2 mb-2">
        {TIME_RANGES.map((range) => (
          <button
            key={range.key}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
              activeRange === range.key
                ? 'bg-[#38bdf8] text-[#0F172A]'
                : 'bg-[#334155] text-gray-300 hover:bg-[#475569]'
            }`}
            onClick={() => setActiveRange(range.key)}
          >
            {range.label}
          </button>
        ))}
      </div>
      <div className="h-32 mt-2">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
        ) : (
          <Line
            data={{
              labels: Array(chartData.length).fill(''),
              datasets: [
                {
                  label: 'Price',
                  data: chartData,
                  fill: false,
                  borderColor: '#38bdf8',
                  backgroundColor: '#38bdf8',
                  tension: 0.3,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false }, tooltip: { enabled: true } },
              scales: { x: { display: false }, y: { display: false } },
              elements: { line: { borderWidth: 2 } },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        )}
      </div>
    </div>
  );
};

const CryptoMarketHighlights = ({ className = "" }) => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: COINS.join(','), // Make sure this is a string
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
        console.error(err); // Log the error for debugging
        setError('Failed to load crypto market highlights.');
        setLoading(false);
      });
  }, []);

  // ...rest of your component (tabs, table, etc.)
};

export default PortfolioSummary;
