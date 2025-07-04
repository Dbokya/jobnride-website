import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function InterviewTips() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: { xs: 3, sm: 6 }, px: { xs: 1, sm: 3 }, width: '100%' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" fontWeight={800} mb={2} align="center" sx={{ fontSize: { xs: 22, sm: 32 } }}>Interview Tips</Typography>
        <Typography variant="body1" mb={2} align="center" sx={{ fontSize: { xs: 15, sm: 18 } }}>
          Prepare for your next interview with confidence. Discover common questions, best practices, and tips from hiring experts.
        </Typography>
        <Box component="ul" sx={{ pl: 3, fontSize: { xs: 14, sm: 16 } }}>
          <li>Common interview questions</li>
          <li>How to answer behavioral questions</li>
          <li>What to wear and bring</li>
          <li>Follow-up etiquette</li>
        </Box>
      </Paper>
    </Box>
  );
}
