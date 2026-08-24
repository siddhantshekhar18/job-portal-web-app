import api from "./jobApi";

export async function getEmployerJobs() {
  const response = await api.get("/employer/jobs");

  return response.data;
}

export async function getEmployerJobById(id) {
  const response = await api.get(`/employer/jobs/${id}`);

  return response.data;
}

export async function createEmployerJob(jobData) {
  const response = await api.post("/employer/jobs", jobData);

  return response.data;
}

export async function updateEmployerJob(id, jobData) {
  const response = await api.put(`/employer/jobs/${id}`, jobData);

  return response.data;
}

export async function deleteEmployerJob(id) {
  const response = await api.delete(`/employer/jobs/${id}`);

  return response.data;
}

export async function getEmployerApplications() {
  const response = await api.get("/employer/applications");

  return response.data;
}

export async function getEmployerApplicationById(id) {
  const response = await api.get(`/employer/applications/${id}`);

  return response.data;
}

export async function updateApplicationStatus(id, status) {
  const response = await api.patch(`/employer/applications/${id}/status`, {
    status,
  });

  return response.data;
}

export async function getEmployerStats() {
  const response = await api.get("/employer/applications/stats");

  return response.data;
}
