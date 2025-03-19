import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Rating, 
  Button,
  Paper,
  Skeleton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { LocationOn, Star, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import '../../styles/destinations.css';

// Additional images for the gallery (since our database only has one main image)
const getAdditionalImages = (location) => {
  const locationMap = {
    'Jaipur, Rajasthan, India': [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      'https://images.unsplash.com/photo-1599661046251-3c599d7c80c4',
      'https://images.unsplash.com/photo-1599661046816-7e696d5754fe',
      'https://images.unsplash.com/photo-1599661046638-a659cbb45023',
      'https://images.unsplash.com/photo-1599661046304-3ec84affc7ae',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41'
    ],
    'Agra, Uttar Pradesh, India': [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523',
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1585468274952-0b9a01b77b1a',
      'https://images.unsplash.com/photo-1590766740016-10e1910b5042',
      'https://images.unsplash.com/photo-1598425716574-07386ce45df5',
      'https://images.unsplash.com/photo-1600689512986-56c4aa4d9146'
    ],
    'Delhi, India': [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      'https://images.unsplash.com/photo-1555952517-2e8e729e0b44',
      'https://images.unsplash.com/photo-1592639296346-560c37a0f711',
      'https://images.unsplash.com/photo-1598600038159-c3c8b577c87c',
      'https://images.unsplash.com/photo-1595930013415-ca6958dc8a8e',
      'https://images.unsplash.com/photo-1595930013415-ca6958dc8a8e'
    ]
  };

  // If we have predefined images for this location, use them
  if (locationMap[location]) {
    return locationMap[location].map(url => `${url}?q=80&w=800`);
  }

  // Default images for locations without specific galleries
  const defaultImages = [
    'https://images.unsplash.com/photo-1600100397608-f010a8e6d3f3',
    'https://images.unsplash.com/photo-1598425716574-07386ce45df5',
    'https://images.unsplash.com/photo-1590766740016-10e1910b5042',
    'https://images.unsplash.com/photo-1548013146-72479768bada',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    'https://images.unsplash.com/photo-1600689512986-56c4aa4d9146'
  ];

  return defaultImages.map(url => `${url}?q=80&w=800`);
};

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/destinations/${id}`);
        setDestination(response.data);
        setGalleryImages(getAdditionalImages(response.data.location));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destination:', error);
        setLoading(false);
        navigate('/');
      }
    };

    fetchDestination();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="destination-detail">
        <Skeleton variant="rectangular" height={400} />
        <Container>
          <Box sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Box>
        </Container>
      </div>
    );
  }

  if (!destination) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Destination not found
        </Typography>
      </Container>
    );
  }

  return (
    <div className="destination-detail">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        className="back-button"
      >
        Back to Destinations
      </Button>

      <div 
        className="destination-hero"
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      >
        <div className="hero-content">
          <Typography variant="h1" className="hero-title">
            {destination.name}
          </Typography>
          <Typography variant="h6" className="hero-location">
            <LocationOn sx={{ color: '#fff' }} />
            {destination.location}
          </Typography>
          <Box className="hero-rating">
            <Rating
              value={destination.rating}
              precision={0.1}
              readOnly
              icon={<Star sx={{ color: '#00aa6c' }} />}
              emptyIcon={<Star sx={{ color: 'rgba(255,255,255,0.5)' }} />}
            />
            <Typography variant="h6" sx={{ color: '#00aa6c', fontWeight: 600 }}>
              {destination.rating}
            </Typography>
            <Typography variant="body1">
              ({destination.reviewCount} reviews)
            </Typography>
          </Box>
        </div>
      </div>

      <Container className="detail-content">
        <Paper className="detail-card">
          <Typography variant="h2" className="section-title">
            About {destination.name}
          </Typography>
          <Typography variant="body1" className="description-text">
            {destination.description}
          </Typography>

          <Typography variant="h2" className="section-title">
            Photo Gallery
          </Typography>
          <Box className="image-gallery">
            {galleryImages.map((img, index) => (
              <Box
                key={index}
                className="gallery-image-container"
                sx={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '200px',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
            ))}
          </Box>

          {/* Additional sections can be added here, such as:
              - Nearby Attractions
              - Best Time to Visit
              - How to Reach
              - Travel Tips
              - Reviews & Ratings
          */}
        </Paper>
      </Container>
    </div>
  );
};

export default DestinationDetail;
