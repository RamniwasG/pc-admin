// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api",
  timeout: 10000,
  headers: { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));


export default api;
