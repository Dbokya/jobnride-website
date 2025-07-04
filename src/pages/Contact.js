import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Contact() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: { xs: 3, sm: 6 }, px: { xs: 1, sm: 3 }, width: '100%' }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" fontWeight={800} mb={2} align="center" sx={{ fontSize: { xs: 22, sm: 32 } }}>Contact Us</Typography>
        <Typography variant="body1" mb={2} align="center" sx={{ fontSize: { xs: 15, sm: 18 } }}>
          Have questions, feedback, or need support? We're here to help!
        </Typography>
        <Typography variant="body2" mb={1} align="center" sx={{ fontSize: { xs: 14, sm: 16 } }}>
          Email: <a href="mailto:support@jobnride.com" style={{ color: '#9A02E2', fontWeight: 600 }}>support@jobnride.com</a>
        </Typography>
        <Typography variant="body2" align="center" sx={{ fontSize: { xs: 14, sm: 16 } }}>
          For urgent issues, please use the support feature in our mobile app for the fastest response.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Contact;
