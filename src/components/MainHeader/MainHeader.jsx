import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  styled,
} from '@mui/material';
import { Menu as MenuIcon, DoorClosed as CloseIcon, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  borderRadius: '12px',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontSize: '1rem',
  fontWeight: 500,
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const ReferButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
  color: 'white',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1.5, 3),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    color: 'white',
    width: 280,
    padding: theme.spacing(2),
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
  marginBottom: theme.spacing(2),
}));

const DrawerListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  marginBottom: theme.spacing(1),
  '& .MuiListItemButton-root': {
    borderRadius: '8px',
    padding: theme.spacing(1.5, 2),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      transform: 'translateX(8px)',
    },
  },
  '& .MuiListItemText-primary': {
    fontSize: '1.1rem',
    fontWeight: 500,
  },
}));

const MainHeader= ({user}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  
  const navItems = [{title:'Home', url:'/'},  {title:'Browse Jobs', url: '/browse-jobs'}, {title:'About',url: '/about-us'}, {title:'Contact', url:'/contact'}];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation=(url)=>{
    navigate(url)
    handleDrawerToggle()
  }
  const navigate = useNavigate()

  const handleOpenDialog=()=>{setOpenJoinDialog(true)}
  const drawer = (
    <Box>
      <DrawerHeader>
      {!user ? 
        <ListItemButton onClick={()=>handleNavigation('/login')} sx={{pl:'unset'}}>
          <AccountCircleIcon style={{ fontSize: 30, color: '#fff' }} />
          <ListItemText primary={'Login'} sx={{ml:'10px'}}/>
        </ListItemButton>
        :
        <button
          onClick={() =>  handleNavigation('/profile')}
          style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 600, fontSize: "16px", display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', cursor: 'pointer', justifyContent: 'flex-end' }}
        >
          <AccountCircleIcon style={{ fontSize: 30, color: '#fff' }} /> Profile
        </button>
        }
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      
      <List>
        {navItems.map((item) => (
          <DrawerListItem key={item.title}>
            <ListItemButton onClick={()=>handleNavigation(item.url)} sx={{border:'1px solid #fff', borderRadius:'12px'}}>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </DrawerListItem>
        ))}
      </List>
        
        <ListItemButton sx={{border:'1px solid #fff', borderRadius:'12px'}}>
          <ListItemText primary={'Signup'} onClick={handleOpenDialog}/>
        </ListItemButton>

      <DrawerListItem sx={{pt:'15px'}}>
          <ReferButton fullWidth onClick={()=>handleNavigation('/my-jobs')}>
            Refer a job
          </ReferButton>
        </DrawerListItem>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <a href="/" style={{textDecoration:'none'}}>
            <Logo>
              <LogoIcon>
                <Users size={24} color="white" />
              </LogoIcon>
              <LogoText variant="h6">JobNRide</LogoText>
            </Logo>
          </a>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <NavButton key={item.title} onClick={()=>navigate(item.url)}>
                    {item.title}
                  </NavButton>
                ))}
              </Box>
              <ReferButton sx={{ ml: 2 }} onClick={()=>navigate('/my-jobs')}>
                Refer a job
              </ReferButton>
              <NavButton onClick={handleOpenDialog}>
                Signup
              </NavButton>
              {!user ? 
              <NavButton onClick={()=>navigate('/login')}>
                Login
              </NavButton>
              :
              <button
              onClick={() =>  navigate('/profile')}
              style={{ background: 'none', border: 'none', color: '#9A02E2', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', cursor: 'pointer', justifyContent: 'flex-end' }}
            >
              <AccountCircleIcon style={{ fontSize: 30, color: '#fff' }} />
            </button>
              }
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant="temporary"
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </StyledDrawer>
      {openJoinDialog && <WelcomeDialog setOpenJoinDialog={setOpenJoinDialog}/>}
    </>
  );
};

export default MainHeader;