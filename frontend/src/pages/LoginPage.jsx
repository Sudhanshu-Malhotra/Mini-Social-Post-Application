import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
        navigate('/');
    } else {
        setError(result.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
        {/* Brand Side */}
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h3" fontWeight={800} color="primary" sx={{ letterSpacing: '-2px', mb: 2 }}>
            Task
          </Typography>
          <Typography variant="h5" color="text.primary" sx={{ maxWidth: 450, fontWeight: 500 }}>
            Connect with friends and the world around you on Task.
          </Typography>
        </Box>

        {/* Form Side */}
        <Box sx={{ width: { xs: '100%', sm: 400 }, flexShrink: 0 }}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#ffffff' }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2, mb: 2, py: 1.5, borderRadius: 2, fontSize: '1.1rem', fontWeight: 700 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
              </Button>
              
              <Box textAlign="center" sx={{ borderBottom: '1px solid #dadde1', pb: 3, mb: 3 }}>
                <Link component={RouterLink} to="#" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Forgotten password?
                </Link>
              </Box>

              <Box textAlign="center">
                <Button 
                  component={RouterLink} 
                  to="/register" 
                  variant="contained" 
                  color="secondary"
                  sx={{ py: 1.5, px: 4, fontWeight: 700, borderRadius: 2 }}
                >
                  Create new account
                </Button>
              </Box>
            </Box>
          </Paper>
          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            <strong>Create a Page</strong> for a celebrity, brand or business.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
