import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Users, Briefcase, Car, LineChart as ChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "../admin.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    rides: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    chartData: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [uSnap, rSnap, jSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "rides")),
        getDocs(collection(db, "jobs")),
      ]);

      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let todayRevenue = 0;
      let weekRevenue = 0;
      let monthRevenue = 0;

      const dailyData = {};

      const chartData = Object.entries(dailyData).map(([day, values]) => ({
        day,
        revenue: values.revenue,
      }));

      setStats({
        users: uSnap.size,
        jobs: jSnap.size,
        rides: rSnap.size,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        chartData,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="stats-cards">
        <div className="stat-card shadow">
          <div className="stat-header">
            <p>Total Users</p>
            <Users className="stat-icon icon-blue" />
          </div>
          <h3>{stats.users}</h3>
        </div>

        <div className="stat-card shadow">
          <div className="stat-header">
            <p>Active Jobs</p>
            <Briefcase className="stat-icon icon-green" />
          </div>
          <h3>{stats.jobs}</h3>
        </div>

        <div className="stat-card shadow">
          <div className="stat-header">
            <p>Total Rides</p>
            <Car className="stat-icon icon-purple" />
          </div>
          <h3>{stats.rides}</h3>
          
        </div>

        <div className="stat-card shadow">
          <div className="stat-header">
            <p>Monthly Revenue</p>
            <ChartIcon className="stat-icon icon-orange" />
          </div>
          <h3>₹{stats.monthRevenue.toLocaleString()}</h3>
        </div>
      </div>

      <div className="dashboard-graph-row">
        <div className="chart-card">
          <h3>Weekly Revenue Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#a855f7" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="revenue-overview-card">
          <h3>Revenue Overview</h3>
          <div className="revenue-item">Today: ₹{stats.todayRevenue}</div>
          <div className="revenue-item">This Week: ₹{stats.weekRevenue}</div>
          <div className="revenue-item highlight">
            This Month: ₹{stats.monthRevenue}
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>

        <div className="activity-item success">
          <div className="activity-message">New user registered</div>
          <div className="activity-time">2 mins ago</div>
        </div>

        <div className="activity-item info">
          <div className="activity-message">New ride posted</div>
          <div className="activity-time">5 mins ago</div>
        </div>

        <div className="activity-item warning">
          <div className="activity-message">Job application submitted</div>
          <div className="activity-time">Just now</div>
        </div>
      </div>
    </div>
  );
}
