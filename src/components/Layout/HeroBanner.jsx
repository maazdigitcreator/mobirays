import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BannerAd from '../BannerAd';
import { useData } from '../../context/useData';

const HeroBanner = () => {
    const { allBanners, loading } = useData();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filteredBanners, setFilteredBanners] = useState([]);

    useEffect(() => {
        if (allBanners.length > 0) {
            const locations = ["slider_banner_one", "slider_banner_two", "slider_banner_three"];
            const filtered = locations
                .map(loc => allBanners.find(b => b.location === loc))
                .filter(b => b && (b.image || b.ads_type === 'google_adsense'));
            setFilteredBanners(filtered);
        }
    }, [allBanners]);

    useEffect(() => {
        if (filteredBanners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBanners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [filteredBanners]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBanners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredBanners.length) % filteredBanners.length);
    };

    if (loading && allBanners.length === 0) {
        return (
            <div className="md:col-span-3 mb-2 overflow-hidden bg-gray-100 animate-pulse sm:h-120 h-[200px] flex items-center justify-center">
                <span className="text-gray-400">Loading Banners...</span>
            </div>
        );
    }

    if (filteredBanners.length === 0) return null;

    return (
        <div className="md:col-span-3 mb-2 overflow-hidden relative group">
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {filteredBanners.map((banner, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <BannerAd banner={banner} className="sm:h-120 h-[200px]" />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {filteredBanners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {filteredBanners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? "bg-white w-6" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default HeroBanner