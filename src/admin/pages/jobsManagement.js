import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Search, Eye, Check, X, MapPin, Calendar } from 'lucide-react';
import '../admin.css'; // Make sure styles are defined here

export default function JobsManagement() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobs'), snap => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const approve = async (job, status) => {
    await updateDoc(doc(db, 'jobs', job.id), { approved: status });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && job.approved === true) ||
      (filterStatus === 'pending' && job.approved === false);

    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (approved) => {
    return approved ? 'status-badge approved' : 'status-badge pending';
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h2 className="section-title">Jobs Management</h2>
        <div className="job-count">Total Jobs: {jobs.length}</div>
      </div>

      <div className="search-filter-box">
        <div className="search-wrapper">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Search jobs..."
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
          <option value="all">All Jobs</option>
          <option value="active">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="cards-grid">
        {filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>
            <div className="job-card-header">
              <div>
                <h3>{job.title}</h3>
                <p className="company">{job.company}</p>
              </div>
              <span className={getStatusClass(job.approved)}>
                {job.approved ? 'Approved' : 'Pending'}
              </span>
            </div>

            <div className="job-details">
            <div>
            {job.location && (
                <p className="info"><MapPin size={20} /> {job.location}</p>
              )}
              {job.postedDate && (
                <p className="info"><Calendar size={20} /> Posted on {job.postedDate}</p>
              )}
              {job.experience && (
                <p className="info">Experience: {job.experience}</p>
              )}
            </div>
            <div>
              {job.salary && (
                <p className="info"><strong>Salary:</strong> {job.salary}</p>
              )}
              <p className="info"><strong>Posted by:</strong> {job.jobpostername || 'Unknown'}</p>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-view">
                <Eye size={16} /> View
              </button>
              {!job.approved && (
                <>
                  <button className="btn-approve" onClick={() => approve(job, true)}>
                    <Check size={16} />
                  </button>
                  <button className="btn-reject" onClick={() => approve(job, false)}>
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="no-data">No jobs found matching your criteria.</div>
      )}
    </div>
  );
}
