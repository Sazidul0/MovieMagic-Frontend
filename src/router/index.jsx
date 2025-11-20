import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import HomePage from '../pages/HomePage';
import MovieDetailsPage from '../pages/MovieDetailsPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import BookingPage from '../pages/BookingPage';
import AllMoviePage from '../pages/AllMoviePage';

// User-specific pages
import MyProfilePage from '../pages/MyProfilePage'; // New
import MyBookingsPage from '../pages/MyBookingsPage'; // New

// Admin Pages
import DashboardPage from '../pages/admin/DashboardPage';
import AddMoviePage from '../pages/admin/AddMoviePage';

// Utility Page
import NotFoundPage from '../components/common/NotFoundPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminMoviesPage from '../pages/admin/AdminMoviesPage';
import AdminBookingsPage from '../pages/admin/AdminBookingPage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/movies', element: <AllMoviePage /> },
      { path: '/movie/:id', element: <MovieDetailsPage /> },
      { path: '/booking/:id', element: <BookingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/profile', element: <MyProfilePage /> }, 
      { path: '/bookings', element: <MyBookingsPage /> }, 
      { path: '*', element: <NotFoundPage/> }, 
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'add-movie', element: <AddMoviePage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'movies', element: <AdminMoviesPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
    ],
  },
]);
