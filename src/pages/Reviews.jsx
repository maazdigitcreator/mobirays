import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SingleReview from '../components/SingleReview'
import Pagination from '../components/Pagination'
import LatestNews from '../components/LatestNews'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import mobileImg from '../assets/mobileImg.jpg'
import reviewsBanner from '../assets/reviewsBanner.png'
import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import { useData } from '../context/DataContext';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3';
import BannerAd from '../components/BannerAd'
import { usePublicProductReviews } from '../hooks/usePublicProductReviews';
import homeBanner3 from '../assets/homeBanner3.png';
import homeBannerSM3 from '../assets/homeBannerSM3.png';
import { createSlug } from '../utils/urlHelper';
import compareIcon from '../assets/compareIcon.png';
import commentsIcon from '../assets/commentsIcon.png';
import picturesIcon from '../assets/picturesIcon.png';

const Reviews = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const searchQuery = (params.get('q') || '').toLowerCase();
    const [searchInput, setSearchInput] = useState(params.get('q') || '');
    const { currentReviews, currentPage, totalPages, status, filteredCount, setCurrentPage } = usePublicProductReviews(searchQuery);
    const topReviews = currentReviews.slice(0, 8);
    const bottomReviews = currentReviews.slice(8);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const trimmedQuery = searchInput.trim();
        navigate(trimmedQuery ? `/reviews?q=${encodeURIComponent(trimmedQuery)}` : '/reviews');
    };

    const { allBanners } = useData();
    const reviewsBannerFallback = {
        title: 'Reviews Banner',
        image: homeBanner3,
    };
    const reviewsBannerMobileFallback = {
        title: 'Reviews Banner Mobile',
        image: homeBannerSM3,
    };

    const pageBanners = useMemo(() => {
        const map = {};
        ['reviews_banner_1', 'reviews_banner_2', 'reviews_banner_3', 'reviews_banner_4'].forEach((loc) => {
            const banner = allBanners.find((item) => item.location === loc);
            if (banner) map[loc] = banner;
        });
        return map;
    }, [allBanners]);

    return (
        <div>
            <div className="grid gap-2 lg:grid-cols-[401px_minmax(0,1fr)] lg:items-start">
                <div className="hidden lg:block">
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

                <div className="min-w-0">
                    <div className="w-full">
                        <div className="relative w-full mb-2 overflow-hidden">
                            <div className="flex h-10 items-center justify-between sm:h-14">
                                <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                                <div className="relative flex w-full items-end">
                                    <div className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-14">
                                        <h1 className="pl-2 text-[14px] sm:pl-4 sm:text-[26px]">Reviews</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="relative overflow-hidden border border-[#0580A5] bg-cover bg-center"
                            style={{ backgroundImage: `url(${pageBanners['reviews_banner_1']?.image || reviewsBanner})` }}
                        >
                            <div className="aspect-[2.55/1] min-h-[180px] w-full sm:min-h-[320px]" />
                            <div className="absolute inset-x-0 bottom-0 bg-white/70 px-3 py-3 backdrop-blur-[2px] sm:px-6 sm:py-5">
                                <form onSubmit={handleSearchSubmit} className="mx-auto flex w-full max-w-[710px] gap-2">
                                    <div className="relative min-w-0 flex-1">
                                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] font-semibold sm:text-[28px]">
                                            <span className="text-[#4285F4]">G</span>
                                            <span className="text-[#EA4335]">o</span>
                                            <span className="text-[#FBBC05]">o</span>
                                            <span className="text-[#4285F4]">g</span>
                                            <span className="text-[#34A853]">l</span>
                                            <span className="text-[#EA4335]">e</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={searchInput}
                                            onChange={(event) => setSearchInput(event.target.value)}
                                            placeholder="Custom Search"
                                            className="w-full border-2 border-[#41403E] bg-white py-2 pl-[112px] pr-3 text-[14px] text-black placeholder:text-[#959190] focus:outline-none sm:py-4 sm:pl-[180px] sm:pr-4 sm:text-[24px]"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="shrink-0 border-2 border-[#41403E] bg-[#0580A5] px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#046a8a] sm:px-12 sm:py-4 sm:text-[24px]"
                                    >
                                        Search
                                    </button>
                                </form>

                                <div className="mt-4 grid grid-cols-3 gap-4 sm:mt-6">
                                    <Link to="/comparison" className="flex items-center justify-center">
                                        <img src={compareIcon} alt="Compare" className="h-10 w-10 cursor-pointer brightness-0 sm:h-16 sm:w-16" />
                                    </Link>
                                    <button type="button" className="flex items-center justify-center">
                                        <img src={commentsIcon} alt="Comments" className="h-10 w-10 cursor-pointer brightness-0 sm:h-16 sm:w-16" />
                                    </button>
                                    <button type="button" className="flex items-center justify-center">
                                        <img src={picturesIcon} alt="Pictures" className="h-10 w-10 cursor-pointer brightness-0 sm:h-16 sm:w-16" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {status.loading ? (
                        <div className="text-center py-20">Loading reviews...</div>
                    ) : (
                        <>
                            {status.error && (
                                <div className="mb-4 border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                                    {status.error}
                                </div>
                            )}

                            <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6">
                                {filteredCount === 0 && searchQuery && (
                                    <div className="col-span-full py-20 text-center text-gray-500">No reviews found matching "{searchQuery}"</div>
                                )}
                                {topReviews.map((review) => (
                                        <Link
                                            key={review.id}
                                            to={`/review/${createSlug(review.title || review.productName)}`}
                                            state={{ reviewData: review }}
                                        >
                                            <SingleReview
                                                title={review.title}
                                                rating={review.displayRating}
                                                image={review.productImage}
                                            />
                                        </Link>
                                ))}
                            </div>

                            <div className="mt-7 sm:hidden">
                                <BannerAd banner={pageBanners['reviews_banner_2'] || reviewsBannerMobileFallback} className="w-full" />
                            </div>
                            <div className="mt-7 hidden sm:block">
                                <BannerAd banner={pageBanners['reviews_banner_2'] || reviewsBannerFallback} className="w-full" />
                            </div>

                            {bottomReviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6">
                                    {bottomReviews.map((review) => (
                                            <Link
                                                key={review.id}
                                                to={`/review/${createSlug(review.title || review.productName)}`}
                                                state={{ reviewData: review }}
                                            >
                                                <SingleReview
                                                    title={review.title}
                                                    rating={review.displayRating}
                                                    image={review.productImage}
                                                />
                                            </Link>
                                    ))}
                                </div>
                            )}
                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-7 sm:hidden">
                <BannerAd banner={pageBanners['reviews_banner_3'] || reviewsBannerMobileFallback} className="w-full" />
            </div>
            <div className="mt-7 hidden sm:block">
                <BannerAd banner={pageBanners['reviews_banner_3'] || reviewsBannerFallback} className="w-full" />
            </div>

            <div className="mb-15 mt-10">
                <LatestNews
                    title="Latest News"
                    gridCols="sm:grid-cols-3"
                    limit={6}
                />
            </div>

            <div className="mt-7 sm:hidden">
                <BannerAd banner={pageBanners['reviews_banner_4'] || reviewsBannerMobileFallback} className="w-full" />
            </div>
            <div className="mt-7 hidden sm:block">
                <BannerAd banner={pageBanners['reviews_banner_4'] || reviewsBannerFallback} className="w-full" />
            </div>

            <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />
        </div>
    )
}

export default Reviews
