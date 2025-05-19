import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundParticles from './BackgroundParticles';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setMessage('Login successful.');
        setFormData({ email: '', password: '' });
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-[#0F172A] overflow-hidden">
        {/* 🌟 Particles Background */}
        <BackgroundParticles />

        {/* 💻 Login Form */}
        <div className="max-w-md w-full p-6 bg-[#1E293B] rounded-xl shadow-lg z-10 border border-[#334155]">
          <h2 className="text-2xl font-bold mb-2 text-center text-[#F1F5F9]">Login</h2>
          <p className="text-center text-[#38BDF8] mb-4">Trade Smarter. Secure Access to Markets.</p>

          {message && <p className="text-[#22C55E] mb-4">{message}</p>}
          {error && <p className="text-[#EF4444] mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-[#94A3B8]">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded border-[#334155] bg-[#0F172A] text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-[#94A3B8]">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded border-[#334155] bg-[#0F172A] text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#3B82F6] text-[#F1F5F9] py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#3B82F6] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
