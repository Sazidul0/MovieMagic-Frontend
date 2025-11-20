// src/pages/admin/AddMoviePage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addMovie } from "../../services/api";
import { Film, Image, Clock, Calendar, Tag, Star, AlertCircle, CheckCircle, Upload } from "lucide-react";

const AddMoviePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    posterUrl: "",
    genre: "",
    rating: "",
    duration: "",
    releaseDate: "",
    showtimesInput: "2025-04-15: 10:00 AM, 1:30 PM, 7:30 PM\n2025-04-16: 11:00 AM, 3:00 PM, 9:00 PM", // Example
    format: "2D",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Convert user input into correct showtimes format for backend
  const parseShowtimes = (input) => {
    const showtimes = [];
    const lines = input.trim().split("\n");

    for (const line of lines) {
      const [datePart, timesPart] = line.split(":");
      if (!datePart || !timesPart) continue;

      const date = datePart.trim();
      const times = timesPart.split(",").map(t => t.trim()).filter(Boolean);

      for (const time of times) {
        if (time) {
          showtimes.push({ date, time });
        }
      }
    }

    return showtimes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const showtimes = parseShowtimes(formData.showtimesInput);

      if (showtimes.length === 0) {
        throw new Error("Please enter at least one showtime in format: YYYY-MM-DD: time, time");
      }

      const movieData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        posterUrl: formData.posterUrl.trim(),
        genre: formData.genre.trim(),
        rating: parseFloat(formData.rating) || 0,
        duration: formData.duration.trim(),
        releaseDate: formData.releaseDate,
        format: formData.format,
        showtimes, // ← This is now CORRECT for your new backend!
      };

      await addMovie(movieData);

      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1800);
    } catch (err) {
      setError(err.message || "Failed to add movie. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-12 px-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
              Add New Movie
            </h1>
            <p className="text-xl text-gray-300">Launch the next blockbuster in your cinema</p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-green-500/20 border border-green-500/50 rounded-3xl flex items-center gap-4 text-green-300 animate-pulse">
            <CheckCircle className="w-10 h-10 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold">Movie Added Successfully!</p>
              <p className="text-lg">Taking you back to the dashboard...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-500/20 border border-red-500/50 rounded-3xl flex items-center gap-4 text-red-300">
            <AlertCircle className="w-10 h-10 flex-shrink-0" />
            <div>
              <p className="text-xl font-bold">Error Adding Movie</p>
              <p className="text-lg">{error}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="relative">
              <Film className="absolute left-4 top-6 w-6 h-6 text-purple-400" />
              <input
                type="text"
                name="title"
                placeholder="Movie Title (e.g., Avengers: Endgame)"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full pl-14 pr-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all text-xl font-semibold"
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                placeholder="Enter a captivating movie description..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-6 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all resize-none"
              />
            </div>

            {/* Poster URL */}
            <div className="relative">
              <Image className="absolute left-4 top-6 w-6 h-6 text-pink-400" />
              <input
                type="url"
                name="posterUrl"
                placeholder="https://image.tmdb.org/t/p/w500/..."
                value={formData.posterUrl}
                onChange={handleChange}
                required
                className="w-full pl-14 pr-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Tag className="absolute left-4 top-6 w-6 h-6 text-cyan-400" />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre (e.g., Action, Sci-Fi, Drama)"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative">
                <Star className="absolute left-4 top-6 w-6 h-6 text-yellow-400" />
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="Rating (e.g., 8.7)"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative">
                <Clock className="absolute left-4 top-6 w-6 h-6 text-green-400" />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., 2h 28min)"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-6 w-6 h-6 text-blue-400" />
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/10 border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            {/* Showtimes - NEW SMART INPUT */}
            <div>
              <label className="text-lg font-medium mb-3 block flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Showtimes (One date per line)
              </label>
              <textarea
                name="showtimesInput"
                value={formData.showtimesInput}
                onChange={handleChange}
                placeholder="2025-04-15: 10:00 AM, 1:30 PM, 7:30 PM&#10;2025-04-16: 11:00 AM, 3:00 PM, 9:00 PM"
                rows="5"
                required
                className="w-full p-5 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all resize-none"
              />
              <p className="text-sm text-gray-400 mt-2">Format: YYYY-MM-DD: time, time → One line per date</p>
            </div>

            {/* Format */}
            <div>
              <label className="text-lg font-medium mb-4 block">Screening Format</label>
              <div className="flex flex-wrap gap-6">
                {["2D", "3D", "IMAX", "4DX"].map(format => (
                  <label key={format} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={format}
                      checked={formData.format === format}
                      onChange={handleChange}
                      className="radio radio-lg radio-primary"
                    />
                    <span className="text-xl font-medium">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-4"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-lg"></span>
                    Adding Movie...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-8 h-8" />
                    Movie Added Successfully!
                  </>
                ) : (
                  <>
                    <Upload className="w-7 h-7" />
                    Launch This Blockbuster
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMoviePage;