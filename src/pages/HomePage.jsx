import React from 'react';
import { Link } from 'react-router-dom';
import { movies } from '../data/movies';
import { Star, Calendar, Clock } from 'lucide-react';

const HomePage = () => {
  const featuredMovies = movies.slice(0, 4);
  const nowShowing = movies.slice(0, 8); // Show more in grid

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Banner Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url(${movies[4].posterUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500 drop-shadow-lg">
            MovieMagic
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Experience cinema like never before. Book your seats for the latest blockbusters, indie gems, and timeless classics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/movies"
              className="btn btn-lg btn-primary rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Browse Movies
            </Link>
            {/* <Link
              to="/now-showing"
              className="btn btn-lg btn-outline border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Now Showing
            </Link> */}
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-32 text-gray-900">
            <path
              fill="currentColor"
              d="M0,0 C360,100 1080,20 1440,0 V120 H0 Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Featured This Week
          </h2>

          <div className="carousel carousel-center w-full space-x-6 p-4 rounded-2xl bg-black bg-opacity-30 backdrop-blur-md">
            {featuredMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="carousel-item relative group overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-80 h-96 object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                    <p className="text-sm opacity-90">{movie.genre}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{movie.rating || '8.5'}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Now Showing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {nowShowing.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <Link to={`/movie/${movie.id}`}>
                  <div className="relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {movie.rating || '8.5'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{movie.genre}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {movie.duration || '2h 15m'}
                      </span>
                      <span className="badge badge-sm badge-outline border-cyan-400 text-cyan-400">
                        {movie.format || '2D'}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/movies"
              className="btn btn-outline btn-lg rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
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