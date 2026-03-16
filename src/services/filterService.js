import { httpClient } from "./httpClient";

export const filterService = {
  getAllAttributes() {
    return httpClient.request("/api/v1/filters/allAttributes", {
      method: "GET",
    });
  },
};
