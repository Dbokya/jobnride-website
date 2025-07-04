import React, { useState } from 'react';

function JobPostForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobType: '',
    salary: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    applicationUrl: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or Firebase
  };

  if (submitted) {
    return (
      <div className="jobpost-success">
        <h2>Job Posted Successfully!</h2>
        <p>Your job has been submitted and will be reviewed soon.</p>
      </div>
    );
  }

  return (
    <form className="jobpost-form" onSubmit={handleSubmit}>
      <h2>Post a Job</h2>
      <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" required />
      <input name="company" value={form.company} onChange={handleChange} placeholder="Company Name" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <select name="jobType" value={form.jobType} onChange={handleChange} required>
        <option value="">Select Job Type</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
        <option value="Remote">Remote</option>
      </select>
      <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary (optional)" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" required />
      <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements" required />
      <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} placeholder="Responsibilities" />
      <textarea name="benefits" value={form.benefits} onChange={handleChange} placeholder="Benefits" />
      <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Contact Name" required />
      <input name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Contact Email" type="email" required />
      <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="Contact Phone" />
      <input name="applicationUrl" value={form.applicationUrl} onChange={handleChange} placeholder="Application URL (optional)" />
      <button type="submit">Submit Job</button>
    </form>
  );
}

export default JobPostForm;
