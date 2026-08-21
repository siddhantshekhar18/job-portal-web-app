import { useEffect, useState } from "react";
import {
  login as loginApi,
  register as registerApi,
  fetchCurrentUser,
} from "../services/authApi";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);

        return;
      }

      try {
        const response = await fetchCurrentUser(storedToken);

        setToken(storedToken);
        setUser(response.user);
      } catch (error) {
        console.error("Failed to restore session:", error);

        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email, password) {
    const response = await loginApi(email, password);

    const { token: newToken, user: loggedInUser } = response;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(loggedInUser);

    return response;
  }

  async function register(name, email, password) {
    const response = await registerApi(name, email, password);

    return response;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
