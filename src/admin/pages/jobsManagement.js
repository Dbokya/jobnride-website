import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import '../admin.css'; // Assuming styles are in admin.css

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
      <h2 className="section-title">Jobs Management</h2>
      <div className="cards-grid">
        {jobs.map(j => (
          <div className="job-card" key={j.id}>
            <h3>{j.title}</h3>
            <p><strong>Company:</strong> {j.company}</p>
            <p><strong>Posted By:</strong> {j.jobpostername}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`status-badge ${j.approved ? 'approved' : 'pending'}`}>
                {j.approved ? 'Approved' : 'Pending'}
              </span>
            </p>
            <div className="card-actions">
              <button className="btn-approve" onClick={() => approve(j, true)}>Approve</button>
              <button className="btn-reject" onClick={() => approve(j, false)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
