import React from "react";
import { Navigate, Link } from "react-router-dom";
import { bookings } from "../data/booking";

const MyBookingsPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Filter bookings for current user
  const userBookings = bookings.filter((b) => b.userId === user.id);

  return (
    <div className="mt-16 min-h-screen bg-base-200 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-10">My Bookings</h1>

        {userBookings.length > 0 ? (
          <div className="space-y-6">
            {userBookings.map((booking) => (
              <div
                key={booking.id}
                className="card lg:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                {/* Poster */}
                <figure className="lg:w-64">
                  <img
                    src={booking.posterUrl}
                    alt={booking.movieTitle}
                    className="h-64 lg:h-full w-full object-cover rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none"
                  />
                </figure>

                {/* Details */}
                <div className="card-body">
                  <h2 className="card-title text-2xl">{booking.movieTitle}</h2>
                  <div className="space-y-2 text-base-content/80">
                    <p>
                      <strong>Date:</strong> {booking.bookingDate}
                    </p>
                    <p>
                      <strong>Showtime:</strong> {booking.showtime}
                    </p>
                    <p>
                      <strong>Seats:</strong> {booking.seats.join(", ")}
                    </p>
                    <p>
                      <strong>Total Paid:</strong> ${booking.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-error btn-sm">Cancel</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-base-300 rounded-full mb-4">
              <svg className="w-10 h-10 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 110 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 110-4V7a2 2 0 012-2z" />
              </svg>
            </div>
            <p className="text-xl text-base-content/70 mb-4">
              You haven't booked any movies yet.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;