import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Rating,
  Alert,
  Snackbar
} from '@mui/material';
import { destinationService } from '../../services/api';

const AddDestination = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    rating: 0
  });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name?.trim()) {
      setError('Destination name is required');
      setOpenSnackbar(true);
      return;
    }
    if (!formData.location?.trim()) {
      setError('Location is required');
      setOpenSnackbar(true);
      return;
    }

    // Validate image URL if provided
    if (formData.imageUrl && !formData.imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      setError('Please provide a direct image URL (ending with .jpg, .jpeg, .png, etc.)');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      console.log('Submitting destination data:', formData);
      const response = await destinationService.create(formData);
      console.log('Destination created:', response);
      navigate('/');
    } catch (err) {
      console.error('Error adding destination:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error adding destination';
      console.error('Error details:', errorMessage);
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#00aa6c', mb: 4 }}>
          Add New Destination
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            required
            fullWidth
            label="Destination Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
          />

          <TextField
            required
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            variant="outlined"
          />

          <TextField
            required
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            variant="outlined"
            helperText="Enter a direct image URL (ending with .jpg, .jpeg, .png, etc.). For Pexels images, use the images.pexels.com URL."
            error={formData.imageUrl && !formData.imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              precision={0.5}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#00aa6c',
                '&:hover': { bgcolor: '#008c58' }
              }}
            >
              Add Destination
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{
                color: '#00aa6c',
                borderColor: '#00aa6c',
                '&:hover': {
                  borderColor: '#008c58',
                  color: '#008c58'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddDestination;
