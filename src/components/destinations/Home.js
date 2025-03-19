import React, { useState, useEffect } from 'react';
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
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocationOn, Star, Search } from '@mui/icons-material';
import axios from 'axios';
import '../../styles/destinations.css';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/destinations');
        // Remove duplicates based on id
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
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

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
    setSearchQuery(event.target.value);
  };



  return (
    <div className="destinations-container">
      <Container>
        <div className="destinations-header">
          <Typography variant="h1" className="destinations-title">
            Discover India's Wonders
          </Typography>
          <Typography variant="h6" className="destinations-subtitle">
            Explore the rich heritage, stunning landscapes, and vibrant culture of India's most beloved destinations
          </Typography>
          <Box className="search-container">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search destinations by name or location..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00aa6c'
                  }
                }
              }}
            />
          </Box>
        </div>

        <div className="destinations-grid">
          {filteredDestinations.slice(0, 10).map((destination) => (
            <Card key={destination.id} className="destination-card">
              <CardMedia
                className="destination-image"
                component="div"
                style={{
                  backgroundImage: `url(${destination.imageUrl})`,
                  height: 200
                }}
                title={destination.name}
              />
              <CardContent className="destination-content">
                <Typography variant="h6" className="destination-name">
                  {destination.name}
                </Typography>
                <Typography variant="body2" className="destination-location">
                  <LocationOn sx={{ color: '#00aa6c' }} />
                  {destination.location}
                </Typography>
                <Box className="destination-rating">
                  <Rating
                    value={destination.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                    icon={<Star sx={{ color: '#00aa6c' }} />}
                    emptyIcon={<Star sx={{ color: '#e0e0e0' }} />}
                  />
                  <span className="rating-number">{destination.rating}</span>
                  <span className="review-count">
                    ({destination.reviewCount} reviews)
                  </span>
                </Box>
                <Button
                  variant="contained"
                  className="explore-button"
                  onClick={() => navigate(`/destination/${destination.id}`)}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>


      </Container>
    </div>
  );
};

export default Home;
