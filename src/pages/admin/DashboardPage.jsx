import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Film, Users, Ticket, DollarSign, TrendingUp, Search, 
  Menu, X, Plus, Edit, Trash2, Shield, UserCheck 
} from "lucide-react";
import { movies } from "../../data/movies";
import { users } from "../../data/users";

// Mock real-time data
const generateStats = () => ({
  totalMovies: movies.length,
  totalUsers: users.length,
  totalBookings: Math.floor(Math.random() * 200) + 300,
  revenue: Math.floor(Math.random() * 5000) + 12000,
});

const DashboardPage = () => {
  const [stats, setStats] = useState(generateStats());
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(generateStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter users
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm]);

  const StatCard = ({ icon: Icon, label, value, trend, color }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const start = 0;
      const end = value;
      const duration = 1500;
      const increment = end / (duration / 16);

      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+{trend}%</span>
            </div>
          )}
        </div>
        <h3 className="text-3xl font-bold text-white">{count.toLocaleString()}</h3>
        <p className="text-sm text-gray-300 mt-1">{label}</p>
      </div>
    );
  };

  return (
    <div className="mt-14 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        {/* <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black/50 backdrop-blur-2xl border-r border-white/20 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <Film className="w-10 h-10 text-yellow-400" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
                Admin Panel
              </h1>
            </div>
            <nav className="space-y-2">
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium"
              >
                <Shield className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                to="/admin/movies"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
              >
                <Film className="w-5 h-5" />
                Movies
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
              >
                <Users className="w-5 h-5" />
                Users
              </Link>
              <Link
                to="/admin/bookings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
              >
                <Ticket className="w-5 h-5" />
                Bookings
              </Link>
            </nav>
          </div>
        </aside> */}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 lg:ml-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                Admin Dashboard
              </h1>
              <p className="text-gray-300">Manage your cinema empire with ease</p>
            </div>
            <Link
              to="/admin/add-movie"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add New Movie
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={Film}
              label="Total Movies"
              value={stats.totalMovies}
              trend={12}
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              trend={8}
              color="from-cyan-500 to-blue-600"
            />
            <StatCard
              icon={Ticket}
              label="Total Bookings"
              value={stats.totalBookings}
              trend={15}
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              icon={DollarSign}
              label="Revenue"
              value={stats.revenue}
              trend={20}
              color="from-yellow-500 to-orange-600"
            />
          </div>

          <div className="divider my-12 bg-white/20 h-px"></div>

          {/* User Management */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-bold mb-4 sm:mb-0">User Management</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left p-4 font-semibold">User</th>
                      <th className="text-left p-4 font-semibold">Email</th>
                      <th className="text-left p-4 font-semibold">Role</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                              <UserCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{user.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500"
                                : "bg-green-500/20 text-green-300 border border-green-500"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                              <Edit className="w-4 h-4 text-blue-400" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <Link
        to="/admin/add-movie"
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-30"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
};

export default DashboardPage;