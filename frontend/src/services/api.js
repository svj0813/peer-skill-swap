import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const fetchMentors = () => API.get('/users/mentors');
export const fetchMySessions = () => API.get('/sessions/my-sessions');
export const bookSession = (data) => API.post('/sessions/book', data);
export const updateSessionStatus = (id, status, rating) => API.put(`/sessions/${id}/status`, { status, rating });
