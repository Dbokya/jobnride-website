
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import "./JobPostingModal.css"

const topIndustries = [
  "Information Technology (IT)",
  "Healthcare & Life Sciences",
  "E-commerce & Retail",
  "Banking, Financial Services & Insurance (BFSI)",
  "Telecommunications",
  "Education & EdTech",
  "Manufacturing & Automotive",
  "Logistics & Supply Chain",
  "Renewable Energy & Utilities",
  "Media, Entertainment & Gaming"
];
export default function JobPostingModal({ job, onSubmit, onClose }) {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryMax: '',
    salaryMin:'',
    type: 'Full-time',
    description: '',
    requirements: '',
    experience: '',
    email:'',
    industry:topIndustries[0]
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salaryMax: job.salaryMax || '',
        salaryMin: job.salaryMin || '',
        type: job.type || 'Full-time',
        description: job.description || '',
        requirements: job.requirements || '',
        experience: job.experience || '',
        email: job.email || '',
        industry: job.industry || topIndustries[0],
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        salaryMax: '',
        salaryMin: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        experience: '',
        email: '',
        industry: topIndustries[0],
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors= {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Job description must be at least 50 characters';
    }
    
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // Use flush to ensure logs show up before async/await
    console.log("[DEBUG] Submit button clicked. Current formData:", JSON.parse(JSON.stringify(formData)));
    if (!validateForm()) {
      setMessage("Validation failed. Please check the form.");
      console.log("[DEBUG] Validation failed:", errors);
      return;
    }
    setIsLoading(true);
    setMessage(job ? "Updating job..." : "Posting job...");
    try {
      console.log("[DEBUG] Calling onSubmit with formData:", JSON.parse(JSON.stringify(formData)));
      const result = await onSubmit(formData);
      console.log("[DEBUG] onSubmit resolved successfully. Result:", result);
      setMessage(job ? "Job updated successfully!" : "Job posted successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error("[DEBUG] Error in onSubmit:", err);
    } finally {
      setIsLoading(false);
      console.log("[DEBUG] handleSubmit finished.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2>{job ? 'Edit Job Posting' : 'Post a New Job'}</h2>
          <button onClick={onClose} className="modal__close">
            <X size={24} />
          </button>
        </div>
        {message && (
          <div style={{ textAlign: 'center', color: message.includes('success') ? 'green' : '#d32f2f', fontWeight: 600, margin: '10px 0' }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Job Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                  {errors.title && <div className="error-message">{errors.title}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="company" className="form-label">Company Name *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`form-input ${errors.company ? 'error' : ''}`}
                    placeholder="e.g. Tech Innovations Inc."
                  />
                  {errors.company && <div className="error-message">{errors.company}</div>}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label htmlFor="location" className="form-label">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`form-input ${errors.location ? 'error' : ''}`}
                    placeholder="e.g. San Francisco, CA"
                  />
                  {errors.location && <div className="error-message">{errors.location}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="type" className="form-label">Job Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="experience" className="form-label">Experience</label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`form-input ${errors.experience ? 'error' : ''}`}
                      placeholder="In Years"
                    />
                    {errors.experience && <div className="error-message">{errors.experience}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter email"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="industry" className="form-label">Industry </label>
                    <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {topIndustries.map(i=><option value={i} key={i}>{i}</option>)}
                  </select>
                    
                  </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="salaryMin" className="form-label">Salary min</label>
                    <input
                      type="text"
                      id="salaryMin"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                      className={`form-input`}
                      placeholder="e.g. $80,000"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="salaryMax" className="form-label">Salary max</label>
                    <input
                      type="text"
                      id="salaryMax"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                      className={`form-input`}
                      placeholder="e.g. $120,000"
                    />
                  </div>
                </div>
              <div className="form-group">
                <label htmlFor="description" className="form-label">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                  rows={6}
                />
                {errors.description && <div className="error-message">{errors.description}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="requirements" className="form-label">Requirements *</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.requirements ? 'error' : ''}`}
                  placeholder="List the required skills, experience, and qualifications..."
                  rows={4}
                />
                {errors.requirements && <div className="error-message">{errors.requirements}</div>}
              </div>
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" style={{ marginRight: '8px' }}></span>
                  {job ? 'Updating...' : 'Posting...'}
                </>
              ) : (
                job ? 'Update Job' : 'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    
  );
}