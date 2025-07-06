import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, getFirestore, getDoc, addDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { getStoredUser } from './utils';
import withAuthProtection from './components/HOCs/withAuthProtection';
import JobPostingModal from './components/JobPostingModal/JobPostingModal';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const navigate = useNavigate();

  // Fetch jobs from Firestore where jobPosterId matches current user
  async function fetchJobs() {
    setLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      let jobsList = [];
      console.log('-->',user, user?.uid);
      
      
      if (user && user.uid) {
        const q = query(collection(db, 'jobs'), where('jobposterid', '==', user.uid));
        const snap = await getDocs(q);
        console.log('snap', snap);
        
        jobsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      console.log(jobsList);
      
      setJobs(jobsList);
    } catch (err) {
      setError('Failed to fetch jobs.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    
    fetchJobs();
  }, [auth.currentUser]);

  // Only show jobs from Firestore (no demo jobs)
  const jobsToDisplay = jobs;

  // Track selected job for details view
  const [selectedJobId, setSelectedJobId] = useState(null);
  useEffect(() => {
    if (jobsToDisplay.length > 0 && !selectedJobId) {
      setSelectedJobId(jobsToDisplay[0].id);
    }
  }, [jobsToDisplay, selectedJobId]);
  const selectedJob = jobsToDisplay.find(j => j.id === selectedJobId) || jobsToDisplay[0];

  const handlePostJob = async(formData) => {
    console.log('Posting job with data:', formData);
    
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
      await fetchJobs()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error posting job:', err); // Log the actual error
      setError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = async (formData) => {
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Prepare salary range string
      const salaryRange = formData.salaryMin && formData.salaryMax
        ? `$${formData.salaryMin},000 - $${formData.salaryMax},000`
        : '';
      // Only update fields that are allowed to change
      const jobData = {
        ...formData,
        salaryRange,
        jobposterid: editingJob.jobposterid,
        jobpostername: editingJob.jobpostername,
        postedDate: editingJob.postedDate || new Date().toISOString(),
        status: editingJob.status || 'active',
      };
      const dbInstance = getFirestore();
      if (!editingJob || !editingJob.id) throw new Error('No job selected for editing.');
      const jobRef = doc(dbInstance, 'jobs', editingJob.id);
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(jobRef, jobData);
      setSuccess('Job updated successfully!');
      await fetchJobs();
      setIsModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // If loading, show spinner
  if (loading) {
    return (
      <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#181818' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  // Main layout always shows sidebar and header; only show job details box if jobs exist
  return (
    <>
    <Box sx={{ width: '100vw', minHeight: '100vh', py: { xs: 2, md: 6 }, px: { xs: 0, md: 4 }, display: 'flex', gap: 0, bgcolor: '#181818', position: 'relative' }}>
      {/* Sidebar: Job Titles */}
      <Box sx={{
        minWidth: 220,
        maxWidth: 320,
        bgcolor: '#181818',
        borderRadius: 6,
        boxShadow: 3,
        p: 2,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: 1,
        border: '1.5px solid #222',
        height: 'fit-content',
        alignSelf: 'flex-start',
        mt: 4,
        maxHeight: '80vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: 8, background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#fff', borderRadius: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
      }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: '#9A02E2', mb: 2, letterSpacing: 1, textAlign: 'center', fontSize: 18 }}>
          My Job Titles
        </Typography>
        {jobsToDisplay.map(job => (
          <Button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            sx={{
              justifyContent: 'flex-start',
              color: selectedJobId === job.id ? '#fff' : '#aaa',
              fontWeight: selectedJobId === job.id ? 800 : 600,
              bgcolor: selectedJobId === job.id ? '#9A02E2' : 'transparent',
              borderRadius: 3,
              mb: 1,
              px: 2,
              py: 1.1,
              textTransform: 'none',
              boxShadow: selectedJobId === job.id ? 4 : 0,
              border: selectedJobId === job.id ? '2px solid #fff' : '1.5px solid #222',
              transition: 'all 0.2s',
              fontSize: 15,
              '&:hover': { bgcolor: '#A400F1', color: '#fff', borderColor: '#fff' }
            }}
            fullWidth
          >
            {job.title}
          </Button>
        ))}
      </Box>
      {/* Vertical Divider with white line and scroll bar */}
      <Box sx={{
        width: 2,
        bgcolor: '#fff',
        borderRadius: 2,
        mx: 0.5,
        display: { xs: 'none', md: 'block' },
        minHeight: '80vh',
        alignSelf: 'center',
        position: 'relative',
      }} />
      {/* Main Content: Header and (conditionally) Job Details */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100%'
      }}>
        {/* Header row: Title and Post New Job button */}
        <Box sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.5,
          mt: { xs: 0, md: -2 },
          px: { xs: 1, md: 2 },
          maxWidth: { xs: '98vw', md: '700px' },
        }}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#fff', letterSpacing: 1, textAlign: 'left', fontSize: { xs: 22, md: 32 } }}>
            My Posted Jobs
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(90deg, #9A02E2 60%, #2F013E 100%)',
              color: '#fff',
              fontWeight: 800,
              borderRadius: 3,
              fontSize: { xs: 13, md: 15 },
              px: 2.5,
              py: 1,
              boxShadow: 4,
              textTransform: 'none',
              '&:hover': { background: 'linear-gradient(90deg, #A400F1 60%, #2F013E 100%)' }
            }}
            onClick={()=> setIsModalOpen(true)}
          >
            Post New Job
          </Button>
        </Box>
        {/* Only show job details box if jobs exist */}
        {jobsToDisplay.length > 0 && selectedJob && (
          <Box sx={{
            background: 'linear-gradient(135deg, #181818 60%, #2F013E 100%)',
            border: '1.5px solid #fff',
            borderRadius: 0,
            color: '#fff',
            p: { xs: 2, md: 4 },
            boxShadow: 6,
            minHeight: { xs: 120, md: 140 },
            minWidth: { xs: '90vw', md: '60vw' },
            maxWidth: { xs: '98vw', md: '700px' },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            mx: { xs: 0, md: 'auto' },
            justifyContent: 'center',
            clipPath: 'polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))',
            WebkitClipPath: 'polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#fff', letterSpacing: 1, fontSize: { xs: 16, md: 20 } }}>
                {selectedJob.title}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', textAlign: 'right', opacity: 0.85, fontSize: { xs: 13, md: 16 } }}>
                {selectedJob.company}
              </Typography>
            </Box>
            <Divider sx={{ bgcolor: '#333', mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
              <Chip label={`Exp: ${selectedJob.experienceLevel || 'Not disclosed'}`} sx={{ bgcolor: '#222', color: '#fff', fontWeight: 700, fontSize: 13, height: 24 }} />
              <Chip label={`Salary: ${selectedJob.salaryRange || 'Not disclosed'}`} sx={{ bgcolor: '#222', color: '#fff', fontWeight: 700, fontSize: 13, height: 24 }} />
              <Chip label={`Location: ${selectedJob.location || 'Not disclosed'}`} sx={{ bgcolor: '#222', color: '#fff', fontWeight: 700, fontSize: 13, height: 24 }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, mb: 1, minHeight: 20, fontSize: { xs: 13, md: 15 }, textAlign:'justify' }}>
              {selectedJob.description}
            </Typography>
            <Box sx={{ position: 'absolute', right: 24, bottom: 18, display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="secondary" sx={{ color: '#fff', borderColor: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 70, fontSize: 13, py: 0.5 }} onClick={()=>{setIsModalOpen(true); setEditingJob(selectedJob)}}>Edit</Button>
              <Button variant="contained" color="error" sx={{ color: '#fff', background: '#d32f2f', fontWeight: 700, borderRadius: 2, minWidth: 70, fontSize: 13, py: 0.5 }}>Delete</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
    {isModalOpen && (
        <JobPostingModal
          key={editingJob ? editingJob.id : 'new'}
          open={isModalOpen}
          job={editingJob}
          onSubmit={editingJob ? handleEditJob : handlePostJob}
          onClose={() => {
            setIsModalOpen(false);
            setEditingJob(null);
          }}
        />
      )}
    </>
  );
}

export default withAuthProtection(MyJobs);
// () => {
//   import('./PostJobForm').then(({ default: PostJobForm }) => {
//     const modalRoot = document.createElement('div');
//     modalRoot.id = 'post-job-modal-root';
//     document.body.appendChild(modalRoot);
//     const closeModal = () => {
//       if (modalRoot) {
//         document.body.removeChild(modalRoot);
//       }
//     };
//     import('react-dom').then(ReactDOM => {
//       ReactDOM.createRoot(modalRoot).render(
//         <React.StrictMode>
//           <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <Box sx={{ bgcolor: '#fff', borderRadius: 4, p: 3, minWidth: 340, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: 24 }}>
//               <PostJobForm onClose={closeModal} />
//             </Box>
//           </Box>
//         </React.StrictMode>
//       );
//     });
//   });
// }