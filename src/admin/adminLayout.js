import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./admin.css"; // Reuse user CSS or create custom styles

function AdminLayout() {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/rides">Rides</NavLink>
          <NavLink to="/admin/jobs">Jobs</NavLink>
          <NavLink to="/admin/reports">Reports</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
          <NavLink to="/admin/support">Support</NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;