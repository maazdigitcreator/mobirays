import { httpClient } from "./httpClient";

const ALL_PAGES_ENDPOINT = "/api/v1/allPages";

export const pageService = {
  async getAllPages() {
    const response = await httpClient.request(ALL_PAGES_ENDPOINT, {
      method: "GET",
    });
    // The API wraps response in { data: [...] }
    return response.data || [];
  },
};
