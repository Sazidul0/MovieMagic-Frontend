import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Navbar />  {/* Navbar now auto-updates */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};


export default AdminLayout;