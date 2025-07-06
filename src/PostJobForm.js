import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { auth, db } from './firebase';
import { collection, addDoc, getFirestore, doc, getDoc } from 'firebase/firestore';

const industryOptions = [
  'IT', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Hospitality', 'Construction', 'Transportation', 'Media', 'Telecom', 'Energy', 'Government', 'Legal', 'Real Estate', 'Agriculture', 'Automotive', 'Aerospace', 'Biotechnology', 'Chemicals', 'Consulting', 'Consumer Goods', 'Defense', 'Design', 'E-commerce', 'Electronics', 'Engineering', 'Entertainment', 'Environmental', 'Fashion', 'Food & Beverage', 'Insurance', 'Logistics', 'Marine', 'Mining', 'Nonprofit', 'Pharmaceuticals', 'Printing', 'Public Relations', 'Publishing', 'Recreation', 'Security', 'Sports', 'Travel', 'Utilities', 'Waste Management', 'Wholesale', 'Other'
];

const jobTypes = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'permanent', label: 'Permanent' }
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (5+ years)' },
  { value: 'lead', label: 'Lead/Principal (8+ years)' },
  { value: 'executive', label: 'Executive' }
];

const workplaceTypes = [
  { value: 'office', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' }
];

function PostJobForm({ onClose, jobPosterId, jobPosterName }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    experienceLevel: '',
    location: [],
    description: '',
    salaryMin: '',
    salaryMax: '',
    type: '',
    skills: '',
    benefits: '',
    requirements: '',
    responsibilities: '',
    department: '',
    industry: [],
    education: '',
    applicationDeadline: '',
    contactEmail: '',
    contactPhone: '',
    remote: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'location') {
      setFormData(prev => ({
        ...prev,
        location: value.split(',').map(loc => loc.trim()).filter(Boolean)
      }));
    } else if (name === 'industry') {
      setFormData(prev => ({
        ...prev,
        industry: typeof value === 'string' ? value.split(',') : value
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      company: '',
      experienceLevel: '',
      location: [],
      description: '',
      salaryMin: '',
      salaryMax: '',
      type: '',
      skills: '',
      benefits: '',
      requirements: '',
      responsibilities: '',
      department: '',
      industry: [],
      education: '',
      applicationDeadline: '',
      contactEmail: '',
      contactPhone: '',
      remote: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const salaryRange = formData.salaryMin && formData.salaryMax
        ? `$${formData.salaryMin},000 - $${formData.salaryMax},000`
        : '';
      const jobData = {
        ...formData,
        salaryRange,
        postedDate: new Date().toISOString(),
        status: 'active'
      };
      // Always set jobposterid and jobpostername for every job
      const {uid} =auth.currentUser
      jobData.jobposterid = uid;
      const db = getFirestore();
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
      jobData.jobpostername = userSnap?.data()?.name || 'Demo User';
      // Add job to Firestore 'jobs' collection (auto-generated id)
      await addDoc(collection(db, 'jobs'), jobData);
      setSuccess('Job posted successfully!');
      clearForm();
    } catch (err) {
      console.error('Error posting job:', err); // Log the actual error
      setError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for random data generation
  const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomDate = (start, end) => {
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toISOString().slice(0, 10);
  };
  const randomPhone = () => '+91-' + randomInt(7000000000, 9999999999);
  const randomEmail = (company) => `hr@${company.replace(/\s+/g, '').toLowerCase()}.com`;
  const randomCompany = () => randomFromArray([
    'TechNova Solutions', 'InnoSoft Labs', 'BluePeak Systems', 'NextGen Apps', 'Cloudify',
    'DataMinds', 'PixelCrafters', 'QuantumLeap', 'SkyNetics', 'BrightPath', 'CodeNest', 'AppVantage'
  ]);
  const randomTitle = () => randomFromArray([
    'Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'Data Analyst', 'DevOps Engineer',
    'QA Tester', 'Mobile App Developer', 'UI/UX Designer', 'Product Manager', 'Cloud Architect'
  ]);
  const randomSkills = () => randomFromArray([
    'React, JavaScript, HTML, CSS, REST API, Git',
    'Node.js, Express, MongoDB, Docker, AWS',
    'Python, Django, PostgreSQL, Pandas, NumPy',
    'Java, Spring Boot, MySQL, Kafka',
    'Flutter, Dart, Firebase, GraphQL',
    'C#, .NET, Azure, Entity Framework',
    'Angular, TypeScript, RxJS, SCSS',
    'Kotlin, Android, SQLite, Retrofit',
    'Swift, iOS, CoreData, Alamofire',
    'Go, Kubernetes, Prometheus, gRPC'
  ]);
  const randomBenefits = () => randomFromArray([
    'Health insurance, Remote work, Flexible hours',
    'Stock options, Paid time off, Learning budget',
    'Wellness programs, Free snacks, Team outings',
    'Parental leave, Gym membership, Annual bonus',
    'Commuter benefits, Home office stipend, Conferences'
  ]);
  const randomRequirements = () => randomFromArray([
    'Bachelor’s degree in CS or related, 2+ years experience',
    'Strong problem-solving skills, Team player, Good communication',
    'Experience with Agile, Familiarity with CI/CD',
    'Portfolio of past projects, Willingness to learn new tech',
    'Attention to detail, Ability to work independently'
  ]);
  const randomResponsibilities = () => randomFromArray([
    'Develop and maintain applications, Write tests, Code reviews',
    'Collaborate with cross-functional teams, Deliver features',
    'Troubleshoot issues, Optimize performance, Document code',
    'Participate in planning, Mentor juniors, Research new tools',
    'Ensure code quality, Deploy releases, Gather feedback'
  ]);
  const randomDepartment = () => randomFromArray([
    'Engineering', 'Product', 'QA', 'DevOps', 'Mobile', 'Data Science', 'Design', 'Cloud', 'Support'
  ]);
  const randomEducation = () => randomFromArray([
    'Bachelor’s Degree', 'Master’s Degree', 'Diploma', 'PhD', 'Associate Degree'
  ]);
  const randomLocation = () => randomFromArray([
    ['Bangalore', 'Remote'], ['Mumbai'], ['Delhi', 'Remote'], ['Hyderabad'], ['Chennai', 'Remote'], ['Pune'], ['Gurgaon'], ['Noida', 'Remote']
  ]);

  // Auto-fill and post demo job (with fixed jobposterid)
  const autoFillAndPostDemoJob = async () => {
    const company = randomCompany();
    const title = randomTitle();
    const industry = randomFromArray(industryOptions);
    const type = randomFromArray(jobTypes).value;
    const experience = randomInt(1, 12);
    const location = randomLocation();
    const salaryMin = randomInt(5, 20).toString();
    const salaryMax = (parseInt(salaryMin) + randomInt(2, 10)).toString();
    const applicationDeadline = randomDate(new Date(), new Date(Date.now() + 1000*60*60*24*60)); // within 60 days
    setFormData({
      title,
      company,
      experience,
      location,
      description: `We are looking for a ${title} to join our ${randomDepartment()} team at ${company}. ${randomResponsibilities()}`,
      salaryMin,
      salaryMax,
      type,
      skills: randomSkills(),
      benefits: randomBenefits(),
      requirements: randomRequirements(),
      responsibilities: randomResponsibilities(),
      department: randomDepartment(),
      industry,
      education: randomEducation(),
      applicationDeadline,
      contactEmail: randomEmail(company),
      contactPhone: randomPhone(),
      remote: randomFromArray(['Yes', 'No'])
    });
    setTimeout(() => {
      // Set jobposterid directly before submit
      document.getElementById('post-job-form').requestSubmit();
    }, 200);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
            Post a New Job
          </Typography>
          {onClose && (
            <Button onClick={onClose} color="error" variant="outlined">Close</Button>
          )}
        </Box>
        <form id="post-job-form" onSubmit={handleSubmit} autoComplete="off">
          {/* Auto-fill demo job button */}
          <Button
            variant="contained"
            sx={{ mb: 2, background: '#9A02E2', color: '#fff', fontWeight: 700, borderRadius: 2 }}
            onClick={autoFillAndPostDemoJob}
            disabled={loading}
          >
            Auto-Fill & Post Demo Job
          </Button>
          {/* Industry field at the top */}
          <TextField
            fullWidth
            select
            required
            SelectProps={{
              multiple: false,
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected || selected === '') {
                  return <span style={{ color: '#888' }}>Choose Industry</span>;
                }
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip key={selected} label={selected} sx={{ bgcolor: '#181818', color: '#fff', fontWeight: 700, border: '1px solid #9A02E2' }} />
                  </Box>
                );
              },
              MenuProps: {
                PaperProps: {
                  sx: { bgcolor: '#181818', color: '#fff', zIndex: 2000 },
                  elevation: 24,
                  style: { position: 'absolute' }
                },
                sx: { zIndex: 2000 }
              }
            }}
            label="Industry"
            name="industry"
            value={formData.industry || ''}
            onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            variant="outlined"
            sx={{ mb: 2 }}
            helperText="Select industry"
            FormHelperTextProps={{ sx: { color: '#9A02E2', fontWeight: 500 } }}
          >
            <MenuItem disabled value="">
              <span style={{ color: '#888' }}>Choose Industry</span>
            </MenuItem>
            {industryOptions.map(option => (
              <MenuItem key={option} value={option} sx={{ bgcolor: '#181818', color: '#fff', '&.Mui-selected': { bgcolor: '#9A02E2', color: '#fff' }, '&:hover': { bgcolor: '#2F013E' } }}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {/* Job Title (required) */}
          <TextField
            fullWidth
            required
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {/* Company (required) */}
          <TextField
            fullWidth
            required
            label="Company Name"
            name="company"
            value={formData.company}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {/* Experience (required, number of years) */}
          <TextField
            fullWidth
            required
            label="Experience (years)"
            name="experience"
            type="number"
            value={formData.experience || ''}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: <span style={{ color: '#888', marginLeft: 4 }}>years</span>,
              inputProps: { min: 0 }
            }}
            helperText="Enter total years of experience"
            FormHelperTextProps={{ sx: { color: '#9A02E2', fontWeight: 500 } }}
          />
          {/* Location (required, multiple allowed) */}
          <TextField
            fullWidth
            required
            label="Location(s)"
            name="location"
            value={formData.location.join(', ')}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            helperText="Enter one or more locations, separated by commas"
            FormHelperTextProps={{ sx: { color: '#9A02E2', fontWeight: 500 } }}
          />
          {/* Optional fields below */}
          <TextField
            fullWidth
            label="Job Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Minimum Salary (K)"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            variant="outlined"
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Maximum Salary (K)"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            variant="outlined"
            type="number"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            required
            label="Job Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            helperText="Select job type"
            FormHelperTextProps={{ sx: { color: '#9A02E2', fontWeight: 500 } }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: { bgcolor: '#181818', color: '#fff', zIndex: 2000 },
                  elevation: 24,
                  style: { position: 'absolute' }
                },
                sx: { zIndex: 2000 }
              }
            }}
          >
            <MenuItem disabled value="">
              <span style={{ color: '#888' }}>Choose Job Type</span>
            </MenuItem>
            {jobTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Required Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            helperText="Separate skills with commas"
            FormHelperTextProps={{ sx: { color: '#9A02E2', fontWeight: 500 } }}
          />
          <TextField
            fullWidth
            label="Benefits"
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Key Responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Required Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Application Deadline"
            name="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {/* Form Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={clearForm}
              disabled={loading}
              sx={{
                color: '#9A02E2',
                borderColor: '#9A02E2',
                fontWeight: 700,
                '&:hover': { borderColor: '#A400F1', color: '#A400F1', background: 'rgba(154,2,226,0.08)' }
              }}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                minWidth: 120,
                background: 'linear-gradient(90deg, #9A02E2 60%, #2F013E 100%)',
                color: '#fff',
                fontWeight: 800,
                borderRadius: 3,
                boxShadow: 4,
                textTransform: 'none',
                '&:hover': { background: 'linear-gradient(90deg, #A400F1 60%, #2F013E 100%)', color: '#fff' }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Post Job'}
            </Button>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PostJobForm;
