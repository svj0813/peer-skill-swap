import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api' 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const fetchMentors = () => API.get('/mentors');
export const bookSession = (sessionData) => API.post('/sessions/book', sessionData);
export const fetchMySessions = () => API.get('/sessions/my-sessions');
