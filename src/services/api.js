import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
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

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const destinationService = {
    getAll: () => api.get('/destinations'),
    getTop: () => api.get('/destinations/top'),
    getById: (id) => api.get(`/destinations/${id}`),
    search: (query) => api.get(`/destinations/search?query=${query}`),
};

export default api;
