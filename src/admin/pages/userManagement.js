import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

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
    <div>
      <h2>User Management</h2>
      <table>
        <thead><tr><th>Email</th><th>Referral Count</th><th>Rides Posted</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.jobsReferred || 0}</td>
              <td>{u.ridesPosted || 0}</td>
              <td>
                <button onClick={() => toggleBan(u)}>
                  {u.banned ? 'Unban' : 'Ban'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}