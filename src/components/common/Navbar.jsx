import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Shield, Film, Users, ClipboardList } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const linkClass = "px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all duration-300 font-medium";

  return (
    <div className=" navbar bg-white/80 backdrop-blur-md shadow-xl fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="navbar-start">
        {/* MOBILE TOGGLE */}
        <div className="dropdown lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-ghost p-2">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          {mobileMenuOpen && (
            <ul className="menu dropdown-content mt-3 p-4 shadow-lg bg-white rounded-2xl w-64 border border-gray-200">
              <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
              <li><Link to="/movies" onClick={() => setMobileMenuOpen(false)}>All Movies</Link></li>
              {user?.role === "admin" && <li><Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link></li>}
              {!user && <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>}
            </ul>
          )}
        </div>

        <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
          <Film className="w-8 h-8" />
          MovieMagic
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/" className={linkClass}>Home</Link></li>
          <li><Link to="/movies" className={linkClass}>All Movies</Link></li>
          {user?.role === "admin" && <li><Link to="/admin" className={linkClass}>Admin Dashboard</Link></li>}
          {!user && <li><Link to="/login" className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold">Login</Link></li>}
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-3">
        {user && (
          <div className="dropdown dropdown-end">
            {/* AVATAR */}
            <div tabIndex={0} role="button" className="avatar cursor-pointer relative w-10 h-10 rounded-full overflow-hidden">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-full h-full flex items-center justify-center">
                <span className="text-white font-bold text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>

            {/* DROPDOWN */}
            <ul className="dropdown-content menu p-3 shadow-2xl bg-white rounded-2xl w-56 mt-2 border">
              <li className="menu-title text-sm pb-2">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> {user.name}
                </span>
                {user.role === "admin" && <span className="badge badge-error text-white mt-1">ADMIN</span>}
              </li>
              {/* USER LINKS */}
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>

              {/* ADMIN LINKS */}
              {user.role === "admin" && (
                <>
                  <div className="divider my-1"></div>
                  <li><Link to="/admin/movies">All Movies (Edit)</Link></li>
                  <li><Link to="/admin/users">All Users</Link></li>
                  <li><Link to="/admin/bookings">All Bookings</Link></li>
                </>
              )}

              {/* LOGOUT */}
              <li className="border-t mt-2 pt-2">
                <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 rounded-lg w-full flex gap-2">
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
