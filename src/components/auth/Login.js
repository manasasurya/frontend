import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      console.log('Login response:', response.data);
      
      if (response.data?.token) {
        // Log authentication details
        console.log('Authentication successful');
        console.log('Token:', response.data.token);
        console.log('Role:', response.data.role);
        
        // Update auth context with token
        authLogin(response.data.token);
        
        // Navigate to home page after a short delay to allow context to update
        setTimeout(() => {
          console.log('Navigating to home page...');
          navigate('/', { replace: true });
        }, 100);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || 'Authentication failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response from server');
      } else {
        console.error('Error details:', error.message);
        setError('An error occurred during login');
      }
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <Container component="main" maxWidth="xs">
        <Paper className="auth-paper" elevation={3}>
          <img 
            src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" 
            alt="TripAdvisor Logo"
            className="auth-logo"
          />
          <Typography component="h1" variant="h4" className="auth-title">
            Welcome Back
          </Typography>
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#00aa6c' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#00aa6c' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Typography variant="body2" className="auth-switch-text">
              Don't have an account?{' '}
              <Link 
                onClick={() => navigate('/register')} 
                className="auth-switch-link"
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
