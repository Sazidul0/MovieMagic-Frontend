// src/pages/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../services/api";
import { UserCheck, Users, Calendar, Shield, Search, AlertCircle } from "lucide-react";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAllUsers();
        const sortedUsers = (Array.isArray(data) ? data : []).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUsers(sortedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err.message || "Could not load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8 px-4 mt-10">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-pink-700 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
            User Management
          </h1>
          <p className="text-xl text-gray-300">Monitor and manage all registered cinema members</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg">Total Users</p>
                <p className="text-5xl font-bold text-cyan-400">{totalUsers}</p>
              </div>
              <Users className="w-16 h-16 text-cyan-400 opacity-70" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg">Admins</p>
                <p className="text-5xl font-bold text-purple-400">{adminCount}</p>
              </div>
              <Shield className="w-16 h-16 text-purple-400 opacity-70" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg">Members</p>
                <p className="text-5xl font-bold text-green-400">{totalUsers - adminCount}</p>
              </div>
              <UserCheck className="w-16 h-16 text-green-400 opacity-70" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white/10 border border-white/30 rounded-3xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-500/20 border border-red-500/50 rounded-3xl flex items-center gap-4 text-red-300">
            <AlertCircle className="w-10 h-10 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold">Error Loading Users</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 animate-pulse border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-5 bg-white/20 rounded w-32"></div>
                    <div className="h-4 bg-white/10 rounded w-48"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-24 h-24 mx-auto mb-6 text-gray-600 opacity-50" />
            <p className="text-3xl font-bold text-gray-400">
              {searchTerm ? "No users match your search" : "No users found"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-8 py-4 bg-purple-600/50 hover:bg-purple-600 rounded-2xl font-bold transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Users Grid - Responsive & Beautiful */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
              const joinedDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown";

              return (
                <div
                  key={user._id}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-5 mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl ${
                      user.role === "admin"
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 ring-4 ring-purple-500/50"
                        : "bg-gradient-to-br from-cyan-500 to-blue-600 ring-4 ring-cyan-500/50"
                    }`}>
                      {initial}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{user.name || "Unnamed User"}</h3>
                      <p className="text-gray-400 text-sm">ID: {user._id.slice(-8)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-300">{user.email}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {user.role === "admin" ? (
                          <Shield className="w-6 h-6 text-purple-400" />
                        ) : (
                          <UserCheck className="w-6 h-6 text-cyan-400" />
                        )}
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          user.role === "admin"
                            ? "bg-purple-600/50 text-purple-200 border border-purple-400"
                            : "bg-cyan-600/50 text-cyan-200 border border-cyan-400"
                        }`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">Joined {joinedDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl hover:bg-white/20 transition-all duration-300 text-xl font-medium shadow-xl"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;