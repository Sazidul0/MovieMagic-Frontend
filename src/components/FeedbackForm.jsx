import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitFeedback } from '../services/api';

const FeedbackForm = ({ movieId, onSubmitted }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      // If not logged in, send user to login page
      navigate('/login');
      return;
    }

    if (!rating && !comment.trim()) {
      setError('Please provide a rating or comment.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await submitFeedback({ movieId, rating: rating || undefined, comment: comment || undefined });
      setRating(0);
      setComment('');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  // If the user isn't logged in, show a prompt to login instead of the form
  if (!user || !user.token) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="text-xl font-semibold mb-3">Leave Feedback</h4>
        <p className="text-gray-300 mb-4">You must be logged in to submit feedback.</p>
        <div className="flex gap-2">
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold">
            Login to Leave Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <h4 className="text-xl font-semibold mb-3">Leave Feedback</h4>

      {error && <div className="mb-3 text-sm text-red-300">{error}</div>}

      <div className="mb-3">
        <label className="block text-sm text-gray-300 mb-2">Rating (1-5)</label>
        <input
          type="number"
          min={0}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-24 px-3 py-2 rounded bg-black/50 border border-white/10 text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">Comment</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-white"
          placeholder="Share your thoughts (optional)"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
