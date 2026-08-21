import api from "./jobApi";

export async function register(name, email, password) {
  const response = await api.post("/auth/register", { name, email, password });

  return response.data;
}

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });

  return response.data;
}

export async function fetchCurrentUser(token) {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
