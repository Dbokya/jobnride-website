import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button, Box, Typography, Snackbar, Alert } from '@mui/material';

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
const industryOptions = [
  'IT', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Hospitality', 'Construction', 'Transportation', 'Media', 'Telecom', 'Energy', 'Government', 'Legal', 'Real Estate', 'Agriculture', 'Automotive', 'Aerospace', 'Biotechnology', 'Chemicals', 'Consulting', 'Consumer Goods', 'Defense', 'Design', 'E-commerce', 'Electronics', 'Engineering', 'Entertainment', 'Environmental', 'Fashion', 'Food & Beverage', 'Insurance', 'Logistics', 'Marine', 'Mining', 'Nonprofit', 'Pharmaceuticals', 'Printing', 'Public Relations', 'Publishing', 'Recreation', 'Security', 'Sports', 'Travel', 'Utilities', 'Waste Management', 'Wholesale', 'Other'
];
const jobTypes = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'permanent', label: 'Permanent' }
];

// Set your test user id here
const TEST_USER_ID = 'bLKKzsPaAGdo0mDEJdANQkGvTr23';

export default function AutoFillDemoJob() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAutoFillAndPost = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const company = randomCompany();
      const title = randomTitle();
      const industry = randomFromArray(industryOptions);
      const type = randomFromArray(jobTypes).value;
      const experience = randomInt(1, 12);
      const location = randomLocation();
      const salaryMin = randomInt(5, 20).toString();
      const salaryMax = (parseInt(salaryMin) + randomInt(2, 10)).toString();
      const applicationDeadline = randomDate(new Date(), new Date(Date.now() + 1000*60*60*24*60)); // within 60 days
      const jobData = {
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
        remote: randomFromArray(['Yes', 'No']),
        salaryRange: salaryMin && salaryMax ? `$${salaryMin},000 - $${salaryMax},000` : '',
        postedDate: new Date().toISOString(),
        status: 'active',
        jobposterid: TEST_USER_ID
      };
      await addDoc(collection(db, 'jobs'), jobData);
      setSuccess('Demo job posted successfully!');
    } catch (err) {
      setError('Failed to post demo job.');
      console.error('Error posting demo job:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 4, bgcolor: '#fff', borderRadius: 4, boxShadow: 6, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#9A02E2' }}>Auto-Fill & Post Demo Job</Typography>
      <Button
        variant="contained"
        sx={{ background: '#9A02E2', color: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 200, minHeight: 48 }}
        onClick={handleAutoFillAndPost}
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Auto-Fill & Post Demo Job'}
      </Button>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
