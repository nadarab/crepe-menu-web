import { useState, useEffect } from 'react';
import { getAllRatings, deleteRating, getRatingStats } from '../../services/firebase/ratings';
import type { Rating } from '../../types/rating';

const Ratings = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    average: number;
    breakdown: { [key: number]: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRatings = async () => {
    try {
      setLoading(true);
      setError('');
      const [ratingsData, statsData] = await Promise.all([
        getAllRatings(),
        getRatingStats(),
      ]);
      setRatings(ratingsData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load ratings');
      console.error('Error loading ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings();
  }, []);

  const handleDelete = async (ratingId: string) => {
    if (!confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      setDeletingId(ratingId);
      await deleteRating(ratingId);
      await loadRatings(); // Reload data
    } catch (err) {
      alert('Failed to delete rating');
      console.error('Error deleting rating:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-5 h-5"
            fill={star <= rating ? '#FBBF24' : '#E5E7EB'}
            stroke={star <= rating ? '#FBBF24' : '#D1D5DB'}
            strokeWidth="1"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-xl">Loading ratings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Ratings</h1>
        <p className="text-gray-600">View and manage customer feedback</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Ratings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Ratings</h3>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Average Rating</h3>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-gray-900">
                {stats.average.toFixed(1)}
              </p>
              <div className="flex flex-col">
                {renderStars(Math.round(stats.average))}
                <span className="text-xs text-gray-500 mt-1">out of 5</span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-3">Rating Breakdown</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: stats.total > 0
                          ? `${(stats.breakdown[star] / stats.total) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {stats.breakdown[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ratings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Ratings</h2>
        </div>

        {ratings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <p className="text-lg">No ratings yet</p>
            <p className="text-sm mt-1">Ratings will appear here once customers submit them</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {ratings.map((rating) => (
              <div key={rating.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Rating Stars and Date */}
                    <div className="flex items-center gap-4 mb-3">
                      {renderStars(rating.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(rating.createdAt)}
                      </span>
                    </div>

                    {/* Feedback */}
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {rating.feedback}
                    </p>

                    {/* User Agent (optional info) */}
                    {rating.userAgent && (
                      <details className="mt-3">
                        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                          Technical Details
                        </summary>
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          {rating.userAgent}
                        </p>
                      </details>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(rating.id)}
                    disabled={deletingId === rating.id}
                    className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete rating"
                  >
                    {deletingId === rating.id ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
