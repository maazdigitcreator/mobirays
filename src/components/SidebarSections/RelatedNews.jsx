import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegCommentDots } from 'react-icons/fa';
import LatestNewsImg from '../../assets/LatestNewsImg.png';

const RelatedNews = ({ productName }) => {
    const [news, setNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);

    // Fetch news data
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/posts`);
                const data = await response.json();
                if (data && data.data) {
                    setNews(data.data);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoadingNews(false);
            }
        };

        fetchNews();
    }, []);

    // Filter: only show news where is_products === 1 and products matches the current product name
    const displayNews = productName
        ? news.filter(n =>
            n.is_products === 1 &&
            n.products &&
            n.products.toLowerCase() === productName.toLowerCase()
        )
        : [];

    return (
        <div>
            <div className="bg-[#0580A5] text-white px-4 py-3 text-2xl text-start">
                Related News
            </div>
            <div>
                {loadingNews ? (
                    <div className="text-center py-4">Loading news...</div>
                ) : displayNews.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4 px-2">
                        This product has no related news yet.
                    </p>
                ) : (
                    <>
                        <div className='flex flex-col gap-4 mt-2'>
                            {displayNews.slice(0, 4).map((newsItem) => (
                                <Link key={newsItem.id} to={`/news/${newsItem.slug}`} state={{ newsData: newsItem }}>
                                    <div className="grid grid-cols-12 justify-between items-start group cursor-pointer">
                                        <div className="col-span-8 h-full flex flex-col justify-between">
                                            <h3 className="text-black font-semibold text-base leading-snug mb-2 group-hover:text-[#0580A5] transition-colors line-clamp-3">
                                                {newsItem.name}
                                            </h3>
                                            <div className="flex text-[#1E1E1E] flex-wrap items-center gap-5 text-[10px]">
                                                <span>{new Date(newsItem.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}, by Noor</span>
                                                <div className="flex items-center gap-1">
                                                    <span className='pr-1'>Comments</span>
                                                    <FaRegCommentDots className="text-xs " />
                                                    <span>12</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-4 flex-shrink-0 overflow-hidden bg-gray-100">
                                            <img
                                                src={newsItem.image || LatestNewsImg}
                                                alt="news"
                                                className="w-full h-full object-cover mix-blend-multiply"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link to="/news" className="w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center mt-4">
                            <span className="bg-white border-2 rounded-full border-[#0580A5] px-10 py-2 z-10 hover:cursor-pointer">Show More &gt;&gt;</span>
                            <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default RelatedNews;
