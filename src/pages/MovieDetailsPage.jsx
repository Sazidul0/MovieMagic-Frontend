// src/pages/MovieDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../services/api";
import { Star, Clock, Calendar, Play, Users, Film, ChevronLeft, AlertCircle, Ticket } from "lucide-react";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieById(id);
        setMovie(data);

        // Auto-select first available date
        if (data?.showtimes?.length > 0) {
          const dates = [...new Set(data.showtimes.map(s => s.date))].sort();
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        console.error("Failed to fetch movie:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Extract unique dates and group showtimes
  const availableDates = movie?.showtimes
    ? [...new Set(movie.showtimes.map(s => s.date))].sort((a, b) => new Date(a) - new Date(b))
    : [];

  const showtimesForDate = movie?.showtimes
    ? movie.showtimes
        .filter(s => s.date === selectedDate)
        .map(s => s.time)
        .sort()
    : [];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-purple-500 mx-auto mb-6"></div>
          <p className="text-2xl text-gray-300">Loading movie details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-xl text-gray-300 mb-8">{error || "This movie doesn't exist."}</p>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white hover:shadow-2xl transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 8.5;
    const full = Math.floor(numRating / 2);
    const hasHalf = numRating % 2 >= 1;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: full }, (_, i) => (
          <Star key={`full-${i}`} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalf && <Star className="w-6 h-6 fill-yellow-400/50 text-yellow-400" />}
        {Array.from({ length: empty }, (_, i) => (
          <Star key={`empty-${i}`} className="w-6 h-6 text-gray-600" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Hero Backdrop */}
      <div
        className="relative h-screen flex items-end pb-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.9) 100%), url(${movie.posterUrl || "https://via.placeholder.com/1920x1080"})`,
        }}
      >
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-10 items-end">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={movie.posterUrl || "https://via.placeholder.com/400x600?text=No+Image"}
                alt={movie.title}
                className="w-64 lg:w-80 rounded-2xl shadow-2xl border-4 border-white/20 transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Play className="w-20 h-20 text-white opacity-90" />
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/20 max-w-3xl">
            <Link to="/movies" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" /> Back to Movies
            </Link>

            <h1 className="text-4xl lg:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "TBA"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.duration || "N/A"}
              </span>
              <span className="badge badge-outline border-pink-400 text-pink-400">
                {movie.format || "2D"}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              {renderStars(movie.rating || 8.5)}
              <span className="text-2xl font-bold">{(movie.rating || 8.5).toFixed(1)}/10</span>
            </div>

            <p className="text-lg text-gray-200 leading-relaxed mb-8 max-w-2xl">
              {movie.description || "No description available."}
            </p>

            {/* Genre */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Film className="w-5 h-5 text-pink-400" /> Genre
              </h3>
              <div className="flex flex-wrap gap-3">
                {(movie.genre || "Action, Adventure").split(",").map((g, i) => (
                  <span key={i} className="px-4 py-2 bg-purple-600/40 backdrop-blur-sm rounded-full text-sm border border-purple-400 font-medium">
                    {g.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Showtimes Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Ticket className="w-7 h-7 text-cyan-400" />
                Available Showtimes
              </h3>

              {availableDates.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
                  <p className="text-xl text-gray-400">No showtimes available yet</p>
                  <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
                </div>
              ) : (
                <>
                  {/* Date Tabs */}
                  <div className="flex flex-wrap gap-3">
                    {availableDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${
                          selectedDate === date
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {formatDate(date)}
                      </button>
                    ))}
                  </div>

                  {/* Time Buttons */}
                  <div className="flex flex-wrap gap-4">
                    {showtimesForDate.length > 0 ? (
                      showtimesForDate.map(time => (
                        <Link
                          key={time}
                          to={`/booking/${movie._id}?date=${selectedDate}&time=${encodeURIComponent(time)}`}
                          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
                        >
                          <Clock className="w-5 h-5" />
                          {time}
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400">No showtimes for this date</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to={`/booking/${movie._id}`}
                className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 text-center flex items-center justify-center gap-3"
              >
                <Ticket className="w-7 h-7" />
                Book Tickets Now
              </Link>
              <button className="flex-1 py-5 bg-white/10 border border-white/30 text-white font-bold text-xl rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3">
                <Play className="w-7 h-7" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section (Optional) */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="py-20 px-6 bg-black/60">
          <div className="container mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              Cast & Crew
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {movie.cast.map((person, i) => (
                <div key={i} className="text-center group">
                  <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gray-800 border-4 border-dashed border-gray-700 flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {person.name}
                  </h4>
                  <p className="text-sm text-gray-400">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetailsPage;