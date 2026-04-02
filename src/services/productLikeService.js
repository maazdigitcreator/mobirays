import { httpClient } from "./httpClient";

const PRODUCT_LIKE_ENDPOINT = "/api/v1/product/likes";
const PRODUCT_LIKE_TOTAL_ENDPOINT = "/api/v1/product/likes/total";
const PRODUCT_LIKE_TOGGLE_ENDPOINT = "/api/v1/product/likes/toggle";
const DEFAULT_PER_PAGE = 100;

const getLikesPage = ({ page = 1, signal } = {}) =>
  httpClient.request(
    `${PRODUCT_LIKE_ENDPOINT}?page=${page}&per_page=${DEFAULT_PER_PAGE}`,
    {
      method: "GET",
      signal,
    },
  );

const TOTAL_LIKES_PER_PAGE = 500;

const getTotalLikesPage = ({ page = 1, signal } = {}) =>
  httpClient.request(
    `${PRODUCT_LIKE_TOTAL_ENDPOINT}?page=${page}&per_page=${TOTAL_LIKES_PER_PAGE}`,
    {
      method: "GET",
      signal,
    },
  );

export const productLikeService = {
  getLikes() {
    return httpClient.request(PRODUCT_LIKE_ENDPOINT, {
      method: "GET",
    });
  },

  async getTotalLikes({ page = 1, signal } = {}) {
    const response = await getTotalLikesPage({ page, signal });

    return response.data.data;
  },

  async getAllTotalLikes({ signal } = {}) {
    const firstPage = await getTotalLikesPage({ page: 1, signal });
    const { data: firstItems, last_page: lastPage } = firstPage.data;

    if (lastPage <= 1) {
      return firstItems;
    }

    const remainingPages = Array.from({ length: lastPage - 1 }, (_, i) =>
      getTotalLikesPage({ page: i + 2, signal }),
    );
    const remainingResponses = await Promise.all(remainingPages);

    return [...firstItems, ...remainingResponses.flatMap((r) => r.data.data)];
  },

  async getAllLikes({ signal } = {}) {
    let page = 1;
    let lastPage = 1;
    const likes = [];

    do {
      const response = await getLikesPage({ page, signal });

      likes.push(...response.data);
      lastPage = response.meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return likes;
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
