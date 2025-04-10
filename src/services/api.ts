import axios from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to every request
api.interceptors.request.use(
  (config) => {
    // Using a hardcoded API key as specified in the swagger document
    config.headers.Authorization = 'Bearer API_KEY=cde7ac9e2f9b7950690b0b44c031309591de0ae033976d762c1b220c02b4614b';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;