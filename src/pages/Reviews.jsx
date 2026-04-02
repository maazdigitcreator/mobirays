import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Sidebar2 from '../components/Layout/Sidebar2'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg'
import LatestReviews from '../components/LatestReviews'
import homeBanner3 from '../assets/homeBanner3.png'
import SingleReview from '../components/SingleReview'
import Pagination from '../components/Pagination'
import reviewImg from '../assets/reviewsImg.png'
import LatestNews from '../components/LatestNews'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import mobileImg from '../assets/mobileImg.jpg'
import AllBrandsHero from '../components/AllBrandsHero'
import reviewsBanner from '../assets/reviewsBanner.png'
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import RelatedReviews from '../components/SidebarSections/RelatedReviews';
import RelatedNews from '../components/SidebarSections/RelatedNews';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import { useData } from '../context/useData';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import shareIcon from '../assets/shareIcon.png'
import compareIcon from '../assets/compareIcon.png'
import BannerAd from '../components/BannerAd'

const Reviews = () => {
    const location = useLocation();
    const { allReviews: cachedReviews, loading } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Use cached reviews data
    const reviews = cachedReviews;

    // Apply search filter if query exists
    const params = new URLSearchParams(location.search);
    const searchQuery = (params.get('q') || '').toLowerCase();

    const displayedReviews = searchQuery
        ? reviews.filter(r =>
            (r.name && r.name.toLowerCase().includes(searchQuery)) ||
            (r.subtitle && r.subtitle.toLowerCase().includes(searchQuery))
        )
        : reviews;

    // Note: If using server-side pagination, this client-side filtering only filters the current page.
    // Ideally the API should support 'q' param. Since we are doing client side mostly for now or simple API content:
    // If the API supported ?search=... we would pass it there. 
    // Assuming for now we rely on what we have or user accepts this limitation or we fetch ALL reviews for search.
    // The previous Fetch call was `allReviews?page=...`. If we want full search we might need to fetch all.
    // For this task, let's assume filtering the fetched data (or user might need infinite scroll / all data).
    // Given the previous pattern in Products, we fetch "allProducts". 
    // For reviews it seems we paginate. 
    // Let's modify the fetch to be "allReviews" without page if there is a query, OR just filter what we have.
    // Actually, `LatestReviews` usually fetches `allReviews`.
    // Let's filter `displayedReviews` effectively.

    // Local state for total pages if API provides it, otherwise default
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const { allBanners } = useData();
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['reviews_banner_1', 'reviews_banner_2', 'reviews_banner_3', 'reviews_banner_4'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b) map[loc] = b;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    const formatUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    const Banner1Content = () => {
        const b = pageBanners['reviews_banner_1'];
        if (!b) return null;

        const getImgUrl = (img) => {
            if (!img) return "";
            if (img.startsWith("http")) return img;
            const apiBase = "https://mobirays.voucherndeals.com";
            const cleanPath = img.replace(/^\/?storage\//, '');
            return `${apiBase}/storage/${cleanPath}`;
        };

        const desktopImg = getImgUrl(b.image);
        const mobileImg = getImgUrl(b.mobile_image) || desktopImg;
        const tabletImg = getImgUrl(b.tablet_image) || desktopImg;

        const content = (
            <div
                className="w-full h-[300px] sm:h-[55vh] relative overflow-hidden bg-gray-100"
            >
                <div className="absolute inset-0 w-full h-full">
                    <picture className="block w-full h-full">
                        <source
                            media="(max-width: 640px)"
                            srcSet={mobileImg}
                        />
                        <source
                            media="(min-width: 641px) and (max-width: 1024px)"
                            srcSet={tabletImg}
                        />
                        <img
                            src={desktopImg}
                            className="w-full h-full object-cover object-top"
                            alt=""
                        />
                    </picture>
                </div>
                <div className="absolute bg-white/60 bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:px-6 sm:py-5">
                    <div className="flex w-full gap-5 items-center justify-end">
                        <Link to="/comparison" className="">
                            <img src={compareIcon} alt="Compare" className="w-8 h-8 sm:w-10 sm:h-10 invert cursor-pointer" />
                        </Link>
                    </div>
                </div>
            </div>
        );

        if (b.url) {
            return (
                <a href={formatUrl(b.url)} target="_blank" rel="noopener noreferrer" className="block w-full cursor-pointer hover:opacity-90 transition-opacity">
                    {content}
                </a>
            );
        }
        return content;
    };

    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-2'>
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />

                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">
                    {/* Hero Section */}
                    <div className="w-full">
                        {/* Header */}
                        <div className="relative w-full mb-2 overflow-hidden">
                            {/* Background bar */}
                            <div className="w-full h-10 sm:h-14 flex items-center justify-between">
                                {/* Left side - Device name with slanted edge */}
                                <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                                <div className="relative w-full flex items-end">
                                    {/* Title Box */}
                                    <div
                                        className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10"
                                    >
                                        <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">Reviews</h1>
                                    </div>
                                </div>

                                {/* Right side - Share Icon */}
                                <div className="h-full flex gap-20 justify-between">
                                    <button className="hover:cursor-pointer flex items-center transition-colors w-fit pb-7 ">
                                        <img src={shareIcon} width={25} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hero Section with Background Image */}
                        <Banner1Content />
                    </div>

                    {loading ? (
                        <div className="text-center py-20">Loading reviews...</div>
                    ) : (
                        <>
                            {/* First 3 Reviews */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 mt-3">
                                {displayedReviews.length === 0 && searchQuery && (
                                    <div className="col-span-3 text-center py-20 text-gray-500">No reviews found matching "{searchQuery}"</div>
                                )}
                                {displayedReviews.slice(0, 3).map((review) => {
                                    const rating = (parseFloat(review.rating) || 0);
                                    // Generate slug
                                    const slug = review.name ? review.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : 'review';

                                    return (
                                        <Link key={review.id} to={`/review/${slug}`} state={{ reviewData: review }}>
                                            <SingleReview
                                                title={review.name}
                                                rating={Math.min(rating, 10)}
                                                image={review.image}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Banner 1 */}
                            {pageBanners['reviews_banner_2'] && (
                                <BannerAd banner={pageBanners['reviews_banner_2']} className="mb-4" />
                            )}

                            {/* Next 3 Reviews */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                {displayedReviews.slice(3, 6).map((review) => {
                                    const rating = (parseFloat(review.rating) || 0);
                                    const slug = review.name ? review.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : 'review';

                                    return (
                                        <Link key={review.id} to={`/review/${slug}`} state={{ reviewData: review }}>
                                            <SingleReview
                                                title={review.name}
                                                rating={Math.min(rating, 10)}
                                                image={review.image}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Banner 2 */}
                            {displayedReviews.length > 6 && pageBanners['reviews_banner_3'] && (
                                <BannerAd banner={pageBanners['reviews_banner_3']} className="mb-4" />
                            )}

                            {/* Last 3 Reviews (or more if page size > 9, but likely 9 or 10) */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                {displayedReviews.slice(6, 9).map((review) => {
                                    const rating = (parseFloat(review.rating) || 0) * 2;
                                    const slug = review.name ? review.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : 'review';

                                    return (
                                        <Link key={review.id} to={`/review/${slug}`} state={{ reviewData: review }}>
                                            <SingleReview
                                                title={review.name}
                                                rating={Math.min(rating, 10)}
                                                image={review.image}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
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

            {/* Full Width Banner */}
            {pageBanners['reviews_banner_4'] && (
                <div className="w-full mb-6 overflow-hidden">
                    <BannerAd banner={pageBanners['reviews_banner_4']} className="mt-7" />
                </div>
            )}

            {/* Latest News - Full Width */}
            <div className="mb-15">
                <LatestNews
                    title="Latest News"
                    gridCols="sm:grid-cols-3"
                    titleAlign="center"
                    limit={6}
                />
            </div>

            {/* Coming Soon Mobiles - Full Width */}
            <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />
        </div>
    )
}

export default Reviews
