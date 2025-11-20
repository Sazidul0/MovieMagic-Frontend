import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllMovies } from "../services/api"; // Your API function
import { Star, Search, Filter, Calendar, Clock, Film } from "lucide-react";

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Safe genre parsing (handles string or missing)
  const primaryGenre = movie.genre?.split(",")[0]?.trim() || "Unknown";

  // Genre-based gradient
  const genreColors = {
    Action: "from-red-500 to-orange-600",
    Comedy: "from-yellow-400 to-amber-500",
    Drama: "from-purple-500 to-pink-600",
    SciFi: "from-cyan-400 to-blue-600",
    "Sci-Fi": "from-cyan-400 to-blue-600",
    Horror: "from-gray-700 to-black",
    Romance: "from-pink-400 to-rose-500",
    Thriller: "from-indigo-600 to-purple-700",
    default: "from-gray-600 to-gray-800",
  };
  const gradient = genreColors[primaryGenre] || genreColors.default;

  // SAFE STAR RENDERING
  const renderStars = (rating) => {
    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      return <span className="text-xs text-gray-500">N/A</span>;
    }

    const full = Math.floor(numRating / 2); // assuming rating is out of 10 → convert to 5 stars
    const hasHalf = (numRating / 2) - full >= 0.5;
    const empty = 5 - Math.ceil(numRating / 2);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalf && (
          <Star className="w-4 h-4 fill-yellow-400/50 bg-yellow-400/50 text-yellow-400" />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />
        ))}
      </div>
    );
  };

  const displayRating = () => {
    const r = parseFloat(movie.rating);
    return isNaN(r) ? "-" : r.toFixed(1);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie._id || movie.id}`} className="block">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl || "https://via.placeholder.com/400x600?text=No+Image"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

          {/* Genre Badge */}
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient} shadow-lg`}
          >
            {primaryGenre}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            {renderStars(movie.rating)}
            <span className="ml-1 font-semibold">{displayRating()}</span>
          </div>

          {/* Hover Info Panel */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                {movie.description || "No description available."}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {movie.releaseDate?.split("T")[0] || "TBA"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {movie.duration || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-lg font-bold text-white line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{movie.duration || "N/A"}</span>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">{displayRating()}</span>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-1000 ${
            isHovered ? "translate-x-full" : ""
          }`}
        ></div>
      </Link>
    </div>
  );
};

const AllMoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getAllMovies();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Extract unique genres safely
  const genres = useMemo(() => {
    if (!Array.isArray(movies) || movies.length === 0) return ["All"];
    const genreList = movies
      .flatMap((m) =>
        m.genre
          ? m.genre.split(",").map((g) => g.trim())
          : []
      )
      .filter(Boolean);
    return ["All", ...new Set(genreList)].sort();
  }, [movies]);

  // Filter movies based on search and genre
  const filteredMovies = useMemo(() => {
    if (!Array.isArray(movies)) return [];

    return movies.filter((movie) => {
      const matchesSearch = movie.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" ||
        movie.genre?.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchTerm, selectedGenre]);

  // Loading State
  if (loading) {
    return (
      <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-4">Oops! Something went wrong</p>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
            All Movies
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover the latest blockbusters, hidden gems, and timeless classics in one place.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-10 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="pl-12 pr-10 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                {genres.map((g) => (
                  <option key={g} value={g} className="bg-gray-800 text-white">
                    {g}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-300">
            Showing <span className="font-bold text-white">{filteredMovies.length}</span> of{" "}
            <span className="font-bold text-white">{movies.length}</span> movies
          </div>
        </div>

        {/* Movie Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Film className="w-20 h-20 mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">No movies found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedGenre("All");
              }}
              className="mt-4 text-purple-400 hover:text-purple-300 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMoviePage;