import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Pricing() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: { xs: 3, sm: 6 }, px: { xs: 1, sm: 3 }, width: '100%' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" fontWeight={800} mb={2} align="center" sx={{ fontSize: { xs: 22, sm: 32 } }}>Pricing</Typography>
        <Typography variant="body1" mb={2} align="center" sx={{ fontSize: { xs: 15, sm: 18 } }}>
          Choose the right plan for your hiring needs. Transparent pricing for job postings, featured listings, and more.
        </Typography>
        <Box component="ul" sx={{ pl: 3, fontSize: { xs: 14, sm: 16 } }}>
          <li>Free and premium plans</li>
          <li>Bulk posting discounts</li>
          <li>Featured job upgrades</li>
        </Box>
      </Paper>
    </Box>
  );
}
