import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { movies } from "../data/movies";
import { Star, Search, Filter, Calendar, Clock, Film } from "lucide-react";

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Safe genre parsing
  const primaryGenre = movie.genre?.split(",")[0]?.trim() || "Unknown";

  // Genre-based gradient
  const genreColors = {
    Action: "from-red-500 to-orange-600",
    Comedy: "from-yellow-400 to-amber-500",
    Drama: "from-purple-500 to-pink-600",
    SciFi: "from-cyan-400 to-blue-600",
    Horror: "from-gray-700 to-black",
    Romance: "from-pink-400 to-rose-500",
    default: "from-gray-600 to-gray-800",
  };
  const gradient = genreColors[primaryGenre] || genreColors.default;

  // SAFE STAR RENDERING — NEVER CRASHES
  const renderStars = (rating) => {
    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      return <span className="text-xs text-gray-500">N/A</span>;
    }

    const full = Math.floor(numRating);
    const hasHalf = numRating - full >= 0.5;
    const empty = 5 - Math.ceil(numRating);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalf && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
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
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                  {movie.releaseDate || "TBA"}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // SAFE GENRE LIST
  const genres = useMemo(() => {
    if (!Array.isArray(movies) || movies.length === 0) return ["All"];
    const list = movies
      .flatMap((m) => (m.genre ? m.genre.split(",").map((g) => g.trim()) : []))
      .filter(Boolean);
    return ["All", ...new Set(list)].sort();
  }, []);

  // SAFE FILTERED MOVIES
  const filteredMovies = useMemo(() => {
    if (!Array.isArray(movies)) return [];
    return movies.filter((movie) => {
      const matchesSearch = movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === "All" || movie.genre?.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [searchTerm, selectedGenre]);

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
            {/* Search */}
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

            {/* Genre Filter */}
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

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-300">
            Showing <span className="font-bold text-white">{filteredMovies.length}</span> of{" "}
            <span className="font-bold text-white">{movies.length}</span> movies
          </div>
        </div>

        {/* Movie Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Film className="w-20 h-20 mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">No movies found.</p>
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