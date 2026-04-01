import React, { useContext } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <Box sx={{ flexGrow: 1, position: 'sticky', top: 0, zIndex: 1100 }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #dadde1' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 60 }}>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                fontWeight: 800,
                color: 'primary.main',
                textDecoration: 'none',
                letterSpacing: '-1px'
              }}
            >
              Task
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 0.5, borderRadius: 10, '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }, cursor: 'pointer' }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem', fontWeight: 600 }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle2" fontWeight="700" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {user.username}
                </Typography>
              </Box>
              <Button 
                color="error" 
                onClick={logout} 
                size="small" 
                variant="text"
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                Log Out
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
