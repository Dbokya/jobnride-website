import React from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import JobCard from '../JobCard/JobCard';

const JobList = ({ jobs, onBookmark, onLike, loading }) => {
    if(loading){
        return <Box sx={{ display: 'flex', justifyContent:'center' }}>
        <CircularProgress />
      </Box>
    }
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Browse Jobs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {jobs.length} jobs found
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <JobCard 
              job={job} 
              onBookmark={onBookmark} 
              onLike={onLike} 
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default JobList;