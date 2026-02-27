import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

const CACHE_KEY = 'mobirays_api_cache_v1';

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
            const [productsRes, newsRes, reviewsRes, brandsRes, bannersRes] = await Promise.all([
                fetch(`${apiBaseUrl}/api/v1/products/allProducts`),
                fetch(`${apiBaseUrl}/api/v1/posts`),
                fetch(`${apiBaseUrl}/api/v1/reviews/allReviews`),
                fetch(`${apiBaseUrl}/api/v1/brands/allBrands`),
                fetch(`${apiBaseUrl}/api/v1/banner?per_page=100`)
            ]);

            const [productsData, newsData, reviewsData, brandsData, bannersData] = await Promise.all([
                productsRes.json(),
                newsRes.json(),
                reviewsRes.json(),
                brandsRes.json(),
                bannersRes.json()
            ]);

            const products = productsData?.data || [];
            const news = newsData?.data || [];
            const reviews = reviewsData?.data || [];
            const brands = brandsData?.data || [];
            const banners = bannersData?.data || [];

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
