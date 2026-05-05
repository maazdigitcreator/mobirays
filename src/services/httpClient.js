import { API_BASE_URL } from "../config/api";

const requestInterceptors = [];
const responseInterceptors = [];

export const addRequestInterceptor = (interceptor) => {
  requestInterceptors.push(interceptor);
};

export const addResponseInterceptor = (interceptor) => {
  responseInterceptors.push(interceptor);
};

const applyRequestInterceptors = async (config) => {
  let nextConfig = config;
  for (const interceptor of requestInterceptors) {
    // Allow interceptors to mutate or replace request config.
    // If nothing is returned, keep the previous config.
    const maybeConfig = await interceptor(nextConfig);
    if (maybeConfig) {
      nextConfig = maybeConfig;
    }
  }
  return nextConfig;
};

const applyResponseInterceptors = async (response, parsedData) => {
  let nextResponse = { response, data: parsedData };
  for (const interceptor of responseInterceptors) {
    const maybeResponse = await interceptor(nextResponse);
    if (maybeResponse) {
      nextResponse = maybeResponse;
    }
  }
  return nextResponse;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export class HttpError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

export const httpClient = {
  async request(path, options = {}) {
    const baseHeaders = {
      Accept: "application/json",
    };

    const config = await applyRequestInterceptors({
      url: `${API_BASE_URL}${path}`,
      options: {
        ...options,
        headers: {
          ...baseHeaders,
          ...(options.headers || {}),
        },
      },
    });

    const response = await fetch(config.url, config.options);
    const parsedData = await parseResponse(response);
    const finalResponse = await applyResponseInterceptors(response, parsedData);

    if (!finalResponse.response.ok) {
      const errorMessage =
        finalResponse.data?.message ||
        `Request failed with status ${finalResponse.response.status}`;
      throw new HttpError(
        errorMessage,
        finalResponse.response.status,
        finalResponse.data,
      );
    }

    return finalResponse.data;
  },
};
