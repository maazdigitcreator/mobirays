import { useEffect, useState } from "react";
import { authService, setAuthTokenProvider } from "../services/authService";
import { AuthContext } from "./authContextInstance";

const TOKEN_KEY = "MOBIRAYS_TOKEN";
const USER_KEY = "MOBIRAYS_USER";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || null,
  );

  useEffect(() => {
    setAuthTokenProvider(() => token);
  }, [token]);

  const normalizeServiceError = (error) => {
    if (error?.data) {
      return error.data;
    }
    return error;
  };

  const register = async ({
    name,
    email,
    password,
    agreeStoreDetail,
    agreeAge,
  }) => {
    try {
      return await authService.register({
        name,
        email,
        password,
        agreeStoreDetail,
        agreeAge,
      });
    } catch (error) {
      throw normalizeServiceError(error);
    }
  };

  const login = async (email, password) => {
    let data;
    try {
      data = await authService.login({ email, password });
    } catch (error) {
      throw normalizeServiceError(error);
    }

    // Response: { success, token, user }
    const authToken = data.token;
    const userData = data.user;

    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    return data;
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
