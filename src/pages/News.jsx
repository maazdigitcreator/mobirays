import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import newsBanner1 from '../assets/newsBanner1.png'
import newsBanner2 from '../assets/newsBanner2.png'
import SingleNews from '../components/SingleNews'
import Pagination from '../components/Pagination'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import mobileImg from '../assets/mobileImg.jpg'
import SidebarIntro from '../components/SidebarSections/SidebarIntro'
import SidebarBrands from '../components/SidebarSections/SidebarBrands'
import SidebarFilters from '../components/SidebarSections/SidebarFilters'
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1'
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2'
import SidebarStats from '../components/SidebarSections/SidebarStats'
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels'
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3'
import { useData } from '../context/DataContext';
import BannerAd from '../components/BannerAd'
import homeBanner3 from '../assets/homeBanner3.png'
import homeBannerSM3 from '../assets/homeBannerSM3.png'

const News = () => {
    const location = useLocation();
    const { allNews: cachedNews, allBanners, loading } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [pageBanners, setPageBanners] = useState({});
    const newsBannerFallback = {
        title: 'News Banner',
        image: homeBanner3,
    };
    const newsBannerMobileFallback = {
        title: 'News Banner Mobile',
        image: homeBannerSM3,
    };

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
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white sm:p-6">
                            <h2 className="mb-1 text-[18px] font-bold leading-tight transition-colors sm:mb-2 sm:text-[48px]">
                                {featuredNews.name}
                            </h2>
                            <p className="text-[10px] uppercase tracking-wide sm:text-sm">
                                BY NOOR
                            </p>
                        </div>
                    </Link>

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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-3 pr-7 text-white">
                                    <h3 className="mb-1 text-[10px] font-semibold leading-tight line-clamp-3 transition-colors sm:text-[25px] sm:font-bold">
                                        {news.name}
                                    </h3>
                                    <p className="text-[9px] uppercase tracking-wide sm:text-xs">
                                        BY NOOR
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            <div className="mt-2 grid gap-2 lg:grid-cols-[401px_minmax(0,1fr)] lg:items-start">
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

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                    <div className="mt-7 sm:hidden">
                        <BannerAd banner={pageBanners['news_banner_3'] || newsBannerMobileFallback} className="w-full" />
                    </div>
                    <div className="mt-7 hidden sm:block">
                        <BannerAd banner={pageBanners['news_banner_3'] || newsBannerFallback} className="w-full" />
                    </div>
                </div>
            </div>
            <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />

        </div>
    )
}

export default News
