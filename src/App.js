import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import logo from './logo.svg';
import './App.css';
import PhoneAuth from './PhoneAuth';
import JobPostForm from './JobPostForm';
import JobPostingPage from './JobPostingPage';
import BrowseJobs from './pages/BrowseJobs';
import CareerAdvice from './pages/CareerAdvice';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewTips from './pages/InterviewTips';
import PostJobs from './pages/PostJobs';
import Pricing from './pages/Pricing';
import Analytics from './pages/Analytics';
import Support from './pages/Support';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import MyJobs from './MyJobs';
import UserProfile from './UserProfile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { auth } from './firebase';
import SavedJobsPage from './pages/SavedJobsPage';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import BrowseJobsNew from './pages/BrowseJobsNew';
import MainHeader from './components/MainHeader/MainHeader';
import { getAuth, signOut } from 'firebase/auth';

// Create a dark theme instance with custom colors from Flutter app
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9A02E2', // Primary purple
      light: '#A400F1', // Secondary purple (slightly lighter)
      dark: '#902E97', // Tertiary purple
    },
    secondary: {
      main: '#A400F1', // Secondary purple
      light: '#B52FF2',
      dark: '#8A00CD',
    },
    background: {
      default: 'transparent', // Make background transparent
      paper: 'rgba(18,18,18,0.1)', // Very light, almost transparent for cards/dialogs
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#999999', // Grey text
    },
    success: {
      main: '#028436', // textgreen from Flutter
    },
    error: {
      main: '#f44336', // textred from Flutter (using Material Red)
    },
  },
  shape: {
    borderRadius: 0 // Set global border radius to 0
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker backdrop
          }
        },
        paper: {
          borderRadius: 0,
          border: '2px solid #FFFFFF',
          backgroundImage: 'none',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
          '&:before': {
            display: 'none' // Remove any pseudo-elements that might add borders
          },
          '&:after': {
            display: 'none' // Remove any pseudo-elements that might add borders
          }
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #FFFFFF'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #FFFFFF'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          padding: '8px 16px',
        },
        contained: {
          background: 'linear-gradient(45deg, #9A02E2 30%, #A400F1 90%)',
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(45deg, #902E97 30%, #9A02E2 90%)',
          },
        },
        outlined: {
          borderColor: '#9A02E2',
          '&:hover': {
            borderColor: '#A400F1',
            backgroundColor: 'rgba(154, 2, 226, 0.08)'
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: 'none',
          '&:before': {
            display: 'none'
          },
          '&:after': {
            display: 'none'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        notchedOutline: {
          borderColor: 'rgba(154, 2, 226, 0.3)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#9A02E2',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#A400F1',
        }
      }
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
});

function ReferJobPage() {
  const [verified, setVerified] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleVerified = () => {
    setShowDialog(true);
    setTimeout(() => {
      setShowDialog(false);
      setVerified(true);
      window.location.href = '/my-jobs'; // Redirect to My Jobs after verification
    }, 1500);
  };

  return (
    <div className="refer-job-page">
      {!verified && <PhoneAuth onVerified={handleVerified} />}
      {showDialog && (
        <div className="verified-dialog">
          <h3>Phone Verified!</h3>
          <p>Your phone number has been successfully verified.</p>
        </div>
      )}
      {verified && <JobPostForm />}
    </div>
  );
}

