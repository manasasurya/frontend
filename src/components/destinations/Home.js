import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  Box,
  Container,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Fab,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem
} from '@mui/material';
import { LocationOn, Star, Search, Logout, Add, Edit, Delete, MoreVert } from '@mui/icons-material';
import { destinationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FloatingLogo from '../animations/FloatingLogo';
import SlidingBus from '../animations/SlidingBus';
import '../../styles/destinations.css';
import '../../styles/animations.css';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    location: '',
    description: '',
    imageUrl: '',
    rating: 0
  });
  
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  const userIsAdmin = isAdmin();

  const fetchDestinations = useCallback(async () => {
    try {
      const response = await destinationService.getAll();
      if (response?.data) {
        const uniqueDestinations = response.data.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setDestinations(uniqueDestinations);
        setFilteredDestinations(uniqueDestinations);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error loading destinations';
      setError(errorMessage);
      setOpenSnackbar(true);
      
      if (error.response?.status === 403 || error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const loadDestinations = async () => {
      if (user) {
        await fetchDestinations();
      } else {
        navigate('/login');
      }
    };
    loadDestinations();
  }, [navigate, user, fetchDestinations]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDestinations(destinations);
    } else {
      const filtered = destinations.filter(destination =>
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, [searchQuery, destinations]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    // Filter destinations based on search query
    const filtered = destinations.filter(destination =>
      destination.name.toLowerCase().includes(query.toLowerCase()) ||
      destination.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDestinations(filtered);
    setPage(1); // Reset to first page when searching
  };

  const handleMenuOpen = (event, destination) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('Selected destination for menu:', destination);
    setAnchorEl(event.currentTarget);
    setSelectedDestination(destination);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDestination(null);
  };

  const handleEditClick = () => {
    if (!selectedDestination) return;
    
    console.log('Opening edit dialog for destination:', selectedDestination);
    setEditFormData({
      id: selectedDestination.id,
      name: selectedDestination.name || '',
      location: selectedDestination.location || '',
      description: selectedDestination.description || '',
      imageUrl: selectedDestination.imageUrl || '',
      rating: Number(selectedDestination.rating) || 0
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    console.log('Opening delete dialog for destination:', selectedDestination);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      // Validate required fields
      if (!editFormData.name?.trim() || !editFormData.location?.trim()) {
        setError('Name and location are required');
        setOpenSnackbar(true);
        return;
      }

      if (!editFormData.id) {
        setError('No destination selected for update');
        setOpenSnackbar(true);
        return;
      }

      const updateData = {
        name: editFormData.name.trim(),
        location: editFormData.location.trim(),
        description: editFormData.description?.trim() || '',
        imageUrl: editFormData.imageUrl?.trim(),
        rating: Number(editFormData.rating) || 0
      };

      console.log('Updating destination:', editFormData.id, updateData);
      const response = await destinationService.update(editFormData.id, updateData);
      
      // Update the destination in the current state immediately
      setDestinations(prevDestinations => 
        prevDestinations.map(dest => 
          dest.id === editFormData.id ? { ...dest, ...updateData } : dest
        )
      );
      
      // Also fetch fresh data to ensure consistency
      await fetchDestinations();
      
      // Reset form and close dialog
      setEditDialogOpen(false);
      setSelectedDestination(null);
      setEditFormData({
        id: null,
        name: '',
        location: '',
        description: '',
        imageUrl: '',
        rating: 0
      });
      
      // Show success message
      setError('Destination updated successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error updating destination:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error updating destination';
      setError(errorMsg);
      setOpenSnackbar(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedDestination?.id) {
        throw new Error('No destination selected for deletion');
      }
      console.log('Deleting destination:', selectedDestination.id);
      await destinationService.delete(selectedDestination.id);
      
      // Close dialog and clean up state
      setDeleteDialogOpen(false);
      setSelectedDestination(null);
      setAnchorEl(null);
      
      // Fetch fresh data from server
      await fetchDestinations();
      
      // Show success message
      setError('Destination deleted successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error deleting destination:', err);
      setError(err.response?.data?.message || 'Error deleting destination');
      setOpenSnackbar(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ backgroundColor: '#00aa6c', overflow: 'hidden' }}>
        <Toolbar sx={{ 
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          minHeight: '70px'
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              zIndex: 2,
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            TripAdvisor
          </Typography>
          
          <SlidingBus />
          
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              zIndex: 2
            }}
          >
            <Typography variant="body1" sx={{ mr: 1 }}>
              Logout
            </Typography>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, py: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <FloatingLogo />
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          {user && (
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                animation: 'welcomeSlide 0.5s ease-out forwards'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#00aa6c',
                  fontWeight: 500,
                  background: 'linear-gradient(45deg, #00aa6c 30%, #008c58 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {`Welcome${user.role === 'ADMIN' ? ' Admin' : ''}, ${user.sub}!`}
              </Typography>
              <span 
                role="img" 
                aria-label="wave"
                style={{
                  fontSize: '1.5rem',
                  display: 'inline-block',
                  animation: 'waveHand 1.5s ease-in-out infinite'
                }}
              >
                👋
              </span>
            </Box>
          )}
          <Typography 
            variant="h4" 
            className="title-animation"
            sx={{ 
              mb: 2, 
              fontWeight: 'bold',
              display: 'inline-block',
              background: 'linear-gradient(45deg, #00aa6c 30%, #008c58 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Discover India's Wonders
          </Typography>
          <Typography 
            variant="h6" 
            className="subtitle-animation"
            sx={{ 
              mb: 2, 
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Explore the rich heritage, stunning landscapes, and vibrant culture of India's most beloved destinations
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search destinations by name or location..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              maxWidth: '600px',
              margin: '0 auto 1rem',
              display: 'block',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="shimmer-effect" sx={{ color: '#00aa6c' }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00aa6c',
                  transition: 'all 0.3s ease'
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 170, 108, 0.1)',
                },
                '&.Mui-focused': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 170, 108, 0.15)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#008c58'
                }
              }
            }}
          />
        </Box>

        <Box sx={{ flex: 1, mb: 2 }}>
          <Grid container spacing={2}>
            {filteredDestinations
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((destination) => (
                <Grid item xs={12} sm={6} md={4} key={destination.id}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    {destination.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={destination.imageUrl}
                        alt={destination.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {destination.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <LocationOn sx={{ color: '#00aa6c', mr: 0.5, flexShrink: 0 }} />
                        {destination.location}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating
                          value={destination.rating}
                          readOnly
                          precision={0.5}
                          size="small"
                          icon={<Star sx={{ color: '#00aa6c' }} />}
                          emptyIcon={<Star sx={{ color: '#ccc' }} />}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Button
                          variant="contained"
                          sx={{
                            flex: 1,
                            mr: userIsAdmin ? 1 : 0,
                            backgroundColor: '#00aa6c',
                            '&:hover': {
                              backgroundColor: '#008c58'
                            }
                          }}
                          onClick={() => navigate(`/destinations/${destination.id}`)}
                        >
                          Explore
                        </Button>
                        {userIsAdmin && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Opening menu for destination:', destination);
                              handleMenuOpen(e, {
                                id: destination.id,
                                name: destination.name
                              });
                            }}
                            sx={{ color: '#00aa6c' }}
                          >
                            <MoreVert />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, backgroundColor: 'white', borderRadius: 1 }}>
          <Pagination
            count={Math.ceil(filteredDestinations.length / itemsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#00aa6c',
                '&.Mui-selected': {
                  backgroundColor: '#00aa6c',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#008c58'
                  }
                }
              }
            }}
          />
        </Box>

        {userIsAdmin && (
          <Fab
            color="primary"
            aria-label="add destination"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: '#00aa6c',
              '&:hover': {
                backgroundColor: '#008c58'
              }
            }}
            onClick={() => navigate('/add-destination')}
          >
            <Add />
          </Fab>
        )}
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1, color: '#00aa6c' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete sx={{ mr: 1, color: '#ff1744' }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedDestination(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedDestination?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedDestination(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log('Confirming delete for destination:', selectedDestination);
              handleDeleteConfirm();
            }}
            sx={{ color: '#ff1744' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedDestination(null);
          setEditFormData({
            id: null,
            name: '',
            location: '',
            description: '',
            imageUrl: '',
            rating: 0
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Destination</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              fullWidth
              label="Name"
              value={editFormData.name || ''}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              error={!editFormData.name}
              helperText={!editFormData.name ? 'Name is required' : ''}
            />
            <TextField
              required
              fullWidth
              label="Location"
              value={editFormData.location || ''}
              onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
              error={!editFormData.location}
              helperText={!editFormData.location ? 'Location is required' : ''}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={editFormData.description || ''}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={editFormData.imageUrl || ''}
              onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
            />
            <Box sx={{ mt: 1 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={Number(editFormData.rating) || 0}
                onChange={(event, newValue) => {
                  setEditFormData({ ...editFormData, rating: Number(newValue) || 0 });
                }}
                precision={0.5}
                size="large"
                icon={<Star sx={{ color: '#00aa6c' }} />}
                emptyIcon={<Star sx={{ color: '#ccc' }} />}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setEditDialogOpen(false);
              setEditFormData({
                name: '',
                location: '',
                description: '',
                imageUrl: '',
                rating: 0
              });
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            color="primary"
            disabled={!editFormData.name || !editFormData.location}
            sx={{
              backgroundColor: '#00aa6c',
              '&:hover': {
                backgroundColor: '#008c58'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
