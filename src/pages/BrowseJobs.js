import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, CircularProgress, Paper } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, deleteDoc, getDocs as getUserDocs, collection as fbCollection } from 'firebase/firestore';
import JobsListModal from '../components/JobsListModal';
import { useNavigate } from 'react-router-dom';

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [openJob, setOpenJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]); // array of job ids
  const [likedJobs, setLikedJobs] = useState([]); // array of job ids
  const [user, setUser] = useState(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showLikedModal, setShowLikedModal] = useState(false);
  const navigate = useNavigate();

  // Listen for auth state
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
        const jobsRef = collection(db, 'jobs');
        // Fetch all jobs without ordering (works even if createdAt is missing)
        const snapshot = await getDocs(jobsRef);
        const jobList = [];
        snapshot.forEach(doc => jobList.push({ id: doc.id, ...doc.data() }));
        setHasMore(jobList.length > 20);
        setJobs(jobList);
      } catch (err) {
        setJobs([]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // Load saved/liked jobs from Firestore
  useEffect(() => {
    if (!user) {
      setSavedJobs([]);
      setLikedJobs([]);
      return;
    }
    const fetchUserJobs = async () => {
      const savedSnap = await getUserDocs(fbCollection(db, 'users', user.uid, 'savedJobs'));
      setSavedJobs(savedSnap.docs.map(doc => doc.id));
      const likedSnap = await getUserDocs(fbCollection(db, 'users', user.uid, 'likedJobs'));
      setLikedJobs(likedSnap.docs.map(doc => doc.id));
    };
    fetchUserJobs();
  }, [user]);

  // Only filter by search, always show all jobs otherwise
  useEffect(() => {
    let filtered = jobs;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(s)) ||
        (job.company && job.company.toLowerCase().includes(s)) ||
        (job.description && job.description.toLowerCase().includes(s))
      );
    }
    // If no jobs match search, show all jobs
    setFilteredJobs(filtered.length > 0 ? filtered : jobs);
  }, [jobs, search]);

  // Handlers for save/like/share (now sync with Firestore)
  const handleSave = async (jobId) => {
    if (!user) return alert('Please sign in to save jobs.');
    const ref = doc(db, 'users', user.uid, 'savedJobs', jobId);
    if (savedJobs.includes(jobId)) {
      await deleteDoc(ref);
      setSavedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      await setDoc(ref, { savedAt: new Date() });
      setSavedJobs(prev => [...prev, jobId]);
    }
  };
  const handleLike = async (jobId) => {
    if (!user) return alert('Please sign in to like jobs.');
    const ref = doc(db, 'users', user.uid, 'likedJobs', jobId);
    if (likedJobs.includes(jobId)) {
      await deleteDoc(ref);
      setLikedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      await setDoc(ref, { likedAt: new Date() });
      setLikedJobs(prev => [...prev, jobId]);
    }
  };
  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.description,
        url: window.location.href + '#' + job.id
      });
    } else {
      navigator.clipboard.writeText(window.location.href + '#' + job.id);
      alert('Job link copied to clipboard!');
    }
  };

  return (
    <Box sx={{
      maxWidth: 1200,
      mx: 'auto',
      py: { xs: 1, md: 5 },
      px: { xs: 0.5, sm: 2 },
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 0, md: 3 },
      width: '100%',
    }}>
      {/* Sidebar for saved/liked jobs (hidden on mobile) */}
      <Box sx={{
        width: { xs: '100%', md: 270 },
        minWidth: { xs: 0, md: 220 },
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box sx={{ bgcolor: '#181818', borderRadius: 3, p: 2, mb: 2, border: '2px solid #9A02E2', maxHeight: 220, overflowY: 'auto', cursor: 'pointer' }} onClick={() => navigate('/saved-jobs')}>
          <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1, fontSize: 15 }}>Saved Jobs</Typography>
          {savedJobs.length === 0 ? (
            <Typography sx={{ color: '#bbb', fontSize: 13 }}>No saved jobs</Typography>
          ) : (
            savedJobs.map(id => {
              const job = jobs.find(j => j.id === id);
              return job ? (
                <Box key={id} sx={{ mb: 1 }}>
                  <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{job.title}</Typography>
                  <Typography sx={{ color: '#9A02E2', fontSize: 12 }}>{job.company}</Typography>
                </Box>
              ) : null;
            })
          )}
        </Box>
        <Box sx={{ bgcolor: '#181818', borderRadius: 3, p: 2, border: '2px solid #9A02E2', maxHeight: 220, overflowY: 'auto' }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1, fontSize: 15 }}>Liked Jobs</Typography>
          {likedJobs.length === 0 ? (
            <Typography sx={{ color: '#bbb', fontSize: 13 }}>No liked jobs</Typography>
          ) : (
            <Box sx={{ cursor: 'pointer' }} onClick={() => setShowLikedModal(true)}>
              {likedJobs.map(id => {
                const job = jobs.find(j => j.id === id);
                return job ? (
                  <Box key={id} sx={{ mb: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{job.title}</Typography>
                    <Typography sx={{ color: '#9A02E2', fontSize: 12 }}>{job.company}</Typography>
                  </Box>
                ) : null;
              })}
            </Box>
          )}
        </Box>
      </Box>
      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: { xs: 2, sm: 4 },
            gap: 2,
            width: '100%',
          }}
        >
          <TextField
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs by title, company, or keyword..."
            variant="outlined"
            sx={{
              width: { xs: '100%', sm: 400 },
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: 2,
              mb: { xs: 1.5, sm: 0 },
              fontSize: { xs: 15, sm: 16 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              style: { fontWeight: 600 }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)',
              width: { xs: '100%', sm: 'auto' },
              minWidth: 100,
              py: 1.2,
              fontSize: { xs: 15, sm: 16 },
            }}
            onClick={() => setSearch('')}
          >
            Clear
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {jobs.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 700, mt: 8 }}>
                No jobs found.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {filteredJobs.map((job) => (
                  <Paper key={job.id} onClick={() => setOpenJob(job)} sx={{
                    cursor: 'pointer',
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    boxShadow: 3,
                    background: '#111',
                    border: '2px solid #fff',
                    mb: 2.5,
                    maxWidth: { xs: '100%', sm: 600 },
                    width: '100%',
                    minHeight: 90,
                    transition: 'box-shadow 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    alignItems: 'flex-start',
                    '&:hover': { boxShadow: 7, borderColor: '#9A02E2', background: '#181818' },
                  }}>
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#fff', fontSize: { xs: 15, sm: 17 }, textAlign: 'left', maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</Typography>
                      <Typography fontWeight={700} sx={{ color: '#9A02E2', fontSize: { xs: 13, sm: 15 }, textAlign: 'right', maxWidth: '30%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.company}</Typography>
                    </Box>
                    {/* Experience/Description first line */}
                    {job.description && (
                      <Typography sx={{ color: '#eee', fontSize: { xs: 12, sm: 13 }, mb: 0.5, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {job.description.split('\n')[0] || job.description.split('.')[0] || job.description}
                        {job.description.length > 60 ? '...' : ''}
                      </Typography>
                    )}
                    {/* Details row */}
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
                      {/* Add more fields as needed */}
                    </Box>
                    {/* Removed: No extra description below details row */}
                    <Typography variant="caption" sx={{ color: '#bbb', fontSize: { xs: 10, sm: 11 }, mt: 0.5 }}>
                      Posted: {job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString('en-GB') : ''}
                    </Typography>
                    {/* Action buttons row */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }} onClick={e => e.stopPropagation()}>
                      <IconButton size="small" onClick={() => handleLike(job.id)} sx={{ color: likedJobs.includes(job.id) ? '#9A02E2' : '#bbb' }}>
                        {likedJobs.includes(job.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton size="small" onClick={() => handleSave(job.id)} sx={{ color: savedJobs.includes(job.id) ? '#9A02E2' : '#bbb' }}>
                        {savedJobs.includes(job.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                      <IconButton size="small" onClick={() => handleShare(job)} sx={{ color: '#bbb' }}>
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
            {/* Job Details Dialog */}
            <Dialog open={!!openJob} onClose={() => setOpenJob(null)} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ bgcolor: '#111', color: '#fff', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{openJob?.title}</span>
                <IconButton onClick={() => setOpenJob(null)} sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ bgcolor: '#181818', color: '#fff', p: 2 }}>
                {openJob && (
                  <Box>
                    <Typography fontWeight={700} sx={{ color: '#9A02E2', fontSize: 16, mb: 1 }}>{openJob.company}</Typography>
                    <Typography sx={{ color: '#eee', fontSize: 14, mb: 1 }}>{openJob.description}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                      {openJob.experience && (
                        <Typography sx={{ color: '#ccc', fontSize: 13, fontWeight: 600 }}>
                          Exp: {openJob.experience}
                        </Typography>
                      )}
                      {openJob.salaryRange && (
                        <Typography sx={{ color: '#ccc', fontSize: 13, fontWeight: 600 }}>
                          Salary: {openJob.salaryRange}
                        </Typography>
                      )}
                      {openJob.location && (
                        <Typography sx={{ color: '#ccc', fontSize: 13, fontWeight: 600 }}>
                          Location: {openJob.location}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#bbb', fontSize: 12 }}>
                      Posted: {openJob.createdAt?.toDate ? openJob.createdAt.toDate().toLocaleDateString('en-GB') : ''}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
            </Dialog>
            {/* End Job Details Dialog */}
            {/* Saved Jobs Modal */}
            <Dialog open={showSavedModal} onClose={() => setShowSavedModal(false)} maxWidth="sm" fullWidth>
              <JobsListModal
                jobs={jobs.filter(j => savedJobs.includes(j.id))}
                savedJobs={savedJobs}
                likedJobs={likedJobs}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
                onClose={() => setShowSavedModal(false)}
                title="Saved Jobs"
              />
            </Dialog>
            {/* Liked Jobs Modal */}
            <Dialog open={showLikedModal} onClose={() => setShowLikedModal(false)} maxWidth="sm" fullWidth>
              <JobsListModal
                jobs={jobs.filter(j => likedJobs.includes(j.id))}
                savedJobs={savedJobs}
                likedJobs={likedJobs}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
                onClose={() => setShowLikedModal(false)}
                title="Liked Jobs"
              />
            </Dialog>
            {hasMore && jobs.length > 0 && (
              <Box sx={{ mt: 6, textAlign: 'center', bgcolor: '#f8f4ff', borderRadius: 3, p: { xs: 2, sm: 3 }, boxShadow: 1 }}>
                <Typography variant="body1" color="text.secondary" mb={2} sx={{ fontSize: { xs: 15, sm: 16 } }}>
                  To view more jobs, please login or signup with the JobNRide mobile app.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href="https://play.google.com/store/apps/details?id=com.kdads.jobnride&pcampaignid=web_share"
                  sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, fontWeight: 700, borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
                >
                  Download for Android
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  href="https://apps.apple.com/app/id0000000000"
                  sx={{ fontWeight: 700, borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
                >
                  Download for iOS
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default BrowseJobs;
