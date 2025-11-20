// src/pages/MyProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { getUserBookings } from "../services/api";
import { LogOut, Ticket, DollarSign, User, Calendar } from "lucide-react";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  // Get user from localStorage
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Fetch user's real bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUserBookings(); // Real API call
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError("Could not load your bookings");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate stats
  const totalBookings = bookings.length;
  const totalSpent = bookings
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    .toFixed(2);

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-12 px-4">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-pink-700 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="avatar mb-6">
  <div className="
    w-32 h-32
    relative
    rounded-full
    ring ring-purple-500 ring-offset-base-100 ring-offset-4
    bg-gradient-to-br from-purple-600 to-pink-600
    shadow-2xl
  ">
    <span className="
      text-5xl font-bold leading-none
      absolute top-1/2 left-1/2 
      -translate-x-1/2 -translate-y-1/2
    ">
      {initial}
    </span>
  </div>
</div>


            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
              {user.name || "Movie Lover"}
            </h1>
            <p className="text-xl text-gray-300">{user.email}</p>

            <div className="mt-4">
              <span className={`px-6 py-3 rounded-full text-lg font-bold ${
                user.role === "admin"
                  ? "bg-purple-600/50 border border-purple-400 text-purple-200"
                  : "bg-cyan-600/50 border border-cyan-400 text-cyan-200"
              }`}>
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 hover:scale-105 transition-transform">
              <Ticket className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-4xl font-bold">
                {loading ? <span className="loading loading-spinner loading-sm"></span> : totalBookings}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 hover:scale-105 transition-transform">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-4xl font-bold text-yellow-400">
                {loading ? <span className="loading loading-spinner loading-sm"></span> : `$${totalSpent}`}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 hover:scale-105 transition-transform">
              <Calendar   ></Calendar>          
               <User className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <p className="text-gray-400 text-sm">Member Since</p>
              <p className="text-2xl font-bold">
                {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-5 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-300 text-center">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/bookings"
              className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Ticket className="w-6 h-6" />
              View My Bookings
            </Link>

            <button
              onClick={handleLogout}
              className="flex-1 py-5 bg-white/10 border border-white/30 text-white font-bold text-xl rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <LogOut className="w-6 h-6" />
              Logout
            </button>
          </div>

          {/* Back Home */}
          <div className="text-center mt-8">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-lg">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;