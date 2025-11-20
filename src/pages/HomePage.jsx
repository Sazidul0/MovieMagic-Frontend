// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllMovies } from "../services/api";
import { Star, Calendar, Clock, Film, Loader2 } from "lucide-react";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getAllMovies();
        const validMovies = Array.isArray(data) ? data : [];
        setMovies(validMovies);
      } catch (err) {
        setError("Failed to load movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Take first 8 movies (or less if fewer exist)
  const featuredMovies = movies.slice(0, 4);
  const nowShowing = movies.slice(0, 8);

  // Use first movie as hero background (or fallback)
  const heroMovie = movies[0] || {
    title: "Welcome to MovieMagic",
    posterUrl: "https://images.unsplash.com/photo-1489599462982-7bb5f3df2c3c?w=1920&h=1080&fit=crop"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-6" />
          <p className="text-2xl text-gray-300">Loading the latest blockbusters...</p>
        </div>
      </div>
    );
  }

  if (error || movies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Film className="w-24 h-24 text-gray-600 mx-auto mb-6 opacity-50" />
          <p className="text-3xl font-bold text-gray-400 mb-4">No movies available</p>
          <p className="text-gray-500">Check back soon for upcoming releases!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Hero Banner */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.4)), url(${heroMovie.posterUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 drop-shadow-2xl animate-pulse">
            MovieMagic
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the magic of cinema — where stories come alive and dreams become reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/movies"
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 flex items-center gap-3 justify-center"
            >
              <Calendar className="w-6 h-6" />
              Browse All Movies
            </Link>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 180" className="w-full h-40 text-gray-900">
            <path
              fill="currentColor"
              d="M0,60 C320,140 1120,20 1440,80 L1440,180 L0,180 Z"
            />
          </svg>
        </div>
      </section>

      {/* Featured This Week - Carousel */}
      {featuredMovies.length > 0 && (
        <section className="py-24 px-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              Featured This Week
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredMovies.map((movie) => (
                <Link
                  key={movie._id}
                  to={`/movie/${movie._id}`}
                  className="group relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                >
                  <div className="relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-96 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-6 group-hover:translate-y-0">
                      <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
                      <p className="text-gray-300 mb-3">{movie.genre}</p>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{movie.rating || "8.8"}</span>
                        <span className="text-sm text-gray-400 ml-2">• {movie.showtimes?.length || 0} showtimes</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-yellow-400 font-bold text-sm">
                      Featured
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Now Showing Grid */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            Now Showing
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {nowShowing.map((movie) => (
              <Link
                key={movie._id}
                to={`/movie/${movie._id}`}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-yellow-400 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {movie.rating || "8.5"}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-purple-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    {movie.format || "2D"}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{movie.genre}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {movie.duration || "2h 30m"}
                    </span>
                    <span className="text-cyan-400 font-medium">
                      {movie.showtimes?.length || 0} shows
                    </span>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/movies"
              className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300"
            >
              View All Movies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;