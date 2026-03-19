import { httpClient } from "./httpClient";

const PRODUCT_LIKE_ENDPOINT = "/api/v1/product/likes";
const PRODUCT_LIKE_TOTAL_ENDPOINT = "/api/v1/product/likes/total";
const PRODUCT_LIKE_TOGGLE_ENDPOINT = "/api/v1/product/likes/toggle";
const DEFAULT_PER_PAGE = 100;

export const productLikeService = {
  getLikes() {
    return httpClient.request(PRODUCT_LIKE_ENDPOINT, {
      method: "GET",
    });
  },

  async getTotalLikes({ page = 1, signal } = {}) {
    const response = await httpClient.request(
      `${PRODUCT_LIKE_TOTAL_ENDPOINT}?page=${page}`,
      {
        method: "GET",
        signal,
      },
    );

    return response.data.data;
  },

  async getAllLikes() {
    const firstPage = await httpClient.request(
      `${PRODUCT_LIKE_ENDPOINT}?page=1&per_page=${DEFAULT_PER_PAGE}`,
      {
        method: "GET",
      },
    );

    const firstPageData = Array.isArray(firstPage?.data)
      ? firstPage.data
      : Array.isArray(firstPage)
        ? firstPage
        : [];
    const lastPage = Number(firstPage?.meta?.last_page) || 1;

    if (lastPage <= 1) {
      return firstPageData;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        httpClient.request(
          `${PRODUCT_LIKE_ENDPOINT}?page=${index + 2}&per_page=${DEFAULT_PER_PAGE}`,
          {
            method: "GET",
          },
        ),
      ),
    );

    return [
      ...firstPageData,
      ...remainingPages.flatMap((page) =>
        Array.isArray(page?.data) ? page.data : Array.isArray(page) ? page : [],
      ),
    ];
  },

  toggle(productId) {
    return httpClient.request(PRODUCT_LIKE_TOGGLE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
      }),
    });
  },
};
