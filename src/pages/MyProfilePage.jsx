import React from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { bookings } from "../data/booking";

const MyProfilePage = () => {
  const navigate = useNavigate();

  // Safely get user
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.error("Invalid user data", e);
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Stats
  const userBookings = bookings.filter((b) => b.userId === user.id);
  const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2);
  const totalBookings = userBookings.length;

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">

          {/* Avatar */}
          <div className="avatar placeholder mb-6">
            <div className="bg-primary text-primary-content rounded-full w-24 ring ring-primary ring-offset-base-100 ring-offset-2">
              <span className="text-3xl font-bold">{initial}</span>
            </div>
          </div>

          {/* Name */}
          <h2 className="card-title text-3xl mb-2">
            {user.name || user.email.split("@")[0]}
          </h2>

          {/* Email */}
          <p className="text-base-content/70 mb-1">Email: {user.email}</p>

          {/* Role */}
          <div className="badge badge-lg mb-6">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full mb-6">
            <div className="bg-base-200 rounded-box p-3">
              <div className="stat-title text-xs">Bookings</div>
              <div className="stat-value text-lg">{totalBookings}</div>
            </div>
            <div className="bg-base-200 rounded-box p-3">
              <div className="stat-title text-xs">Spent</div>
              <div className="stat-value text-lg">${totalSpent}</div>
            </div>
            <div className="bg-base-200 rounded-box p-3">
              <div className="stat-title text-xs">Member</div>
              <div className="stat-value text-lg">Active</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="card-actions justify-center gap-3 w-full">
            <Link to="/bookings" className="btn btn-primary flex-1">
              My Bookings
            </Link>
            <button onClick={handleLogout} className="btn btn-error flex-1">
              Logout
            </button>
          </div>

          <Link to="/" className="link link-hover text-sm mt-4">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;