import api from "./jobApi";

export async function getSavedJobs() {
  const response = await api.get("/saved-jobs");
  return response.data;
}

export async function saveJob(jobId) {
  const response = await api.post(`/saved-jobs/${jobId}`);
  return response.data;
}

export async function removeSavedJob(jobId) {
  const response = await api.delete(`/saved-jobs/${jobId}`);
  return response.data;
}
