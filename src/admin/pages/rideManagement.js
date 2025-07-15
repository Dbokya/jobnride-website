import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Search, MapPin, Clock, Users, Car, Bike } from 'lucide-react';
import "../admin.css";

export default function RideManagement() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rides"), (snap) => {
      setRides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const removeRide = async (r) => {
    await deleteDoc(doc(db, "rides", r.id));
  };

  // Filtered list
  const filteredRides = rides.filter((r) => {
    const matchesSearch =
      r.ridegiveruser?.toLowerCase().includes(search.toLowerCase()) ||
      r.startLocation?.toLowerCase().includes(search.toLowerCase()) ||
      r.endLocation?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "All" || r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ride-management">
      <div className="ride-header-header">
        <h2 className="section-title">Ride Management</h2>
        <p className="ride-count"><h3>Total Users: {rides.length}</h3></p>
      </div>

      {/* ROW 2: Search and Filter */}
      <div className="ride-filters">
        <input
          type="text"
          placeholder="Search rides..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All Rides</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* ROW 3: Table */}
      <div className="table-container">
        {filteredRides.length === 0 ? (
          <p className="no-data">No rides match your search.</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Driver</th>
                <th>Schedule</th>
                <th>Vehicle</th>
                <th>Seats</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRides.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.startLocation} → {r.endLocation}
                  </td>
                  <td>{r.ridegiveruser || "-"}</td>
                  <td>
                    {r.date} {r.time}
                  </td>
                  <td>{r.ridetype || "-"}</td>
                  <td>{r.availableSeats || 0} available</td>
                  <td>₹{r.amount} / seat</td>
                  <td>
                    <span className={`status-badge ${r.status?.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-reject"
                      onClick={() => removeRide(r)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
