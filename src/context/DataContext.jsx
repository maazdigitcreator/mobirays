import { useCallback, useEffect, useRef, useState } from "react";
import { bannerService } from "../services/bannerService";
import { filterService } from "../services/filterService";
import { productLikeService } from "../services/productLikeService";
import { DataContext } from "./dataContextInstance";

const CACHE_KEY = "mobirays_api_cache_v2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DataProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allBanners, setAllBanners] = useState([]);
  const [productLikeTotals, setProductLikeTotals] = useState([]);
  const [productLikeTotalsStatus, setProductLikeTotalsStatus] = useState({
    loading: true,
    error: "",
    loaded: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dataLoadedRef = useRef(false);

  const fetchAllData = useCallback(async (force = false) => {
    if (!force && dataLoadedRef.current) return;

    if (!force) {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setAllProducts(parsed.products || []);
          setAllNews(parsed.news || []);
          setAllReviews(parsed.reviews || []);
          setAllBrands(parsed.brands || []);
          setAllBanners(parsed.banners || []);
          setLoading(false);
          dataLoadedRef.current = true;
          return;
        } catch (e) {
          console.error("Error parsing cache", e);
        }
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Fire all requests in parallel — including filter page 1 and enrichment endpoints
      const [
        newsRes,
        reviewsRes,
        brandsRes,
        allBannersData,
        firstFilterRes,
        phoneComingsoonData,
        tabletComingsoonData,
        watchesComingsoonData,
        phoneWhatsNewData,
        tabletWhatsNewData,
        watchesWhatsNewData,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/posts`),
        fetch(`${API_BASE_URL}/api/v1/reviews/allReviews`),
        fetch(`${API_BASE_URL}/api/v1/brands/allBrands`),
        bannerService.getAllBanners(100),
        filterService.applyFilters({ categories: [], page: 1 }),
        fetch(`${API_BASE_URL}/api/v1/products/phoneComingsoon`).then((r) =>
          r.json(),
        ),
        fetch(`${API_BASE_URL}/api/v1/products/tabletComingsoon`).then((r) =>
          r.json(),
        ),
        fetch(`${API_BASE_URL}/api/v1/products/watchesComingsoon`).then((r) =>
          r.json(),
        ),
        fetch(`${API_BASE_URL}/api/v1/products/phoneWhatsNew`).then((r) =>
          r.json(),
        ),
        fetch(`${API_BASE_URL}/api/v1/products/tabletWhatsNew`).then((r) =>
          r.json(),
        ),
        fetch(`${API_BASE_URL}/api/v1/products/watchesWhatsNew`).then((r) =>
          r.json(),
        ),
      ]);

      // Parse JSON + fetch remaining filter pages — all in parallel
      const lastPage = Number(firstFilterRes?.meta?.last_page || 1);
      const remainingPageNums = Array.from(
        { length: lastPage - 1 },
        (_, i) => i + 2,
      );

      const [newsData, reviewsData, brandsData, ...remainingFilterPages] =
        await Promise.all([
          newsRes.json(),
          reviewsRes.json(),
          brandsRes.json(),
          ...remainingPageNums.map((p) =>
            filterService.applyFilters({ categories: [], page: p }),
          ),
        ]);

      const rawProducts = [
        ...(firstFilterRes.data || []),
        ...remainingFilterPages.flatMap((r) => r.data || []),
      ];

      const comingSoonIds = new Set([
        ...(phoneComingsoonData?.data?.map((p) => p.id) || []),
        ...(tabletComingsoonData?.data?.map((p) => p.id) || []),
        ...(watchesComingsoonData?.data?.map((p) => p.id) || []),
      ]);

      const whatsNewIds = new Set([
        ...(phoneWhatsNewData?.data?.map((p) => p.id) || []),
        ...(tabletWhatsNewData?.data?.map((p) => p.id) || []),
        ...(watchesWhatsNewData?.data?.map((p) => p.id) || []),
      ]);

      const products = rawProducts.map((product) => {
        const prodType = product.product_type || "";

        if (prodType === "General") {
          return { ...product, is_coming_soon: false, is_new: false };
        }

        return {
          ...product,
          is_coming_soon:
            comingSoonIds.has(product.id) ||
            product.is_coming_soon === 1 ||
            prodType === "Coming Soon",
          is_new:
            whatsNewIds.has(product.id) ||
            product.is_new === 1 ||
            prodType === "What's New",
        };
      });

      const news = newsData?.data || [];
      const reviews = reviewsData?.data || [];
      const brands = brandsData?.data || [];
      const banners = allBannersData || [];

      setAllProducts(products);
      setAllNews(news);
      setAllReviews(reviews);
      setAllBrands(brands);
      setAllBanners(banners);
      dataLoadedRef.current = true;

      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ products, news, reviews, brands, banners }),
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    productLikeService
      .getAllTotalLikes()
      .then((totals) => {
        setProductLikeTotals(totals);
        setProductLikeTotalsStatus({ loading: false, error: "", loaded: true });
      })
      .catch((err) => {
        setProductLikeTotalsStatus({
          loading: false,
          error:
            err?.data?.message ||
            err?.message ||
            "Failed to load device likes.",
          loaded: false,
        });
      });
  }, [fetchAllData]);

  const setProductLikeTotalCount = useCallback((productId, likesCount) => {
    const normalizedId = Number(productId);
    setProductLikeTotals((current) =>
      current.map((product) =>
        Number(product.id) === normalizedId
          ? { ...product, likes_count: Number(likesCount) }
          : product,
      ),
    );
  }, []);

  const value = {
    allProducts,
    allNews,
    allReviews,
    allBrands,
    allBanners,
    productLikeTotals,
    productLikeTotalsStatus,
    loading,
    error,
    refreshData: () => fetchAllData(true),
    setProductLikeTotalCount,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
