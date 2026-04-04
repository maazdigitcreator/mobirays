import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useData } from '../context/useData'
import { useAuth } from '../context/useAuth'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import LatestNews from '../components/LatestNews'
import LatestReviews from '../components/LatestReviews'
import mobileImg from '../assets/mobileImg.jpg'
import tabImg from '../assets/tabImg.jpg'
import watchImg from '../assets/watchImg.png'
import MobileSpecsDetail from '../components/MobileSpecsDetail'
import SpecificationsTable from '../components/SpecificationsTable'
import cartIcon from '../assets/cartIcon.png'
import SidebarBrands from '../components/SidebarSections/SidebarBrands'
import SidebarFilters from '../components/SidebarSections/SidebarFilters'
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1'
import SidebarStats from '../components/SidebarSections/SidebarStats'
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2'
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels'
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3'
import RelatedReviews from '../components/SidebarSections/RelatedReviews'
import RelatedNews from '../components/SidebarSections/RelatedNews'
import { productReviewService } from '../services/productReviewService'
import { productService } from '../services/productService'
import { useProductPageReviews } from '../hooks/useProductPageReviews'
import BannerAd from '../components/BannerAd'

const PRODUCT_DETAIL_CACHE_KEY = 'mobirays_product_detail_cache_v1';
const PRODUCT_VISITED_CACHE_KEY = 'mobirays_product_visited_v1';

const readCachedProductDetails = (productId) => {
    if (typeof window === 'undefined' || !productId) {
        return null;
    }

    try {
        const rawCache = sessionStorage.getItem(PRODUCT_DETAIL_CACHE_KEY);
        const parsedCache = rawCache ? JSON.parse(rawCache) : {};
        return parsedCache[String(productId)] ?? null;
    } catch {
        return null;
    }
};

const writeCachedProductDetails = (product) => {
    const normalizedProductId = Number(product?.id);

    if (
        typeof window === 'undefined' ||
        !Number.isFinite(normalizedProductId) ||
        normalizedProductId <= 0
    ) {
        return;
    }

    try {
        const rawCache = sessionStorage.getItem(PRODUCT_DETAIL_CACHE_KEY);
        const parsedCache = rawCache ? JSON.parse(rawCache) : {};
        parsedCache[String(normalizedProductId)] = product;
        sessionStorage.setItem(
            PRODUCT_DETAIL_CACHE_KEY,
            JSON.stringify(parsedCache),
        );
    } catch {
        // Ignore cache write failures and continue with in-memory state.
    }
};

const readVisitedProductIds = () => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const rawVisitedIds = sessionStorage.getItem(PRODUCT_VISITED_CACHE_KEY);
        const parsedVisitedIds = rawVisitedIds ? JSON.parse(rawVisitedIds) : [];
        return Array.isArray(parsedVisitedIds) ? parsedVisitedIds : [];
    } catch {
        return [];
    }
};

const hasVisitedProduct = (productId) =>
    readVisitedProductIds().includes(String(productId));

const markProductAsVisited = (productId) => {
    if (typeof window === 'undefined' || !productId) {
        return;
    }

    try {
        const visitedIds = readVisitedProductIds();
        const normalizedProductId = String(productId);

        if (visitedIds.includes(normalizedProductId)) {
            return;
        }

        sessionStorage.setItem(
            PRODUCT_VISITED_CACHE_KEY,
            JSON.stringify([...visitedIds, normalizedProductId]),
        );
    } catch {
        // Ignore cache write failures and continue without visit deduping.
    }
};

