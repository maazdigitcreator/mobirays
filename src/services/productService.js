import { httpClient } from "./httpClient";

const PRODUCTS_ENDPOINT = "/api/v1/products/allProducts";
const DEFAULT_PER_PAGE = 100;

const getProductsPage = async ({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) => {
  return httpClient.request(
    `${PRODUCTS_ENDPOINT}?page=${page}&per_page=${perPage}`,
  );
};

export const productService = {
  async getAllProducts(perPage = DEFAULT_PER_PAGE) {
    let currentPage = 1;
    let lastPage = 1;
    const allProducts = [];

    do {
      const response = await getProductsPage({
        page: currentPage,
        perPage,
      });

      const pageData = Array.isArray(response?.data) ? response.data : [];
      allProducts.push(...pageData);
      lastPage = Number(response?.meta?.last_page || 1);
      currentPage += 1;
    } while (currentPage <= lastPage);

    return allProducts;
  },
};
