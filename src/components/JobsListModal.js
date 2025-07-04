import React from 'react';
import { Box, Typography, Paper, IconButton, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';

export default function JobsListModal({ jobs, savedJobs, likedJobs, onLike, onSave, onShare, onClose, title }) {
  return (
    <Box sx={{ p: 2, bgcolor: '#181818', minHeight: 300, minWidth: { xs: '90vw', sm: 400 }, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>{title}</Typography>
      {jobs.length === 0 ? (
        <Typography sx={{ color: '#bbb', fontSize: 15 }}>No jobs found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {jobs.map(job => (
            <Paper key={job.id} sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              boxShadow: 3,
              background: '#111',
              border: '2px solid #fff',
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
              <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                <IconButton size="small" onClick={() => onLike(job.id)} sx={{ color: likedJobs.includes(job.id) ? '#9A02E2' : '#bbb' }}>
                  {likedJobs.includes(job.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton size="small" onClick={() => onSave(job.id)} sx={{ color: savedJobs.includes(job.id) ? '#9A02E2' : '#bbb' }}>
                  {savedJobs.includes(job.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
                <IconButton size="small" onClick={() => onShare(job)} sx={{ color: '#bbb' }}>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      <Button onClick={onClose} variant="outlined" sx={{ mt: 3, color: '#fff', borderColor: '#9A02E2' }}>Close</Button>
    </Box>
  );
}
