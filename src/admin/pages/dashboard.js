import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
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
      const [uSnap, rSnap, jSnap, transSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "rides")),
        getDocs(collection(db, "jobs")),
        getDocs(collection(db, "transactions")),
      ]);
      console.log("Users:", uSnap.size);
      console.log("Rides:", rSnap.size);
      console.log("Jobs:", jSnap.size);
      console.log("Transactions:", transSnap.docs.map(doc => doc.data()));
      const now = new Date();
      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let todayRevenue = 0;
      let weekRevenue = 0;
      let monthRevenue = 0;

      const dailyData = {};

      transSnap.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const amount = parseFloat(data.amount || 0);

        if (createdAt >= startOfToday) todayRevenue += amount;
        if (createdAt >= startOfWeek) weekRevenue += amount;
        if (createdAt >= startOfMonth) monthRevenue += amount;

        const day = createdAt.toLocaleDateString("en-US", { weekday: "short" });
        if (!dailyData[day]) {
          dailyData[day] = { revenue: 0 };
        }
        dailyData[day].revenue += amount;
      });

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
        <div className="stat-card bg-white border shadow-sm">
          <div className="stat-header">
            <p>Total Users</p>
            <Users className="stat-icon bg-blue-100 text-blue-600" />
          </div>
          <h3>{stats.users}</h3>
          <span className="stat-growth text-green-500">+12%</span>
        </div>

        <div className="stat-card bg-white border shadow-sm">
          <div className="stat-header">
            <p>Active Jobs</p>
            <Briefcase className="stat-icon bg-green-100 text-green-600" />
          </div>
          <h3>{stats.jobs}</h3>
          <span className="stat-growth text-green-500">+8%</span>
        </div>

        <div className="stat-card bg-white border shadow-sm">
          <div className="stat-header">
            <p>Total Rides</p>
            <Car className="stat-icon bg-purple-100 text-purple-600" />
          </div>
          <h3>{stats.rides}</h3>
          <span className="stat-growth text-green-500">+15%</span>
        </div>

        <div className="stat-card bg-white border shadow-sm">
          <div className="stat-header">
            <p>Monthly Revenue</p>
            <ChartIcon className="stat-icon bg-orange-100 text-orange-600" />
          </div>
          <h3>₹{stats.monthRevenue.toLocaleString()}</h3>
          <span className="stat-growth text-green-500">+22%</span>
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
        <ul>
          <li className="activity success">New user registered (2 mins ago)</li>
          <li className="activity info">New ride posted (5 mins ago)</li>
          <li className="activity warning">Job application submitted</li>
        </ul>
      </div>
    </div>
  );
}
