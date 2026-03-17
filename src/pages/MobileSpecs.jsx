import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/useAuth'
import Sidebar4 from '../components/Layout/Sidebar4'
import LatestProducts from '../components/LatestProducts'
import Pagination from '../components/Pagination'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import ProductsSectionButton from '../components/ProductsSectionButton'
import homeBanner3 from '../assets/homeBanner3.png'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg'
import LatestNews from '../components/LatestNews'
import LatestReviews from '../components/LatestReviews'
import HeroBanner from '../components/Layout/HeroBanner'
import homeBannerSM2 from '../assets/homeBannerSM2.png'
import mobileImg from '../assets/mobileImg.jpg'
import tabImg from '../assets/tabImg.jpg'
import watchImg from '../assets/watchImg.png'
import MobileSpecsDetail from '../components/MobileSpecsDetail'
import SpecificationsTable from '../components/SpecificationsTable'
import cartIcon from '../assets/cartIcon.png'
import amazonLogo from '../assets/amazon.png'
import samsungLogo from '../assets/samsung.png'
import ebayLogo from '../assets/ebay.png'
import flipkartLogo from '../assets/flipkart.png'
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
import BannerAd from '../components/BannerAd'
import homeBannerSM3 from '../assets/homeBannerSM3.png'

const MobileSpecs = () => {
    const { productSlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { allProducts, allNews, allReviews, allBanners, loading: contextLoading } = useData();
    const [pageBanners, setPageBanners] = useState({});
    const [productData, setProductData] = useState(location.state?.product || null);
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
    const specsBannerFallback = {
        title: 'Specs Banner',
        image: homeBanner3,
    };
    const specsBannerMobileFallback = {
        title: 'Specs Banner Mobile',
        image: homeBannerSM3,
    };

    // Handle product data synchronization with URL slug
    useEffect(() => {
        // Case 1: State is provided via navigation (Link state)
        if (location.state?.product && location.state.product.slug === productSlug) {
            setProductData(location.state.product);
            return;
        }

        // Case 2: Direct navigation or refresh - find in global data
        if (allProducts.length > 0) {
            const found = allProducts.find(p => p.slug === productSlug);
            if (found) {
                setProductData(found);
            }
        }
    }, [allProducts, productSlug, location.state]);

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['mobilespecifications_banner_1', 'mobilespecifications_banner_2', 'mobilespecifications_banner_3'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b?.image) map[loc] = b.image;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    // Define related news and reviews with unique names to avoid shadowing components
    const filteredRelatedNews = React.useMemo(() => {
        if (!productData?.name) return [];
        const pName = productData.name.toLowerCase().trim();
        return allNews.filter(n =>
            (n.is_products === 1 && n.products && n.products.toLowerCase().trim() === pName) ||
            (n.name && n.name.toLowerCase().includes(pName)) ||
            (n.title && n.title.toLowerCase().includes(pName))
        );
    }, [allNews, productData]);

    const filteredRelatedReviews = React.useMemo(() => {
        if (!productData?.name) return [];
        const pName = productData.name.toLowerCase().trim();
        return allReviews.filter(r =>
            (r.is_products === 1 && r.products && r.products.toLowerCase().trim() === pName) ||
            (r.name && r.name.toLowerCase().includes(pName)) ||
            (r.subtitle && r.subtitle.toLowerCase().includes(pName))
        );
    }, [allReviews, productData]);

    const comingSoonConfig = React.useMemo(() => {
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

    return (
        <div>
            <div className="grid gap-2 lg:grid-cols-[401px_minmax(0,1fr)] lg:items-start">
                <div className="hidden lg:block">
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

                <div className="min-w-0">
                    <MobileSpecsDetail key={productData?.id || productSlug} productData={productData} />

                    <div className="mt-4 ">
                        <SpecificationsTable productData={productData} />
                    </div>


                    <div className="mt-7 sm:hidden">
                        <BannerAd banner={{ image: pageBanners['mobilespecifications_banner_1'] || specsBannerMobileFallback.image }} className="w-full" />
                    </div>
                    <div className="mt-7 hidden sm:block">
                        <BannerAd banner={{ image: pageBanners['mobilespecifications_banner_1'] || specsBannerFallback.image }} className="w-full" />
                    </div>


                    <div>
                        <div className="relative mb-8 mt-3 flex w-full items-end justify-start">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-12"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "10px",
                                    paddingRight: "60px"
                                }}
                            >
                                <img src={cartIcon} width={30} alt="" />
                                <h2 className="pl-2 text-[18px] sm:pl-4 sm:text-2xl">Shop by</h2>
                            </div>
                        </div>


                        {/* Shop Section */}
                        <div className="mt-4 px-0 sm:px-2">
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
                                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6">
                                        <div className="space-y-2">
                                            {leftColumn.map((item, index) => (
                                                <div key={index} className="flex items-stretch gap-1.5">
                                                    <div className="flex min-w-[72px] items-center justify-center rounded-l-full border-2 border-[#0580A5] px-3 py-1">
                                                        <span className="text-[11px] font-semibold text-black sm:text-sm">${item.price}</span>
                                                    </div>
                                                    <div className="flex min-w-[88px] items-center justify-center border-2 border-[#0580A5] bg-white px-3 py-1 sm:min-w-[120px]">
                                                        <img
                                                            src={item.image}
                                                            alt="Store logo"
                                                            className="h-5 object-contain sm:h-6"
                                                        />
                                                    </div>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-1 items-center justify-center rounded-r-full bg-[#0580A5] px-3 py-1 text-[10px] text-white transition-colors hover:bg-[#046a8a] sm:text-sm"
                                                    >
                                                        GO TO BUYING
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            {rightColumn.map((item, index) => (
                                                <div key={index} className="flex items-stretch gap-1.5">
                                                    <div className="flex min-w-[72px] items-center justify-center rounded-l-full border-2 border-[#0580A5] px-3 py-1">
                                                        <span className="text-[11px] font-semibold text-gray-800 sm:text-sm">${item.price}</span>
                                                    </div>
                                                    <div className="flex min-w-[88px] items-center justify-center border-2 border-[#0580A5] bg-white px-3 py-1 sm:min-w-[120px]">
                                                        <img
                                                            src={item.image}
                                                            alt="Store logo"
                                                            className="h-5 object-contain sm:h-6"
                                                        />
                                                    </div>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-1 items-center justify-center rounded-r-full bg-[#0580A5] px-3 py-1 text-[10px] text-white transition-colors hover:bg-[#046a8a] sm:text-sm"
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
                            <div className="mx-auto mt-5 max-w-4xl text-center">
                                <p className="text-[10px] font-medium leading-relaxed text-black sm:text-[15px]">
                                    <span className="font-semibold">Disclaimer.</span> Samsung Galaxy Note 20 price in Pakistan is updated daily from the price list provided by local shops and dealers but we can not guarantee that the information/price/Samsung Galaxy Note 20 Prices on this page is 100% correct (Human error is possible), always visit your local shop for exact cell phone cost & rate. Samsung Galaxy Note 20 price Pakistan.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div className="relative mb-5 mt-3 flex w-full items-start justify-between gap-2">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-12"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "10px",
                                    paddingRight: "60px"
                                }}
                            >
                                <h2 className="pl-2 text-[14px] sm:pl-4 sm:text-2xl">User Reviews</h2>
                            </div>
                            <div>
                                <Link to="/reviews" className="cursor-pointer text-[10px] text-[#0060FF] underline sm:text-xl">Read All User Reviews</Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5 px-0 sm:grid-cols-3 sm:px-2">
                            <div className="flex flex-col items-center justify-center border-2 border-[#0580A5] p-1.5 text-center sm:p-5">
                                <h3 className="mb-1 text-[9px] font-semibold text-black sm:mb-2 sm:text-lg">OVERALL RATING</h3>
                                <div className="text-[20px] font-bold text-black sm:text-6xl">
                                    4.3<span className="text-[11px] sm:text-4xl">/5</span>
                                </div>
                                <p className="mt-1 text-[7px] leading-tight text-black sm:mt-2 sm:text-sm">BASED ON 7,373 RATING(S)</p>
                            </div>

                            <div className="border-2 border-[#0580A5] p-1.5 sm:p-5">
                                <h3 className="mb-1.5 text-center text-[8px] font-semibold text-black sm:mb-4 sm:text-lg">OVERALL RATING</h3>
                                <div className="space-y-1 text-black sm:space-y-2">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="w-7 text-[7px] sm:w-14 sm:text-sm">5 stars</span>
                                        <div className="h-2 flex-1 bg-gray-200 sm:h-4">
                                            <div className="h-2 bg-[#0580A5] sm:h-4" style={{ width: '70%' }}></div>
                                        </div>
                                        <span className="w-6 text-right text-[7px] sm:w-12 sm:text-sm">4,645</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="w-7 text-[7px] sm:w-14 sm:text-sm">4 stars</span>
                                        <div className="h-2 flex-1 bg-gray-200 sm:h-4">
                                            <div className="h-2 bg-[#0580A5] sm:h-4" style={{ width: '25%' }}></div>
                                        </div>
                                        <span className="w-6 text-right text-[7px] sm:w-12 sm:text-sm">1,777</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="w-7 text-[7px] sm:w-14 sm:text-sm">3 stars</span>
                                        <div className="h-2 flex-1 bg-gray-200 sm:h-4">
                                            <div className="h-2 bg-[#0580A5] sm:h-4" style={{ width: '7%' }}></div>
                                        </div>
                                        <span className="w-6 text-right text-[7px] sm:w-12 sm:text-sm">485</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="w-7 text-[7px] sm:w-14 sm:text-sm">2 stars</span>
                                        <div className="h-2 flex-1 bg-gray-200 sm:h-4">
                                            <div className="h-2 bg-[#0580A5] sm:h-4" style={{ width: '3%' }}></div>
                                        </div>
                                        <span className="w-6 text-right text-[7px] sm:w-12 sm:text-sm">183</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <span className="w-7 text-[7px] sm:w-14 sm:text-sm">1 star</span>
                                        <div className="h-2 flex-1 bg-gray-200 sm:h-4">
                                            <div className="h-2 bg-[#0580A5] sm:h-4" style={{ width: '7%' }}></div>
                                        </div>
                                        <span className="w-6 text-right text-[7px] sm:w-12 sm:text-sm">477</span>
                                    </div>
                                </div>
                                <p className="mt-1.5 text-center text-[7px] leading-tight text-black sm:mt-4 sm:text-xs">2,492 USER REVIEW(S)</p>
                            </div>

                            <div className="flex flex-col items-center justify-between border-2 border-[#0580A5] p-1.5 text-center sm:p-5">
                                <h3 className="mb-2 text-[8px] font-semibold leading-tight text-black sm:mb-6 sm:text-lg">SHARE YOUR THOUGHTS</h3>
                                <button className="bg-[#0580A5] px-2 py-1.5 text-[8px] text-white transition-colors hover:bg-[#046a8a] sm:px-8 sm:py-3 sm:text-sm">
                                    WRITE A REVIEW
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="relative mb-5 mt-6 flex w-full items-end justify-start">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip relative z-10 flex h-10 max-w-full items-center bg-[#0580A5] text-white sm:h-12"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "0px",
                                    paddingRight: "60px"
                                }}
                            >

                                <h2 className="pl-2 text-[11px] leading-none sm:pl-4 sm:text-2xl">
                                    {productData?.name || "Mobile"} Price Discussions, Opinions and Reviews
                                </h2>
                            </div>
                        </div>



                        <div className="space-y-2 px-0">
                            {/* Review Cards - Array Mapping */}
                            {(() => {
                                const reviewsData = [
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    },
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    },
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    },
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    }
                                ];

                                return reviewsData.map((review, index) => (
                                    <div key={index} className="border-2 border-[#0580A5] px-2 py-2 sm:px-4">
                                        <div className="mb-1 flex items-start justify-between gap-2">
                                            <h3 className="text-[10px] font-medium leading-tight sm:text-2xl">{review.title}</h3>
                                            <div className="flex flex-col items-end gap-0">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <span key={i} className="text-[12px] text-yellow-400 sm:text-xl">★</span>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-black">{review.date}</span>
                                            </div>
                                        </div>
                                        <p className="mb-2 text-[10px] font-bold text-black sm:text-sm">{review.author}</p>
                                        <p className="mb-3 text-[10px] leading-tight text-black sm:text-sm">
                                            {review.text}
                                        </p>
                                        <div className="flex items-center gap-3 pb-1 text-[10px] sm:text-sm">
                                            <span className="text-[10px] font-semibold text-black sm:text-sm">Is this review helpful?</span>
                                            <button className="flex items-center gap-1 text-[#0580A5] hover:underline cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                ));
                            })()}

                            {/* Add Review Form */}
                            <form className="mt-2 border-2 border-[#0580A5] bg-gray-50 p-2" onSubmit={handleReviewSubmit}>
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
                                <div className="mb-3 flex items-center gap-2 sm:gap-4">
                                    <input
                                        type="text"
                                        name="title"
                                        value={reviewForm.title}
                                        onChange={handleReviewChange}
                                        placeholder="Add Title"
                                        required
                                        className="border-1 min-w-0 flex-1 border-[#0580A5] bg-white px-3 py-1 text-black placeholder:text-[12px] placeholder:font-semibold placeholder:text-black focus:outline-none sm:w-[300px] sm:flex-none sm:placeholder:text-lg"
                                    />
                                    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleRatingSelect(i + 1)}
                                                className={`cursor-pointer text-[16px] sm:text-xl ${i < reviewForm.rating ? 'text-yellow-400' : 'text-[#0580A5]'}`}
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
                                        className="bg-[#0580A5] px-6 py-2 text-[11px] font-medium text-white transition-colors hover:bg-[#046a8a] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:text-base"
                                    >
                                        {reviewStatus.loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-2 flex w-full items-center gap-2 sm:gap-4">
                                <Link to="/reviews" className="flex flex-1 items-center justify-center rounded-full border-2 border-[#0580A5] px-3 py-1.5 text-[9px] text-black transition-colors hover:bg-[#0580A5] hover:text-white cursor-pointer sm:px-6 sm:py-2 sm:text-base">
                                    Read All Reviews&gt;&gt;
                                </Link>
                                <button className="flex-1 rounded-full border-2 border-[#0580A5] px-3 py-1.5 text-[9px] text-black transition-colors hover:bg-[#0580A5] hover:text-white cursor-pointer sm:px-6 sm:py-2 sm:text-base">
                                    Post a Suggestion&gt;&gt;
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 sm:hidden">
                        <BannerAd banner={{ image: pageBanners['mobilespecifications_banner_2'] || specsBannerMobileFallback.image }} className="w-full" />
                    </div>
                    <div className="mt-7 hidden sm:block">
                        <BannerAd banner={{ image: pageBanners['mobilespecifications_banner_2'] || specsBannerFallback.image }} className="w-full" />
                    </div>



                    <div className='mt-10'>
                        <LatestNews
                            title="Latest News"
                            gridCols="sm:grid-cols-2"
                            limit={4}
                            newsData={filteredRelatedNews}
                            emptyMessage="This product has no related news yet."
                        />
                    </div>
                    <div className='mt-10'>
                        <LatestReviews
                            title="Latest Reviews"
                            gridCols="sm:grid-cols-3"
                            limit={6}
                            reviewsData={filteredRelatedReviews}
                            emptyMessage="This product has no reviews yet."
                        />
                    </div>




                </div>
            </div>


            <div className="mt-7 sm:hidden">
                <BannerAd banner={{ image: pageBanners['mobilespecifications_banner_3'] || specsBannerMobileFallback.image }} className="w-full" />
            </div>
            <div className="mt-7 hidden sm:block">
                <BannerAd banner={{ image: pageBanners['mobilespecifications_banner_3'] || specsBannerFallback.image }} className="w-full" />
            </div>

            <ComingSoonMobiles title={comingSoonConfig.title} itemImage={comingSoonConfig.itemImage} endpoint={comingSoonConfig.endpoint} />

        </div>
    )
}

export default MobileSpecs
