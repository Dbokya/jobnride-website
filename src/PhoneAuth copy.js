import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
  Alert,
  Snackbar,
  InputAdornment,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { auth, checkUserInAuth } from './firebase';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import DownloadAppDialog from './DownloadAppDialog';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import logo from './logo.svg';

const ENGLISH_COUNTRIES = [
  { code: '+1', name: 'United States/Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+61', name: 'Australia' },
  { code: '+64', name: 'New Zealand' },
  { code: '+91', name: 'India' },
  { code: '+65', name: 'Singapore' },
  { code: '+27', name: 'South Africa' },
  { code: '+353', name: 'Ireland' },
  { code: '+356', name: 'Malta' },
  { code: '+63', name: 'Philippines' },
  { code: '+254', name: 'Kenya' },
  { code: '+234', name: 'Nigeria' },
  { code: '+92', name: 'Pakistan' },
  { code: '+94', name: 'Sri Lanka' },
  { code: '+880', name: 'Bangladesh' },
];

function PhoneAuth({ onVerified, isPage }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState('+91'); // Default to India
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [verifier, setVerifier] = useState(null);

  const setupRecaptcha = useCallback(async (retry = 0) => {
    try {
      // Clean up any existing verifier
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Error clearing existing verifier:', e);
        }
        window.recaptchaVerifier = null;
      }

      // Create a new verifier
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
          console.log('reCAPTCHA solved');
          setRecaptchaVerified(true);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          setRecaptchaVerified(false);
          setupRecaptcha();
        },
      });

      await verifier.render();
      setVerifier(verifier);
      window.recaptchaVerifier = verifier;
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      if (retry < 3) {
        setTimeout(() => setupRecaptcha(retry + 1), 1000);
      }
    }
  }, []);

  useEffect(() => {
    setupRecaptcha();
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Error clearing verifier on unmount:', e);
        }
      }
    };
  }, [setupRecaptcha]);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Format phone number
      const formattedPhone = countryCode + phone.replace(/[^\d]/g, '');
      console.log('Formatted phone:', formattedPhone);
      
      // Check if user exists in auth
      const exists = await checkUserInAuth(formattedPhone);
      console.log('User exists:', exists);
      
      if (!exists) {
        setShowDownloadDialog(true);
        setLoading(false);
        return;
      }

      // Proceed with OTP
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);
      setShowOTP(true);
      setMaskedPhone(formattedPhone);
      setSuccess('OTP sent successfully!');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await confirmationResult.confirm(otp);
      console.log('Phone authentication successful:', result.user);
      setSuccess('Phone verified successfully!');
      onVerified();
      navigate('/jobs');
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return isPage ? (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#111',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4vw 2vw',
      boxSizing: 'border-box',
    }}>
      <Paper
        elevation={8}
        sx={{
          p: { xs: 2, sm: 4 },
          width: '100%',
          maxWidth: 420,
          borderRadius: 5,
          backgroundColor: 'rgba(0,0,0,0.70)', // pure black, more transparent
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 8px 32px 0 #000',
          backdropFilter: 'blur(6px)', // less blur for more clarity
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/icons/appicon.png" alt="JobNRide Logo" style={{ width: 60, height: 60, marginBottom: 10, filter: 'drop-shadow(0 2px 8px #9A02E244)' }} />
        <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 900, color: '#9A02E2', mb: 0.5, letterSpacing: 1, textShadow: '0 2px 8px #000' }}>
          JobNRide
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600, color: '#fff', mb: 2, textShadow: '0 1px 8px #000' }}>
          Connect. Refer. Ride. Succeed.
        </Typography>
        <Typography variant="h6" align="center" sx={{ fontWeight: 800, color: '#fff', mb: 1, fontSize: 20, textShadow: '0 1px 8px #000' }}>
          Sign in to your account
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: '#fff', mb: 2, textShadow: '0 1px 8px #000' }}>
          Enter your phone number to receive a secure OTP and access all features.<br />
          <span style={{ color: '#9A02E2', fontWeight: 700 }}>Fast, secure, and privacy-first.</span>
        </Typography>

        {!showOTP ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 500 }}>
                Enter your phone number to continue
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                variant="outlined"
                sx={{
                  backgroundColor: '#111',
                  borderRadius: 2,
                  '& .MuiInputBase-root': { color: '#fff', fontWeight: 600, borderColor: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                  '& .MuiSelect-icon': { color: '#fff' },
                  '& .MuiInputLabel-root': { color: '#aaa' },
                }}
                InputLabelProps={{ shrink: true, style: { color: '#aaa' } }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: '#111',
                        color: '#fff',
                      },
                    },
                  },
                }}
              >
                {ENGLISH_COUNTRIES.map((country) => (
                  <MenuItem key={country.code} value={country.code} style={{ color: '#fff', backgroundColor: '#111' }}>
                    {`${country.code} ${country.name}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                  style: { color: '#fff', fontWeight: 600, background: '#111', border: '1.5px solid #fff', borderRadius: 8 },
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                    '& input::placeholder': {
                      color: '#aaa',
                      opacity: 1,
                    },
                  },
                }}
                sx={{ backgroundColor: '#111', borderRadius: 2, '& .MuiOutlinedInput-root': { color: '#fff', borderColor: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' }, '& input::placeholder': { color: '#aaa', opacity: 1 } }}
                InputLabelProps={{ shrink: true, style: { color: '#aaa' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box id="recaptcha-container" sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSendOTP}
                disabled={loading || !recaptchaVerified || !phone}
                sx={{ mt: 2, fontWeight: 700, fontSize: 17, py: 1.2, borderRadius: 2, background: '#111', color: '#fff', '&:hover': { background: '#222' } }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 500 }}>
                Enter the OTP sent to <span style={{ color: '#9A02E2' }}>{maskedPhone}</span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="OTP"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  style: { color: '#111', fontWeight: 600 }
                }}
                sx={{ backgroundColor: '#fff', borderRadius: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp('');
                    setupRecaptcha();
                  }}
                  disabled={loading}
                  sx={{ fontWeight: 700, borderRadius: 2, color: '#111', borderColor: '#111', '&:hover': { borderColor: '#9A02E2', color: '#9A02E2' } }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length < 6}
                  sx={{ fontWeight: 700, borderRadius: 2, background: '#111', color: '#fff', '&:hover': { background: '#222' } }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
    </div>
  ) : (
    <Container maxWidth="sm" sx={{
      py: 4,
      position: 'relative',
      zIndex: 2,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none !important',
    }}>
      {/* Blurred video background overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            minWidth: '100vw',
            minHeight: '100vh',
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            filter: 'blur(2px) brightness(0.95)', // much less blur, almost full brightness
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 0,
            background: 'none',
            display: 'block',
          }}
        >
          <source src="/videos/websitejob.mp4" type="video/mp4" />
        </video>
      </Box>
      <Paper 
        elevation={8} 
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(30,30,30,0.10)', // ultra transparent
          borderRadius: theme.shape.borderRadius,
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 8px 32px 0 #000',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 900, color: '#9A02E2', mb: 0.5, letterSpacing: 1, textShadow: '0 2px 8px #000' }}>
          JobNRide
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600, color: '#fff', mb: 2, textShadow: '0 1px 8px #000' }}>
          Connect. Refer. Ride. Succeed.
        </Typography>
        <Typography variant="h6" align="center" sx={{ fontWeight: 800, color: '#fff', mb: 1, fontSize: 20, textShadow: '0 1px 8px #000' }}>
          Sign in to your account
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: '#fff', mb: 2, textShadow: '0 1px 8px #000' }}>
          Enter your phone number to receive a secure OTP and access all features.<br />
          <span style={{ color: '#9A02E2', fontWeight: 700 }}>Fast, secure, and privacy-first.</span>
        </Typography>

        {!showOTP ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 500 }}>
                Enter your phone number to continue
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                label="Country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                variant="outlined"
                sx={{
                  backgroundColor: '#111',
                  borderRadius: 2,
                  '& .MuiInputBase-root': { color: '#fff', fontWeight: 600, borderColor: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                  '& .MuiSelect-icon': { color: '#fff' },
                  '& .MuiInputLabel-root': { color: '#aaa' },
                }}
                InputLabelProps={{ shrink: true, style: { color: '#aaa' } }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: '#111',
                        color: '#fff',
                      },
                    },
                  },
                }}
              >
                {ENGLISH_COUNTRIES.map((country) => (
                  <MenuItem key={country.code} value={country.code} style={{ color: '#fff', backgroundColor: '#111' }}>
                    {`${country.code} ${country.name}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                  style: { color: '#fff', fontWeight: 600, background: '#111', border: '1.5px solid #fff', borderRadius: 8 },
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff',
                    },
                    '& input::placeholder': {
                      color: '#aaa',
                      opacity: 1,
                    },
                  },
                }}
                sx={{ backgroundColor: '#111', borderRadius: 2, '& .MuiOutlinedInput-root': { color: '#fff', borderColor: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' }, '& input::placeholder': { color: '#aaa', opacity: 1 } }}
                InputLabelProps={{ shrink: true, style: { color: '#aaa' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box id="recaptcha-container" sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSendOTP}
                disabled={loading || !recaptchaVerified || !phone}
                sx={{ mt: 2, fontWeight: 700, fontSize: 17, py: 1.2, borderRadius: 2, background: '#111', color: '#fff', '&:hover': { background: '#222' } }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 500 }}>
                Enter the OTP sent to <span style={{ color: '#9A02E2' }}>{maskedPhone}</span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="OTP"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  style: { color: '#111', fontWeight: 600 }
                }}
                sx={{ backgroundColor: '#fff', borderRadius: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp('');
                    setupRecaptcha();
                  }}
                  disabled={loading}
                  sx={{ fontWeight: 700, borderRadius: 2, color: '#111', borderColor: '#111', '&:hover': { borderColor: '#9A02E2', color: '#9A02E2' } }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length < 6}
                  sx={{ fontWeight: 700, borderRadius: 2, background: '#111', color: '#fff', '&:hover': { background: '#222' } }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Snackbar 
        open={Boolean(error)} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={Boolean(success)} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <DownloadAppDialog
        open={showDownloadDialog}
        onClose={() => setShowDownloadDialog(false)}
      />
    </Container>
  );
}

export default PhoneAuth;
