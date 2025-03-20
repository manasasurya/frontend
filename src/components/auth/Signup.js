import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Link,
  Alert,
  Snackbar
} from '@mui/material';
import { Person, Email, Lock, AdminPanelSettings } from '@mui/icons-material';
import '../../styles/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email?.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password?.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.confirmPassword?.trim()) {
      setError('Please confirm your password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      // Ensure role is properly set
      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role || 'USER'
      };

      console.log('Sending registration request:', requestData);

      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...dataToSend } = requestData;
      
      const response = await axios.post(
        'http://localhost:8081/api/auth/register',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        }
      );

      console.log('Registration successful:', response.data);

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        setError('Registration successful but no token received');
      }
    } catch (error) {
      console.error('Registration failed:', error.response || error);
      
      const errorMessage = error.response?.data ||
                          error.message ||
                          'Registration failed. Please try again.';
      
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
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
            Create Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#00aa6c' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
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
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#00aa6c' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#00aa6c' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
                startAdornment={
                  <InputAdornment position="start">
                    <AdminPanelSettings sx={{ color: '#00aa6c' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-submit-button"
            >
              Sign Up
            </Button>
            <Typography variant="body2" className="auth-switch-text">
              Already have an account?{' '}
              <Link 
                onClick={() => navigate('/login')} 
                className="auth-switch-link"
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={error !== ''}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
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

export default Signup;
