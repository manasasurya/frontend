import React from 'react';
import { Box, keyframes } from '@mui/material';
import { Flight, LocationOn, ExploreOutlined } from '@mui/icons-material';

const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const orbit = keyframes`
  0% {
    transform: rotate(0deg) translateX(30px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(30px) rotate(-360deg);
  }
`;

const FloatingLogo = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: '40px',
        top: '100px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
      }}
    >
      {/* Main floating logo */}
      <ExploreOutlined
        sx={{
          fontSize: '3rem',
          color: '#00aa6c',
          animation: `${float} 3s ease-in-out infinite`,
          position: 'relative',
          zIndex: 2,
        }}
      />
      
      {/* Orbiting elements */}
      <Flight
        sx={{
          position: 'absolute',
          color: '#00aa6c',
          fontSize: '1.5rem',
          animation: `${orbit} 8s linear infinite`,
          opacity: 0.7,
        }}
      />
      <LocationOn
        sx={{
          position: 'absolute',
          color: '#00aa6c',
          fontSize: '1.5rem',
          animation: `${orbit} 8s linear infinite`,
          animationDelay: '-4s',
          opacity: 0.7,
        }}
      />
    </Box>
  );
};

export default FloatingLogo;
