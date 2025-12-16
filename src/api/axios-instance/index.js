// src/api.js
import { clearLoginCredentials } from "@/utils";
import axios from "axios";
import { redirect } from "next/navigation";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 45000, // 45s
  headers: { 
    "Content-Type": "application/json",
  }
});

export const useAxios = () => {
  const api = axiosInstance;
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🧩 Add a response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      // 🔐 If token expired or unauthorized
      if (status === 401) {
        console.log("Unauthorized! Redirecting to login...");
        // optional: clear localStorage / sessionStorage
        clearLoginCredentials();
        // redirect to login
        if (typeof window !== "undefined") {
          redirect("/admin/login");
        }
      }

      // ⚠️ Handle 403 / 500 etc. if needed
      // if (status === 500) {
      //   redirect('/error');
      // }

      return Promise.reject(error);
    }
  );
  return api
};
