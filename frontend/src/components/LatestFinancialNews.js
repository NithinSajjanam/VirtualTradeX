import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LatestFinancialNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get('https://newsapi.org/v2/top-headlines?category=business&apiKey=c1715f638a4241268ca59821756d803f')
      .then(res => {
        if (res.data.status === 'ok') {
          setNews(res.data.articles);
        } else {
          setError('Failed to load latest financial news.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load latest financial news.');
        setLoading(false);
      });
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'less than an hour ago';
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  return (
    <div className="bg-[#1E293B] rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto text-white">
      <h2 className="text-xl font-semibold mb-4">Latest Financial News</h2>
      {loading ? (
        <p>Loading news...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : news.length > 0 ? (
        <ul className="space-y-3">
          {news.map((item, idx) => (
            <li key={item.url || idx} className="hover:bg-[#0F172A] p-2 rounded cursor-pointer">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-medium hover:underline">
                {item.title}
              </a>
              <div className="text-gray-400 text-sm">
                {item.source?.name || 'Unknown Source'} – {formatTimeAgo(item.publishedAt || item.published)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No financial news available.</p>
      )}
    </div>
  );
};

export default LatestFinancialNews;