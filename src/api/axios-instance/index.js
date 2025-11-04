// src/api.js
import axios from "axios";
import { useRouter } from "next/navigation";

export const useAxios = () => {
  const router = useRouter();
  const api = axios.create({
    baseURL: "http://localhost:5002/api",
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
  }, (error) => {
    if (error.response?.status === 401) {
      router.push("/login");
    } else if (error.response?.status === 500) {
      router.push("/error");
    }
    return Promise.reject(error);
  });

  return api
};
