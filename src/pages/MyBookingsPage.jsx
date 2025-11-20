import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { getUserBookings } from "../services/api"; // Your real API function
import { Calendar, Clock, Ticket, Film } from "lucide-react";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUserBookings(); // Assumes it includes movie details
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <Ticket className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-4">Oops!</p>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
            My Bookings
          </h1>
          <p className="text-lg text-gray-300">
            View all your upcoming and past movie experiences
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const movie = booking.movie || {};
              const date = new Date(booking.bookingDate);
              const formattedDate = date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div
                  key={booking._id}
                  className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Poster */}
                    <div className="relative overflow-hidden">
                      <img
                        src={movie.posterUrl || "https://via.placeholder.com/400x600?text=No+Image"}
                        alt={movie.title}
                        className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 p-8 flex flex-col justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                          {movie.title || "Unknown Movie"}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="text-sm text-gray-400">Date</p>
                              <p className="font-medium">{formattedDate}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-pink-400" />
                            <div>
                              <p className="text-sm text-gray-400">Showtime</p>
                              <p className="font-medium">{booking.showtime || "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Ticket className="w-5 h-5 text-yellow-400" />
                            <div>
                              <p className="text-sm text-gray-400">Seats</p>
                              <p className="font-medium">{booking.seats?.join(", ") || "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-green-400 font-bold text-xl">
                              ${booking.totalPrice?.toFixed(2) || "0.00"}
                            </div>
                            <span className="text-sm text-gray-400">Total Paid</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-8 flex gap-4">
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2">
                          <Film className="w-5 h-5" />
                          View Ticket
                        </button>
                        <button className="px-6 py-3 bg-red-600/80 hover:bg-red-600 rounded-xl font-medium transition">
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-8 backdrop-blur-sm">
              <Ticket className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              No bookings yet
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't booked any movies. Time to plan your next cinematic adventure!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              <Film className="w-6 h-6" />
              Browse Movies Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;