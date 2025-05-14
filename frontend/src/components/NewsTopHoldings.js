import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NewsTopHoldings() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch news related to top holdings from backend API
        const response = await axios.get('/api/news/top-holdings');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news for top holdings:', error);
      }
    };

    fetchNews();
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
    <div className="bg-[#1E293B] p-6 rounded-xl text-white shadow-lg max-h-96 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">News on Top Holdings</h2>
      <ul className="space-y-3">
        {news.length > 0 ? (
          news.map((item) => (
            <li key={item.id || item._id} className="hover:bg-[#0F172A] p-2 rounded cursor-pointer">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-medium hover:underline">
                {item.title}
              </a>
              <div className="text-gray-400 text-sm">
                {item.source} – {formatTimeAgo(item.publishedAt || item.published)}
              </div>
            </li>
          ))
        ) : (
          <li>No news available for top holdings.</li>
        )}
      </ul>
    </div>
  );
}

export default NewsTopHoldings;
