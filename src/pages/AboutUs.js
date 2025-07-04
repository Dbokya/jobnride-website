import React from 'react';
import { Box, Typography, Paper, Divider, Link } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';

function AboutUs() {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 120px)',
        width: '100%',
        py: { xs: 2, sm: 8 },
        px: { xs: 1, sm: 2 },
        background: 'linear-gradient(135deg, #1A1024 0%, #9A02E2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 1.5, sm: 6 },
          borderRadius: { xs: 3, sm: 6 },
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
          background: 'rgba(18,18,18,0.98)',
          backdropFilter: 'blur(18px) saturate(180%)',
          border: '1.5px solid #A400F1',
          boxShadow: '0 8px 32px 0 #9A02E244',
        }}
      >
        <Typography
          variant="h2"
          fontWeight={900}
          align="left"
          sx={{
            background: 'linear-gradient(90deg, #9A02E2, #A400F1, #fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            letterSpacing: 1.5,
            fontSize: { xs: 22, sm: 38 }
          }}
        >
          About JobNRide
        </Typography>
        <Typography
          variant="h6"
          align="left"
          color="#fff"
          sx={{ mb: 2, fontWeight: 500, opacity: 0.92, maxWidth: 700, mx: 'auto', lineHeight: 1.7, fontSize: { xs: 13, sm: 18 } }}
        >
          JobNRide is your trusted digital companion for both job seekers and commuters. We blend the power of technology, community, and trust to create a seamless experience for finding jobs and sharing rides.<br /><br />
          <b>What We Offer:</b>
          <ul style={{ margin: '12px 0 0 24px', padding: 0, color: '#fff', fontSize: 15, fontWeight: 400, lineHeight: 1.7, textAlign: 'left' }}>
            <li><b style={{ color: '#A400F1' }}>Smart Job Search:</b> Discover jobs tailored to your skills, location, and preferences. Our AI-driven recommendations help you find the right fit, faster.</li>
            <li><b style={{ color: '#A400F1' }}>Seamless Ride Sharing:</b> Connect with verified riders and drivers for safe, affordable commutes—whether daily, occasional, or intercity.</li>
            <li><b style={{ color: '#A400F1' }}>Instant Notifications:</b> Stay updated on job matches, ride requests, and important alerts in real time.</li>
            <li><b style={{ color: '#A400F1' }}>User Privacy & Security:</b> Your data is protected with industry-leading security and you control your account at all times.</li>
            <li><b style={{ color: '#A400F1' }}>Community & Support:</b> We foster a positive, helpful community and offer responsive support for all users.</li>
          </ul>
          <br />Whether you’re a student, professional, or entrepreneur, JobNRide is designed to empower your journey—every day.
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#A400F1', opacity: 0.18 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
          <RocketLaunchIcon sx={{ mr: 1, color: '#A400F1', fontSize: { xs: 22, sm: 32 } }} />
          <Typography variant="h4" fontWeight={800} color="#A400F1" align="left" sx={{ fontSize: { xs: 18, sm: 28 } }}>Our Mission</Typography>
        </Box>
        <Typography mb={2} color="#fff" fontSize={16} sx={{ opacity: 0.92, maxWidth: 700, mx: 'auto', lineHeight: 1.7, textAlign: 'left' }}>
          To revolutionize the way India moves and works by connecting people to opportunities and safe, affordable rides. We believe in a future where technology bridges gaps—between jobs and talent, between cities and people, and between ambition and achievement.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 3 }}>
          <BusinessIcon sx={{ mr: 1, color: '#fff', fontSize: { xs: 22, sm: 32 } }} />
          <Typography variant="h4" fontWeight={800} color="#fff" align="left" sx={{ fontSize: { xs: 18, sm: 28 } }}>Who We Are</Typography>
        </Box>
        <Box sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}>
          <Typography mb={1.5} color="#fff" fontSize={16} sx={{ opacity: 0.92, lineHeight: 1.7, textAlign: 'left' }}>
            <b style={{ color: '#A400F1' }}>KD Ads Solution Pvt Ltd</b> is a forward-thinking Indian technology firm, passionate about building digital products that solve real-world problems. Our team is a blend of experienced engineers, designers, and business leaders who are committed to:
          </Typography>
          <ul style={{ marginLeft: 24, marginTop: 8, marginBottom: 8, color: '#fff', fontSize: 15, fontWeight: 400, lineHeight: 1.7, textAlign: 'left' }}>
            <li>Delivering user-first, intuitive mobile and web experiences</li>
            <li>Ensuring privacy, security, and transparency in everything we do</li>
            <li>Supporting India’s digital growth and employment ecosystem</li>
            <li>Innovating with the latest in cloud, AI, and mobile technology</li>
            <li>Building a culture of trust, learning, and social impact</li>
          </ul>
        </Box>
        <Typography mb={2} color="#fff" fontSize={16} sx={{ opacity: 0.92, maxWidth: 700, mx: 'auto', lineHeight: 1.7, textAlign: 'left' }}>
          We are not just another app—we are your daily partner in navigating work and travel, securely and affordably. Our vision is to make JobNRide a household name for reliability, safety, and opportunity.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 3 }}>
          <VerifiedUserIcon sx={{ mr: 1, color: '#A400F1', fontSize: { xs: 22, sm: 32 } }} />
          <Typography variant="h4" fontWeight={800} color="#A400F1" align="left" sx={{ fontSize: { xs: 18, sm: 28 } }}>What Makes Us Unique?</Typography>
        </Box>
        <ul style={{ marginLeft: 28, marginBottom: 16, color: '#fff', fontSize: 15, fontWeight: 500, lineHeight: 1.7, opacity: 0.92, maxWidth: 700, marginRight: 'auto', textAlign: 'left' }}>
          <li><b style={{ color: '#A400F1' }}>Dual Platform:</b> Find jobs and rides in one place—no need for multiple apps.</li>
          <li><b style={{ color: '#A400F1' }}>Hyperlocal Focus:</b> Connect with opportunities and rides in your city, college, or neighborhood.</li>
          <li><b style={{ color: '#A400F1' }}>Verified Community:</b> Every user is phone-verified for a safer, more trustworthy experience.</li>
          <li><b style={{ color: '#A400F1' }}>Instant Notifications:</b> Get real-time updates on job matches, ride requests, and more.</li>
          <li><b style={{ color: '#A400F1' }}>Privacy & Control:</b> You own your data. Delete your account and data anytime, no questions asked.</li>
          <li><b style={{ color: '#A400F1' }}>Zero Hidden Fees:</b> Transparent pricing and policies—always.</li>
          <li><b style={{ color: '#A400F1' }}>Career Tools:</b> Resume builder, interview tips, and career advice built right in.</li>
          <li><b style={{ color: '#A400F1' }}>24/7 Support:</b> Our team is always here to help you succeed.</li>
        </ul>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 3 }}>
          <PublicIcon sx={{ mr: 1, color: '#fff', fontSize: { xs: 22, sm: 32 } }} />
          <Typography variant="h4" fontWeight={800} color="#fff" align="left" sx={{ fontSize: { xs: 18, sm: 28 } }}>Our Vision</Typography>
        </Box>
        <Typography mb={2} color="#fff" fontSize={16} sx={{ opacity: 0.92, maxWidth: 700, mx: 'auto', lineHeight: 1.7, textAlign: 'left' }}>
          To become India’s most trusted platform for jobs and rides, empowering millions to move forward—literally and figuratively. We envision a world where every commute is an opportunity, and every opportunity is within reach.<br /><br />
          <b>Our Roadmap:</b>
          <ul style={{ marginLeft: 24, marginTop: 8, marginBottom: 8, color: '#fff', fontSize: 15, fontWeight: 400, lineHeight: 1.7, textAlign: 'left' }}>
            <li>Expand to every major city and campus in India</li>
            <li>Integrate advanced AI for smarter job and ride matching</li>
            <li>Launch new features for employers, recruiters, and ride providers</li>
            <li>Build partnerships with educational institutions and businesses</li>
            <li>Promote sustainability through shared mobility</li>
          </ul>
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#A400F1', opacity: 0.18 }} />
        <Typography variant="h5" fontWeight={800} mb={1} color="#A400F1" align="left" sx={{ fontSize: { xs: 16, sm: 22 } }}>
          📬 Get in Touch
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'flex-start' }}>
          <EmailIcon sx={{ mr: 1, color: '#A400F1', fontSize: { xs: 16, sm: 22 } }} />
          <Link href="mailto:support@jobnride.com" underline="hover" color="#A400F1" fontWeight={700} fontSize={15}>support@jobnride.com</Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'flex-start' }}>
          <LanguageIcon sx={{ mr: 1, color: '#A400F1', fontSize: { xs: 16, sm: 22 } }} />
          <Link href="https://www.jobnride.com" underline="hover" color="#A400F1" fontWeight={700} fontSize={15}>www.jobnride.com</Link>
        </Box>
        <Typography variant="body1" color="#fff" align="left" mt={2} fontWeight={600} fontSize={16} sx={{ opacity: 0.92, maxWidth: 700, mx: 'auto', lineHeight: 1.7 }}>
          Thank you for trusting JobNRide.<br />We’re here to power your career and commute—together.
        </Typography>
      </Paper>
    </Box>
  );
}

export default AboutUs;
