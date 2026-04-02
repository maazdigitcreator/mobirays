import { httpClient } from "./httpClient";

const NEWS_DISCUSSION_BY_NEWS_ENDPOINT = "/api/v1/news/getNewsById";
const NEWS_DISCUSSION_STORE_ENDPOINT = "/api/v1/news/store";
const NEWS_DISCUSSION_MEMBER_ENDPOINT = "/api/v1/news/member";
const NEWS_DISCUSSION_EDIT_ENDPOINT = "/api/v1/news/edit";
const NEWS_DISCUSSION_DELETE_ENDPOINT = "/api/v1/news/delete";
const DEFAULT_PER_PAGE = 100;

const getNewsDiscussionPage = async ({
  newsId,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  signal,
} = {}) =>
  httpClient.request(
    `${NEWS_DISCUSSION_BY_NEWS_ENDPOINT}?post_id=${newsId}&page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      signal,
    },
  );

const getMemberNewsDiscussionPage = async ({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  signal,
} = {}) =>
  httpClient.request(
    `${NEWS_DISCUSSION_MEMBER_ENDPOINT}?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      signal,
    },
  );

export const newsDiscussionService = {
  async getMemberReviews({ perPage = DEFAULT_PER_PAGE, signal } = {}) {
    let page = 1;
    let lastPage = 1;
    const discussions = [];

    try {
      do {
        const { data, meta } = await getMemberNewsDiscussionPage({
          page,
          perPage,
          signal,
        });

        discussions.push(...data);
        lastPage = meta.last_page;
        page += 1;
      } while (page <= lastPage);
    } catch (error) {
      if (error.status === 401) return [];
      throw error;
    }

    return discussions;
  },

  async getByNewsId(newsId, { perPage = DEFAULT_PER_PAGE, signal } = {}) {
    let page = 1;
    let lastPage = 1;
    const discussions = [];

    try {
      do {
        const { data, meta } = await getNewsDiscussionPage({
          newsId,
          page,
          perPage,
          signal,
        });

        discussions.push(...(data || []));
        lastPage = meta?.last_page || 1;
        page += 1;
      } while (page <= lastPage);
    } catch (error) {
      if (error.status === 404 || error.data?.message?.includes("SQLSTATE")) {
        return [];
      }
      throw error;
    }

    return discussions;
  },

  store({ newsId, title, content, rating }) {
    return httpClient.request(NEWS_DISCUSSION_STORE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: newsId,
        title,
        content,
        rating,
      }),
    });
  },

  update(id, { title, content, rating }) {
    return httpClient.request(`${NEWS_DISCUSSION_EDIT_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, rating }),
    });
  },

  delete(id) {
    return httpClient.request(`${NEWS_DISCUSSION_DELETE_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
  },
};
