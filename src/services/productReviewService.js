import { httpClient } from "./httpClient";

const PRODUCT_REVIEW_STORE_ENDPOINT = "/api/v1/product/reviews/store";
const PRODUCT_REVIEW_MEMBER_ENDPOINT = "/api/v1/product/reviews/member";
const PRODUCT_REVIEW_ALL_ENDPOINT = "/api/v1/product/reviews/allReviews";
const DEFAULT_PER_PAGE = 100;

const getPublicReviewsPage = async ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) =>
  httpClient.request(
    `${PRODUCT_REVIEW_ALL_ENDPOINT}?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
    },
  );

export const productReviewService = {
  store({ productId, title, rating, content }) {
    return httpClient.request(PRODUCT_REVIEW_STORE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        title,
        name: title,
        rating,
        content,
      }),
    });
  },

  getMemberReviews() {
    return httpClient.request(PRODUCT_REVIEW_MEMBER_ENDPOINT, {
      method: "GET",
    });
  },

  async getAllPublicReviews(perPage = DEFAULT_PER_PAGE) {
    let currentPage = 1;
    let lastPage = 1;
    const allReviews = [];

    do {
      const response = await getPublicReviewsPage({
        page: currentPage,
        perPage,
      });

      const pageData = Array.isArray(response?.data) ? response.data : [];
      allReviews.push(...pageData);
      lastPage = Number(response?.meta?.last_page || 1);
      currentPage += 1;
    } while (currentPage <= lastPage);

    return allReviews;
  },
};
