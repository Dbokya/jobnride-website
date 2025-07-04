import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { getDocs, doc, deleteDoc, collection as fbCollection } from 'firebase/firestore';

function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const jobsRef = fbCollection(db, 'jobs');
        const snapshot = await getDocs(jobsRef);
        const jobList = [];
        snapshot.forEach(doc => jobList.push({ id: doc.id, ...doc.data() }));
        setJobs(jobList);
      } catch (err) {
        setJobs([]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedJobs([]);
      return;
    }
    const fetchSaved = async () => {
      const savedSnap = await getDocs(fbCollection(db, 'users', user.uid, 'savedJobs'));
      setSavedJobs(savedSnap.docs.map(doc => doc.id));
    };
    fetchSaved();
  }, [user]);

  const handleRemove = async (jobId) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'savedJobs', jobId);
    await deleteDoc(ref);
    setSavedJobs(prev => prev.filter(id => id !== jobId));
  };

  if (!user) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Please sign in to view your saved jobs.</Typography></Box>;
  }

  return (
    <Box sx={{
      maxWidth: { xs: '100%', sm: 700 },
      mx: 'auto',
      py: { xs: 2, sm: 4 },
      px: { xs: 1, sm: 2 },
      width: '100%',
    }}>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 3, fontSize: { xs: 22, sm: 28 } }}>Saved Jobs</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {savedJobs.length === 0 ? (
            <Typography sx={{ color: '#bbb', fontSize: { xs: 15, sm: 16 } }}>No saved jobs found.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {jobs.filter(j => savedJobs.includes(j.id)).map(job => (
                <Paper key={job.id} sx={{
                  p: { xs: 1.2, sm: 2 },
                  borderRadius: 3,
                  boxShadow: 3,
                  background: '#111',
                  border: '2px solid #fff',
                  width: '100%',
                  minHeight: 90,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  alignItems: 'flex-start',
                  position: 'relative',
                }}>
                  <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#fff', fontSize: { xs: 15, sm: 17 }, textAlign: 'left', maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</Typography>
                    <Typography fontWeight={700} sx={{ color: '#9A02E2', fontSize: { xs: 13, sm: 15 }, textAlign: 'right', maxWidth: '30%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.company}</Typography>
                  </Box>
                  {job.description && (
                    <Typography sx={{ color: '#eee', fontSize: { xs: 12, sm: 13 }, mb: 0.5, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.description.split('\n')[0] || job.description.split('.')[0] || job.description}
                      {job.description.length > 60 ? '...' : ''}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: '100%', alignItems: 'center', mt: 0.5 }}>
                    {job.experience && (
                      <Typography sx={{ color: '#ccc', fontSize: { xs: 11, sm: 12 }, fontWeight: 600 }}>
                        Exp: {job.experience}
                      </Typography>
                    )}
                    {job.salaryRange && (
                      <Typography sx={{ color: '#ccc', fontSize: { xs: 11, sm: 12 }, fontWeight: 600 }}>
                        Salary: {job.salaryRange}
                      </Typography>
                    )}
                    {job.location && (
                      <Typography sx={{ color: '#ccc', fontSize: { xs: 11, sm: 12 }, fontWeight: 600 }}>
                        Location: {job.location}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#bbb', fontSize: { xs: 10, sm: 11 }, mt: 0.5 }}>
                    Posted: {job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString('en-GB') : ''}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemove(job.id)} sx={{ position: 'absolute', top: 8, right: 8, color: '#f44336', fontSize: { xs: 20, sm: 24 } }} title="Remove from saved">
                    <BookmarkRemoveIcon />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default SavedJobsPage;
