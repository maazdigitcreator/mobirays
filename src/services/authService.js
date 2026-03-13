import {
  addRequestInterceptor,
  addResponseInterceptor,
  httpClient,
} from "./httpClient";

const TOKEN_KEY = "MOBIRAYS_TOKEN";

let authTokenProvider = () => null;
let authUnauthorizedHandler = () => {};

const getAuthToken = () => {
  const providedToken = authTokenProvider();
  if (providedToken) {
    return providedToken;
  }

  return localStorage.getItem(TOKEN_KEY) || null;
};

export const setAuthTokenProvider = (provider) => {
  authTokenProvider = provider;
};

export const setAuthUnauthorizedHandler = (handler) => {
  authUnauthorizedHandler = handler;
};

addRequestInterceptor((config) => {
  const token = getAuthToken();
  if (!token) {
    return config;
  }

  return {
    ...config,
    options: {
      ...config.options,
      headers: {
        ...(config.options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    },
  };
});

addResponseInterceptor((result) => {
  if (result.response.status === 401 && getAuthToken()) {
    authUnauthorizedHandler();
  }

  return result;
});

export const authService = {
  register({ name, email, password, agreeStoreDetail, agreeAge }) {
    return httpClient.request("/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: password,
        agree_store_detail: agreeStoreDetail ? 1 : 0,
        agree_age: agreeAge ? 1 : 0,
      }),
    });
  },

  login({ email, password }) {
    return httpClient.request("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return httpClient.request("/api/v1/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
