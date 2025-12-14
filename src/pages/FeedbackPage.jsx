import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FeedbackList from '../components/FeedbackList';
import FeedbackForm from '../components/FeedbackForm';
import { getMovieById } from '../services/api';
import { useEffect } from 'react';

const FeedbackPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmitted = () => {
    // trigger list refresh
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-16 px-6 mt-16">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to={`/movie/${id}`} className="text-sm text-gray-300 hover:text-white">Back to Movie</Link>
          <h1 className="text-3xl font-bold">Reviews for {movie?.title || 'Movie'}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeedbackList movieId={id} refreshSignal={refreshKey} />
          </div>
          <div>
            <FeedbackForm movieId={id} onSubmitted={handleSubmitted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
