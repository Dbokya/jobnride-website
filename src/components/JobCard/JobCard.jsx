import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Button,
  Chip,
  Link,
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  Share,
  Send,
  Schedule,
  AttachMoney,
  LocationOn,
} from '@mui/icons-material';

import { playstoreLink } from '../../utils';
import {format} from 'date-fns'

const JobCard = ({ job, onBookmark, onLike }) => {

  return (
    <Card sx={{maxWidth:'800px'}}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              mr: 2,
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
            }}
          >
            {job.companyLogo}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="start">
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom textAlign={'left'}>
                  {job.company}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => onBookmark(job.id)}
                  color={job.saved ? 'primary' : 'default'}
                >
                  {job.saved ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign={'justify'}>
          {job.description}
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2, mt:2 }}>
          <Chip
            icon={<Schedule />}
            label={job.experience}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<AttachMoney />}
            label={job.salary}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<LocationOn />}
            label={job.location}
            size="small"
            variant="outlined"
          />
          <Chip
            label={job.type}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Typography variant="subtitle2" color="text.secondary" textAlign={'left'}>
          Posted: {format(job.postedDate, 'dd/MM/yyyy')}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Link href={playstoreLink}>
            <Button
            variant="contained"
            color="primary"
            startIcon={<Send />}
            sx={{ mr: 1 }}
            
            >
            Connect Now
            </Button>
        </Link>
        <Button
          variant="outlined"
          onClick={() => onLike(job.id)}
          color={job.liked ? 'secondary' : 'primary'}
        >
          {job.liked ? '♥' : '♡'} {job.liked ? 'Liked' : 'Like'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;