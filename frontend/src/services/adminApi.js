import api from "./jobApi";

export async function getAdminStats() {
  const response = await api.get("/admin/stats");

  return response.data;
}
