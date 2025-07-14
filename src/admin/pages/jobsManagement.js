import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export default function JobsManagement() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobs'), snap => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const approve = async (j, status) => {
    await updateDoc(doc(db, 'jobs', j.id), { approved: status });
  };

  return (
    <div>
      <h2>Jobs Management</h2>
      <table>
        <thead><tr><th>Title</th><th>Company</th><th>Posted By</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id}>
              <td>{j.title}</td>
              <td>{j.company}</td>
              <td>{j.jobpostername}</td>
              <td>{j.approved ? 'Approved' : 'Pending'}</td>
              <td>
                <button onClick={() => approve(j, true)}>Approve</button>
                <button onClick={() => approve(j, false)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
