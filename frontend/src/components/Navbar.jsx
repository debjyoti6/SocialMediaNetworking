import { Link } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  // Logs out the user by clearing localStorage and state
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    // Navigation bar stuck to top with glassmorphism effect
    <nav className="glass sticky top-0 z-50 flex justify-between px-6 py-4 items-center">
      <div className="flex gap-6 items-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
          Multiverse
        </h1>
        {/* Navigation Links */}
        <Link to="/feed" className="hover:text-indigo-400 font-medium">Galaxy</Link>
        <Link to="/messages" className="hover:text-indigo-400 font-medium">Comms</Link>
        <Link to="/profile" className="hover:text-indigo-400 font-medium">Command Center</Link>
      </div>

      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="flex items-center gap-2">
          {user?.profilePicture ? (
            <img src={user.profilePicture} className="w-8 h-8 rounded-full object-cover" alt="User" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="font-medium">{user.username}</span>
        </div>
        
        {/* Logout Button */}
        <button onClick={logout} className="px-5 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold tracking-wider transition">
          EJECT
        </button>
      </div>
    </nav>
  );
}
