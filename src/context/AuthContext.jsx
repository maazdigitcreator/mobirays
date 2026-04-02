import { useEffect, useState } from "react";
import {
  authService,
  setAuthTokenProvider,
  setAuthUnauthorizedHandler,
} from "../services/authService";
import { AuthContext } from "./authContextInstance";

const TOKEN_KEY = "MOBIRAYS_TOKEN";
const USER_KEY = "MOBIRAYS_USER";

const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || null;

const getStoredUser = () => {
  const storedToken = getStoredToken();
  if (!storedToken) {
    return null;
  }

  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    setAuthTokenProvider(() => token);
  }, [token]);

  useEffect(() => {
    setAuthUnauthorizedHandler(clearSession);
  }, []);

  useEffect(() => {
    if (!token && user) {
      setUser(null);
      localStorage.removeItem(USER_KEY);
    }
  }, [token, user]);

  useEffect(() => {
    const syncAuthState = () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        clearSession();
        return;
      }

      setToken(storedToken);
      setUser(getStoredUser());
    };

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

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
    const userData = data.member;

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
      clearSession();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
