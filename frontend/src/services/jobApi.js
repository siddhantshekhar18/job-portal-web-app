import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getJobs(params = {}) {
  const response = await api.get("/jobs", { params });

  return response.data;
}

export async function getJobById(id) {
  const response = await api.get(`/jobs/${id}`);

  return response.data;
}

export default api;
