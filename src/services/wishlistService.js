import { httpClient } from "./httpClient";

const PRODUCT_WISHLIST_ENDPOINT = "/api/v1/product/wishlist";
const PRODUCT_WISHLIST_TOTAL_ENDPOINT = "/api/v1/product/wishlist/total";
const PRODUCT_WISHLIST_TOGGLE_ENDPOINT = "/api/v1/product/wishlist/toggle";
const DEFAULT_PER_PAGE = 100;

const getWishlistPage = ({ page = 1, signal } = {}) =>
  httpClient.request(
    `${PRODUCT_WISHLIST_ENDPOINT}?page=${page}&per_page=${DEFAULT_PER_PAGE}`,
    {
      method: "GET",
      signal,
    },
  );

const TOTAL_WISHLIST_PER_PAGE = 500;

const getTotalWishlistPage = ({ page = 1, signal } = {}) =>
  httpClient.request(
    `${PRODUCT_WISHLIST_TOTAL_ENDPOINT}?page=${page}&per_page=${TOTAL_WISHLIST_PER_PAGE}`,
    {
      method: "GET",
      signal,
    },
  );

export const wishlistService = {
  getWishlist() {
    return httpClient.request(PRODUCT_WISHLIST_ENDPOINT, {
      method: "GET",
    });
  },

  async getTotalWishlist({ page = 1, signal } = {}) {
    const response = await getTotalWishlistPage({ page, signal });

    return response.data.data;
  },

  async getAllTotalWishlist({ signal } = {}) {
    const firstPage = await getTotalWishlistPage({ page: 1, signal });
    const { data: firstItems, last_page: lastPage } = firstPage.data;

    if (lastPage <= 1) {
      return firstItems;
    }

    const remainingPages = Array.from({ length: lastPage - 1 }, (_, i) =>
      getTotalWishlistPage({ page: i + 2, signal }),
    );
    const remainingResponses = await Promise.all(remainingPages);

    return [...firstItems, ...remainingResponses.flatMap((r) => r.data.data)];
  },

  async getAllWishlist({ signal } = {}) {
    let page = 1;
    let lastPage = 1;
    const wishlist = [];

    do {
      const response = await getWishlistPage({ page, signal });

      wishlist.push(...response.data);
      lastPage = response.meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return wishlist;
  },

  toggle(productId) {
    return httpClient.request(PRODUCT_WISHLIST_TOGGLE_ENDPOINT, {
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
