import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const lang = localStorage.getItem("i18nextLng") || "fr";
    config.headers["Accept-Language"] = lang;
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
