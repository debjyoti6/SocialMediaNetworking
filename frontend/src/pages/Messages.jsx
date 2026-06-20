import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Messages({ user }) {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Fetch all users (excluding current user) when component mounts
  useEffect(() => {
    axios.get(`${API_URL}/users`).then(res => setUsers(res.data.filter(u => u._id !== user._id)));
  }, [user._id]);

  // Fetch messages with the active user, and set up polling every 3s
  useEffect(() => {
    if (!activeUser) return;
    const fetchMsgs = async () => {
      const res = await axios.get(`${API_URL}/messages/${user._id}/${activeUser._id}`);
      setMessages(res.data);
      scrollToBottom();
    };
    fetchMsgs();
    const intId = setInterval(fetchMsgs, 3000);
    return () => clearInterval(intId); // Cleanup interval on unmount or activeUser change
  }, [activeUser, user._id]);

  // Scroll down when new messages are added
  useEffect(() => scrollToBottom(), [messages]);

  // Handle sending a new message
  const sendMsg = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUser) return;
    const res = await axios.post(`${API_URL}/messages`, { senderId: user._id, receiverId: activeUser._id, text });
    setMessages([...messages, res.data]);
    setText('');
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-8 flex h-[80vh] gap-6">
      {/* Sidebar: Users List */}
      <div className="w-1/3 glass rounded-2xl flex flex-col overflow-hidden">
        <h2 className="p-4 bg-slate-800/50 font-bold text-xl border-b border-slate-700/50 uppercase tracking-widest text-indigo-300">Frequencies</h2>
        <div className="overflow-y-auto p-2 flex-1 space-y-1">
          {users.map(u => (
            <div 
              key={u._id} 
              onClick={() => setActiveUser(u)}
              className={`flex gap-3 p-3 rounded-xl cursor-pointer transition ${activeUser?._id === u._id ? 'bg-indigo-600/30 border border-indigo-500/50' : 'hover:bg-slate-800'}`}
            >
              {u.profilePicture ? (
                <img src={u.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="User" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex justify-center items-center font-bold">
                  {u.username[0].toUpperCase()}
                </div>
              )}
              <h3 className="font-semibold self-center">{u.username}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Chat Window */}
      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
        {activeUser ? (
          <>
            {/* Chat Header */}
            <h2 className="p-4 bg-slate-800/50 font-bold border-b border-slate-700/50 flex items-center gap-3">
              {activeUser.username}
            </h2>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => {
                const isMe = msg.senderId === user._id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[70%] ${isMe ? 'bg-indigo-600 rounded-br-sm' : 'bg-slate-700 rounded-bl-sm'}`}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMsg} className="p-4 bg-slate-800/50 border-t border-slate-700/50 flex gap-2">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Encode transmission..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 outline-none focus:border-indigo-500 text-white"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(79,70,229,0.5)] transition">
                Transmit
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center text-slate-400 font-medium">Tune into a frequency to start transmitting.</div>
        )}
      </div>
    </div>
  );
}
