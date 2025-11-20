// The base URL of your backend API
const API_BASE_URL = 'http://localhost:5000/api';

// A helper function to handle API requests and responses
const request = async (url, options = {}) => {
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
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
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

/* ----------------------------- BOOKING SERVICES ----------------------------- */
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