const setDocumentDescription = (content) => {
    if (typeof document === 'undefined') {
        return;
    }

    let descriptionTag = document.querySelector('meta[name="description"]');

    if (!descriptionTag) {
        descriptionTag = document.createElement('meta');
        descriptionTag.setAttribute('name', 'description');
        document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', content);
};

const MobileSpecs = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const {
        allProducts,
        allNews,
        allReviews,
        allBanners,
        setProductVisitorTotalCount,
    } = useData();
    const topRef = useRef(null);
    const commentsSectionRef = useRef(null);
    const reviewFormRef = useRef(null);
    const [reviewForm, setReviewForm] = useState({
        title: '',
        rating: 0,
        content: '',
    });
    const [reviewStatus, setReviewStatus] = useState({
        loading: false,
        error: '',
        success: '',
    });
    const [fetchedProduct, setFetchedProduct] = useState(null);
    const [productStatus, setProductStatus] = useState({
        loading: false,
        error: '',
    });

    const routeProductId = Number(productId);
    const stateProduct = location.state?.product ?? null;

    const matchedProduct = useMemo(() => {
        if (Number.isFinite(routeProductId) && routeProductId > 0) {
            return allProducts.find((product) => Number(product.id) === routeProductId) ?? null;
        }

        if (stateProduct?.id) {
            return allProducts.find((product) => Number(product.id) === Number(stateProduct.id)) ?? stateProduct;
        }
        return null;
    }, [allProducts, routeProductId, stateProduct]);

    const resolvedProductId = useMemo(() => {
        if (Number.isFinite(routeProductId) && routeProductId > 0) {
            return routeProductId;
        }

        const matchedProductId = Number(stateProduct?.id ?? matchedProduct?.id);
        return Number.isFinite(matchedProductId) && matchedProductId > 0 ? matchedProductId : null;
    }, [matchedProduct?.id, routeProductId, stateProduct?.id]);

    useEffect(() => {
        if (!resolvedProductId) {
            return;
        }

        const cachedProduct = readCachedProductDetails(resolvedProductId);

        if (cachedProduct) {
            setFetchedProduct(cachedProduct);
            setProductVisitorTotalCount(
                cachedProduct.id,
                cachedProduct.views,
                cachedProduct.name,
                cachedProduct.slug,
            );
            setProductStatus({
                loading: false,
                error: '',
            });
            return;
        }

        setFetchedProduct(null);

        const controller = new AbortController();
        const shouldIncrementView = !hasVisitedProduct(resolvedProductId);

        const fetchProduct = async () => {
            setProductStatus({
                loading: true,
                error: '',
            });

            try {
                const response = await productService.getProductById({
                    productId: resolvedProductId,
                    isVisited: shouldIncrementView ? 1 : 0,
                    signal: controller.signal,
                });

                if (controller.signal.aborted) {
                    return;
                }

                const nextProduct = response?.data ?? null;

                setFetchedProduct(nextProduct);
                writeCachedProductDetails(nextProduct);
                if (shouldIncrementView) {
                    markProductAsVisited(resolvedProductId);
                }
                setProductVisitorTotalCount(
                    nextProduct?.id ?? resolvedProductId,
                    nextProduct?.views,
                    nextProduct?.name,
                    nextProduct?.slug,
                );
                setProductStatus({
                    loading: false,
                    error: '',
                });
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setFetchedProduct(null);
                setProductStatus({
                    loading: false,
                    error:
                        error?.data?.message ||
                        error?.message ||
                        'Failed to load product details.',
                });
            }
        };

        void fetchProduct();

        return () => {
            controller.abort();
        };
    }, [
        resolvedProductId,
        setProductVisitorTotalCount,
    ]);

    const productData = fetchedProduct ?? stateProduct ?? matchedProduct ?? null;

    useEffect(() => {
        if (!productData?.name) {
            return;
        }

        const nextTitle = `${productData.name} - Full Specifications | Mobirays`;
        const nextDescription = `${productData.name} full specs, price, camera, battery, display and more on Mobirays.`;

        document.title = nextTitle;
        setDocumentDescription(nextDescription);
    }, [productData?.name]);

    const pageBanners = useMemo(() => {
        const map = {};
        ['mobilespecifications_banner_1', 'mobilespecifications_banner_2', 'mobilespecifications_banner_3'].forEach((loc) => {
            const banner = allBanners.find((item) => item.location === loc);
            if (banner) map[loc] = banner;
        });
        return map;
    }, [allBanners]);
    const {
        visibleReviews: productReviews,
        status: productReviewsStatus,
        stats: productReviewStats,
        refreshReviews,
    } = useProductPageReviews(productData?.id);

    useEffect(() => {
        topRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [resolvedProductId]);

    // Define related news and reviews with unique names to avoid shadowing components
    const filteredRelatedNews = useMemo(() => {
        if (!productData?.name) return [];
        const pName = productData.name.toLowerCase().trim();
        return allNews.filter(n =>
            (n.is_products === 1 && n.products && n.products.toLowerCase().trim() === pName) ||
            (n.name && n.name.toLowerCase().includes(pName)) ||
            (n.title && n.title.toLowerCase().includes(pName))
        );
    }, [allNews, productData]);

    const filteredRelatedReviews = useMemo(() => {
        if (!productData?.name) return [];
        const pName = productData.name.toLowerCase().trim();
        return allReviews.filter(r =>
            (r.is_products === 1 && r.products && r.products.toLowerCase().trim() === pName) ||
            (r.name && r.name.toLowerCase().includes(pName)) ||
            (r.subtitle && r.subtitle.toLowerCase().includes(pName))
        );
    }, [allReviews, productData]);

    const comingSoonConfig = useMemo(() => {
        const category = productData?.product_category?.toLowerCase();

        if (category && category.includes('watch')) {
            return {
                itemImage: watchImg,
                title: 'Coming Soon Smartwatches',
                endpoint: '/api/v1/products/watchesComingsoon',
            };
        }

        if (category && (category.includes('tab') || category.includes('pad'))) {
            return {
                itemImage: tabImg,
                title: 'Coming Soon Tablets',
                endpoint: '/api/v1/products/tabletComingsoon',
            };
        }

        return {
            itemImage: mobileImg,
            title: 'Coming Soon Mobiles',
            endpoint: '/api/v1/products/phoneComingsoon',
        };
    }, [productData?.product_category]);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRatingSelect = (rating) => {
        setReviewForm((prev) => ({
            ...prev,
            rating,
        }));
    };

    const handleCommentsClick = () => {
        commentsSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const getReviewErrorMessage = (error) => {
        const apiError = error?.data || error;
        if (apiError?.errors) {
            const firstError = Object.values(apiError.errors).flat()[0];
            if (firstError) return firstError;
        }
        return apiError?.message || 'Failed to submit review. Please try again.';
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login', {
                state: {
                    from: location,
                },
            });
            return;
        }

        if (!productData?.id) {
            setReviewStatus({
                loading: false,
                error: 'Product information is missing. Please refresh and try again.',
                success: '',
            });
            return;
        }

        if (!reviewForm.rating) {
            setReviewStatus({
                loading: false,
                error: 'Please select a rating before submitting your review.',
                success: '',
            });
            return;
        }

        setReviewStatus({
            loading: true,
            error: '',
            success: '',
        });

        try {
            await productReviewService.store({
                productId: productData.id,
                title: reviewForm.title.trim(),
                rating: reviewForm.rating,
                content: reviewForm.content.trim(),
            });

            setReviewStatus({
                loading: false,
                error: '',
                success: 'Your review has been submitted successfully.',
            });
            setReviewForm({
                title: '',
                rating: 0,
                content: '',
            });
            refreshReviews();
        } catch (error) {
            if (error?.status === 401) {
                navigate('/login', {
                    state: {
                        from: location,
                    },
                });
                return;
            }

            setReviewStatus({
                loading: false,
                error: getReviewErrorMessage(error),
                success: '',
            });
        }
    };

    if (productStatus.loading && !productData) {
        return (
            <div ref={topRef} className="py-20 text-center text-gray-500">
                Loading product details...
            </div>
        );
    }

    if (!productData) {
        return (
            <div ref={topRef} className="py-20 text-center">
                <p className="text-gray-700">
                    {productStatus.error || 'Product details could not be found.'}
                </p>
            </div>
        );
    }

    return (
        <div ref={topRef}>
            <div className='flex flex-col lg:flex-row gap-2'>
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">

                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <RelatedReviews productName={productData?.name} />
                        <RelatedNews productName={productData?.name} />
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
                    {/* Mobile Specs Detail Component */}
                    <MobileSpecsDetail
                        key={productData?.id || resolvedProductId}
                        productData={productData}
                        onCommentsClick={handleCommentsClick}
                    />

                    {/* Specifications Table */}
                    <div className="mt-4 ">
                        <SpecificationsTable productData={productData} />
                    </div>


                    {pageBanners['mobilespecifications_banner_1'] && <BannerAd banner={pageBanners['mobilespecifications_banner_1']} className='mt-7 w-auto sm:w-full' />}


                    <div>
                        <div className="relative w-full flex items-end lg:justify-start mb-8 mt-3">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center gap-4 sm:gap-0 justify-center relative z-10"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "10px",
                                    paddingRight: "60px"
                                }}
                            >
                                <img src={cartIcon} width={30} alt="" />
                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">Shop by</h2>
                            </div>
                        </div>


                        {/* Shop Section */}
                        <div className="mt-5 px-2 sm:px-4">
                            {/* Shop Data */}
                            {(() => {
                                // Use API data from productData.shopBy_links or fallback to empty array
                                const shopLinks = productData?.shopBy_links || [];

                                // If no API data, show message
                                if (shopLinks.length === 0) {
                                    return (
                                        <div className="text-center py-10">
                                            <p className="text-gray-500">No shopping links available</p>
                                        </div>
                                    );
                                }

                                const leftColumn = shopLinks.slice(0, 3);
                                const rightColumn = shopLinks.slice(3, 6);

                                return (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-15 max-w-5xl mx-auto">
                                        {/* Left Column */}
                                        <div className="space-y-3">
                                            {leftColumn.map((item, index) => (
                                                <div key={index} className="flex items-stretch justify-center lg:justify-end gap-2">
                                                    <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center">
                                                        <span className="font-semibold text-black">${item.price}</span>
                                                    </div>
                                                    <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                                        <img
                                                            src={item.image}
                                                            alt="Store logo"
                                                            className="h-6 object-contain"
                                                        />
                                                    </div>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-[#0580A5] text-white px-6 py-2 hover:bg-[#046a8a] transition-colors cursor-pointer text-sm rounded-r-full flex items-center justify-center"
                                                    >
                                                        GO TO BUYING
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-3">
                                            {rightColumn.map((item, index) => (
                                                <div key={index} className="flex items-stretch gap-2 sm:justify-start justify-center lg:justify-start">
                                                    <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center">
                                                        <span className="font-semibold text-gray-800">${item.price}</span>
                                                    </div>
                                                    <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                                        <img
                                                            src={item.image}
                                                            alt="Store logo"
                                                            className="h-6 object-contain"
                                                        />
                                                    </div>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-[#0580A5] text-white px-6 py-2 hover:bg-[#046a8a] transition-colors cursor-pointer text-sm rounded-r-full flex items-center justify-center"
                                                    >
                                                        GO TO BUYING
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Disclaimer Text */}
                            <div className="mt-6 text-center max-w-4xl mx-auto">
                                <p className="text-sm sm:font-medium text-black leading-relaxed sm:text-[17px]">
                                    <span className="font-semibold">Disclaimer.</span> Samsung Galaxy Note 20 price in Pakistan is updated daily from the price list provided by local shops and dealers but we can not guarantee that the information/price/Samsung Galaxy Note 20 Prices on this page is 100% correct (Human error is possible), always visit your local shop for exact cell phone cost & rate. Samsung Galaxy Note 20 price Pakistan.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div className="relative w-full flex items-start justify-between lg:justify-between mb-5 mt-3">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "10px",
                                    paddingRight: "60px"
                                }}
                            >
                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">User Reviews</h2>
                            </div>
                            <div>
                                <Link to="/reviews" className='text-[#0060FF] sm:text-xl underline cursor-pointer text-sm'>Read All User Reviews</Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-4">
                            {/* Box 1: Overall Rating */}
                            <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-evenly">
                                <h3 className="text-lg font-semibold mb-2 text-black">OVERALL RATING</h3>
                                <div className="text-6xl font-bold text-black">
                                    {productReviewStats.averageRating}<span className="text-4xl">/5</span>
                                </div>
                                <p className="text-base text-black mt-2 text-sm">
                                    BASED ON {productReviewStats.totalReviews.toLocaleString()} RATING(S)
                                </p>
                            </div>

                            {/* Box 2: Rating Breakdown */}
                            <div className="border-2 border-[#0580A5] p-6">
                                <h3 className="text-lg font-semibold mb-4 text-black text-center">OVERALL RATING</h3>
                                <div className="space-y-2 text-black">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = productReviewStats.counts[star];
                                        const width = productReviewStats.totalReviews > 0
                                            ? `${(count / productReviewStats.totalReviews) * 100}%`
                                            : '0%';

                                        return (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-sm w-14">{star} star{star === 1 ? '' : 's'}</span>
                                                <div className="flex-1 bg-gray-200 h-4 ">
                                                    <div className="bg-[#0580A5] h-4 " style={{ width }}></div>
                                                </div>
                                                <span className="text-sm w-12 text-right">{count.toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-center mt-4 text-black">
                                    {productReviewStats.totalReviews.toLocaleString()} USER REVIEW(S)
                                </p>
                            </div>

                            {/* Box 3: Share Your Thoughts */}
                            <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-start gap-10">
                                <h3 className="text-lg font-semibold mb-6 text-black">SHARE YOUR THOUGHTS</h3>
                                <button
                                    type="button"
                                    onClick={() => reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    className="bg-[#0580A5] text-white px-8 py-3 hover:bg-[#046a8a] transition-colors  text-sm cursor-pointer"
                                >
                                    WRITE A REVIEW
                                </button>
                            </div>
                        </div>
                    </div>

                    <div ref={commentsSectionRef}>
                        <div className="relative w-full flex items-end justify-center lg:justify-start mb-5 mt-6">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit sm:h-10 sm:h-12 flex items-center justify-center relative z-10"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "0px",
                                    paddingRight: "60px"
                                }}
                            >

                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">{productData?.name || "Mobile"} Price Discussions, Opinions and Reviews</h2>
                            </div>
                        </div>



                        <div className="space-y-3 px-2 sm:px-0">
                            {productReviewsStatus.error && (
                                <div className="border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                                    {productReviewsStatus.error}
                                </div>
                            )}

                            {productReviewsStatus.loading ? (
                                <div className="border-2 border-[#0580A5] px-4 py-8 text-center text-gray-500">
                                    Loading reviews...
                                </div>
                            ) : productReviews.length > 0 ? (
                                productReviews.map((review) => (
                                    <div key={review.id} className="border-2 border-[#0580A5] px-4 py-2">
                                        <div className="flex justify-between items-start mb-1 gap-4">
                                            <h3 className="text-2xl">{review.title}</h3>
                                            <div className="flex flex-col items-end gap-0 flex-shrink-0">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <span key={i} className="text-yellow-400 text-xl">★</span>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-black">{review.date}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-black font-bold mb-2">{review.author}</p>
                                        <p className="text-sm text-black leading-tight mb-3">
                                            {review.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="border-2 border-[#0580A5] px-4 py-8 text-center text-gray-500">
                                    No reviews found for this product yet.
                                </div>
                            )}

                            {/* Add Review Form */}
                            <form
                                ref={reviewFormRef}
                                className="border-2 border-[#0580A5] bg-gray-50 p-2 mt-2"
                                onSubmit={handleReviewSubmit}
                            >
                                {reviewStatus.error && (
                                    <div className="mb-3 border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                                        {reviewStatus.error}
                                    </div>
                                )}

                                {reviewStatus.success && (
                                    <div className="mb-3 border border-green-300 bg-green-100 px-3 py-2 text-sm text-green-700">
                                        {reviewStatus.success}
                                    </div>
                                )}

                                {/* Title and Stars Row */}
                                <div className="flex items-center gap-4 mb-3">
                                    <input
                                        type="text"
                                        name="title"
                                        value={reviewForm.title}
                                        onChange={handleReviewChange}
                                        placeholder="Add Title"
                                        required
                                        className="border-1 px-3 py-1 focus:outline-none bg-white border-[#0580A5] flex-shrink-0 placeholder-black text-black placeholder:font-semibold placeholder:text-lg w-[170px] sm:w-[250px]"

                                    />
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleRatingSelect(i + 1)}
                                                className={`text-xl cursor-pointer ${i < reviewForm.rating ? 'text-yellow-400' : 'text-[#0580A5]'}`}
                                                aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                                            >
                                                {i < reviewForm.rating ? '★' : '☆'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment Section */}
                                <div className="mb-1">

                                    <textarea
                                        name="content"
                                        value={reviewForm.content}
                                        onChange={handleReviewChange}
                                        className="w-full border-1  p-3 focus:outline-none border-[#0580A5] bg-white text-black placeholder-black"
                                        rows="3"
                                        placeholder="Content"
                                        required
                                    ></textarea>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="submit"
                                        disabled={reviewStatus.loading}
                                        className="bg-[#0580A5] text-white px-8 py-2 hover:bg-[#046a8a] transition-colors font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {reviewStatus.loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>

                            <div className="flex sm:flex-row gap-4 justify-between sm:justify-end items-center mt-2">
                                <Link to="/reviews" className="flex items-center justify-center border-2 border-[#0580A5] text-black sm:px-6 px-4 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors text-base cursor-pointer">
                                    Read All Reviews&gt;&gt;
                                </Link>
                                <button className="border-2 border-[#0580A5] text-black sm:px-6 px-4 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors  text-base cursor-pointer ">
                                    Post a Suggestion&gt;&gt;
                                </button>
                            </div>
                        </div>
                    </div>

                    {pageBanners['mobilespecifications_banner_2'] && <BannerAd banner={pageBanners['mobilespecifications_banner_2']} className='mt-7 h-[200px] w-auto sm:w-full' />}



                    <div className='mt-10'>
                        <LatestNews
                            title="Related News"
                            gridCols="sm:grid-cols-2"
                            titleAlign="start"
                            clipPath="polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)"
                            paddingLeft="0px"
                            paddingRight="60px"
                            limit={4}
                            newsData={filteredRelatedNews}
                            emptyMessage="This product has no related news yet."
                        />
                    </div>
                    <div className='mt-10'>
                        <LatestReviews
                            title="Related Reviews"
                            gridCols="sm:grid-cols-3"
                            titleAlign="start"
                            clipPath="polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)"
                            paddingLeft="0px"
                            paddingRight="60px"
                            limit={6}
                            reviewsData={filteredRelatedReviews}
                            emptyMessage="This product has no reviews yet."
                        />
                    </div>




                </div>
            </div>


            {pageBanners['mobilespecifications_banner_3'] && <BannerAd banner={pageBanners['mobilespecifications_banner_3']} className='mt-7 w-auto sm:w-full h-[200px] sm:h-auto' />}

            <ComingSoonMobiles title={comingSoonConfig.title} itemImage={comingSoonConfig.itemImage} endpoint={comingSoonConfig.endpoint} />

        </div>
    )
}

export default MobileSpecs
