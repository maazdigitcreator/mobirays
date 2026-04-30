import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LatestReviews from '../components/LatestReviews'
import SingleReview from '../components/SingleReview'
import Pagination from '../components/Pagination'
import LatestNews from '../components/LatestNews'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import mobileImg from '../assets/mobileImg.jpg'
import AllBrandsHero from '../components/AllBrandsHero'
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import { useData } from '../context/useData';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import BannerAd from '../components/BannerAd'
import useMetadata from '../hooks/useMetadata'

const Reviews = () => {
    const location = useLocation();
    const { allReviews: cachedReviews, loading } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useMetadata(
        "Tech Reviews | Mobirays",
        "Read comprehensive reviews of the latest smartphones, tablets, and gadgets on Mobirays."
    );

    // Use cached reviews data and sort by latest first
    const reviews = [...cachedReviews].sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at));

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
    };

    const reviewsSectionRef = React.useRef(null);

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
                    <AllBrandsHero
                        title="Reviews"
                        backgroundImage={pageBanners['reviews_banner_1'] || null}
                    />

                    {loading ? (
                        <div className="text-center py-20">Loading reviews...</div>
                    ) : (
                        <>
                            {displayedReviews.length === 0 && searchQuery && (
                                <div className="text-center py-20 text-gray-500">No reviews found matching "{searchQuery}"</div>
                            )}

                            {/* Single continuous grid — banners injected as full-width rows at positions 3 and 6 */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 mb-4" ref={reviewsSectionRef}>
                                {displayedReviews.slice(0, 9).flatMap((review, idx) => {
                                    const rating = (parseFloat(review.rating) || 0);
                                    const slug = review.name ? review.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : 'review';
                                    const elements = [];

                                    if (idx === 3 && pageBanners['reviews_banner_2']) {
                                        elements.push(
                                            <div key="banner-2" className="col-span-2 sm:col-span-3">
                                                <BannerAd banner={pageBanners['reviews_banner_2']} />
                                            </div>
                                        );
                                    }
                                    if (idx === 6 && displayedReviews.length > 6 && pageBanners['reviews_banner_3']) {
                                        elements.push(
                                            <div key="banner-3" className="col-span-2 sm:col-span-3">
                                                <BannerAd banner={pageBanners['reviews_banner_3']} />
                                            </div>
                                        );
                                    }

                                    elements.push(
                                        <Link key={review.id} to={`/review/${slug}`} state={{ reviewData: review }}>
                                            <SingleReview
                                                title={review.name}
                                                rating={Math.min(rating, 10)}
                                                image={review.image}
                                            />
                                        </Link>
                                    );
                                    return elements;
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="mb-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    scrollTargetRef={reviewsSectionRef}
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
