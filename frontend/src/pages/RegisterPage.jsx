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
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await register(username, email, password);
    setIsLoading(false);
    if (result.success) {
        navigate('/');
    } else {
        setError(result.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="xs">
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" fontWeight={800} color="primary" sx={{ letterSpacing: '-3px' }}>
            Task
          </Typography>
        </Box>
        
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#ffffff' }}>
          <Typography component="h1" variant="h5" textAlign="center" fontWeight={700} mb={1}>
            Create a new account
          </Typography>
          <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
            It's quick and easy.
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, mb: 3 }}>
              By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us.
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              color="secondary"
              disabled={isLoading}
              sx={{ py: 1.2, borderRadius: 2, fontSize: '1.1rem', fontWeight: 800 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
            
            <Box textAlign="center" mt={3}>
              <Link component={RouterLink} to="/login" variant="body1" fontWeight={700} sx={{ textDecoration: 'none' }}>
                Already have an account?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
