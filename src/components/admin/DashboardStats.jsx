import React from 'react';

const DashboardStats = () => {
  // Hardcoded stats
  const totalSales = 54200;
  const totalUsers = 150;
  const totalMovies = 12;

  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-title">Total Sales</div>
        <div className="stat-value">${totalSales.toLocaleString()}</div>
        <div className="stat-desc">21% more than last month</div>
      </div>
      <div className="stat">
        <div className="stat-title">Total Users</div>
        <div className="stat-value">{totalUsers}</div>
         <div className="stat-desc">↗︎ 40 (22%)</div>
      </div>
      <div className="stat">
        <div className="stat-title">Movies Showing</div>
        <div className="stat-value">{totalMovies}</div>
        <div className="stat-desc">2 added this week</div>
      </div>
    </div>
  );
};

export default DashboardStats;