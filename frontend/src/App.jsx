import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Navbar from './components/Navbar';

export default function App() {
  // State to hold the logged-in user's information
  const [user, setUser] = useState(null);

  // Runs once on component mount to check if user is already logged in (saved in localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    // Router provides the navigation context for the application
    <Router>
      <div className="h-screen flex flex-col text-white relative overflow-hidden bg-space-dark">
        {/* Animated Stars and Planets Background Layers */}
        <div className="stars"></div>
        <div className="twinkling"></div>
        
        {/* Nebula & Planet Decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-purple-900/60 to-indigo-600/30 blur-[100px] z-0 mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-fuchsia-900/40 to-blue-800/30 blur-[120px] z-0 mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-gradient-to-tr from-teal-900/30 to-emerald-600/10 blur-[100px] z-0 mix-blend-screen"></div>

        {/* Content wrapper ensures content sits on top of background */}
        <div className="relative z-10 flex flex-col h-full flex-1 min-h-0">
          {/* Render Navbar only if user is logged in */}
          {user && <Navbar user={user} setUser={setUser} />}
          
          {/* Main content area */}
          <main className="flex-1 flex flex-col p-4 min-h-0">
          <Routes>
            {/* If not logged in, show Login; otherwise redirect to Feed */}
            <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to="/feed" />} />
            
            {/* Protected Routes: Only accessible if user is logged in */}
            <Route path="/feed" element={user ? <Feed user={user} /> : <Navigate to="/" />} />
            <Route path="/messages" element={user ? <Messages user={user} /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      </div>
    </Router>
  );
}
