import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';
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
    runAdvancedSearch,
} from '../utils/advancedSearchFilters';
import { decodeAdvancedSearchQuery } from '../utils/advancedSearchQuery';
import { filterProductsByCategory } from '../utils/filterHelpers';
import useMetadata from '../hooks/useMetadata';

const parseCategoryId = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
};

const SearchPage = () => {
    const location = useLocation();
    const { allProducts, allNews, allReviews, loading } = useData();
    const { attributes } = useAdvancedSearchAttributes();
    const resultsRef = useRef(null);

    const [pageBanners, setPageBanners] = useState({});
    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );
    const searchQuery = searchParams.get('q') || '';
    const isAdvancedSearchMode = searchParams.get('advanced') === '1';
    const activeCategoryId = useMemo(
        () => parseCategoryId(searchParams.get('category')),
        [searchParams],
    );
    const appliedFilters = useMemo(
        () => decodeAdvancedSearchQuery(searchParams.get('filters')),
        [searchParams],
    );
    const hasAppliedFilters = Object.keys(appliedFilters).length > 0;
    const isFilteredView = isAdvancedSearchMode && !searchQuery;

    useMetadata(
        isFilteredView ? 'Filtered Products | Mobirays' : `Search results for "${searchQuery}" | Mobirays`,
        isFilteredView ? 'Advanced filter search results on Mobirays.' : `Explore search results for ${searchQuery} on Mobirays.`
    );
    const advancedRequestCategories = useMemo(
        () => buildAdvancedSearchRequestPayload(attributes, appliedFilters, {
            activeCategoryId,
            includeEmptyActiveCategory: activeCategoryId !== null,
        }),
        [activeCategoryId, appliedFilters, attributes],
    );
    const advancedFiltersMissingCategoryIds = useMemo(
        () => getAdvancedSearchAttributesMissingCategoryIds(attributes, appliedFilters, {
            activeCategoryId,
        }),
        [activeCategoryId, appliedFilters, attributes],
    );

    // Fetch banners from API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/banner?per_page=100`);
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

    // Advanced Search now runs locally on the allProducts catalog for perfect pagination and performance
    const localAdvancedProducts = useMemo(() => {
        if (!isFilteredView || allProducts.length === 0) return [];
        
        return runAdvancedSearch(
            allProducts,
            attributes,
            appliedFilters,
        );
    }, [isFilteredView, allProducts, attributes, appliedFilters]);

    const searchResults = useMemo(() => {
        if (isFilteredView) {
            if (allProducts.length > 0) {
                // Categorize matched products using existing helper
                const filteredPhones = filterProductsByCategory(localAdvancedProducts, 'Phones');
                const filteredTablets = filterProductsByCategory(localAdvancedProducts, 'Tablets');
                const filteredWatches = filterProductsByCategory(localAdvancedProducts, 'Smartwatches');

                // Products that don't match any known category — still show them in phones
                const categorizedIds = new Set([...filteredPhones, ...filteredTablets, ...filteredWatches].map(p => p.id));
                const uncategorized = localAdvancedProducts.filter(p => !categorizedIds.has(p.id));

                return {
                    phones: [...filteredPhones, ...uncategorized],
                    tablets: filteredTablets,
                    watches: filteredWatches,
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
        localAdvancedProducts,
        allProducts.length,
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

    if (loading) {
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

                        <div className="mb-4" ref={resultsRef}>
                            <h1 className="text-2xl font-bold px-4">
                                {isFilteredView ? 'Filtered Results' : `Search Results for "${searchQuery}"`}
                            </h1>
                        </div>

                        {/* Phones Section */}
                        {phones.length > 0 && (
                            <div>
                                <LatestProducts title="Phones Results" products={phones} itemImage={mobileImg} enablePagination={true} itemsPerPage={24} />
                            </div>
                        )}

                        {phones.length > 0 && pageBanners['searchpage_banner_1'] && <div className='mt-7 hidden sm:block'><BannerAd banner={pageBanners['searchpage_banner_1']} className='h-[200px] sm:w-full' /></div>}

                        {/* Tabs Section */}
                        {tablets.length > 0 && (
                            <div className='mt-10'>
                                <LatestProducts title="Tablets Results" products={tablets} itemImage={tabImg} enablePagination={true} itemsPerPage={24} />
                            </div>
                        )}

                        {tablets.length > 0 && pageBanners['searchpage_banner_2'] && <div className='mt-7 hidden sm:block'><BannerAd banner={pageBanners['searchpage_banner_2']} className='h-[200px] sm:w-full' /></div>}

                        {/* Smartwatches Section */}
                        {watches.length > 0 && (
                            <div className='mt-10'>
                                <LatestProducts title="Smartwatches Results" products={watches} itemImage={watchImg} enablePagination={true} itemsPerPage={24} />
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
