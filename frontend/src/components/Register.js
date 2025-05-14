import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Use full backend URL to bypass proxy issues
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        setMessage('Registration successful. You can now log in.');
        setFormData({ username: '', email: '', password: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="max-w-md w-full p-6 bg-[#1E293B] rounded shadow-md border border-[#334155]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#F1F5F9]">Register</h2>
        {message && <p className="text-[#22C55E] mb-4">{message}</p>}
        {error && <p className="text-[#EF4444] mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-[#94A3B8]">Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded border-[#334155] bg-[#0F172A] text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-[#94A3B8]">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded border-[#334155] bg-[#0F172A] text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-[#94A3B8]">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded border-[#334155] bg-[#0F172A] text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3B82F6] text-[#F1F5F9] py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-[#94A3B8]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3B82F6] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
