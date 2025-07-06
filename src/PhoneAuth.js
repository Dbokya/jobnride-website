import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
  InputAdornment,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import { auth, checkUserInAuth } from './firebase';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import DownloadAppDialog from './DownloadAppDialog';

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
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState('+91');
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

  const setupRecaptcha = useCallback(async () => {
    try {
      // Clean up any previous recaptcha
      if (window.recaptchaVerifier) {
        try {
          if (typeof window.recaptchaVerifier.clear === 'function') {
            window.recaptchaVerifier.clear();
          }
        } catch (e) {
          console.log('Recaptcha clear error (safe to ignore if already destroyed):', e);
        }
        window.recaptchaVerifier = null;
      }
      const recaptchaElem = document.getElementById('recaptcha-container');
      if (recaptchaElem) recaptchaElem.innerHTML = '';
      // Create new verifier
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => setRecaptchaVerified(true),
        'expired-callback': () => {
          setRecaptchaVerified(false);
          // Do NOT call setupRecaptcha here to avoid multiple renders
        },
      });
      await verifier.render();
      setVerifier(verifier);
      window.recaptchaVerifier = verifier;
      console.log('Recaptcha rendered');
    } catch (error) {
      // Only retry a limited number of times to avoid infinite loops
      // (Optional: add retry logic if needed)
    }
  }, []);

  useEffect(() => {
    setupRecaptcha();
    return () => {
      if (window.recaptchaVerifier) {
        try {
          if (typeof window.recaptchaVerifier.clear === 'function') {
            window.recaptchaVerifier.clear();
          }
        } catch (e) {
          console.log('Recaptcha clear error (on unmount, safe to ignore):', e);
        }
        window.recaptchaVerifier = null;
      }
      const recaptchaElem = document.getElementById('recaptcha-container');
      if (recaptchaElem) recaptchaElem.innerHTML = '';
    };
  }, [setupRecaptcha]);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const formattedPhone = countryCode + phone.replace(/[^\d]/g, '');
      const exists = await checkUserInAuth(formattedPhone);
      if (!exists) {
        setShowDownloadDialog(true);
        setLoading(false);
        return;
      }
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);
      setShowOTP(true);
      setMaskedPhone(formattedPhone);
      setSuccess('OTP sent successfully!');
      console.log('OTP sent successfully to', formattedPhone);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
      console.log('OTP send error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!confirmationResult) {
        setError('No OTP request in progress.');
        setLoading(false);
        return;
      }
      const result = await confirmationResult.confirm(otp);
      setSuccess('OTP verified!');
      setShowDownloadDialog(true);
      // if (onVerified) {
      //   // Pass the Firebase user object to parent so header updates
      //   await onVerified(result.user);
      // }
      navigate('/my-jobs'); // Redirect to My Jobs after successful verification
      setShowOTP(false);
      setOtp('');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.log('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      p: { xs: 0, sm: 0 },
    }}>
      {/* Blurred video background */}
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
            filter: 'blur(2px) brightness(0.95)',
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
      {/* Floating glassmorphism login box */}
      <Paper
        elevation={8}
        sx={{
          p: { xs: 2, sm: 4 },
          width: '100%',
          maxWidth: { xs: 340, sm: 420 },
          borderRadius: 5,
          backgroundColor: 'rgba(0,0,0,0.70)',
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 8px 32px 0 #000',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/icons/appicon.png" alt="JobNRide Logo" style={{ width: 60, height: 60, marginBottom: 10, filter: 'drop-shadow(0 2px 8px #9A02E244)' }} />
        <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 900, color: '#9A02E2', mb: 0.5, letterSpacing: 1, textShadow: '0 2px 8px #000', fontSize: { xs: 28, sm: 34 } }}>
          JobNRide
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600, color: '#fff', mb: 2, textShadow: '0 1px 8px #000', fontSize: { xs: 14, sm: 16 } }}>
          Connect. Refer. Ride. Succeed.
        </Typography>
        <Typography variant="h6" align="center" sx={{ fontWeight: 800, color: '#fff', mb: 1, fontSize: { xs: 16, sm: 20 }, textShadow: '0 1px 8px #000' }}>
          Sign in to your account
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: '#fff', mb: 2, textShadow: '0 1px 8px #000', fontSize: { xs: 12, sm: 14 } }}>
          Enter your phone number to receive a secure OTP and access all features.<br />
          <span style={{ color: '#9A02E2', fontWeight: 700 }}>Fast, secure, and privacy-first.</span>
        </Typography>
        {!showOTP ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 14, sm: 16 } }}>
                Enter your phone number to continue
              </Typography>
            </Grid>
            <Grid item xs={5} sm={4}>
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
                  fontSize: { xs: 13, sm: 15 },
                }}
                InputLabelProps={{ shrink: true, style: { color: '#aaa', fontSize: 13 } }}
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
                  <MenuItem key={country.code} value={country.code} style={{ color: '#fff', backgroundColor: '#111', fontSize: 13 }}>
                    {`${country.code} ${country.name}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={7} sm={8}>
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
                  style: { color: '#fff', fontWeight: 600, background: '#111', border: '1.5px solid #fff', borderRadius: 8, fontSize: 14 },
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
                sx={{ backgroundColor: '#111', borderRadius: 2, '& .MuiOutlinedInput-root': { color: '#fff', borderColor: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' }, '& input::placeholder': { color: '#aaa', opacity: 1 }, fontSize: 14 }}
                InputLabelProps={{ shrink: true, style: { color: '#aaa', fontSize: 13 } }}
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
                sx={{ mt: 2, fontWeight: 700, fontSize: { xs: 15, sm: 17 }, py: 1.2, borderRadius: 2, background: '#111', color: '#fff', '&:hover': { background: '#222' } }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 14, sm: 16 } }}>
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
                  style: { color: '#111', fontWeight: 600, fontSize: 15 }
                }}
                sx={{ backgroundColor: '#fff', borderRadius: 2, fontSize: 15 }}
                InputLabelProps={{ shrink: true, style: { fontSize: 13 } }}
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
                  }}
                  disabled={loading}
                  sx={{ fontWeight: 700, borderRadius: 2, color: '#111', borderColor: '#111', fontSize: { xs: 15, sm: 17 }, '&:hover': { borderColor: '#9A02E2', color: '#9A02E2' } }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length < 6}
                  sx={{ fontWeight: 700, borderRadius: 2, background: '#111', color: '#fff', fontSize: { xs: 15, sm: 17 }, '&:hover': { background: '#222' } }}
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
    </Box>
  );
}

export default PhoneAuth;
