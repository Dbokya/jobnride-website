import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  PhoneAndroid as PhoneIcon
} from '@mui/icons-material';

function DownloadAppDialog({ open, onClose }) {
  const theme = useTheme();
  const benefits = [
    'Easy job posting and management',
    'Real-time notifications',
    'Chat with candidates',
    'Track applications'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth      PaperProps={{
        sx: {
          borderRadius: '0 !important', // Force remove border radius
          backgroundColor: theme.palette.background.paper,
          border: `2px solid ${theme.palette.primary.main}`, // Add border with primary color
          boxShadow: `0 0 20px rgba(154, 2, 226, 0.15)`, // Subtle glow effect
          overflow: 'hidden', // Ensure clean edges
          '& .MuiDialog-paper': {
            borderRadius: '0 !important', // Force remove border radius on inner paper
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        borderBottom: `1px solid ${theme.palette.primary.main}`, // Add bottom border
        backgroundColor: 'rgba(154, 2, 226, 0.05)' // Subtle background
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
            Download JobNRide App
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          size="small"
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: 'rgba(154, 2, 226, 0.08)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 3,
        backgroundColor: theme.palette.background.paper
      }}>
        <Typography variant="body1" sx={{ 
          mb: 2,
          color: theme.palette.text.primary
        }}>
          To post jobs on JobNRide, you need to download and register on our mobile app first.
        </Typography>

        <Typography variant="subtitle1" sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: theme.palette.primary.main
        }}>
          Benefits of using the app:
        </Typography>

        <List sx={{ 
          backgroundColor: 'rgba(154, 2, 226, 0.05)',
          border: '1px solid rgba(154, 2, 226, 0.1)',
          borderRadius: 0,
          mb: 2
        }}>
          {benefits.map((benefit, index) => (
            <ListItem key={index} dense>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckIcon sx={{ color: theme.palette.primary.main }} fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={benefit} 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: theme.palette.text.primary 
                  }
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2,
          mt: 3,
          pt: 3,
          borderTop: `1px solid rgba(154, 2, 226, 0.1)`
        }}>
          <a 
            href="https://play.google.com/store/apps/details?id=com.kdads.jobnride&pcampaignid=web_share" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <img 
              src="/images/playstore.png" 
              alt="Get it on Google Play"
              style={{ 
                height: '48px',
                filter: theme.palette.mode === 'dark' ? 'brightness(0.8)' : 'none'
              }}
            />
          </a>
          <a 
            href="https://apps.apple.com/app/jobnride" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <img 
              src="/images/applestore.png" 
              alt="Download on the App Store"
              style={{ 
                height: '48px',
                filter: theme.palette.mode === 'dark' ? 'brightness(0.8)' : 'none'
              }}
            />
          </a>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: 'rgba(154, 2, 226, 0.05)'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              backgroundColor: 'rgba(154, 2, 226, 0.08)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DownloadAppDialog;