function MainPage() {
  const navigate = useNavigate();
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
  // Rotating testimonials
  const testimonials = [
    {
      comment: 'JobNRide helped me connect with my dream job and share rides to reduce pollution. Highly recommend!',
      name: 'Alex M.',
      stars: 10,
      image: '/images/7143953.jpg'
    },
    {
      comment: 'Thanks to JobNRide, I received a referral and found a job while sharing my commute. Amazing app!',
      name: 'Sarah T.',
      stars: 9,
      image: '/images/7178884.jpg'
    },
    {
      comment: 'The platform is super easy to use and the support team is very responsive. Love the eco-friendly mission!',
      name: 'Priya S.',
      stars: 10,
      image: '/images/anxiety-induced-by-traffic.jpg'
    },
    {
      comment: 'I got my first job interview through a referral on JobNRide. The process was smooth and transparent.',
      name: 'John D.',
      stars: 9,
      image: '/images/beard-young-man-sitting-with-his-friend-car-taking-selfie.jpg'
    },
    {
      comment: 'Ride sharing and job search in one place! Saved me time and money every week.',
      name: 'Ravi K.',
      stars: 10,
      image: '/images/ridesharing.png'
    },
    {
      comment: 'Great for both job seekers and employers. Posting jobs is quick and the talent pool is impressive.',
      name: 'Emily W.',
      stars: 9,
      image: '/images/pexels-liza-summer-6347901.jpg'
    },
    {
      comment: 'I love the dark theme and the modern look. The referral rewards are a nice bonus!',
      name: 'Sandeep P.',
      stars: 10,
      image: '/images/Screenshot 2025-06-20 190418.png'
    },
    {
      comment: 'The analytics and support features are top-notch. Highly recommend for companies!',
      name: 'Maya L.',
      stars: 9,
      image: '/images/Screenshot 2025-06-20 190851.png'
    }
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="App" style={{ background: 'transparent', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      {/* Hero Section with Background Video */}
      <section className="hero" style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: isMobile ? '65vh' : '80vh', // increase minHeight for desktop
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2F013E 0%, #9A02E2 100%)',
        width: '100%',
        boxSizing: 'border-box',
        padding: 0,
        zIndex: 3,
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 1,
            filter: 'none',
            transition: 'opacity 0.3s, filter 0.3s',
          }}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="hero-content" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // always center vertically
          padding: isMobile ? '1.5rem 0.5rem' : 0,
          textAlign: 'center',
          color: '#fff',
          background: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          border: 'none',
          pointerEvents: 'auto',
          overflowY: isMobile ? 'auto' : 'visible',
          maxHeight: isMobile ? '100%' : 'none',
        }}>
          <div
            style={{
              pointerEvents: 'auto',
              width: '100%',
              maxWidth: isMobile ? 320 : 500,
              margin: isMobile ? 0 : '0 auto',
              background: 'none',
              boxShadow: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '0 0.5rem' : '0',
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: isMobile ? 10 : 16,
            }}>
              <h1
                style={{
                  fontSize: isMobile ? '1.3rem' : '2rem',
                  fontWeight: 700,
                  marginBottom: isMobile ? 10 : 12,
                  color: '#FFFFFF',
                  textShadow: '0 2px 8px #111, 0 0px 1px #111, 0 0px 2px #111',
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  pointerEvents: 'auto',
                  lineHeight: 1.15,
                  marginTop: 0,
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                Connect, Refer, and Share Rides
              </h1>
              <p
                className="subtitle"
                style={{
                  fontSize: isMobile ? '0.95rem' : '1.05rem',
                  marginBottom: isMobile ? 14 : 16,
                  color: '#FFFFFF',
                  fontWeight: 400,
                  textShadow: '0 2px 8px #111, 0 1px 0 #111',
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  pointerEvents: 'auto',
                  lineHeight: 1.25,
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                Empowering job seekers and employees through referrals and eco-friendly commuting solutions.
              </p>
              <div
                className="hero-rating"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  marginBottom: isMobile ? 10 : 12,
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  pointerEvents: 'auto',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <span
                  className="stars"
                  style={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    color: '#FFD700',
                    textShadow: '0 1px 4px #000a',
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                >
                  ★★★★★
                </span>
                <span
                  className="rating-value"
                  style={{
                    fontWeight: 600,
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    color: '#fff',
                    textShadow: '0 1px 4px #000a',
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                >
                  4.8
                </span>
                <span
                  className="rating-desc"
                  style={{
                    fontSize: isMobile ? '0.85rem' : '0.95rem',
                    color: '#fff',
                    textShadow: '0 1px 4px #000a',
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                >
                  out of 5 stars
                </span>
              </div>
              <button
                className="join-btn"
                style={{
                  background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: isMobile ? '10px 0' : '10px 24px',
                  fontSize: isMobile ? '1rem' : '1.05rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: isMobile ? 8 : 8,
                  boxShadow: '0 2px 12px #9A02E244',
                  letterSpacing: 1,
                  textShadow: '0 1px 4px #000a',
                  width: '100%',
                  maxWidth: isMobile ? 200 : 220,
                  pointerEvents: 'auto',
                  alignSelf: 'center',
                }}
                onClick={() => setOpenJoinDialog(true)}
              >
                Join
              </button>
              <div
                style={{
                  marginTop: isMobile ? 14 : 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  pointerEvents: 'auto',
                  width: '100%',
                  maxWidth: isMobile ? 260 : 300,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <a
                  href="https://play.google.com/store/apps/details?id=com.kdads.jobnride&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#fff',
                    color: '#9A02E2',
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: isMobile ? '12px 0' : '10px 24px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px #9A02E244',
                    border: '1.5px solid #9A02E2',
                    fontSize: 16,
                    transition: 'background 0.2s, color 0.2s',
                    marginRight: 0,
                    width: '100%',
                    maxWidth: isMobile ? 260 : 300,
                    pointerEvents: 'auto',
                    textAlign: 'center',
                  }}
                >
                  Download Android App
                </a>
                <a
                  href="https://apps.apple.com/app/id0000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#fff',
                    color: '#9A02E2',
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: isMobile ? '12px 0' : '10px 24px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px #9A02E244',
                    border: '1.5px solid #9A02E2',
                    fontSize: 16,
                    transition: 'background 0.2s, color 0.2s',
                    width: '100%',
                    maxWidth: isMobile ? 260 : 300,
                    pointerEvents: 'auto',
                    textAlign: 'center',
                  }}
                >
                  Download iOS App
                </a>
              </div>
            </div>
            {/* Join Dialog */}
            {openJoinDialog && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(26,16,36,0.85)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
                onClick={() => setOpenJoinDialog(false)}
              >
                <div
                  style={{
                    background: '#fff',
                    color: '#2F013E',
                    borderRadius: 16,
                    padding: 36,
                    minWidth: 340,
                    maxWidth: 400,
                    boxShadow: '0 8px 32px #9A02E244',
                    border: '2px solid #9A02E2',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setOpenJoinDialog(false)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 16,
                      background: 'none',
                      border: 'none',
                      fontSize: 22,
                      color: '#9A02E2',
                      cursor: 'pointer',
                    }}
                    aria-label="Close"
                  >×</button>
                  <h2 style={{ color: '#9A02E2', fontWeight: 800, marginBottom: 12 }}>Welcome to JobNRide!</h2>
                  <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>
                    Thank you for your interest in joining our community.<br />
                    Download the JobNRide app to get started and unlock exclusive features!
                  </p>
                  <div style={{ marginBottom: 18 }}>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.kdads.jobnride&pcampaignid=web_share"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        background: '#9A02E2',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: 8,
                        padding: '10px 24px',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px #9A02E244',
                        border: '1.5px solid #9A02E2',
                        marginRight: 12,
                        fontSize: 16,
                        marginBottom: 8,
                        transition: 'background 0.2s, color 0.2s',
                      }}
                    >
                      Download for Android
                    </a>
                    <a
                      href="https://apps.apple.com/app/id0000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        background: '#9A02E2',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: 8,
                        padding: '10px 24px',
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px #9A02E244',
                        border: '1.5px solid #9A02E2',
                        fontSize: 16,
                        marginBottom: 8,
                        transition: 'background 0.2s, color 0.2s',
                      }}
                    >
                      Download for iOS
                    </a>
                  </div>
                  <p style={{ fontSize: 15, color: '#555', marginBottom: 0 }}>
                    Already have the app? <b>Sign in</b> to start connecting, referring, and sharing rides!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" style={{
        background: '#fff',
        color: '#2F013E',
        padding: isMobile ? '16px 0' : '32px 0',
        textAlign: 'center',
        fontWeight: 700,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: isMobile ? 8 : 16,
        marginTop: isMobile ? 24 : 32, // Increased margin-top for mobile
        minHeight: isMobile ? 0 : undefined,
      }}>
        <div className="stat" style={{ display: 'inline-block', margin: isMobile ? '0 6px' : '0 16px', minWidth: 90 }}>
          <span className="stat-value" style={{ fontSize: isMobile ? 20 : 28, color: '#9A02E2' }}>25K+</span>
          <span className="stat-label" style={{ display: 'block', fontSize: isMobile ? 12 : 14 }}>Successful Connections</span>
        </div>
        <div className="stat" style={{ display: 'inline-block', margin: isMobile ? '0 6px' : '0 16px', minWidth: 90 }}>
          <span className="stat-value" style={{ fontSize: isMobile ? 20 : 28, color: '#9A02E2' }}>10K+</span>
          <span className="stat-label" style={{ display: 'block', fontSize: isMobile ? 12 : 14 }}>Rides Shared</span>
        </div>
        <div className="stat" style={{ display: 'inline-block', margin: isMobile ? '0 6px' : '0 16px', minWidth: 90 }}>
          <span className="stat-value" style={{ fontSize: isMobile ? 20 : 28, color: '#9A02E2' }}>5K+</span>
          <span className="stat-label" style={{ display: 'block', fontSize: isMobile ? 12 : 14 }}>Referrals Rewarded</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" style={{ background: '#fff', color: '#2F013E', padding: '32px 0', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
        <div className="feature" style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#9A02E2', fontWeight: 800, fontSize: 'clamp(1.1rem, 5vw, 2rem)' }}>Job Referrals Made Easy</h2>
          <p style={{ fontWeight: 500, fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>Get job referrals from employees and enhance your job search experience effortlessly.</p>
        </div>
        <div className="feature" style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#9A02E2', fontWeight: 800, fontSize: 'clamp(1.1rem, 5vw, 2rem)' }}>Ride Sharing</h2>
          <p style={{ fontWeight: 500, fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>Connecting Jobs and Rides Seamlessly. At JobNRide, we bridge the gap between job seekers and employees, facilitating referrals while promoting eco-friendly commuting options. Join us to enhance your job search and reduce pollution together.</p>
        </div>
        <div className="feature">
          <h2 style={{ color: '#9A02E2', fontWeight: 800, fontSize: 'clamp(1.1rem, 5vw, 2rem)' }}>Empowering Job Seekers Today</h2>
          <p style={{ fontWeight: 500, fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>Our innovative app not only connects you with potential job opportunities but also encourages shared commuting, rewarding employees for referrals and fostering a community dedicated to sustainability and professional growth.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" style={{ position: 'relative', minHeight: 320, overflow: 'hidden', width: '100%' }}>
        {/* Clear background video behind testimonials */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 1, // Make video fully visible and clear
            filter: 'none',
          }}
        >
          <source src="/videos/websitejob.mp4" type="video/mp4" />
        </video>
        <h2 style={{ color: '#9A02E2', fontWeight: 800, textAlign: 'center', position: 'relative', zIndex: 1 }}>What Our Users Say</h2>
        <div className="testimonial-list" style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="testimonial" style={{ maxWidth: 500, width: '90vw', textAlign: 'center', background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px #9A02E244', color: '#2F013E', border: '1.5px solid #9A02E2', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.1rem)', fontStyle: 'italic', marginBottom: 12, color: '#2F013E' }}>
              "{testimonials[currentTestimonial].comment}"
            </p>
            <span className="testimonial-name" style={{ fontWeight: 700, color: '#9A02E2' }}>{testimonials[currentTestimonial].name}</span>
            <div className="testimonial-stars" style={{ color: '#FFD700', fontSize: 20, marginTop: 4, textShadow: '0 1px 4px #fff8' }}>
              {'★'.repeat(testimonials[currentTestimonial].stars)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  const navigate = useNavigate();
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
  return (
    <footer
      className="footer"
      style={{
        background: '#fff',
        color: '#2F013E',
        borderTop: '2px solid #9A02E2',
        padding: isMobile ? '12px 0 0 0' : '32px 0 0 0',
        fontSize: isMobile ? 13 : 16,
      }}
    >
      <div
        className="footer-main"
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'stretch',
          justifyContent: 'space-between',
          gap: isMobile ? 16 : 32,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '0 10px' : '0 32px',
        }}
      >
        <div className="footer-brand" style={{ flex: 1, marginBottom: isMobile ? 12 : 0 }}>
          <img
            src={process.env.PUBLIC_URL + '/icons/appicon.png'}
            alt="JobNRide Logo"
            style={{ width: isMobile ? 32 : 48, height: isMobile ? 32 : 48, borderRadius: 8, marginBottom: 6 }}
          />
          <span style={{ color: '#9A02E2', fontWeight: 900, fontSize: isMobile ? 17 : 24, display: 'block', marginBottom: 2 }}>JobNRide</span>
          <p style={{ margin: 0, fontSize: isMobile ? 12 : 15, lineHeight: 1.3 }}>Empowering job seekers and employees through referrals and eco-friendly commuting solutions.</p>
          <a href="mailto:hello@jobnride.com" style={{ color: '#9A02E2', fontWeight: 600, fontSize: isMobile ? 12 : 15 }}>hello@jobnride.com</a>
        </div>
        <div className="footer-links" style={{ flex: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 8 : 32, marginBottom: isMobile ? 12 : 0 }}>
          <div style={{ marginBottom: isMobile ? 6 : 0 }}>
            <h4 style={{ color: '#9A02E2', fontWeight: 800, fontSize: isMobile ? 14 : 17, margin: 0 }}>For Job Seekers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/browse-jobs')}>Browse Jobs</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/career-advice')}>Career Advice</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/resume-builder')}>Resume Builder</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/interview-tips')}>Interview Tips</li>
            </ul>
          </div>
          <div style={{ marginBottom: isMobile ? 6 : 0 }}>
            <h4 style={{ color: '#9A02E2', fontWeight: 800, fontSize: isMobile ? 14 : 17, margin: 0 }}>For Employers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/post-jobs')}>Post Jobs</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/pricing')}>Pricing</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/analytics')}>Analytics</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/support')}>Support</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#9A02E2', fontWeight: 800, fontSize: isMobile ? 14 : 17, margin: 0 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/about-us')}>About Us</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/contact')}>Contact</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/privacy-policy')}>Privacy Policy</li>
              <li style={{ cursor: 'pointer', color: '#2F013E', fontWeight: 600, marginBottom: 2, fontSize: isMobile ? 12 : 15 }} onClick={() => navigate('/terms-of-service')}>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="footer-newsletter" style={{ flex: 1, marginTop: isMobile ? 8 : 0 }}>
          <h4 style={{ color: '#9A02E2', fontSize: isMobile ? 13 : 16, margin: 0 }}>Enter your email address</h4>
          <input
            type="email"
            placeholder="Your email for notifications"
            style={{
              border: '1px solid #9A02E2',
              borderRadius: 8,
              padding: isMobile ? 6 : 8,
              background: '#fff',
              color: '#2F013E',
              fontSize: isMobile ? 12 : 15,
              width: isMobile ? 140 : 180,
              marginBottom: isMobile ? 6 : 8,
              marginTop: isMobile ? 2 : 4,
              display: 'block',
            }}
          />
          <button
            style={{
              background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: isMobile ? '7px 10px' : '10px 20px',
              fontWeight: 600,
              fontSize: isMobile ? 12 : 15,
              marginTop: isMobile ? 2 : 8,
              width: isMobile ? 140 : 180,
              display: 'block',
            }}
          >
            Submit your application now
          </button>
          <p style={{ color: '#2F013E', fontSize: isMobile ? 11 : 14, margin: isMobile ? '4px 0 0 0' : '8px 0 0 0' }}>
            Reach out for job referrals and ride-sharing opportunities.
          </p>
        </div>
      </div>
      <div
        className="footer-bottom"
        style={{
          borderTop: '1px solid #9A02E2',
          marginTop: isMobile ? 10 : 24,
          paddingTop: isMobile ? 6 : 12,
          color: '#9A02E2',
          fontSize: isMobile ? 11 : 14,
          textAlign: 'center',
        }}
      >
        <span>© 2025 JobNRide. All rights reserved.</span>
      </div>
    </footer>
  );
}

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = window.innerWidth <= 900;

  const menuItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Browse Jobs', onClick: () => navigate('/browse-jobs') },
    { label: 'About', onClick: () => navigate('/about-us') },
    { label: 'Contact', onClick: () => navigate('/contact') },
  ];

  return (
    <>
      <nav className="navbar" style={{
        background: '#1A1024',
        boxShadow: '0 2px 12px #9A02E233',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '4px 8px' : '8px 32px',
        minHeight: isMobile ? 44 : 64,
        height: isMobile ? 44 : 64,
        position: 'relative',
      }}>
        <div className="navbar-logo" style={{
          display: 'flex',
          alignItems: 'center',
          flex: '0 0 auto',
          minWidth: 0,
          marginLeft: isMobile ? 0 : 0,
        }}>
          <img src={process.env.PUBLIC_URL + '/icons/appicon.png'} alt="JobNRide Logo" style={{ width: isMobile ? 28 : 40, height: isMobile ? 28 : 40, borderRadius: 6, marginRight: isMobile ? 4 : 8, marginLeft: isMobile ? 0 : 0 }} />
          <span className="brand" style={{ color: '#9A02E2', fontWeight: 900, fontSize: isMobile ? 18 : 28, textShadow: '0 2px 8px #fff2', marginLeft: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>JobNRide</span>
        </div>
        {isMobile ? (
          <>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#9A02E2', ml: 1 }} style={{ marginLeft: 'auto', marginRight: 0, padding: 4, position: 'absolute', right: 4, top: 4 }}>
              <MenuIcon fontSize="medium" />
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{
                keepMounted: true,
              }}
              PaperProps={{
                style: {
                  right: 0,
                  left: 'auto',
                  top: 44, // below the menu bar (menu bar height is 44px on mobile)
                  height: 'calc(100% - 44px)',
                  width: 180, // restore original drawer width
                  transition: 'none',
                  boxShadow: '0 0 24px #9A02E288',
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  background: '#1A1024',
                },
              }}
              SlideProps={{
                direction: 'right',
                timeout: 0,
                appear: false,
                mountOnEnter: true,
                unmountOnExit: true,
              }}
              transitionDuration={0}
            >
              <div style={{ width: '100%', height: '100%', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  {menuItems.map((item, idx) => (
                    <button key={item.label} onClick={() => { item.onClick(); setMobileOpen(false); }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 14, textAlign: 'right', padding: '10px 0', fontWeight: 500, cursor: 'pointer', borderRadius: 6, transition: 'background 0.2s', width: '100%' }}>{item.label}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, alignItems: 'flex-end' }}>
                  <button
                    onClick={() => { navigate('/refer-job'); setMobileOpen(false); }}
                    style={{ background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontWeight: 700, fontSize: 13, margin: '4px 0', boxShadow: '0 2px 8px #9A02E288', cursor: 'pointer', letterSpacing: 1, width: '100%', borderBottom: '2px solid #fff2', textAlign: 'right' }}
                  >
                    Refer a job
                  </button>
                  {user ? (
                    <button
                      onClick={() => { navigate('/profile'); setMobileOpen(false); }}
                      style={{ background: 'none', border: 'none', color: '#9A02E2', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', cursor: 'pointer', justifyContent: 'flex-end' }}
                    >
                      <AccountCircleIcon style={{ fontSize: 20, color: '#9A02E2' }} /> Profile
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                      <button
                        onClick={() => { navigate('/login'); setMobileOpen(false); }}
                        style={{ background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, fontSize: 13, boxShadow: '0 2px 8px #9A02E244', cursor: 'pointer', letterSpacing: 1, textAlign: 'right' }}
                      >
                        Login
                      </button>
                      <button
                        onClick={() => { setOpenJoinDialog(true); setMobileOpen(false); }}
                        style={{ background: 'linear-gradient(90deg, #A400F1 0%, #9A02E2 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, fontSize: 13, boxShadow: '0 2px 8px #9A02E244', cursor: 'pointer', letterSpacing: 1, textAlign: 'right' }}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Drawer>
          </>
        ) : (
          <ul className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: 24, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.label} onClick={item.onClick} style={{ cursor: 'pointer' }}>{item.label}</li>
            ))}
            <li className="refer-btn" style={{ cursor: 'pointer', fontWeight: 700, marginLeft: 4 }}>
              <button
                onClick={() => navigate('/refer-job')}
                style={{ background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 12px #9A02E244', cursor: 'pointer', letterSpacing: 1 }}
              >
                Refer a job
              </button>
            </li>
            {user ? (
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => navigate('/profile')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: 0, color: '#fff', display: 'flex', alignItems: 'center' }}
                  aria-label="Profile"
                >
                  <AccountCircleIcon style={{ fontSize: 32, color: '#9A02E2' }} />
                </button>
              </li>
            ) : (
              <li style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{ background: 'linear-gradient(90deg, #9A02E2 0%, #A400F1 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 12px #9A02E244', cursor: 'pointer', letterSpacing: 1, transition: 'background 0.2s, color 0.2s' }}
                >
                  Login
                </button>
                <button
                  onClick={() => setOpenJoinDialog(true)}
                  style={{ background: 'linear-gradient(90deg, #A400F1 0%, #9A02E2 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 12px #9A02E244', cursor: 'pointer', letterSpacing: 1, transition: 'background 0.2s, color 0.2s' }}
                >
                  Sign Up
                </button>
              </li>
            )}
          </ul>
        )}
      </nav>
      {/* Join Dialog */}
      {openJoinDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(26,16,36,0.85)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setOpenJoinDialog(false)}
        >
          <div
            style={{
              background: '#fff',
              color: '#2F013E',
              borderRadius: 16,
              padding: 36,
              minWidth: 340,
              maxWidth: 400,
              boxShadow: '0 8px 32px #9A02E244',
              border: '2px solid #9A02E2',
              textAlign: 'center',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenJoinDialog(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 22,
                color: '#9A02E2',
                cursor: 'pointer',
              }}
              aria-label="Close"
            >×</button>
            <h2 style={{ color: '#9A02E2', fontWeight: 800, marginBottom: 12 }}>Welcome to JobNRide!</h2>
            <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>
              Thank you for your interest in joining our community.<br />
              Download the JobNRide app to get started and unlock exclusive features!
            </p>
            <div style={{ marginBottom: 18 }}>
              <a
                href="https://play.google.com/store/apps/details?id=com.kdads.jobnride&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#9A02E2',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: '10px 24px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px #9A02E244',
                  border: '1.5px solid #9A02E2',
                  marginRight: 12,
                  fontSize: 16,
                  marginBottom: 8,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Download for Android
              </a>
              <a
                href="https://apps.apple.com/app/id0000000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#9A02E2',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: '10px 24px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px #9A02E244',
                  border: '1.5px solid #9A02E2',
                  fontSize: 16,
                  marginBottom: 8,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Download for iOS
              </a>
            </div>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 0 }}>
              Already have the app? <b>Sign in</b> to start connecting, referring, and sharing rides!
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const location = window.location.pathname;
  const [user, setUser] = useState(null); // null = not logged in, object = logged in
  const [showProfile, setShowProfile] = useState(false);
  
  // On mount, check if user is already logged in (persisted by Firebase)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Only set background transparent for login page
  const isLoginPage = location === '/login';

  // Handler for successful login (OTP verification)
  const handleLogin = (userData) => {
    setUser(userData);
    setShowProfile(false);
    
  };

  // Handler for logout
  const handleLogout = async() => {
    // setUser(null);
    // setShowProfile(false);
    
    const auth = getAuth();
    signOut(auth).then(()=>{
      alert('User Logged out successfully')
    })
    window.location.href = '/';
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        {/* <Header user={user} onLogout={handleLogout} /> */}
        <MainHeader user={user}/>
        <div className="App" style={{ background: isLoginPage ? 'transparent' : '#1A1024', minHeight: '100vh' }}>
          <Routes>
            <Route 
              path="/" 
              element={<MainPage />} 
            />
            <Route 
              path="/login" 
              element={<PhoneAuth onVerified={handleLogin} />} 
            />
            <Route 
              path="/jobs" 
              element={<Navigate to="/login" />} 
            />
            <Route 
              path="/refer-job" 
              element={<Navigate to="/login" />} 
            />
            <Route 
              path="/about-us" 
              element={<AboutUs />} 
            />
            <Route 
              path="/contact" 
              element={<Contact />} 
            />
            <Route 
              path="/browse-jobs" 
              element={<BrowseJobs />} 
            />
            <Route 
              path="/career-advice" 
              element={<CareerAdvice />} 
            />
            <Route 
              path="/resume-builder" 
              element={<ResumeBuilder />} 
            />
            <Route 
              path="/interview-tips" 
              element={<InterviewTips />} 
            />
            <Route 
              path="/post-jobs" 
              element={<PostJobs />} 
            />
            <Route 
              path="/pricing" 
              element={<Pricing />} 
            />
            <Route 
              path="/analytics" 
              element={<Analytics />} 
            />
            <Route 
              path="/support" 
              element={<Support />} 
            />
            <Route 
              path="/privacy-policy" 
              element={<PrivacyPolicy />} 
            />
            <Route 
              path="/terms-of-service" 
              element={<TermsOfService />} 
            />
            <Route 
              path="/my-jobs" 
              element={<MyJobs />} 
            />
            <Route
              path="/profile"
              element={<UserProfile user={user} onLogout={handleLogout} onClose={() => window.history.back()} />}
            />
            <Route path="/saved-jobs" element={<SavedJobsPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
