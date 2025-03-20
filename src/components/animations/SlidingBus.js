import React from 'react';
import { Box, keyframes } from '@mui/material';
import { DirectionsBus } from '@mui/icons-material';

const slide = keyframes`
  0% {
    right: 0;
  }
  100% {
    right: calc(100% - 30px);
  }
`;

const SlidingBus = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          top: '50%',
          transform: 'translateY(-50%)',
          animation: `${slide} 8s linear infinite`,
        }}
      >
        <DirectionsBus 
          sx={{ 
            fontSize: '2.5rem',
            height: '40px',
            color: '#ffffff',
            transform: 'scaleX(-1)', // Make the bus face left
          }} 
        />
        <Box
          sx={{
            width: '15px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            marginLeft: '-15px',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
          }}
        />
      </Box>
    </Box>
  );
};

export default SlidingBus;
