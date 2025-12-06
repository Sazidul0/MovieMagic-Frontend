// src/pages/admin/AdminMoviesPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllMovies, deleteMovie, updateMovie } from "../../services/api";
import { Film, Calendar, Clock, Search, Edit3, Trash2, AlertCircle, Plus, Users, X, Save, Image } from "lucide-react";

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    posterUrl: "",
    genre: "",
    duration: "",
    releaseDate: "",
    format: "2D",
    showtimesInput: "",
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAllMovies();
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMovies(sorted);
      } catch (err) {
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie? This cannot be undone.")) return;

    try {
      setDeletingId(id);
      await deleteMovie(id);
      setMovies(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert("Failed to delete movie: " + (err.message || "Server error"));
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      releaseDate: movie.releaseDate ? movie.releaseDate.split("T")[0] : "",
      format: movie.format || "2D",
      showtimesInput: movie.showtimes?.map(s => `${s.date}: ${s.time}`).join("\n") || "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMovie(null);
    setFormData({
      title: "", description: "", posterUrl: "", genre: "", duration: "", releaseDate: "", format: "2D", showtimesInput: ""
    });
  };

  const parseShowtimes = (input) => {
    const showtimes = [];
    const lines = input.trim().split("\n");
    lines.forEach(line => {
      const [date, timesStr] = line.split(":");
      if (!date || !timesStr) return;
      const times = timesStr.split(",").map(t => t.trim()).filter(Boolean);
      times.forEach(time => showtimes.push({ date: date.trim(), time }));
    });
    return showtimes;
  };

  const handleUpdate = async () => {
    if (!editingMovie) return;

    const showtimes = parseShowtimes(formData.showtimesInput);
    const updatedData = {
      ...formData,
      showtimes,
      rating: editingMovie.rating || 0,
    };

    try {
      await updateMovie(editingMovie._id, updatedData);
      setMovies(prev => prev.map(m => m._id === editingMovie._id ? { ...m, ...updatedData, showtimes } : m));
      closeEditModal();
      alert("Movie updated successfully!");
    } catch (err) {
      alert("Failed to update movie: " + (err.message || "Server error"));
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalShowtimes = movies.reduce((sum, m) => sum + (m.showtimes?.length || 0), 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8 px-4 mt-10">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 -right-10 w-96 h-96 bg-pink-700 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                Movie Management
              </h1>
              <p className="text-xl text-gray-300">Edit, update, or remove movies instantly</p>
            </div>

            <Link
              to="/admin/add-movie"
              className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-7 h-7" />
              Add New Movie
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-lg">Total Movies</p>
                  <p className="text-5xl font-bold text-cyan-400">{movies.length}</p>
                </div>
                <Film className="w-16 h-16 text-cyan-400 opacity-70" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-lg">Total Showtimes</p>
                <p className="text-5xl font-bold text-purple-400">{totalShowtimes}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-lg">Active Listings</p>
                <p className="text-5xl font-bold text-green-400">{movies.length}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies by title or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/10 border border-white/30 rounded-3xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all text-lg"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-2xl">×</button>
              )}
            </div>
          </div>

          {/* Error & Loading */}
          {error && (
            <div className="mb-8 p-6 bg-red-500/20 border border-red-500/50 rounded-3xl flex items-center gap-4 text-red-300">
              <AlertCircle className="w-10 h-10" />
              <div><p className="text-xl font-bold">Error</p><p>{error}</p></div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 animate-pulse border border-white/10">
                  <div className="bg-white/20 rounded-2xl h-96 mb-6"></div>
                  <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
                  <div className="h-5 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-20">
              <Film className="w-24 h-24 mx-auto mb-6 text-gray-600 opacity-50" />
              <p className="text-3xl font-bold text-gray-400">
                {searchTerm ? "No movies match your search" : "No movies in catalog"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMovies.map((movie) => {
                const showtimeCount = movie.showtimes?.length || 0;
                const posterUrl = movie.posterUrl || "https://via.placeholder.com/400x600?text=No+Image";

                return (
                  <div key={movie._id} className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300">
                    <div className="relative group">
                      <img src={posterUrl} alt={movie.title} className="w-full h-96 object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <div>
                          <p className="text-3xl font-bold mb-2">{movie.title}</p>
                          <p className="text-gray-300">{movie.genre}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 line-clamp-1">{movie.title}</h3>
                      <div className="space-y-3 mb-6 text-gray-300">
                        <div className="flex items-center gap-3"><Calendar className="w-5 h-5" /><span>{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "TBA"}</span></div>
                        <div className="flex items-center gap-3"><Clock className="w-5 h-5" /><span>{movie.duration || "N/A"}</span></div>
                        <div className="flex items-center gap-3"><Users className="w-5 h-5" /><span>{showtimeCount} showtimes</span></div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(movie)}
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                          <Edit3 className="w-5 h-5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(movie._id)}
                          disabled={deletingId === movie._id}
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-600/50 hover:bg-red-600 rounded-2xl font-bold transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-5 h-5" />
                          {deletingId === movie._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/admin" className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl hover:bg-white/20 transition-all duration-300 text-xl font-medium shadow-xl">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingMovie && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Edit Movie
                </h2>
                <button onClick={closeEditModal} className="text-gray-400 hover:text-white text-3xl">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Movie Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 text-xl"
                />
                <input
                  type="url"
                  placeholder="Poster URL"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  className="w-full px-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />
                <input
                  type="text"
                  placeholder="Genre (e.g., Action, Sci-Fi)"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2h 28min)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  className="w-full px-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>

              <textarea
                placeholder="Movie description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full mt-6 p-6 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 resize-none"
              />

              <div className="mt-6">
                <label className="text-lg font-medium mb-3 block">Showtimes (one per line)</label>
                <textarea
                  value={formData.showtimesInput}
                  onChange={(e) => setFormData({ ...formData, showtimesInput: e.target.value })}
                  placeholder="2025-04-15: 10:00 AM, 1:30 PM, 7:30 PM&#10;2025-04-16: 11:00 AM, 3:00 PM"
                  rows="5"
                  className="w-full p-5 bg-white/10 border border-white/30 rounded-2xl text-white font-mono text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/50 resize-none"
                />
                <p className="text-sm text-gray-400 mt-2">Format: YYYY-MM-DD: time, time</p>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Save className="w-7 h-7" />
                  Save Changes
                </button>
                <button
                  onClick={closeEditModal}
                  className="flex-1 py-5 bg-white/10 border border-white/30 text-white font-bold text-xl rounded-3xl hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMoviesPage;