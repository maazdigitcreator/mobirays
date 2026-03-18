import { httpClient } from "./httpClient";

const ADVANCED_SEARCH_ATTRIBUTES_ENDPOINT = "/api/v1/advance-search/allAttributes";

export const advancedSearchService = {
  getAllAttributes() {
    return httpClient.request(ADVANCED_SEARCH_ATTRIBUTES_ENDPOINT, {
      method: "GET",
    });
  },
};
