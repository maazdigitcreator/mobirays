import { httpClient } from "./httpClient";

const FILTER_ATTRIBUTES_ENDPOINT = "/api/v1/filters/allAttributes";
const FILTER_DATA_ENDPOINT = "/api/v1/filters/getData";

export const filterService = {
  getAllAttributes({ signal } = {}) {
    return httpClient.request(FILTER_ATTRIBUTES_ENDPOINT, {
      method: "GET",
      signal,
    });
  },

  applyFilters({ categories = [], page = 1, signal } = {}) {
    return httpClient.request(`${FILTER_DATA_ENDPOINT}?page=${page}`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categories: categories.map((category) => ({
          brand_category_id: category.id,
          filters: category.filters,
        })),
      }),
    });
  },
};
