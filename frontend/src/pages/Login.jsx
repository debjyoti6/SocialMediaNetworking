import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Login({ setUser }) {
  // Toggle between Login and Signup modes
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  // Handle form submission for both Login and Signup
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      // Pick the right endpoint based on mode
      const endpoint = isLogin ? '/users/login' : '/users';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      // Save user to localStorage to keep them logged in across refreshes
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center">
      {/* Glass card container */}
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          {isLogin ? 'Re-enter Orbit' : 'Join the Multiverse'}
        </h2>

        {/* Display error if any */}
        {error && <div className="text-red-300 bg-red-900/30 p-2 rounded mb-4 text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Show username only if signing up */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              required
              className="p-3 rounded bg-slate-800/50 border border-slate-700 outline-none focus:border-indigo-500"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            className="p-3 rounded bg-slate-800/50 border border-slate-700 outline-none focus:border-indigo-500"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="p-3 rounded bg-slate-800/50 border border-slate-700 outline-none focus:border-indigo-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          
          <button type="submit" className="py-3 rounded bg-indigo-600 hover:bg-indigo-500 font-bold tracking-widest uppercase transition mt-2 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            {isLogin ? 'Board Ship' : 'Enlist'}
          </button>
        </form>

        {/* Toggle Mode */}
        <p className="text-center mt-6 text-sm text-slate-400">
          {isLogin ? "Lost in space? " : "Already enlisted? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-400 cursor-pointer font-bold">
            {isLogin ? 'Enlist Now' : 'Board Ship'}
          </span>
        </p>
      </div>
    </div>
  );
}
