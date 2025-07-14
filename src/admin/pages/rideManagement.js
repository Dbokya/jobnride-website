import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import '../admin.css';

export default function RideManagement() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'rides'), snap => {
      setRides(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const removeRide = async (r) => {
    await deleteDoc(doc(db, 'rides', r.id));
  };

  return (
    <div>
      <h2 className="page-title">Ride Management</h2>
      <div className="cards-container">
        {rides.length === 0 ? (
          <p className="no-data">No rides found.</p>
        ) : (
          rides.map((r) => (
            <div key={r.id} className="ride-card">
              <h3 className="ride-header">{r.startLocation} → {r.endLocation}</h3>
              <div className="ride-details">
                <p><strong>Rider:</strong> {r.ridegiveruser}</p>
                <p><strong>Ride Type:</strong> {r.ridetype}</p>
                <p><strong>Date:</strong> {r.date} &nbsp; <strong>Time:</strong> {r.time}</p>
                <p><strong>Amount:</strong> ₹{r.amount}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${r.status}`}>{r.status}</span>
                </p>
              </div>
              <div className="card-actions">
                <button className="btn-reject" onClick={() => removeRide(r)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
