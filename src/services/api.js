import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const destinationService = {
    getAll: () => api.get('/destinations'),
    getTop: () => api.get('/destinations/top'),
    getById: (id) => api.get(`/destinations/${id}`),
    search: (query) => api.get(`/destinations/search?query=${query}`),
    create: (destinationData) => api.post('/destinations', destinationData),
    update: (id, destinationData) => api.put(`/destinations/${id}`, destinationData),
    delete: (id) => api.delete(`/destinations/${id}`),
};

export default api;
