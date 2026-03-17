import React, { useState, useEffect } from 'react'
import homeBannerSM1 from '../assets/homeBannerSM1.png'
import banner from '../assets/banner.png'
import { Search } from 'lucide-react'
import BannerAd from '../components/BannerAd'
import homeBanner3 from '../assets/homeBanner3.png'
import homeBannerSM3 from '../assets/homeBannerSM3.png'


const Videos = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [pageBanners, setPageBanners] = useState({});
    const videosBannerFallback = {
        title: 'Videos Banner',
        image: homeBanner3,
    };
    const videosBannerMobileFallback = {
        title: 'Videos Banner Mobile',
        image: homeBannerSM3,
    };

    // Fetch banners from API
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/banner?per_page=100`);
                const result = await response.json();
                const allBanners = Array.isArray(result.data) ? result.data : [];
                const map = {};
                ['videos_banner_1', 'videos_banner_2'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b?.image) map[loc] = b.image;
                });
                setPageBanners(map);
            } catch (error) {
                console.error("Error fetching video banners:", error);
            }
        };
        fetchBanners();
    }, []);

    // Fetch videos from API
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://mobirays.voucherndeals.com/api/v1/videos/allVideos?per_page=100')
                if (!response.ok) throw new Error('Failed to fetch videos')
                const json = await response.json()
                setVideos(json.data || [])
            } catch (err) {
                console.error('Error fetching videos:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchVideos()
    }, [])

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
            <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
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

            <div className='mt-2 flex gap-2 sm:mt-3 sm:gap-4'>
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0580A5] sm:mt-2 sm:h-8 sm:w-8">
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
                        className="text-[10px] font-bold text-white sm:text-xs"
                        style={{ display: video.channel_icon ? 'none' : 'flex' }}
                    >
                        {video.channel ? video.channel.charAt(0).toUpperCase() : 'V'}
                    </span>
                </div>
                <div className="min-w-0">
                    <h3 className="mb-1 line-clamp-2 text-[10px] font-medium leading-tight text-black sm:text-sm">
                        {video.title}
                    </h3>
                    <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                            {video.channel && (
                                <p className="text-[9px] font-medium text-gray-700 sm:text-xs">{video.channel}</p>
                            )}
                            <p className="text-[9px] text-gray-600 sm:text-xs">
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
            <div className='mb-4 flex flex-col gap-2'>
                <div className="overflow-hidden">
                    <img src={homeBannerSM1} alt="Digital Grand Offer" className="w-full object-cover" />
                </div>
                <div className="overflow-hidden border border-[#d9d9d9] bg-white">
                    <img src={banner} alt="Phone promo" className="w-full object-cover" />
                </div>
            </div>

            <div className="mb-5 flex justify-start">
                <div className="flex w-full max-w-[420px]">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchQuery.trim())}
                        className="min-w-0 flex-1 border-2 border-[#0580A5] px-2 py-1 text-[12px] text-black placeholder-gray-500 focus:outline-none focus:border-[#046a8a] sm:text-base"
                    />
                    <button
                        onClick={() => setSearchQuery(searchQuery.trim())}
                        className="flex items-center justify-center bg-[#0580A5] px-3 transition-colors hover:bg-[#046a8a] sm:px-4"
                    >
                        <Search className="text-white" size={18} />
                    </button>
                </div>
            </div>

            <div className="relative mb-5 w-full overflow-hidden">
                <div className="flex h-10 items-center justify-between sm:h-14">
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    <div className="relative flex w-full items-end">
                        <div
                            className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-14"
                        >
                            <h1 className="pl-2 text-[14px] sm:pl-4 sm:text-[26px]">Reviews Videos</h1>
                        </div>
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
                    <p>Videos load karne mein error aaya: {error}</p>
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
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                        {filteredVideos.slice(0, 16).map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>

                    {filteredVideos.length > 16 && (
                        <div className="mt-8">
                            <div className='mb-8 sm:hidden'>
                                <BannerAd banner={pageBanners['videos_banner_1'] ? { image: pageBanners['videos_banner_1'] } : videosBannerMobileFallback} />
                            </div>
                            <div className='mb-8 hidden sm:block'>
                                <BannerAd banner={pageBanners['videos_banner_1'] ? { image: pageBanners['videos_banner_1'] } : videosBannerFallback} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                                {filteredVideos.slice(16, 32).map((video) => (
                                    <VideoCard key={video.id} video={video} />
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredVideos.length > 32 && (
                        <div className="mt-8 mb-10">
                            <div className='mb-8 sm:hidden'>
                                <BannerAd banner={pageBanners['videos_banner_2'] ? { image: pageBanners['videos_banner_2'] } : videosBannerMobileFallback} />
                            </div>
                            <div className='mb-8 hidden sm:block'>
                                <BannerAd banner={pageBanners['videos_banner_2'] ? { image: pageBanners['videos_banner_2'] } : videosBannerFallback} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
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
