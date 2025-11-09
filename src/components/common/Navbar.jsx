import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogOut, User, Shield, Film } from "lucide-react";

const NavLinks = ({ onLinkClick, isMobile = false }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (onLinkClick) onLinkClick();
    navigate("/login");
  };

  const linkClass = isMobile
    ? "flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
    : "px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all duration-300 font-medium";

  return (
    <>
      <li className={isMobile ? "w-full" : ""}>
        <Link to="/" onClick={onLinkClick} className={linkClass}>
          <Film className="w-4 h-4" />
          Home
        </Link>
      </li>
      <li className={isMobile ? "w-full" : ""}>
        <Link to="/movies" onClick={onLinkClick} className={linkClass}>
          All Movies
        </Link>
      </li>

      {user?.role === "admin" && (
        <li className={isMobile ? "w-full" : ""}>
          <Link to="/admin" onClick={onLinkClick} className={linkClass}>
            <Shield className="w-4 h-4" />
            Dashboard
          </Link>
        </li>
      )}

      {user ? (
        <li className={isMobile ? "w-full border-t border-gray-200 mt-2 pt-2" : ""}>
          <button
            onClick={handleLogout}
            className={`${linkClass} text-red-600 hover:bg-red-50 hover:text-red-700`}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </li>
      ) : (
        <li className={isMobile ? "w-full" : ""}>
          <Link
            to="/login"
            onClick={onLinkClick}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
        </li>
      )}
    </>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="navbar bg-white/80 backdrop-blur-md shadow-xl fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="navbar-start">
        {/* Mobile Menu Toggle */}
        <div className="dropdown lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <ul className="menu dropdown-content mt-3 p-4 shadow-lg bg-white rounded-2xl w-64 border border-gray-200">
              <NavLinks
                onLinkClick={() => setMobileMenuOpen(false)}
                isMobile={true}
              />
            </ul>
          )}
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
        >
          <Film className="w-8 h-8" />
          MovieMagic
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <NavLinks />
        </ul>
      </div>

      {/* Right Side - Search + User */}
      <div className="navbar-end flex items-center gap-3">
      

        {/* User Avatar Dropdown */}
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar placeholder online ring-2 ring-purple-500 ring-offset-2 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-3 shadow-2xl bg-white rounded-2xl w-56 mt-2 border border-gray-200"
            >
              <li className="menu-title text-sm text-gray-600 pb-2 border-b">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.name}
                </span>
                {user.role === "admin" && (
                  <span className="badge badge-xs badge-error text-white">ADMIN</span>
                )}
              </li>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="flex items-center gap-2 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <Film className="w-4 h-4" />
                  My Bookings
                </Link>
              </li>
              <li className="border-t mt-2 pt-2">
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                  className="flex items-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
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