// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Film, Users, Ticket, DollarSign, TrendingUp, Search,
  Menu, X, Plus, Shield, UserCheck, AlertCircle
} from "lucide-react";
import { getAllUsers, getDashboardStats } from "../../services/api";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsData, usersData] = await Promise.all([
          getDashboardStats(),
          getAllUsers()
        ]);

        setStats(statsData);
        // BUG WAS HERE → "usersDataulong"
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon: Icon, label, value, color }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <TrendingUp className="w-5 h-5 text-green-400 opacity-70" />
        </div>
        <h3 className="text-4xl font-bold text-white">{count.toLocaleString()}</h3>
        <p className="text-gray-300 mt-2">{label}</p>
      </div>
    );
  };

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden p-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-black/60 backdrop-blur-2xl border-r border-white/20 transform transition-transform duration-500 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-12">
              <Film className="w-12 h-12 text-yellow-400" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
                Admin Panel
              </h1>
            </div>
            <nav className="space-y-3">
              {[
                { to: "/admin", icon: Shield, label: "Dashboard" },
                { to: "/admin/movies", icon: Film, label: "Movies" },
                { to: "/admin/users", icon: Users, label: "Users" },
                { to: "/admin/bookings", icon: Ticket, label: "Bookings" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="font-medium text-lg">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-300">Real-time cinema analytics</p>
            </div>
            <Link
              to="/admin/add-movie"
              className="mt-6 lg:mt-0 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              Add Movie
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 animate-pulse">
                  <div className="h-12 w-12 bg-white/20 rounded-2xl mb-4"></div>
                  <div className="h-10 bg-white/10 rounded w-32"></div>
                  <div className="h-4 bg-white/10 rounded w-24 mt-3"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-10 p-6 bg-red-500/20 border border-red-500/50 rounded-3xl flex items-center gap-4 text-red-300">
              <AlertCircle className="w-10 h-10 flex-shrink-0" />
              <div>
                <p className="text-xl font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <StatCard icon={Film} label="Total Movies" value={stats.totalMovies} color="from-purple-500 to-pink-600" />
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="from-cyan-500 to-blue-600" />
              <StatCard icon={Ticket} label="Total Bookings" value={stats.totalBookings} color="from-green-500 to-emerald-600" />
              <StatCard icon={DollarSign} label="Revenue" value={stats.revenue} color="from-yellow-500 to-orange-600" />
            </div>
          )}

          <div className="h-px bg-white/20 my-16"></div>

          {/* Recent Users */}
          <div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
              <h2 className="text-3xl font-bold">Recent Users</h2>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-6 font-bold text-lg">User</th>
                      <th className="text-left p-6 font-bold text-lg">Email</th>
                      <th className="text-left p-6 font-bold text-lg">Role</th>
                      <th className="text-left p-6 font-bold text-lg">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-16 text-gray-400 text-xl">
                          {searchTerm ? "No users found" : "No users yet"}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.slice(0, 7).map((user) => (
                        <tr key={user._id} className="border-t border-white/10 hover:bg-white/5 transition-all">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                                <UserCheck className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">{user.name}</p>
                                <p className="text-sm text-gray-400">ID: {user._id.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-gray-300">{user.email}</td>
                          <td className="p-6">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                              user.role === "admin"
                                ? "bg-purple-500/30 text-purple-300 border border-purple-500"
                                : "bg-green-500/30 text-green-300 border border-green-500"
                            }`}>
                              {user.role || "user"}
                            </span>
                          </td>
                          <td className="p-6 text-gray-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB */}
      <Link
        to="/admin/add-movie"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 z-50"
      >
        <Plus className="w-8 h-8 text-white" />
      </Link>
    </div>
  );
};

export default DashboardPage;