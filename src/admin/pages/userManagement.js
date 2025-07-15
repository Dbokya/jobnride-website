import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Search, UserCheck, UserX, Eye, MoreVertical } from 'lucide-react';
import '../admin.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const toggleBan = async (u) => {
    await updateDoc(doc(db, 'users', u.id), { banned: !u.banned });
  };

  const filteredUsers = users.filter(u => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(searchText) ||
      u.email?.toLowerCase().includes(searchText) ||
      u.mobile?.includes(searchText) ||
      u.currentCompany?.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && !u.banned) ||
      (filter === 'Blocked' && u.banned);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1 className="section-title">User Management</h1>
        <p className="user-count"><h3>Total Users: {users.length}</h3></p>
      </div>

      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Users</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Activity</th>
              <th>Earnings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{u.name?.charAt(0)}</div>
                    <div>
                      <strong>{u.name || '-'}</strong>
                      <div className="subtext">Joined {u.joinedDate || '-'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{u.email || '-'}</div>
                  <div className="subtext">{u.mobile || '-'}</div>
                </td>
                <td>
                  <div>{u.ridesPosted || 0} rides</div>
                  <div className="subtext">{u.jobsReferred || 0} jobs</div>
                </td>
                <td>₹{u.earnings || '0'}</td>
                <td>
                  <span className={`status-pill ${u.banned ? 'blocked' : 'active'}`}>
                    {u.banned ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button title="View">
                    <Eye size={16} />
                  </button>
                  <button title={u.banned ? 'Unblock' : 'Block'} onClick={() => toggleBan(u)}>
                    {u.banned ? <UserCheck size={16} /> : <UserX size={16} />}
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
