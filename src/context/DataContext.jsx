import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { bannerService } from '../services/bannerService';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

const CACHE_KEY = 'mobirays_api_cache_v2';

export const DataProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [allNews, setAllNews] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [allBrands, setAllBrands] = useState([]);
    const [allBanners, setAllBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';

    const fetchAllData = async (force = false) => {
        // Only skip if not forced and data is already present in state
        if (!force && allProducts.length > 0) return;

        // Try to load from session storage if not forcing
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
                    return;
                } catch (e) {
                    console.error("Error parsing cache", e);
                }
            }
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch all data in parallel
            const [
                rawProducts, newsRes, reviewsRes, brandsRes, allBannersData,
                phoneComingsoonRes, tabletComingsoonRes, watchesComingsoonRes,
                phoneWhatsNewRes, tabletWhatsNewRes, watchesWhatsNewRes
            ] = await Promise.all([
                productService.getAllProducts(100),
                fetch(`${apiBaseUrl}/api/v1/posts`),
                fetch(`${apiBaseUrl}/api/v1/reviews/allReviews`),
                fetch(`${apiBaseUrl}/api/v1/brands/allBrands`),
                bannerService.getAllBanners(100),
                fetch(`${apiBaseUrl}/api/v1/products/phoneComingsoon`),
                fetch(`${apiBaseUrl}/api/v1/products/tabletComingsoon`),
                fetch(`${apiBaseUrl}/api/v1/products/watchesComingsoon`),
                fetch(`${apiBaseUrl}/api/v1/products/phoneWhatsNew`),
                fetch(`${apiBaseUrl}/api/v1/products/tabletWhatsNew`),
                fetch(`${apiBaseUrl}/api/v1/products/watchesWhatsNew`)
            ]);

            const [
                newsData, reviewsData, brandsData,
                phoneComingsoonData, tabletComingsoonData, watchesComingsoonData,
                phoneWhatsNewData, tabletWhatsNewData, watchesWhatsNewData
            ] = await Promise.all([
                newsRes.json(), reviewsRes.json(), brandsRes.json(),
                phoneComingsoonRes.json(), tabletComingsoonRes.json(), watchesComingsoonRes.json(),
                phoneWhatsNewRes.json(), tabletWhatsNewRes.json(), watchesWhatsNewRes.json()
            ]);

            // Extract IDs for Coming Soon and New products
            const comingSoonIds = new Set([
                ...(phoneComingsoonData?.data?.map(p => p.id) || []),
                ...(tabletComingsoonData?.data?.map(p => p.id) || []),
                ...(watchesComingsoonData?.data?.map(p => p.id) || [])
            ]);

            const whatsNewIds = new Set([
                ...(phoneWhatsNewData?.data?.map(p => p.id) || []),
                ...(tabletWhatsNewData?.data?.map(p => p.id) || []),
                ...(watchesWhatsNewData?.data?.map(p => p.id) || [])
            ]);

            // Enrich products with flag data
            const products = rawProducts.map(product => {
                const prodType = product.product_type || '';

                // If product_type is "General", explicitly disable bubbles
                if (prodType === 'General') {
                    return { ...product, is_coming_soon: false, is_new: false };
                }

                // Determine flags based on endpoint IDs, existing flags, OR product_type string
                const isComingSoon = comingSoonIds.has(product.id) ||
                    product.is_coming_soon === 1 ||
                    prodType === 'Coming Soon';

                const isNew = whatsNewIds.has(product.id) ||
                    product.is_new === 1 ||
                    prodType === "What's New";

                return {
                    ...product,
                    is_coming_soon: isComingSoon,
                    is_new: isNew
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

            // Save to session storage
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                products,
                news,
                reviews,
                brands,
                banners
            }));
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const value = {
        allProducts,
        allNews,
        allReviews,
        allBrands,
        allBanners,
        loading,
        error,
        refreshData: () => fetchAllData(true)
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
