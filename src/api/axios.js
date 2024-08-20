import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token inválido o expirado.");
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default instance;
