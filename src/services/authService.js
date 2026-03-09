import {
  addRequestInterceptor,
  httpClient,
} from "./httpClient";

let authTokenProvider = () => null;

export const setAuthTokenProvider = (provider) => {
  authTokenProvider = provider;
};

addRequestInterceptor((config) => {
  const token = authTokenProvider();
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
