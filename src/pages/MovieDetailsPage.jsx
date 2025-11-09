import React from "react";
import { useParams, Link } from "react-router-dom";
import { movies } from "../data/movies";
import { Star, Clock, Calendar, Play, Users, Film, ChevronLeft } from "lucide-react";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center p-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">Movie Not Found</h1>
          <Link
            to="/"
            className="btn btn-primary rounded-full px-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Mock showtimes
  const showtimes = ["10:00 AM", "1:30 PM", "4:45 PM", "7:30 PM", "10:15 PM"];
  const cast = [
    { name: "Chris Hemsworth", role: "Thor" },
    { name: "Natalie Portman", role: "Jane Foster" },
    { name: "Tom Hiddleston", role: "Loki" },
    { name: "Taika Waititi", role: "Director" },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalf) {
      stars.push(
        <Star key="half" className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />
      );
    }
    const empty = 5 - Math.ceil(rating);
    for (let i = 0; i < empty; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-600" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Backdrop Hero */}
      <div
        className="relative h-screen flex items-end pb-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${movie.posterUrl})`,
        }}
      >
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-10 items-end">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-64 lg:w-80 rounded-2xl shadow-2xl border-4 border-white/20 transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Play className="w-16 h-16 text-white opacity-80" />
              </div>
            </div>
          </div>

          {/* Info Card (Glassmorphism) */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/20 max-w-3xl">
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Movies
            </Link>

            <h1 className="text-4xl lg:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movie.releaseDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.duration}
              </span>
              <span className="badge badge-outline border-pink-400 text-pink-400">
                {movie.format || "2D"}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {renderStars(movie.rating || 8.7)}
              <span className="ml-2 text-lg font-semibold">{movie.rating || 8.7}/10</span>
            </div>

            <p className="text-lg text-gray-200 leading-relaxed mb-8 max-w-2xl">
              {movie.description}
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Film className="w-5 h-5 text-pink-400" />
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.split(", ").map((g, i) => (
                    <span
                      key={i}
                      className="px-4 py-1 bg-purple-600/30 backdrop-blur-sm rounded-full text-sm border border-purple-400"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Showtimes */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Available Showtimes</h3>
                <div className="flex flex-wrap gap-3">
                  {showtimes.map((time, i) => (
                    <Link
                      key={i}
                      to={`/booking/${movie.id}`}
                      className="px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {time}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to={`/booking/${movie.id}`}
                  className="btn btn-lg rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Book Tickets Now
                </Link>
                <button className="btn btn-outline btn-lg rounded-full border-white text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <section className="py-20 px-6 bg-black/50">
        <div className="container mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Cast & Crew
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cast.map((person, i) => (
              <div
                key={i}
                className="text-center group cursor-pointer"
              >
                <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                    <Users className="w-10 h-10 text-gray-500" />
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
    </div>
  );
};

export default MovieDetailsPage;