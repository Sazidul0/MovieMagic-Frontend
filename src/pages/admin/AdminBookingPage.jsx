// src/pages/admin/AdminBookingsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBookings } from "../../services/api";
import { Ticket, Calendar, Clock, User, Film, DollarSign, Search, Filter } from "lucide-react";

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getAllBookings();
        // Sort by newest first
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sorted);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter logic
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !filterDate || booking.bookingDate === filterDate;

    return matchesSearch && matchesDate;
  });

  // Stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalTickets = bookings.reduce((sum, b) => sum + b.seats.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-3xl text-white animate-pulse">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8 px-4">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-pink-700 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
            All Bookings
          </h1>
          <p className="text-xl text-gray-300">Manage and monitor cinema revenue in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg">Total Revenue</p>
                <p className="text-5xl font-bold text-yellow-400">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-16 h-16 text-yellow-400 opacity-70" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg">Tickets Sold</p>
                <p className="text-5xl font-bold text-cyan-400">{totalTickets}</p>
              </div>
              <Ticket className="w-16 h-16 text-cyan-400 opacity-70" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg">Total Bookings</p>
                <p className="text-5xl font-bold text-purple-400">{bookings.length}</p>
              </div>
              <Calendar className="w-16 h-16 text-purple-400 opacity-70" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, email, or movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-14 pr-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {(searchTerm || filterDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                }}
                className="px-8 py-4 bg-red-600/50 hover:bg-red-600 rounded-2xl font-bold transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Ticket className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-2xl">No bookings found</p>
              {(searchTerm || filterDate) && <p className="text-lg mt-2">Try adjusting your filters</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-6 font-bold text-lg"><User className="inline w-5 h-5 mr-2" />User</th>
                    <th className="text-left p-6 font-bold text-lg"><Film className="inline w-5 h-5 mr-2" />Movie</th>
                    <th className="text-left p-6 font-bold text-lg"><Ticket className="inline w-5 h-5 mr-2" />Seats</th>
                    <th className="text-left p-6 font-bold text-lg"><Calendar className="inline w-5 h-5 mr-2" />Date</th>
                    <th className="text-left p-6 font-bold text-lg"><Clock className="inline w-5 h-5 mr-2" />Time</th>
                    <th className="text-left p-6 font-bold text-lg"><DollarSign className="inline w-5 h-5 mr-2" />Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`border-t border-white/10 hover:bg-white/5 transition-all ${index % 2 === 0 ? "bg-white/5" : ""}`}
                    >
                      <td className="p-6">
                        <div>
                          <p className="font-semibold text-lg">{booking.user?.name || "Unknown User"}</p>
                          <p className="text-sm text-gray-400">{booking.user?.email || "N/A"}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-semibold text-lg text-cyan-300">{booking.movie?.title || "Unknown Movie"}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-2">
                          {booking.seats?.map(seat => (
                            <span key={seat} className="px-3 py-1 bg-purple-600/50 rounded-full text-sm font-medium">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 font-medium">
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric"
                        }) : "N/A"}
                      </td>
                      <td className="p-6 font-medium text-purple-300">
                        {booking.showtime || "N/A"}
                      </td>
                      <td className="p-6">
                        <span className="text-2xl font-bold text-yellow-400">${booking.totalPrice}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-10 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 text-xl font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;