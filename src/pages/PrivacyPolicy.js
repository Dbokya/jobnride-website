import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: { xs: 3, sm: 6 }, px: { xs: 1, sm: 3 }, width: '100%' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" fontWeight={800} mb={2} align="center" sx={{ fontSize: { xs: 22, sm: 32 } }}>Privacy Policy</Typography>
        <Typography variant="body1" mb={2} align="center" sx={{ fontSize: { xs: 15, sm: 18 } }}>
          Your privacy is important to us. Read our policy to understand how we protect your data and respect your rights.
        </Typography>
        <Box component="ul" sx={{ pl: 3, fontSize: { xs: 14, sm: 16 } }}>
          <li>What information we collect</li>
          <li>How we use your data</li>
          <li>Your privacy rights</li>
        </Box>
      </Paper>
    </Box>
  );
}
