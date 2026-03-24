import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import newsBanner1 from '../assets/newsBanner1.png'
import newsBanner2 from '../assets/newsBanner2.png'
import Sidebar2 from '../components/Layout/Sidebar2'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg'
import LatestNews from '../components/LatestNews'
import LatestReviews from '../components/LatestReviews'
import SingleNews from '../components/SingleNews'
import Pagination from '../components/Pagination'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import mobileImg from '../assets/mobileImg.jpg'
import SidebarBrands from '../components/SidebarSections/SidebarBrands'
import SidebarFilters from '../components/SidebarSections/SidebarFilters'
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1'
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2'
import SidebarStats from '../components/SidebarSections/SidebarStats'
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels'
import { useData } from '../context/useData';
import BannerAd from '../components/BannerAd'

const News = () => {
    const location = useLocation();
    const { allNews: cachedNews, allBanners, loading } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['news_banner_1', 'news_banner_2', 'news_banner_3'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b) map[loc] = b;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    // Use cached news data
    const newsData = cachedNews;

    // Apply search filter if query exists
    const params = new URLSearchParams(location.search);
    const searchQuery = (params.get('q') || '').toLowerCase();

    const displayedNews = searchQuery
        ? newsData.filter(n =>
            (n.name && n.name.toLowerCase().includes(searchQuery)) ||
            (n.title && n.title.toLowerCase().includes(searchQuery))
        )
        : newsData;

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Use API data or fallback to dummy data
    const featuredNews = displayedNews[0] || {
        id: 1,
        name: "Both a Galaxy S21 with S Pen and a Galaxy Note 21 are coming",
        slug: "galaxy-s21-note-21",
        image: newsBanner1
    };

    const gridNews = displayedNews.slice(1, 5).length > 0 ? displayedNews.slice(1, 5) : [
        { id: 2, name: "Both a Galaxy S21 with S Pen and a Galaxy Note 21 are coming", slug: "news-2", image: newsBanner2 },
        { id: 3, name: "Both a Galaxy S21 with S Pen and a Galaxy Note 21 are coming", slug: "news-3", image: newsBanner2 },
        { id: 4, name: "Both a Galaxy S21 with S Pen and a Galaxy Note 21 are coming", slug: "news-4", image: newsBanner2 },
        { id: 5, name: "Both a Galaxy S21 with S Pen and a Galaxy Note 21 are coming", slug: "news-5", image: newsBanner2 }
    ];

    // Get remaining news after featured and grid (starting from index 5)
    const remainingNews = displayedNews.slice(5);

    // First 3 news items from remaining
    const firstThreeNews = remainingNews.slice(0, 3);

    // Next 3 news items from remaining
    const nextThreeNews = remainingNews.slice(3, 6);

    // Paginated news (everything after the first 6 remaining items)
    const allPaginatedNews = remainingNews.slice(6);
    const totalPages = Math.ceil(allPaginatedNews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPaginatedNews = allPaginatedNews.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div className="text-center py-10">Loading news...</div>;
    }

    return (
        <div className="w-full">
            {/* Featured News Layout */}
            {searchQuery && displayedNews.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No news found matching "{searchQuery}"</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {/* Large Featured News - Left Side */}
                    <Link
                        to={`/news/${featuredNews.slug}`}
                        state={{ newsData: featuredNews }}
                        className="relative group cursor-pointer overflow-hidden"
                    >
                        <img
                            src={featuredNews.image}
                            alt={featuredNews.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h2 className="text-2xl sm:text-[48px] font-bold mb-2 leading-tight transition-colors">
                                {featuredNews.name}
                            </h2>
                            <p className="text-sm uppercase tracking-wide">
                                BY NOOR
                            </p>
                        </div>
                    </Link>

                    {/* Grid of 4 News Items - Right Side */}
                    <div className="grid grid-cols-2 gap-2">
                        {gridNews.map((news) => (
                            <Link
                                key={news.id}
                                to={`/news/${news.slug}`}
                                state={{ newsData: news }}
                                className="relative group cursor-pointer overflow-hidden h-[140px] lg:h-auto"
                            >
                                <img
                                    src={news.image}
                                    alt={news.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 pr-7 text-white">
                                    <h3 className="text-sm sm:text-[25px] sm:font-bold font-semibold mb-1 leading-tight line-clamp-3 transition-colors">
                                        {news.name}
                                    </h3>
                                    <p className="text-xs uppercase tracking-wide">
                                        BY NOOR
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}


            <div className='flex flex-col lg:flex-row gap-2 mt-2'>
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
                    {/* First 3 News */}
                    <div>
                        {firstThreeNews.map((newsItem) => (
                            <Link
                                key={newsItem.id}
                                to={`/news/${newsItem.slug}`}
                                state={{ newsData: newsItem }}
                            >
                                <SingleNews
                                    title={newsItem.name}
                                    description={newsItem.description}
                                    date={formatDate(newsItem.created_at)}
                                    image={newsItem.image}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* First Banner */}
                    {pageBanners['news_banner_1'] && (
                        <div className="md:col-span-3 mb-6 overflow-hidden">
                            <BannerAd banner={pageBanners['news_banner_1']} className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto" />
                        </div>
                    )}

                    {/* Next 3 News */}
                    <div>
                        {nextThreeNews.map((newsItem) => (
                            <Link
                                key={newsItem.id}
                                to={`/news/${newsItem.slug}`}
                                state={{ newsData: newsItem }}
                            >
                                <SingleNews
                                    title={newsItem.name}
                                    description={newsItem.description}
                                    date={formatDate(newsItem.created_at)}
                                    image={newsItem.image}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Second Banner */}
                    {pageBanners['news_banner_2'] && (
                        <div className="md:col-span-3 mb-6 overflow-hidden">
                            <BannerAd banner={pageBanners['news_banner_2']} className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto" />
                        </div>
                    )}

                    {/* Last 4 News with Pagination */}
                    {currentPaginatedNews.length > 0 && (
                        <>
                            <div>
                                {currentPaginatedNews.map((newsItem) => (
                                    <Link
                                        key={newsItem.id}
                                        to={`/news/${newsItem.slug}`}
                                        state={{ newsData: newsItem }}
                                    >
                                        <SingleNews
                                            title={newsItem.name}
                                            description={newsItem.description}
                                            date={formatDate(newsItem.created_at)}
                                            image={newsItem.image}
                                        />
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                    {pageBanners['news_banner_3'] && (
                        <div className="md:col-span-3 mb-6 overflow-hidden">
                            <BannerAd banner={pageBanners['news_banner_3']} className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto" />
                        </div>
                    )}
                </div>




            </div>
            <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />

        </div>
    )
}

export default News
