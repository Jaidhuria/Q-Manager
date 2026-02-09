import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://q-manager-ua2r.vercel.app/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
