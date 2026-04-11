import { useEffect, useRef, } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import mobileImg from '../../assets/mobileImg.jpg';
import { useData } from '../../context/useData';
import { getProductDetailPath } from '../../utils/productRoutes';

const SearchModal = ({ isOpen, onClose, searchQuery }) => {
    const modalRef = useRef(null);
    const { allProducts, allNews, allReviews } = useData();

    // Use cached data instead of local state
    const reviews = allReviews;
    const news = allNews;
    const devices = allProducts;

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            const isInsideSearch = event.target.closest('.search-container');
            if (modalRef.current && !modalRef.current.contains(event.target) && !isInsideSearch) {
                onClose();
            }
        };

        let timer;
        if (isOpen) {
            timer = setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
        }

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    // Use trimmed search term
    const searchTerm = searchQuery ? searchQuery.trim().toLowerCase() : '';

    // If search term is empty, don't show any results (or show nothing)
    if (!searchTerm) {
        return null;
    }

    // Functional Filtering
    const filteredReviews = reviews.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm))
    ).slice(0, 5); // Limit to top 5

    const filteredDevices = devices.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to top 5

    const filteredNews = news.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.title && item.title.toLowerCase().includes(searchTerm))
    ).slice(0, 5); // Limit to top 5

    const hasResults = filteredReviews.length > 0 || filteredDevices.length > 0 || filteredNews.length > 0;

    return (
        <div className="absolute sm:w-200 w-full top-[42px] sm:left-[-250px] left-0 right-0 mt-2 z-[999]">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-6xl mx-auto overflow-hidden animate-in fade-in zoom-in duration-200"
            >
                <div className="p-6">
                    {!hasResults ? (
                        <div className="text-center py-8 text-gray-500">
                            No results found for "{searchQuery}"
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Devices Column */}
                            <div className="md:border-r border-gray-200 md:pr-6">
                                <h3 className="text-xs font-bold text-gray-600 mb-3 pb-2 border-b border-gray-300">DEVICES</h3>
                                <div className="space-y-2">
                                    {filteredDevices.map((device) => {
                                        return (
                                            <Link
                                                key={device.id}
                                                to={getProductDetailPath(device)}
                                                state={{ product: device }}
                                                onClick={onClose}
                                                className="flex items-start gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors"
                                            >
                                                <img src={device.image || mobileImg} alt={device.name} className="w-12 h-12 object-contain rounded flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-800 leading-tight">{device.name}</p>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                                {filteredDevices.length > 0 && (
                                    <Link to={`/search?q=${searchTerm}`} onClick={onClose} className="flex items-center justify-center gap-1 mt-3 text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                                        MORE DEVICE RESULTS <ArrowRight size={12} />
                                    </Link>
                                )}
                            </div>

                            {/* Reviews Column */}
                            <div className="md:border-r border-gray-200 md:pr-6">
                                <h3 className="text-xs font-bold text-gray-600 mb-3 pb-2 border-b border-gray-300">REVIEWS</h3>
                                <div className="space-y-2">
                                    {filteredReviews.map((review) => {
                                        const slug = review.name ? review.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : 'review';
                                        return (
                                            <Link
                                                key={review.id}
                                                to={`/review/${slug}`}
                                                state={{ reviewData: review }}
                                                onClick={onClose}
                                                className="flex items-start gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors"
                                            >
                                                <img src={review.image || mobileImg} alt={review.name} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-800 leading-tight">{review.name}</p>
                                                    {/* Rating as subtitle if available, or static text */}
                                                    {review.rating && <p className="text-[10px] text-gray-500 mt-0.5">Rating: {review.rating}</p>}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                {filteredReviews.length > 0 && (
                                    <Link to={`/reviews?q=${searchTerm}`} onClick={onClose} className="flex items-center justify-center gap-1 mt-3 text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                                        MORE REVIEW RESULTS <ArrowRight size={12} />
                                    </Link>
                                )}
                            </div>

                            {/* News Column */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-600 mb-3 pb-2 border-b border-gray-300">NEWS</h3>
                                <div className="space-y-2">
                                    {filteredNews.map((newsItem) => (
                                        <Link
                                            key={newsItem.id}
                                            to={`/news/${newsItem.slug}`}
                                            state={{ newsData: newsItem }}
                                            onClick={onClose}
                                            className="flex items-start gap-2 hover:bg-gray-50 p-1.5 rounded transition-colors"
                                        >
                                            <img src={newsItem.image || mobileImg} alt={newsItem.name} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-800 line-clamp-2 leading-tight">{newsItem.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {filteredNews.length > 0 && (
                                    <Link to={`/news?q=${searchTerm}`} onClick={onClose} className="flex items-center justify-center gap-1 mt-3 text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                                        MORE NEWS RESULTS <ArrowRight size={12} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
