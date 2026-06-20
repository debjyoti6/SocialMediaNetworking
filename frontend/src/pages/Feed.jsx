import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ content: '', image: '' });

  // Fetch all posts from backend
  const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/posts`);
    setPosts(res.data.reverse()); // Show newest posts at the top
  };

  useEffect(() => { fetchPosts(); }, []);

  // Handle toggling like on a post
  const handleLike = async (postId) => {
    await axios.put(`${API_URL}/posts/${postId}/like`, { userId: user._id });
    fetchPosts(); // Refresh posts to see new like count
  };

  // Handle creating a new post
  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.content && !form.image) return;
    await axios.post(`${API_URL}/posts`, { userId: user._id, ...form });
    setForm({ content: '', image: '' }); // Reset form
    fetchPosts();
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-8 space-y-8">
      {/* Create Post Section */}
      <form onSubmit={handlePost} className="glass p-6 rounded-2xl flex flex-col gap-4">
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Broadcast to the Multiverse..."
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 outline-none focus:border-indigo-500 resize-none h-24 text-white"
        />
        {/* File Picker & Submit Button */}
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-indigo-900/40 hover:bg-indigo-800/60 px-4 py-2 rounded-lg text-indigo-300 transition border border-indigo-500/30 text-sm font-bold uppercase tracking-wider">
            🌌 Attach Hologram
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  // Converts the selected file to a Base64 string that can be saved in the database
                  reader.onloadend = () => setForm({ ...form, image: reader.result });
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          
          {/* Feedback if an image is selected */}
          {form.image && <span className="text-sm text-cyan-400 font-bold tracking-wide">Hologram primed ✓</span>}
          
          <button type="submit" className="ml-auto px-8 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
            Launch
          </button>
        </div>
      </form>

      {/* Posts List Section */}
      <div className="flex flex-col gap-6">
        {posts.map(post => (
          <div key={post._id} className="glass p-6 rounded-2xl">
            {/* Post Header: User Info */}
            <div className="flex items-center gap-3 mb-4">
              {post.userId?.profilePicture ? (
                <img src={post.userId.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="User" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                  {post.userId?.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <p className="font-semibold">{post.userId?.username}</p>
                <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Post Body: Content & Image */}
            <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
            {post.image && <img src={post.image} className="rounded-xl w-full max-h-96 object-cover mb-4" alt="Post" />}
            
            {/* Post Footer: Actions */}
            <div className="pt-4 border-t border-slate-700/50 text-sm">
              <button 
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-2 font-bold tracking-wide transition ${post.likes?.includes(user._id) ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-slate-400 hover:text-yellow-200'}`}
              >
                <span>⭐</span> {post.likes?.length || 0} Stars
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
