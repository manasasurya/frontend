import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log('Initializing with token:', decoded);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            console.log('Token expired, logging out');
            localStorage.removeItem('token');
            setUser(null);
          } else {
            setUser({
              ...decoded,
              token: token // Store token in user object
            });
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log('Login response:', decoded);
      
      localStorage.setItem('token', token);
      setUser({
        ...decoded,
        token: token // Store token in user object
      });
    } catch (error) {
      console.error('Error during login:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => {
    // Check both formats: authorities array and direct role property
    return user?.authorities?.includes('ROLE_ADMIN') || user?.role === 'ROLE_ADMIN';
  };

  const hasRole = (role) => {
    if (!user?.authorities) return false;
    return user.authorities.includes(`ROLE_${role}`);
  };

  const getToken = () => {
    return user?.token || localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      login,
      logout,
      isAdmin,
      hasRole,
      getToken,
      isAuthenticated: !!user,
      isInitialized
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
