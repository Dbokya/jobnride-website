import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0, rides: 0, jobs: 0, todayTransactions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [uSnap, rSnap, jSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'rides')),
        getDocs(collection(db, 'jobs')),
      ]);

      const today = new Date();
      today.setHours(0,0,0,0);

      const tSnap = await getDocs(query(
        collection(db, 'transactions'),
        where('createdAt', '>=', Timestamp.fromDate(today))
      ));

      setStats({
        users: uSnap.size,
        rides: rSnap.size,
        jobs: jSnap.size,
        todayTransactions: tSnap.size
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">Total Users: {stats.users}</div>
        <div className="stat-card">Total Rides: {stats.rides}</div>
        <div className="stat-card">Total Jobs: {stats.jobs}</div>
        <div className="stat-card">Today's Transactions: {stats.todayTransactions}</div>
      </div>
    </div>
  );
}