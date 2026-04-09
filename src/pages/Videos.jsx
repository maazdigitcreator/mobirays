import React, { useState, useEffect } from 'react'
import homeBannerSM1 from '../assets/homeBannerSM1.png'
import homeBannerSM2 from '../assets/homeBannerSM2.png'
import HeroBanner from '../components/Layout/HeroBanner'
import { Search } from 'lucide-react'
import shareIcon from "../assets/shareIcon.png"
import Sidebar from '../components/Layout/Sidebar'
import BannerAd from '../components/BannerAd'
import { useData } from '../context/useData'
import Banner1 from '../assets/homeBannerSM1.png'
import Banner2 from '../assets/homeBannerSM2.png'
import homeBanner3 from '../assets/homeBanner3.png'

let cachedData = null;

const Videos = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        if (cachedData) {
            setVideos(cachedData.videos);
            setPageBanners(cachedData.banners);
            setLoading(false);
            return;
        }

        const fetchBanners = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/banner?per_page=100`);
                const result = await response.json();
                const allBanners = Array.isArray(result.data) ? result.data : [];
                const map = {};
                ['videos_banner_1', 'videos_banner_2'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b) map[loc] = b;
                });
                return map;
            } catch (error) {
                console.error("Error fetching video banners:", error);
                return {};
            }
        };

        const fetchVideos = async () => {
            try {
                const response = await fetch('https://mobirays.voucherndeals.com/api/v1/videos/allVideos?per_page=100');
                if (!response.ok) throw new Error('Failed to fetch videos');
                const json = await response.json();
                return json.data || [];
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError(err.message);
                return [];
            }
        };

        const fetchData = async () => {
            setLoading(true);
            const [fetchedBanners, fetchedVideos] = await Promise.all([
                fetchBanners(),
                fetchVideos()
            ]);
            
            cachedData = {
                banners: fetchedBanners,
                videos: fetchedVideos
            };

            setPageBanners(fetchedBanners);
            setVideos(fetchedVideos);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Format views number (e.g. 105396 -> 105K)
    const formatViews = (views) => {
        if (!views && views !== 0) return ''
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`
        if (views >= 1000) return `${Math.floor(views / 1000)}K views`
        return `${views} views`
    }

    // Filter by search
    const filteredVideos = videos.filter(video =>
        video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Video card component (reusable)
    const VideoCard = ({ video }) => (
        <div className="cursor-pointer group" onClick={() => setSelectedVideo(video)}>
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
                <img
                    src={video.thumbnail?.high || video.thumbnail?.medium || video.thumbnail?.default || `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = `https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`
                    }}
                />
                {/* Duration Badge */}
                {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                    </div>
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className='flex mt-3 gap-4'>
                {/* Channel Icon */}
                <div className="w-8 h-8 mt-2 rounded-full overflow-hidden flex-shrink-0 bg-[#0580A5] flex items-center justify-center">
                    {video.channel_icon ? (
                        <img
                            src={video.channel_icon}
                            alt={video.channel}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                            }}
                        />
                    ) : null}
                    <span
                        className="text-white text-xs font-bold"
                        style={{ display: video.channel_icon ? 'none' : 'flex' }}
                    >
                        {video.channel ? video.channel.charAt(0).toUpperCase() : 'V'}
                    </span>
                </div>
                <div className="min-w-0">
                    <h3 className="text-[0.75rem] sm:text-sm font-medium text-black line-clamp-2 leading-tight sm:mb-1">
                        {video.title}
                    </h3>
                    <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                            {video.channel && (
                                <p className="text-[0.65rem] sm:text-xs text-gray-700 font-medium truncate">{video.channel}</p>
                            )}
                            <p className="text-[0.65rem] sm:text-xs text-gray-600 line-clamp-1">
                                {formatViews(video.views)}{video.time_ago ? ` • ${video.time_ago}` : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="w-full">

            <div className='flex gap-2'>
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className='flex flex-col gap-2 sm:h-120 h-auto'>
                        {/* Left Large Banner */}
                        <div className="md:col-span-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src={Banner1} alt="Digital Grand Offer" className="w-full h-full object-cover" />
                        </div>
                        {/* Center Banner */}
                        <div className="md:col-span-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-blue-50">
                            <img src={Banner2} alt="Spark 20" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-3/4">
                    <HeroBanner />
                </div>
            </div>

            {/* Desktop & Mobile Responsive Header */}
            <div className="w-full mb-5">
                {/* DESKTOP LAYOUT */}
                <div className="hidden sm:flex relative w-full h-14 items-center justify-between overflow-hidden">
                    {/* Full width blue line */}
                    <div className="absolute -bottom-1 left-0 w-full h-[16px] bg-[#0580A5]"></div>

                    <div className="relative flex items-end">
                        <div className="latest-products-clip bg-[#0580A5] text-white w-fit h-14 flex items-center relative z-10">
                            <h1 className="text-[26px] pl-4 pr-6">Reviews Videos</h1>
                        </div>
                    </div>

                    <div className="flex z-10 mb-4 items-start pr-0">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search videos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchQuery.trim())}
                                className="w-[350px] border-2 border-[#0580A5] py-1 px-3 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                            />
                            <button
                                onClick={() => setSearchQuery(searchQuery.trim())}
                                className="px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center">
                                <Search className="text-white" size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE LAYOUT */}
                <div className="flex sm:hidden flex-col-reverse gap-4">
                    <div className="relative w-full h-10 overflow-hidden">
                        {/* Mobile full width blue line */}
                        <div className="absolute -bottom-1 left-0 w-full h-[12px] bg-[#0580A5]"></div>

                        <div className="latest-products-clip bg-[#0580A5] text-white w-fit h-10 flex items-center relative z-10">
                            <h1 className="text-[18px] pl-2 pr-6">Reviews Videos</h1>
                        </div>
                    </div>

                    <div className="flex w-full z-10">
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchQuery.trim())}
                            className="flex-1 w-full border-2 border-[#0580A5] py-1.5 px-3 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                        />
                        <button
                            onClick={() => setSearchQuery(searchQuery.trim())}
                            className="px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center">
                            <Search className="text-white" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Results Count */}
            {searchQuery.trim() && !loading && (
                <div className="mb-4 text-sm text-gray-600">
                    <span className="font-medium text-[#0580A5]">{filteredVideos.length}</span> result{filteredVideos.length !== 1 ? 's' : ''} found for "<span className="font-medium">{searchQuery}</span>"
                    <button onClick={() => setSearchQuery('')} className="ml-3 text-red-500 hover:text-red-700 text-xs underline">Clear</button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-[#0580A5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-20 text-red-500">
                    <p>Error Loading Videos {error}</p>
                </div>
            )}

            {/* No Videos */}
            {!loading && !error && filteredVideos.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p>No videos found matching "<span className="font-medium text-gray-700">{searchQuery}</span>"</p>
                </div>
            )}

            {/* Videos Grid */}
            {!loading && !error && filteredVideos.length > 0 && (
                <>
                    {/* First 16 videos */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                        {filteredVideos.slice(0, 16).map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>

                    {/* Videos 17-32 and Banner 1 */}
                    {filteredVideos.length > 16 && (
                        <div className="mt-8">
                            {pageBanners['videos_banner_1'] && (
                                <div className='mb-8'>
                                    <BannerAd banner={pageBanners['videos_banner_1']} />
                                </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {filteredVideos.slice(16, 32).map((video) => (
                                    <VideoCard key={video.id} video={video} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Videos 33+ and Banner 2 */}
                    {filteredVideos.length > 32 && (
                        <div className="mt-8 mb-10">
                            {pageBanners['videos_banner_2'] && (
                                <div className='mb-8'>
                                    <BannerAd banner={pageBanners['videos_banner_2']} />
                                </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {filteredVideos.slice(32).map((video) => (
                                    <VideoCard key={video.id} video={video} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Bottom margin if no banners */}
            {filteredVideos.length <= 32 && <div className="mb-10"></div>}

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 z-10 text-white hover:text-gray-300 bg-black/50 rounded-full p-1"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Video Player */}
                        <div className="relative pt-[56.25%]">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Video Info in Modal */}
                        <div className="p-4 bg-white">
                            <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{selectedVideo.title}</h2>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {selectedVideo.channel && (
                                    <>
                                        <p className="text-sm font-semibold text-gray-700">{selectedVideo.channel}</p>
                                        <span className="text-gray-400">•</span>
                                    </>
                                )}
                                {selectedVideo.views && (
                                    <p className="text-sm text-gray-600">{formatViews(selectedVideo.views)}</p>
                                )}
                                {selectedVideo.duration && (
                                    <>
                                        <span className="text-gray-400">•</span>
                                        <p className="text-sm text-gray-600">{selectedVideo.duration}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Videos
