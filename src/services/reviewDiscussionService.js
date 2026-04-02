import { httpClient } from "./httpClient";

const REVIEW_DISCUSSION_BY_REVIEW_ENDPOINT = "/api/v1/reviews/getReviewsById";
const REVIEW_DISCUSSION_STORE_ENDPOINT = "/api/v1/reviews/store";
const REVIEW_DISCUSSION_MEMBER_ENDPOINT = "/api/v1/reviews/member";
const REVIEW_DISCUSSION_EDIT_ENDPOINT = "/api/v1/reviews/edit";
const REVIEW_DISCUSSION_DELETE_ENDPOINT = "/api/v1/reviews/delete";
const DEFAULT_PER_PAGE = 100;

const getReviewDiscussionPage = async ({
  reviewId,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  signal,
} = {}) =>
  httpClient.request(
    `${REVIEW_DISCUSSION_BY_REVIEW_ENDPOINT}?review_id=${reviewId}&page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      signal,
    },
  );

const getMemberReviewDiscussionPage = async ({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  signal,
} = {}) =>
  httpClient.request(
    `${REVIEW_DISCUSSION_MEMBER_ENDPOINT}?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      signal,
    },
  );

export const reviewDiscussionService = {
  async getMemberReviews({ perPage = DEFAULT_PER_PAGE, signal } = {}) {
    let page = 1;
    let lastPage = 1;
    const discussions = [];

    do {
      const { data, meta } = await getMemberReviewDiscussionPage({
        page,
        perPage,
        signal,
      });

      discussions.push(...data);
      lastPage = meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return discussions;
  },

  async getByReviewId(reviewId, { perPage = DEFAULT_PER_PAGE, signal } = {}) {
    let page = 1;
    let lastPage = 1;
    const discussions = [];

    do {
      const { data, meta } = await getReviewDiscussionPage({
        reviewId,
        page,
        perPage,
        signal,
      });

      discussions.push(...data);
      lastPage = meta.last_page;
      page += 1;
    } while (page <= lastPage);

    return discussions;
  },

  store({ reviewId, title, content, rating }) {
    return httpClient.request(REVIEW_DISCUSSION_STORE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review_id: reviewId,
        title,
        content,
        rating,
      }),
    });
  },

  update(replyId, { title, content, rating }) {
    return httpClient.request(`${REVIEW_DISCUSSION_EDIT_ENDPOINT}/${replyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, rating }),
    });
  },

  delete(replyId) {
    return httpClient.request(`${REVIEW_DISCUSSION_DELETE_ENDPOINT}/${replyId}`, {
      method: "DELETE",
    });
  },
};
