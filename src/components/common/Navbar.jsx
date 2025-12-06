import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Shield, Film, Users, ClipboardList, Ticket, Settings } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    
    const handleUserLoggedIn = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const linkClass = "px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all duration-300 font-medium text-gray-800 hover:shadow-lg";

  return (
    <div className="navbar bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-2xl shadow-2xl fixed top-0 left-0 right-0 z-50 border-b border-purple-500/30">
      <div className="navbar-start">
        {/* MOBILE TOGGLE */}
        <div className="dropdown lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-ghost p-2 text-white hover:bg-purple-700/50 rounded-lg transition-colors">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          {mobileMenuOpen && (
            <ul className="menu dropdown-content mt-3 p-4 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl w-64 border border-purple-500/50">
              <li><Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:bg-purple-600/50 text-white hover:text-white transition-colors rounded-lg">🏠 Home</Link></li>
              <li><Link to="/movies" onClick={() => setMobileMenuOpen(false)} className="hover:bg-purple-600/50 text-white hover:text-white transition-colors rounded-lg">🎬 All Movies</Link></li>
              {user?.role === "admin" && <li><Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:bg-purple-600/50 text-white hover:text-white transition-colors rounded-lg">📊 Admin Dashboard</Link></li>}
              {!user && <li><Link to="/login" onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transition-shadow rounded-lg font-semibold">Login</Link></li>}
            </ul>
          )}
        </div>

        <Link to="/" className="flex items-center gap-3 text-2xl font-bold hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 p-1.5 rounded-lg shadow-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400">MovieMagic</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/" className={linkClass + " text-white"}>🏠 Home</Link></li>
          <li><Link to="/movies" className={linkClass + " text-white"}>🎬 All Movies</Link></li>
          {user?.role === "admin" && <li><Link to="/admin" className={linkClass + " text-white"}>📊 Admin Dashboard</Link></li>}
          {!user && <li><Link to="/login" className="px-5 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-xl shadow-lg transition-all duration-300 hover:scale-105">Login</Link></li>}
        </ul>
      </div>

      <div className="navbar-end flex items-center justify-end gap-4">
        {user && (
          <div className="dropdown dropdown-end">
            {/* AVATAR */}
            <button tabIndex={0} className="w-11 h-11 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow ring-2 ring-purple-400/80 hover:ring-pink-400/80 cursor-pointer flex-shrink-0 hover:scale-110 transform duration-300">
              <div className="bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </button>

            {/* DROPDOWN */}
            <ul className="dropdown-content menu p-4 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl w-64 mt-3 border border-purple-500/50 z-50">
              <li className="menu-title text-sm pb-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4 text-pink-400" /> {user.name}
                  </span>
                  {user.role === "admin" && <span className="badge bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-2 border-0">ADMIN</span>}
                </div>
              </li>
              
              {/* USER LINKS */}
              <li><Link to="/profile" className="flex items-center gap-2 hover:bg-purple-600/50 text-gray-200 hover:text-white transition-colors rounded-lg"><User className="w-4 h-4 text-pink-400" />My Profile</Link></li>
              <li><Link to="/bookings" className="flex items-center gap-2 hover:bg-purple-600/50 text-gray-200 hover:text-white transition-colors rounded-lg"><Ticket className="w-4 h-4 text-pink-400" />My Bookings</Link></li>

              {/* ADMIN LINKS */}
              {user.role === "admin" && (
                <>
                  <div className="divider my-2 bg-purple-500/30"></div>
                  <div className="text-xs font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent px-4 py-1">Admin Tools</div>
                  <li><Link to="/admin/movies" className="flex items-center gap-2 hover:bg-purple-600/50 text-gray-200 hover:text-white transition-colors rounded-lg"><Film className="w-4 h-4 text-pink-400" />All Movies</Link></li>
                  <li><Link to="/admin/users" className="flex items-center gap-2 hover:bg-purple-600/50 text-gray-200 hover:text-white transition-colors rounded-lg"><Users className="w-4 h-4 text-pink-400" />All Users</Link></li>
                  <li><Link to="/admin/bookings" className="flex items-center gap-2 hover:bg-purple-600/50 text-gray-200 hover:text-white transition-colors rounded-lg"><ClipboardList className="w-4 h-4 text-pink-400" />All Bookings</Link></li>
                </>
              )}

              {/* LOGOUT */}
              <li className="border-t border-purple-500/30 mt-3 pt-3">
                <button onClick={handleLogout} className="text-red-400 hover:bg-red-600/20 hover:text-red-300 rounded-lg w-full flex gap-2 items-center font-semibold transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
