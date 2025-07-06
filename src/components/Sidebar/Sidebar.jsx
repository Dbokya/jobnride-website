import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  Divider,
  Paper,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';

const Sidebar = ({ mobileOpen, onDrawerToggle, savedJobs, likedJobs, isMobile }) => {
  const theme = useTheme();

  const drawer = (
    <Box sx={{ width: 280, p: 2}}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        JobNRide
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600}>
            Saved Jobs
          </Typography>
          <Chip label={savedJobs.length} size="small" color="primary" />
        </Stack>
        {savedJobs.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No saved jobs
          </Typography>
        ) : (
          <List dense sx={{ mt: 1 }}>
            {savedJobs.slice(0, 3).map((job) => (
              <ListItem key={job.id} sx={{ pl: 0 }}>
                <ListItemText
                  primary={job.title}
                  secondary={job.company}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600}>
            Liked Jobs
          </Typography>
          <Chip label={likedJobs.length} size="small" color="secondary" />
        </Stack>
        {likedJobs.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No liked jobs
          </Typography>
        ) : (
          <List dense sx={{ mt: 1 }}>
            {likedJobs.slice(0, 3).map((job) => (
              <ListItem key={job.id} sx={{ pl: 0 }}>
                <ListItemText
                  primary={job.title}
                  secondary={job.company}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            // width: 280,
            mt: { xs: 7, md: 8 },
            height: { xs: 'auto', md: 'calc(100vh - 389px)' },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;