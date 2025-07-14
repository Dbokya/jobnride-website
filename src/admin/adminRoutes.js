// src/admin/adminRoutes.js
import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AdminLayout from "./adminLayout";
import AdminLogin from "./pages/adminLogin";
import Dashboard from "./pages/dashboard";
import UserManagement from "./pages/userManagement";
import RideManagement from "./pages/rideManagement";
import JobsManagement from "./pages/jobsManagement";
import ReportsAndAnalytics from "./pages/reportsAndAnalytics";
import Settings from "./pages/settings";
import SupportAndFeedback from "./pages/supportAndFeedback";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

function AdminRoutes() {
  return useRoutes([
    { path: "login", element: <AdminLogin /> },
    {
      path: "",
      element: <ProtectedAdminRoute />, // Protect all child routes
      children: [
        {
          path: "",
          element: <AdminLayout />,
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "users", element: <UserManagement /> },
            { path: "rides", element: <RideManagement /> },
            { path: "jobs", element: <JobsManagement /> },
            { path: "reports", element: <ReportsAndAnalytics /> },
            { path: "settings", element: <Settings /> },
            { path: "support", element: <SupportAndFeedback /> },
            { index: true, element: <Navigate to="dashboard" /> },
          ],
        }
      ],
    },
    {
        path: "/admin",
        element: <Navigate to="/admin/login" />
      }
  ]);
}

export default AdminRoutes;
