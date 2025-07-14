import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function RideManagement() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'rides'), snap => {
      setRides(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const removeRide = async (r) => { await deleteDoc(doc(db, 'rides', r.id)); };

  return (
    <div>
      <h2>Ride Management</h2>
      <table>
        <thead><tr><th>Origin</th><th>Destination</th><th>Driver</th><th>Actions</th></tr></thead>
        <tbody>
          {rides.map(r => (
            <tr key={r.id}>
              <td>{r.origin}</td>
              <td>{r.destination}</td>
              <td>{r.postedByName}</td>
              <td>
                <button onClick={() => removeRide(r)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
