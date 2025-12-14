import React, { useEffect, useState } from 'react';
import { getFeedbacksForMovie } from '../services/api';

const FeedbackList = ({ movieId, refreshSignal }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getFeedbacksForMovie(movieId);
        // endpoint returns { success: true, feedbacks: [...] }
        setFeedbacks(data.feedbacks || []);
      } catch (err) {
        setError(err.message || 'Failed to load feedbacks');
      } finally {
        setLoading(false);
      }
    };
    if (movieId) fetch();
  }, [movieId, refreshSignal]);

  if (loading) return <p className="text-gray-400">Loading feedbacks...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  if (!feedbacks.length) return <p className="text-gray-400">No feedback yet. Be the first to leave a review!</p>;

  return (
    <div className="space-y-4">
      {feedbacks.map((f) => (
        <div key={f._id} className="bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-300 font-semibold">{f.user?.name || 'Anonymous'}</div>
            <div className="text-sm text-yellow-400 font-bold">{f.rating ?? '—'}</div>
          </div>
          <div className="text-sm text-gray-300">{f.comment || 'No comment provided.'}</div>
          <div className="text-xs text-gray-500 mt-2">{new Date(f.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
