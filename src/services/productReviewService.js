import { httpClient } from "./httpClient";

const PRODUCT_REVIEW_STORE_ENDPOINT = "/api/v1/product/reviews/store";
const PRODUCT_REVIEW_MEMBER_ENDPOINT = "/api/v1/product/reviews/member";
const PRODUCT_REVIEW_ALL_ENDPOINT = "/api/v1/product/reviews/allReviews";
const PRODUCT_REVIEW_BY_PRODUCT_ENDPOINT = "/api/v1/product/reviews/getProductReviewsById";
const DEFAULT_PER_PAGE = 100;

const getPublicReviewsPage = async ({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  signal,
} = {}) =>
  httpClient.request(
    `${PRODUCT_REVIEW_ALL_ENDPOINT}?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      signal,
    },
  );

const getProductReviewsPage = async ({
  productId,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  signal,
} = {}) =>
  httpClient.request(
    `${PRODUCT_REVIEW_BY_PRODUCT_ENDPOINT}?product_id=${productId}&page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      signal,
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

  async getAllPublicReviews({ perPage = DEFAULT_PER_PAGE, signal } = {}) {
    let page = 1;
    let lastPage = 1;
    const reviews = [];

    do {
      const { data, meta } = await getPublicReviewsPage({
        page,
        perPage,
        signal,
      });

      reviews.push(...data);
      lastPage = meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return reviews;
  },

  async getAllPublicReviewsByProduct(productId, options = {}) {
    let page = 1;
    let lastPage = 1;
    const reviews = [];

    do {
      const { data, meta } = await getProductReviewsPage({
        productId,
        page,
        perPage: options.perPage ?? DEFAULT_PER_PAGE,
        signal: options.signal,
      });

      reviews.push(...data);
      lastPage = meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return reviews;
  },
};
