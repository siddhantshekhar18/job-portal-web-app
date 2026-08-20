import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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
