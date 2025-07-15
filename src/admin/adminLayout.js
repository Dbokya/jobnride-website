import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CarFront,
  Briefcase,
  FileWarning,
  Settings,
  LifeBuoy,
  LogOut,
  Power
} from "lucide-react";
import "./admin.css";
import useInactivityLogout from "./useInactivityLogout";
import { auth } from "../firebase";

function AdminLayout() {
  const navigate = useNavigate();
  // Check if the user is authenticated and redirect if not 
  useInactivityLogout();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/admin/login');
    });
  };
  // Navigation items for the admin sidebar
  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/rides", label: "Rides", icon: CarFront },
    { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { to: "/admin/reports", label: "Reports", icon: FileWarning },
    { to: "/admin/settings", label: "Settings", icon: Settings },
    { to: "/admin/support", label: "Support", icon: LifeBuoy }
  ];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="admin-title">🚀 JobNRide Admin</h2>
        <nav className="admin-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-link ${isActive ? "active-link" : ""}`
              }
            >
              <Icon className="admin-icon" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <Power className="logout-icon" />
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
