import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Search, MapPin, Clock, Users, Car, Bike, Delete } from "lucide-react";
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

  const filteredRides = rides.filter((r) => {
    const matchesSearch =
      r.ridegiveruser?.toLowerCase().includes(search.toLowerCase()) ||
      r.startLocation?.toLowerCase().includes(search.toLowerCase()) ||
      r.endLocation?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      r.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ride-container">
      <div className="ride-header">
        <h1 className="ride-title">Ride Management</h1>
        <div className="ride-count"><h3>Total Rides: {rides.length}</h3></div>
      </div>

      <div className="search-filter-box">
        <div className="search-wrapper">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Search rides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-select"
        >
          <option value="All">All Rides</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-wrapper">
        {filteredRides.length === 0 ? (
          <div className="no-data">No rides found matching your criteria.</div>
        ) : (
          <table className="ride-table">
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
              {filteredRides.map((ride) => {
                const VehicleIcon =
                  ride.ridetype?.trim().toLowerCase() === "car" ? Car : Bike;

                return (
                  <tr key={ride.id}>
                    <td>
                      <div className="route-cell">
                        <MapPin className="icon-small" />
                        <div>
                          <div className="bold-text">{ride.startLocation}</div>
                          <div className="light-text">
                            to {ride.endLocation}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="driver-cell">
                        <div className="avatar">
                          {ride.ridegiveruser?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="bold-text">
                          {ride.ridegiveruser || "Unknown"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-cell">
                        <Clock className="icon-small" />
                        <div>
                          <div>{ride.date}</div>
                          <div className="light-text">{ride.time}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="vehicle-cell">
                        <VehicleIcon className="icon-small" />
                        <span>{ride.ridetype}</span>
                      </div>
                    </td>
                    <td>
                      <div className="seat-cell">
                        <Users className="icon-small" />
                        <div>
                          <div>{ride.seats || 0} available</div>
                          <div className="light-text">
                            {ride.bookings || 0} booked
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      ₹{ride.amount}
                      <div className="light-text">per seat</div>
                    </td>
                    <td>
                      <span className={`status-badge ${ride.status?.toLowerCase()}`}>
                        {ride.status?.charAt(0).toUpperCase() + ride.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="btn-reject" onClick={() => removeRide(ride)}>
                      Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
