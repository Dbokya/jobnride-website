import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function ResumeBuilder() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: { xs: 3, sm: 6 }, px: { xs: 1, sm: 3 }, width: '100%' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" fontWeight={800} mb={2} align="center" sx={{ fontSize: { xs: 22, sm: 32 } }}>Resume Builder</Typography>
        <Typography variant="body1" mb={2} align="center" sx={{ fontSize: { xs: 15, sm: 18 } }}>
          Create a professional resume in minutes. Use our easy-to-use builder to showcase your skills and experience.
        </Typography>
        <Box component="ul" sx={{ pl: 3, fontSize: { xs: 14, sm: 16 } }}>
          <li>Step-by-step resume creation</li>
          <li>Modern templates</li>
          <li>Download as PDF</li>
          <li>Share your resume online</li>
        </Box>
      </Paper>
    </Box>
  );
}
