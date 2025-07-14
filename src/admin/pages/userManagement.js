import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import '../admin.css'; // Assuming you placed styles here

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const toggleBan = async (u) => {
    await updateDoc(doc(db, 'users', u.id), { banned: !u.banned });
  };

  return (
    <div className="user-management">
      <h2 className="section-title">User Management</h2>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Company</th>
              <th>Mobile No.</th>
              <th>Referral Count</th>
              <th>Rides Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name || '-'}</td>
                <td>{u.email || '-'}</td>
                <td>{u.location || '-'}</td>
                <td>{u.currentCompany || '-'}</td>
                <td>{u.mobile || '-'}</td>
                <td>{u.jobsReferred || 0}</td>
                <td>{u.ridesPosted || 0}</td>
                <td>
                  <button
                    className={u.banned ? 'unban-btn' : 'ban-btn'}
                    onClick={() => toggleBan(u)}
                  >
                    {u.banned ? 'Unblocl' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
