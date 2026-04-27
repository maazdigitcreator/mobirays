import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/useData';
import LatestNewsImg from '../assets/LatestNewsImg.png'
import { FaRegCommentDots } from "react-icons/fa";

const LatestNews = ({ title, gridCols, titleAlign = 'center', clipPath, paddingLeft, paddingRight, limit, newsData, showMoreLink, emptyMessage }) => {
    const [isDesktop, setIsDesktop] = useState(false);
    const { allNews, loading: dataLoading } = useData();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        if (newsData) {
            setNews(newsData);
            setLoading(false);
        } else if (!dataLoading) {
            setNews([...allNews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            setLoading(false);
        }
    }, [newsData, allNews, dataLoading]);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    if (loading) {
        return <div className="text-center py-10">Loading news...</div>;
    }

    return (
        <div className="w-full">
            <div className={`relative w-full flex items-end ${titleAlign === 'center' ? 'justify-center' : 'justify-center lg:justify-start'} mb-8`}>
                {/* Horizontal Line Background */}
                <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                {/* Title Box */}
                <div
                    className={`${titleAlign === 'center' ? 'latest-news-clip' : 'latest-news-clip lg:latest-products-clip'} bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10`}
                    style={isDesktop ? {
                        clipPath: clipPath,
                        paddingLeft: paddingLeft,
                        paddingRight: paddingRight
                    } : {}}
                >
                    <h2 className={`sm:text-2xl text-[18px] ${titleAlign === 'center' ? '' : 'lg:pl-2 sm:lg:pl-4'}`}>{title}</h2>
                </div>
            </div>

            <div className={`grid grid-cols-1 gap-x-8 gap-y-10 ${gridCols}`}>
                {news.length > 0 ? (
                    news.slice(0, limit || news.length).map((newsItem) => (
                        <Link
                            key={newsItem.id}
                            to={`/news/${newsItem.slug}`}
                            state={{ newsData: newsItem }}
                        >
                            <div className="flex gap-4 justify-between items-start group cursor-pointer">
                                <div className="flex-1 flex gap-8  flex-col">
                                    <h3 className="text-gray-800 font-semibold text-lg leading-snug mb-3 group-hover:text-[#0580A5] transition-colors line-clamp-3">
                                        {newsItem.name}
                                    </h3>
                                    <div className="flex text-[#1E1E1E] flex-wrap items-center gap-4 text-xs">
                                        <span>{formatDate(newsItem.created_at)}, by Noor</span>
                                        <div className="flex items-center gap-1">
                                            <span>Comments</span>
                                            <FaRegCommentDots className="text-base" />
                                            <span>12</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-36 h-36 flex-shrink-0 overflow-hidden bg-gray-100">
                                    <img
                                        src={newsItem.image || LatestNewsImg}
                                        alt={newsItem.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    emptyMessage && <div className="col-span-full p-4 text-center text-gray-500">{emptyMessage}</div>
                )}
            </div>
            {(!limit || news.length > limit) && (
                <div className="mt-10">
                    <Link to={showMoreLink || "/news"} className="w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                        <span className="bg-white border-2 rounded-full border-[#0580A5] sm:px-14 px-6 sm:py-1 py-1 z-10 hover:cursor-pointer sm:text-xl text-base hover:bg-[#0580A5] hover:text-white transition-colors">Show More &gt;&gt;</span>
                        <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default LatestNews