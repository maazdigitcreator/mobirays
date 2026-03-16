import { httpClient } from "./httpClient";

export const productLikeService = {
  getLikes() {
    return httpClient.request("/api/v1/product/likes", {
      method: "GET",
    });
  },

  async getAllLikes() {
    const firstPage = await httpClient.request("/api/v1/product/likes?page=1&per_page=100", {
      method: "GET",
    });

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
        httpClient.request(`/api/v1/product/likes?page=${index + 2}&per_page=100`, {
          method: "GET",
        }),
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
    return httpClient.request("/api/v1/product/likes/toggle", {
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
