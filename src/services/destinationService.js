import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/destinations';

const destinationService = {
  getAll: () => {
    return axios.get(BASE_URL);
  },

  getById: (id) => {
    return axios.get(`${BASE_URL}/${id}`);
  },

  create: (destination) => {
    return axios.post(BASE_URL, destination);
  },

  update: (id, destination) => {
    console.log('Updating destination:', id, destination);
    return axios.put(`${BASE_URL}/${id}`, destination);
  },

  delete: (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
  },

  search: (query) => {
    return axios.get(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
  }
};

export default destinationService;
