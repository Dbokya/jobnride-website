import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  Chip,
  IconButton,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  MenuItem,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  SwipeableDrawer,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon,
  Stars as StarsIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { auth } from './firebase';

// Job Details Dialog Component
const JobDetailsDialog = ({ job, open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!job) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'linear-gradient(rgba(154, 2, 226, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(154, 2, 226, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          height: fullScreen ? '100%' : '90vh', // Set maximum height
          display: 'flex',
          flexDirection: 'column',
          color: '#FFFFFF'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid #FFFFFF`,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        color: '#FFFFFF',
        typography: 'h5',
        fontWeight: 'bold'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WorkIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h5" component="div" sx={{ 
            fontWeight: 600,
            color: theme.palette.primary.main 
          }}>
            {job.title}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
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
        flex: 1, 
        overflow: 'auto', 
        py: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.background.paper,
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.primary.main,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.primary.dark,
        },
        color: '#FFFFFF'
      }}>
        <Box sx={{ color: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#FFFFFF' }}>
            Company: {job?.company}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, color: '#FFFFFF' }}>
            <strong>Location:</strong> {job?.location}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, color: '#FFFFFF' }}>
            <strong>Salary Range:</strong> {job?.salaryRange}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, color: '#FFFFFF' }}>
            <strong>Job Type:</strong> {job?.jobType}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, color: '#FFFFFF' }}>
            <strong>Experience Level:</strong> {job?.experienceLevel}
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1, color: '#FFFFFF' }}>
            Job Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#FFFFFF', whiteSpace: 'pre-line' }}>
            {job?.description}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 1, color: '#FFFFFF' }}>
            Requirements
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#FFFFFF', whiteSpace: 'pre-line' }}>
            {job?.requirements}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 1, color: '#FFFFFF' }}>
            Contact Information
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
            Email: {job?.contactEmail}<br />
            Phone: {job?.contactPhone}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        borderTop: '1px solid #FFFFFF',
        py: 2,
        px: 3 
      }}>
        <Button onClick={onClose} variant="outlined" sx={{ 
          color: '#FFFFFF',
          borderColor: '#FFFFFF',
          '&:hover': {
            borderColor: '#FFFFFF',
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Post Job Dialog Component
const PostJobDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    salaryRange: '',
    experienceLevel: '',
    description: '',
    requirements: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Required fields
    if (!formData.title) newErrors.title = 'Job title is required';
    if (!formData.company) newErrors.company = 'Company name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.jobType) newErrors.jobType = 'Job type is required';
    if (!formData.description) newErrors.description = 'Job description is required';
    
    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const experienceLevels = ['Entry Level', '1-3 years', '3-5 years', '5+ years', '10+ years'];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(154, 2, 226, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(154, 2, 226, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" color="primary">Post a New Job</Typography>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {/* Job Title */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Job Title"
                value={formData.title}
                onChange={handleChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                variant="outlined"
              />
            </Grid>

            {/* Company */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Company Name"
                value={formData.company}
                onChange={handleChange('company')}
                error={!!errors.company}
                helperText={errors.company}
                variant="outlined"
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleChange('location')}
                error={!!errors.location}
                helperText={errors.location}
                variant="outlined"
              />
            </Grid>

            {/* Job Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Job Type"
                value={formData.jobType}
                onChange={handleChange('jobType')}
                error={!!errors.jobType}
                helperText={errors.jobType}
                variant="outlined"
              >
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Experience Level */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Experience Level"
                value={formData.experienceLevel}
                onChange={handleChange('experienceLevel')}
                variant="outlined"
              >
                {experienceLevels.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Salary Range */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary Range"
                placeholder="e.g., $50,000 - $70,000"
                value={formData.salaryRange}
                onChange={handleChange('salaryRange')}
                variant="outlined"
              />
            </Grid>

            {/* Contact Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange('contactEmail')}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
                variant="outlined"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                value={formData.description}
                onChange={handleChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                variant="outlined"
              />
            </Grid>

            {/* Requirements */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Requirements"
                value={formData.requirements}
                onChange={handleChange('requirements')}
                variant="outlined"
                placeholder="List the key requirements for this position..."
              />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: '1px solid #FFFFFF',
          p: 2,
          gap: 1
        }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
          >
            Post Job
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const sampleJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    description: 'We are looking for an experienced software engineer to join our dynamic team. The ideal candidate will have strong expertise in React, Node.js, and cloud technologies.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    type: 'Full-time',
    experience: '5+ years',
    skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
    postedDate: '2025-06-20',
    status: 'Active'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Creative Solutions Ltd',
    description: 'Seeking a talented UX/UI designer to create beautiful and intuitive user interfaces for our products. Must have experience with Figma and Adobe Creative Suite.',
    location: 'New York, NY',
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    experience: '3+ years',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI Design'],
    postedDate: '2025-06-22',
    status: 'Active'
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    description: 'Join our data science team to work on cutting-edge machine learning projects. Experience with Python, TensorFlow, and big data technologies required.',
    location: 'Remote',
    salary: '$100,000 - $130,000',
    type: 'Full-time',
    experience: '4+ years',
    skills: ['Python', 'TensorFlow', 'SQL', 'Machine Learning'],
    postedDate: '2025-06-23',
    status: 'Active'
  }
];

const filterOptions = {
  jobType: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
  experience: ['Entry Level', '1-3 years', '3-5 years', '5+ years', '10+ years'],
  salary: ['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'],
  location: ['Remote', 'On-site', 'Hybrid'],
  skills: ['React', 'Node.js', 'Python', 'Java', 'AWS', 'TypeScript', 'UI/UX', 'DevOps']
};

function JobPostingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [userJobs, setUserJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: [],
    location: [],
    experience: []
  });
  const [sortBy, setSortBy] = useState('newest');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openJobDetails, setOpenJobDetails] = useState(false);
  const [openPostJob, setOpenPostJob] = useState(false);

  useEffect(() => {
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/');
      }
    });

    loadUserJobs();

    return () => unsubscribe();
  }, [navigate]);

  const loadUserJobs = async () => {
    setLoading(true);
    try {
      // Simulating API call with sample data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserJobs(sampleJobs);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load your jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEditJob = (jobId) => {
    console.log('Editing job:', jobId);
    // TODO: Implement edit functionality
    navigate(`/jobs/edit/${jobId}`);
  };

  const handleDeleteClick = (jobId) => {
    setSelectedJobId(jobId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // TODO: Implement actual delete logic with Firebase
      setUserJobs(prev => prev.filter(job => job.id !== selectedJobId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setAnchorEl(null);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setOpenJobDetails(true);
  };

  const handlePostJob = (jobData) => {
    // Add a new ID and posted date to the job data
    const newJob = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    // Add the new job to the list
    setUserJobs(prev => [newJob, ...prev]);

    // Show success message or handle any additional logic
    // TODO: Implement actual job posting to backend
  };

  const filteredJobs = userJobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = (
        (filters.jobType.length === 0 || filters.jobType.includes(job.type)) &&
        (filters.location.length === 0 || filters.location.includes(job.location)) &&
        (filters.experience.length === 0 || filters.experience.includes(job.experience))
      );

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.postedDate) - new Date(a.postedDate);
      if (sortBy === 'oldest') return new Date(a.postedDate) - new Date(b.postedDate);
      return 0;
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary',
      pt: 3,
      pb: 8
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            My Job Postings
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenPostJob(true)}
            sx={{ 
              borderRadius: 2,
              py: 1.5,
              px: 3,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 4
            }}
          >
            Post New Job
          </Button>
        </Box>

        {/* Post Job Dialog */}
        <PostJobDialog
          open={openPostJob}
          onClose={() => setOpenPostJob(false)}
          onSubmit={handlePostJob}
        />

        {/* Search and Filter Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 2,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            alignItems: 'center'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setIsFilterDrawerOpen(true)}
              sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
            >
              Sort by
            </Button>
          </Box>
        </Paper>

        {/* Job Listings */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography>{error}</Typography>
          </Paper>
        ) : filteredJobs.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No jobs found
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenPostJob(true)}
              sx={{ mt: 2 }}
            >
              Post Your First Job
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map(job => (
              <Grid item xs={12} key={job.id}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleJobClick(job)}
                >
                  <CardContent>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      mb: 2,
                      gap: 2
                    }}>
                      <Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <BusinessIcon fontSize="small" />
                          {job.company}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                          label={job.status} 
                          color={job.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                        <Tooltip title="Edit Job">
                          <IconButton onClick={() => handleEditJob(job.id)} size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Job">
                          <IconButton onClick={() => handleDeleteClick(job.id)} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography variant="body1" color="text.secondary" paragraph>
                      {job.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ color: 'text.secondary' }} />
                          <Typography variant="body2">{job.location}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PaymentIcon sx={{ color: 'text.secondary' }} />
                          <Typography variant="body2">{job.salary}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ color: 'text.secondary' }} />
                          <Typography variant="body2">{job.type}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Posted: {new Date(job.postedDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {job.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ 
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.dark'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Filter Drawer */}
        <SwipeableDrawer
          anchor="right"
          open={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onOpen={() => setIsFilterDrawerOpen(true)}
          PaperProps={{
            sx: {
              width: isMobile ? '100%' : 320,
              bgcolor: 'background.paper',
              p: 2
            }
          }}
        >
          {/* Drawer content */}
        </SwipeableDrawer>

        {/* Sort Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={() => handleSortChange('newest')}>Newest First</MenuItem>
          <MenuItem onClick={() => handleSortChange('oldest')}>Oldest First</MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: 'background.paper'
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this job posting?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Job Details Dialog */}
        <JobDetailsDialog
          job={selectedJob}
          open={openJobDetails}
          onClose={() => setOpenJobDetails(false)}
        />
      </Container>
    </Box>
  );
}

export default JobPostingPage;
