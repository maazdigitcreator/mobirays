import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import LatestProducts from '../components/LatestProducts';
import ProductsSectionButton from '../components/ProductsSectionButton';
import LatestNews from '../components/LatestNews';
import LatestReviews from '../components/LatestReviews';
import HeroBanner from '../components/Layout/HeroBanner';
import mobileImg from '../assets/mobileImg.jpg';
import tabImg from '../assets/tabImg.jpg';
import watchImg from '../assets/watchImg.png';
import BannerAd from '../components/BannerAd';

// Sidebar Components
import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3';
import { useData } from '../context/useData';
import { advancedSearchService } from '../services/advancedSearchService';
import { useAdvancedSearchAttributes } from '../hooks/useAdvancedSearchAttributes';
import {
    buildAdvancedSearchRequestPayload,
    getAdvancedSearchAttributesMissingCategoryIds,
} from '../utils/advancedSearchFilters';
import { decodeAdvancedSearchQuery } from '../utils/advancedSearchQuery';
import { filterProductsByCategory } from '../utils/filterHelpers';

const SearchPage = () => {
    const location = useLocation();
    const { allProducts, allNews, allReviews, loading } = useData();
    const { attributes } = useAdvancedSearchAttributes();
    const resultsRef = useRef(null);

    const [pageBanners, setPageBanners] = useState({});
    const [advancedProducts, setAdvancedProducts] = useState([]);
    const [advancedStatus, setAdvancedStatus] = useState({
        loading: false,
        error: '',
        loaded: false,
    });
    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );
    const searchQuery = searchParams.get('q') || '';
    const isAdvancedSearchMode = searchParams.get('advanced') === '1';
    const appliedFilters = useMemo(
        () => decodeAdvancedSearchQuery(searchParams.get('filters')),
        [searchParams],
    );
    const hasAppliedFilters = Object.keys(appliedFilters).length > 0;
    const isFilteredView = isAdvancedSearchMode && !searchQuery;
    const advancedRequestCategories = useMemo(
        () => buildAdvancedSearchRequestPayload(attributes, appliedFilters),
        [attributes, appliedFilters],
    );
    const advancedFiltersMissingCategoryIds = useMemo(
        () => getAdvancedSearchAttributesMissingCategoryIds(attributes, appliedFilters),
        [attributes, appliedFilters],
    );

    // Fetch banners from API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/banner?per_page=100`);
                const result = await response.json();
                const allBanners = Array.isArray(result.data) ? result.data : [];
                const map = {};
                ['searchpage_banner_1', 'searchpage_banner_2', 'searchpage_banner_3'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b) map[loc] = b;
                });
                setPageBanners(map);
            } catch (error) {
                console.error("Error fetching search banners:", error);
            }
        };
        fetchBanners();
    }, []);

    const filterResults = useCallback((query) => {
        const lowerQuery = query.toLowerCase();

        // Filter all products matching the search query by name
        const matchingProducts = allProducts.filter(p =>
            p.name && p.name.toLowerCase().includes(lowerQuery)
        );

        // Categorize matched products using flexible matching (same as LatestProducts.jsx)
        const filteredPhones = matchingProducts.filter(p => {
            const prodCat = p.product_category ? p.product_category.toLowerCase() : '';
            return prodCat.includes('mobile') || prodCat.includes('phone');
        });
        const filteredTablets = matchingProducts.filter(p => {
            const prodCat = p.product_category ? p.product_category.toLowerCase() : '';
            return prodCat.includes('tab') || prodCat.includes('pad');
        });
        const filteredWatches = matchingProducts.filter(p => {
            const prodCat = p.product_category ? p.product_category.toLowerCase() : '';
            return prodCat.includes('watch');
        });

        // Products that don't match any known category — still show them
        const categorizedIds = new Set([...filteredPhones, ...filteredTablets, ...filteredWatches].map(p => p.id));
        const uncategorized = matchingProducts.filter(p => !categorizedIds.has(p.id));

        // Merge uncategorized into phones so they still appear
        const allPhones = [...filteredPhones, ...uncategorized];

        // Filter news
        const filteredNews = allNews.filter(n =>
            (n.name && n.name.toLowerCase().includes(lowerQuery)) ||
            (n.title && n.title.toLowerCase().includes(lowerQuery))
        );

        // Filter reviews
        const filteredReviews = allReviews.filter(r =>
            (r.name && r.name.toLowerCase().includes(lowerQuery)) ||
            (r.subtitle && r.subtitle.toLowerCase().includes(lowerQuery))
        );

        return {
            phones: allPhones,
            tablets: filteredTablets,
            watches: filteredWatches,
            news: filteredNews,
            reviews: filteredReviews,
        };
    }, [allNews, allProducts, allReviews]);

    useEffect(() => {
        if (!isFilteredView) {
            return;
        }

        if (hasAppliedFilters && advancedFiltersMissingCategoryIds.length > 0) {
            setAdvancedProducts([]);
            setAdvancedStatus({
                loading: false,
                error: 'Selected filters are missing brand_category_id.',
                loaded: false,
            });
            return;
        }

        if (hasAppliedFilters && attributes.length > 0 && advancedRequestCategories.length === 0) {
            setAdvancedProducts([]);
            setAdvancedStatus({
                loading: false,
                error: 'Advanced search request is missing category mapping.',
                loaded: false,
            });
            return;
        }

        const controller = new AbortController();

        const fetchAdvancedResults = async () => {
            setAdvancedStatus({
                loading: true,
                error: '',
                loaded: false,
            });

            try {
                const response = await advancedSearchService.getData({
                    categories: advancedRequestCategories,
                    signal: controller.signal,
                });

                if (controller.signal.aborted) {
                    return;
                }

                setAdvancedProducts(Array.isArray(response?.data) ? response.data : []);
                setAdvancedStatus({
                    loading: false,
                    error: '',
                    loaded: true,
                });
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setAdvancedProducts([]);
                setAdvancedStatus({
                    loading: false,
                    error:
                        error?.data?.message ||
                        error?.message ||
                        'Failed to load filtered products.',
                    loaded: false,
                });
            }
        };

        void fetchAdvancedResults();

        return () => {
            controller.abort();
        };
    }, [advancedFiltersMissingCategoryIds.length, advancedRequestCategories, attributes.length, hasAppliedFilters, isFilteredView]);

    const searchResults = useMemo(() => {
        if (isFilteredView) {
            if (advancedStatus.loaded) {
                return {
                    phones: filterProductsByCategory(advancedProducts, 'Mobile Phones'),
                    tablets: filterProductsByCategory(advancedProducts, 'Tablets'),
                    watches: filterProductsByCategory(advancedProducts, 'Smartwatches'),
                    news: [],
                    reviews: [],
                };
            }

            return {
                phones: [],
                tablets: [],
                watches: [],
                news: [],
                reviews: [],
            };
        }

        if (searchQuery && allProducts.length > 0) {
            return filterResults(searchQuery);
        }

        return {
            phones: [],
            tablets: [],
            watches: [],
            news: [],
            reviews: [],
        };
    }, [
        advancedProducts,
        advancedStatus.loaded,
        filterResults,
        isFilteredView,
        searchQuery,
    ]);

    const { phones, tablets, watches, news, reviews } = searchResults;

    // Auto-scroll to results when searching
    useEffect(() => {
        if (!loading && (searchQuery || isFilteredView) && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [loading, searchQuery, isFilteredView]);

    if (loading || advancedStatus.loading) {
        return <div className="text-center py-20">{isFilteredView ? 'Loading filtered results...' : `Searching for "${searchQuery}"...`}</div>;
    }

    return (
        <div>
            <div>
                <div className='flex flex-col lg:flex-row gap-2'>
                    {/* Sidebar Column */}
                    <div className="w-full lg:w-1/3 hidden lg:block">
                        <div className="flex flex-col gap-2">
                            <SidebarIntro />
                            <SidebarBrands />
                            <SidebarFilters />
                            <SidebarBanner1 />
                            <div className="flex flex-col gap-6">
                                <SidebarStats />
                                <SidebarBanner2 />
                                <SidebarLatestModels />
                                <SidebarBanner3 />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Column */}
                    <div className="w-full lg:w-3/4">
                        <HeroBanner />

                        {isFilteredView && advancedRequestCategories.length > 0 && advancedStatus.error && (
                            <div className="mb-4 border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                                {advancedStatus.error}
                            </div>
                        )}

                        <div className="mb-4" ref={resultsRef}>
                            <h1 className="text-2xl font-bold px-4">
                                {isFilteredView ? 'Filtered Results' : `Search Results for "${searchQuery}"`}
                            </h1>
                        </div>

                        {/* Phones Section */}
                        {phones.length > 0 && (
                            <div>
                                <LatestProducts title="Phones Results" products={phones} itemImage={mobileImg} limit={8} />
                                {!isFilteredView && phones.length > 8 && (
                                    <ProductsSectionButton showMoreLink={`/phones?q=${searchQuery}`} comingSoonLink="/coming-soon" />
                                )}
                            </div>
                        )}

                        {phones.length > 0 && pageBanners['searchpage_banner_1'] && <div className='mt-7 hidden sm:block'><BannerAd banner={pageBanners['searchpage_banner_1']} className='h-[200px] sm:w-full' /></div>}

                        {/* Tabs Section */}
                        {tablets.length > 0 && (
                            <div className='mt-10'>
                                <LatestProducts title="Tablets Results" products={tablets} itemImage={tabImg} limit={8} />
                                {!isFilteredView && tablets.length > 8 && (
                                    <ProductsSectionButton showMoreLink={`/tablets?q=${searchQuery}`} comingSoonLink="/coming-soon" />
                                )}
                            </div>
                        )}

                        {tablets.length > 0 && pageBanners['searchpage_banner_2'] && <div className='mt-7 hidden sm:block'><BannerAd banner={pageBanners['searchpage_banner_2']} className='h-[200px] sm:w-full' /></div>}

                        {/* Smartwatches Section */}
                        {watches.length > 0 && (
                            <div className='mt-10'>
                                <LatestProducts title="Smartwatches Results" products={watches} itemImage={watchImg} limit={8} />
                                {!isFilteredView && watches.length > 8 && (
                                    <ProductsSectionButton showMoreLink={`/smartwatches?q=${searchQuery}`} comingSoonLink="/coming-soon" />
                                )}
                            </div>
                        )}

                        {/* No Product Results Message */}
                        {phones.length === 0 && tablets.length === 0 && watches.length === 0 && (
                            <div className="p-4 text-gray-500">
                                {isFilteredView
                                    ? 'No products found for the selected filters.'
                                    : `No products found matching "${searchQuery}".`}
                            </div>
                        )}

                        {pageBanners['searchpage_banner_3'] && <div className='mt-7'><BannerAd banner={pageBanners['searchpage_banner_3']} className='h-[200px] sm:h-auto sm:w-full' /></div>}

                        {/* News Section */}
                        {!isFilteredView && (
                            <div className='mt-10'>
                                {news.length > 0 ? (
                                    <LatestNews title="News Results" gridCols="sm:grid-cols-3" newsData={news} limit={6} showMoreLink={`/news?q=${searchQuery}`} />
                                ) : (
                                    <div className="p-4 text-center text-gray-500">No news found matching "{searchQuery}".</div>
                                )}
                            </div>
                        )}

                        {/* Reviews Section */}
                        {!isFilteredView && (
                            <div className='mt-10'>
                                {reviews.length > 0 ? (
                                    <LatestReviews title="Reviews Results" gridCols="sm:grid-cols-4" reviewsData={reviews} limit={8} showMoreLink={`/reviews?q=${searchQuery}`} />
                                ) : (
                                    <div className="p-4 text-center text-gray-500">No reviews found matching "{searchQuery}".</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
