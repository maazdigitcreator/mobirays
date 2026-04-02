import { httpClient } from "./httpClient";

const ADVANCED_SEARCH_ATTRIBUTES_ENDPOINT = "/api/v1/advance-search/allAttributes";
const ADVANCED_SEARCH_DATA_ENDPOINT = "/api/v1/advance-search/getData";

export const advancedSearchService = {
  getAllAttributes() {
    return httpClient.request(ADVANCED_SEARCH_ATTRIBUTES_ENDPOINT, {
      method: "GET",
    });
  },

  getData({ categories = [], signal } = {}) {
    return httpClient.request(ADVANCED_SEARCH_DATA_ENDPOINT, {
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
