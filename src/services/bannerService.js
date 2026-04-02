import { httpClient } from "./httpClient";

const BANNERS_ENDPOINT = "/api/v1/banner";
const DEFAULT_PER_PAGE = 100;

export const bannerService = {
    async getAllBanners(perPage = DEFAULT_PER_PAGE) {
        let currentPage = 1;
        let lastPage = 1;
        const allBanners = [];

        try {
            do {
                const response = await httpClient.request(
                    `${BANNERS_ENDPOINT}?page=${currentPage}&per_page=${perPage}`,
                );

                const pageData = Array.isArray(response?.data) ? response.data : [];
                allBanners.push(...pageData);
                lastPage = Number(response?.meta?.last_page || 1);
                currentPage += 1;
            } while (currentPage <= lastPage);
        } catch (error) {
            console.error("Error fetching all banners:", error);
        }

        return allBanners;
    },
};
