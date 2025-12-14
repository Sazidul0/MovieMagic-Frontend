// The base URL of your backend API
const API_BASE_URL = 'http://localhost:5000/api';

// A helper function to handle API requests and responses
const request = async (url, options = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (user && user.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Better error handling for network errors
    if (error instanceof TypeError) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error - Backend server may not be running on http://localhost:5000');
      }
    }
    throw error;
  }
};

/* ----------------------------- USER SERVICES ----------------------------- */
export const loginUser = (credentials) => {
  return request('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = (userData) => {
  return request('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/* ----------------------------- MOVIE SERVICES ----------------------------- */
export const getAllMovies = () => request('/movies');

export const getMovieById = (id) => request(`/movies/${id}`);

/* ----------------------------- BOOKING SERVICES (OLD - Still supported) ----------------------------- */
export const getUserBookings = () => request('/bookings/mybookings');

export const createBooking = (bookingData) =>
  request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });

export const getBookedSeats = (movieId, date, time) => {
  return request(
    `/bookings/booked-seats?movieId=${movieId}&date=${encodeURIComponent(
      date
    )}&time=${encodeURIComponent(time)}`
  );
};

/* ----------------------------- CART SERVICES (NEW) ----------------------------- */
export const addToCart = (cartData) =>
  request('/cart/add', {
    method: 'POST',
    body: JSON.stringify(cartData),
  });

export const getCart = async () => {
  // Debug: Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || !user.token) {
    throw new Error('User not authenticated');
  }
  
  try {
    const response = await request('/cart');
    
    // If cart items exist but movie is just an ID, fetch the full movie details
    if (response.cart?.items?.length > 0) {
      const itemsWithStringMovieId = response.cart.items.filter(
        item => typeof item.movie === 'string'
      );
      
      if (itemsWithStringMovieId.length > 0) {
        // Fetch movie details for all items with string movie IDs
        const updatedItems = await Promise.all(
          response.cart.items.map(async (item) => {
            if (typeof item.movie === 'string') {
              try {
                const movieData = await getMovieById(item.movie);
                return {
                  ...item,
                  movie: movieData
                };
              } catch (err) {
                // Return item as-is even if movie fetch fails
                return item;
              }
            }
            // Already has movie object, return as-is
            return item;
          })
        );
        
        response.cart.items = updatedItems;
      }
    }
    
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateCartItem = (itemId, updateData) =>
  request(`/cart/update/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });

export const removeFromCart = (itemId) =>
  request(`/cart/remove/${itemId}`, {
    method: 'DELETE',
  });

export const clearCart = () =>
  request('/cart/clear', {
    method: 'DELETE',
  });

export const checkoutCart = (selectedItems) =>
  request('/cart/checkout', {
    method: 'POST',
    body: JSON.stringify({ selectedItems }),
  });

/* ----------------------------- ADMIN SERVICES ----------------------------- */

// Add a new movie (Admin)
export const addMovie = (movieData) => {
  return request('/movies', {
    method: 'POST',
    body: JSON.stringify(movieData),
  });
};

//  Update movie (Admin)
export const updateMovie = (id, movieData) => {
  return request(`/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movieData),
  });
};

// ⚠ FIXED: admin users route must match backend → `/users/admin`
export const getAllUsers = () => {
  return request('/users/admin'); 
};

// --- Calls the admin stats endpoint
export const getDashboardStats = () => request('/admin/stats');

//  Get all bookings (Admin)
export const getAllBookings = () => request('/bookings/admin');

export const deleteMovie = (movieId) => {
  return request(`/movies/${movieId}`, {
    method: 'DELETE',
  });
};

/* ----------------------------- FEEDBACK SERVICES ----------------------------- */

// Submit feedback (rating and/or comment) - protected
export const submitFeedback = (feedbackData) =>
  request('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  });

// Get all feedbacks (public)
export const getAllFeedbacks = () => request('/feedback');

// Get feedbacks for a single movie (public)
export const getFeedbacksForMovie = (movieId) => request(`/feedback/movie/${movieId}`);

// Get current user's feedbacks (protected)
export const getUserFeedbacks = () => request('/feedback/user');

// Delete feedback (admin)
export const deleteFeedback = (feedbackId) =>
  request(`/feedback/${feedbackId}`, {
    method: 'DELETE',
  });

// Get payment status (owner or admin) - protected
export const getPaymentStatus = (paymentId) => request(`/payment/${paymentId}`);

/* ----------------------------- PAYMENT (STRIPE - TEST MODE) ----------------------------- */

// Create Stripe PaymentIntent (server returns clientSecret)
export const createStripePayment = (paymentData) =>
  request('/payment/stripe/create', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });

// Verify Stripe payment (server-side check)
export const verifyStripePayment = (verifyData) =>
  request('/payment/stripe/verify', {
    method: 'POST',
    body: JSON.stringify(verifyData),
  });
