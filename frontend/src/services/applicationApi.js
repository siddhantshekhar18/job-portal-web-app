import api from "./jobApi";

export async function submitApplication(formData) {
  const response = await api.post("/applications", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getMyApplications() {
  const response = await api.get("/applications/my");

  return response.data;
}

export async function getApplicationStats() {
  const response = await api.get("/applications/stats");

  return response.data;
}

export async function getApplicationById(id) {
  const response = await api.get(`/applications/${id}`);

  return response.data;
}
