import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState({ profilePicture: user.profilePicture || '', bio: user.bio || '' });
  const [msg, setMsg] = useState('');

  // Handle updating user profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Send PUT request to update user document
      const res = await axios.put(`${API_URL}/users/${user._id}`, form);
      // Update global user state & local storage
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setMsg('Coordinates locked!');
    } catch (err) {
      setMsg('Failed to lock data: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto w-full py-12">
      <div className="glass p-8 rounded-3xl text-center">
        {/* Profile Avatar */}
        <div className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-500 overflow-hidden mb-4 bg-slate-800 flex justify-center items-center">
          {form.profilePicture || user.profilePicture ? (
            <img src={form.profilePicture || user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <span className="text-4xl font-bold">{user.username[0].toUpperCase()}</span>
          )}
        </div>
        
        <h2 className="text-3xl font-bold mb-1">{user.username}</h2>
        <p className="text-slate-400 mb-6">{user.email}</p>

        {/* Feedback Message */}
        {msg && <p className="mb-4 p-2 rounded bg-indigo-500/20 text-cyan-300 font-bold tracking-wide">{msg}</p>}

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 text-left">
          
          {/* File Picker for Profile Picture */}
          <div className="flex flex-col gap-1 text-center mb-2">
            <label className="cursor-pointer bg-indigo-900/40 hover:bg-indigo-800/60 px-4 py-2 rounded-lg text-indigo-300 transition border border-indigo-500/30 text-sm font-bold uppercase tracking-wider self-center">
              Update Hologram
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    // Converts the selected file to a Base64 string
                    reader.onloadend = () => setForm({ ...form, profilePicture: reader.result });
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            {/* Show tiny preview text if photo is selected */}
            {form.profilePicture !== user.profilePicture && (
              <span className="text-xs text-cyan-400 mt-1 font-bold tracking-wide">Hologram primed!</span>
            )}
          </div>
          <textarea
            placeholder="Log your journey..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="p-3 rounded bg-slate-800/50 border border-slate-700 outline-none focus:border-indigo-500 resize-none h-24 text-white"
          />
          <button type="submit" className="py-3 rounded bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
            Lock in Data
          </button>
        </form>
      </div>
    </div>
  );
}
