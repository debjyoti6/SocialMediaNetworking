import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({ content: '', image: '' });
  
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/posts`);
    setPosts(res.data.reverse()); 
  };

  const fetchStories = async () => {
    const res = await axios.get(`${API_URL}/stories`);
    setStories(res.data.reverse());
  };

  useEffect(() => { 
    fetchPosts(); 
    fetchStories();
  }, []);

  const handleLike = async (postId) => {
    await axios.put(`${API_URL}/posts/${postId}/like`, { userId: user._id });
    fetchPosts(); 
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.content && !form.image) return;
    try {
      await axios.post(`${API_URL}/posts`, { userId: user._id, ...form });
      setForm({ content: '', image: '' }); 
      fetchPosts();
    } catch (err) {
      alert("Transmission failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${API_URL}/posts/${postId}`);
        fetchPosts();
      } catch (err) {
        alert("Failed to delete post: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleUpdatePost = async (postId) => {
    if (!editContent.trim()) return;
    try {
      await axios.put(`${API_URL}/posts/${postId}`, { content: editContent });
      setEditingPostId(null);
      fetchPosts();
    } catch (err) {
      alert("Failed to update post: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddStory = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await axios.post(`${API_URL}/stories`, { userId: user._id, image: reader.result });
          fetchStories();
        } catch (err) {
          alert("Failed to add story: " + (err.response?.data?.message || err.message));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm("Delete this story?")) {
      try {
        await axios.delete(`${API_URL}/stories/${storyId}`);
        fetchStories();
      } catch (err) {
        alert("Failed to delete story.");
      }
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${API_URL}/comments/post/${postId}`);
      setComments(prev => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = (postId) => {
    const isShowing = showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: !isShowing }));
    if (!isShowing) {
      fetchComments(postId);
    }
  };

  const handlePostComment = async (postId) => {
    const text = commentText[postId];
    if (!text) return;
    try {
      await axios.post(`${API_URL}/comments`, {
        postId,
        userId: user._id,
        content: text
      });
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      fetchComments(postId);
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full pb-8">
      <div className="max-w-2xl mx-auto w-full py-4 space-y-8">
        
        {/* Stories Section */}
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {/* Add Story Button */}
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <label className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-500 flex items-center justify-center cursor-pointer hover:bg-indigo-900/40 transition">
              <span className="text-2xl text-indigo-400">+</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAddStory} />
            </label>
            <span className="text-xs text-slate-400">Add Story</span>
          </div>

          {/* Render Stories */}
          {stories.map(story => (
            <div key={story._id} className="flex flex-col items-center gap-2 min-w-[80px] relative group">
              <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-[2px] overflow-hidden">
                <img src={story.image} className="w-full h-full rounded-full object-cover" alt="Story" />
              </div>
              <span className="text-xs text-slate-300 truncate w-full text-center">{story.userId?.username || 'User'}</span>
              {story.userId?._id === user._id && (
                <button 
                  onClick={() => handleDeleteStory(story._id)} 
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>

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
                    reader.onloadend = () => setForm({ ...form, image: reader.result });
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            
            {form.image && (
              <div className="flex items-center gap-2">
                <img src={form.image} alt="Preview" className="w-8 h-8 rounded object-cover border border-indigo-500" />
                <span className="text-sm text-cyan-400 font-bold tracking-wide">Hologram primed &check;</span>
              </div>
            )}
            
            <button type="submit" className="ml-auto px-8 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
              Launch
            </button>
          </div>
        </form>

        {/* Posts List Section */}
        <div className="flex flex-col gap-6">
          {posts.map(post => (
            <div key={post._id} className="glass p-6 rounded-2xl flex flex-col relative">
              
              {/* Post Options Menu (Only if user owns post) */}
              {post.userId?._id === user._id && (
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}
                    className="text-slate-400 hover:text-white px-2 py-1 transition font-bold text-lg leading-none tracking-widest bg-slate-800/30 hover:bg-slate-800/80 rounded-lg"
                  >
                    ...
                  </button>
                  {openMenuId === post._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
                      <button 
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditContent(post.content);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-indigo-300 hover:bg-slate-700 transition font-semibold"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => {
                          setOpenMenuId(null);
                          handleDeletePost(post._id);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-700 transition font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Post Header */}
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
              
              {/* Post Body */}
              {editingPostId === post._id ? (
                <div className="mb-4 flex flex-col gap-2 relative z-0">
                  <textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-900/80 border border-indigo-500/50 outline-none focus:border-indigo-400 text-white resize-none min-h-[80px]"
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => setEditingPostId(null)}
                      className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold transition uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleUpdatePost(post._id)}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-[0_0_10px_rgba(79,70,229,0.4)] uppercase tracking-wider"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
              )}
              {post.image && <img src={post.image} className="rounded-xl w-full max-h-96 object-cover mb-4" alt="Post" />}
              
              {/* Post Footer Actions */}
              <div className="pt-4 border-t border-slate-700/50 flex items-center gap-6 text-sm">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 font-bold tracking-wide transition ${post.likes?.includes(user._id) ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-slate-400 hover:text-yellow-200'}`}
                >
                  <span>⭐</span> {post.likes?.length || 0} Stars
                </button>

                <button 
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center gap-2 font-bold tracking-wide text-indigo-300 hover:text-indigo-200 transition"
                >
                  <span>💬</span> Comments
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col gap-3">
                  {/* List Comments */}
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    {comments[post._id]?.length > 0 ? (
                      comments[post._id].map(comment => (
                        <div key={comment._id} className="bg-slate-800/40 p-3 rounded-lg flex justify-between items-start group">
                          <div>
                            <span className="font-bold text-indigo-300 text-xs mr-2">{comment.userId?.username}</span>
                            <span className="text-sm">{comment.content}</span>
                          </div>
                          {(comment.userId?._id === user._id || post.userId?._id === user._id) && (
                            <button 
                              onClick={() => handleDeleteComment(comment._id, post._id)}
                              className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition hover:text-red-400 p-1"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No comments yet. Be the first!</p>
                    )}
                  </div>
                  
                  {/* Add Comment Field */}
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post._id)}
                      className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 text-white"
                    />
                    <button 
                      onClick={() => handlePostComment(post._id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
