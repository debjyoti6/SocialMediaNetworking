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
        
        {/* Shooting Stars */}
        <div className="shooting-star star-1"></div>
        <div className="shooting-star star-2"></div>
        <div className="shooting-star star-3"></div>

        {/* CSS Planets */}
        <div className="planet planet-1"></div>
        <div className="planet planet-2">
          <div className="planet-ring"></div>
        </div>
        <div className="planet planet-3"></div>

        {/* Ambient Nebula Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-purple-900/40 to-indigo-600/10 blur-[120px] z-0 mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-fuchsia-900/30 to-blue-800/10 blur-[150px] z-0 mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        {/* Content wrapper ensures content sits on top of background */}
        <div className="relative z-10 flex flex-col h-full flex-1 min-h-0">
          {/* Render Navbar only if user is logged in */}
          {user && <Navbar user={user} setUser={setUser} />}
          
          {/* Main content area */}
          <main className="flex-1 flex flex-col p-4 min-h-0 overflow-y-auto">
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
