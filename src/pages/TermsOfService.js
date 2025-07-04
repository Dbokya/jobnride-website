import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function TermsOfService() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: { xs: 3, sm: 6 }, px: { xs: 1, sm: 3 }, width: '100%' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" fontWeight={800} mb={2} align="center" sx={{ fontSize: { xs: 22, sm: 32 } }}>Terms of Service</Typography>
        <Typography variant="body1" mb={2} align="center" sx={{ fontSize: { xs: 15, sm: 18 } }}>
          Review our terms of service to understand your rights and responsibilities when using JobNRide.
        </Typography>
        <Box component="ul" sx={{ pl: 3, fontSize: { xs: 14, sm: 16 } }}>
          <li>Acceptable use policy</li>
          <li>User responsibilities</li>
          <li>Limitations of liability</li>
        </Box>
      </Paper>
    </Box>
  );
}
