import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchBar from '../components/SearchBar/SearchBar';
import JobList from '../components/JobList/JobList';
import Sidebar from '../components/Sidebar/Sidebar';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const BrowseJobsNew = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false)
    const [filteredJobs, setFilteredJobs] = useState([])
    const [likedJobs, setLikedJobs] = useState([])
    const [user, setUser] = useState(null)

    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };

      useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
        });
        return () => unsubscribe();
      }, []);
    
      const handleBookmark = (jobId) => {
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, saved: !job.saved } : job
        ));
      };
    
    
      const handleSearchChange = (value) => {
        setSearchTerm(value);
        const filteredJobs = jobs.filter(job =>
            job?.title?.toLowerCase().includes(value.toLowerCase()) ||
            job?.company?.toLowerCase().includes(value.toLowerCase()) ||
            job?.description?.toLowerCase().includes(value.toLowerCase())
          );
          setFilteredJobs(filteredJobs.length > 0 ? filteredJobs : jobs)
      };
    
      const handleClear = () => {
        setSearchTerm('');
      };

      const fetchJobs = async () => {
        setLoading(true);
        try {
          const jobsRef = collection(db, 'jobs');
          // Fetch all jobs without ordering (works even if createdAt is missing)
          const snapshot = await getDocs(jobsRef);
          const jobList = [];
          snapshot.forEach(doc => jobList.push({ id: doc.id, ...doc.data() }));
        //   setHasMore(jobList.length > 20);
        
          setJobs(jobList);
          setFilteredJobs(jobList)
        } catch (err) {
          setJobs([]);
        }
        setLoading(false);
      };

      useEffect(() => {
        fetchJobs();
      }, []);
    
      
    
      const savedJobs = jobs.filter(job => job.saved);
      

      
      
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
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar 
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        savedJobs={savedJobs}
        likedJobs={likedJobs}
        isMobile={isMobile}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { md: `calc(100% - 280px)` },
        }}
      >
        <Container maxWidth="lg">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClear={handleClear}
          />

          <JobList 
            jobs={filteredJobs}
            onBookmark={handleBookmark}
            onLike={handleLike}
            loading={loading}
          />
        </Container>
      </Box>
    </Box>
  )
}

export default BrowseJobsNew