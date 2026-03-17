import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext';
import reviewImg from '../assets/reviewsImg.png'

const LatestReviews = ({ title, gridCols, titleAlign = 'center', clipPath, paddingLeft, paddingRight, limit, reviewsData, showMoreLink, emptyMessage }) => {
    const [isDesktop, setIsDesktop] = useState(false);
    const { allReviews, loading: dataLoading } = useData();
    const [reviews, setReviews] = useState([]);
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
        if (reviewsData) {
            setReviews(reviewsData);
            setLoading(false);
        } else if (!dataLoading) {
            setReviews(allReviews);
            setLoading(false);
        }
    }, [reviewsData, allReviews, dataLoading]);

    const getRatingColor = (rating) => {
        if (rating >= 8.0) return '#7EE102'; // Green
        if (rating >= 5.0) return '#FBBC04'; // Orange/Yellow
        return '#FF0008'; // Red
    };

    if (loading) {
        return <div className="text-center py-10">Loading reviews...</div>;
    }

    return (
        <div className="w-full">
            <div className={`relative w-full flex items-end ${titleAlign === 'center' ? 'justify-center' : 'justify-center lg:justify-start'} mb-2`}>
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
                    <h2 className={`sm:text-2xl text-[18px] ${titleAlign === 'center' ? '' : 'lg:pl-4'}`}>{title}</h2>
                </div>
            </div>


            <div className={`grid grid-cols-2 gap-2 ${gridCols}`}>
                {reviews.length > 0 ? (
                    reviews.slice(0, limit || reviews.length).map((review) => {
                        // Start rating logic
                        // API gives rating out of 5. We need to display out of 10.
                        const apiRating = parseFloat(review.rating) || 0;
                        const displayedRating = apiRating; // Scale to 10
                        // Clamp to max 10 just in case
                        const finalRating = Math.min(displayedRating, 10);

                        const color = getRatingColor(finalRating);

                        // Generate slug from name
                        const slug = review.name ? review.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : 'review';

                        return (
                            <Link
                                key={review.id}
                                to={`/review/${slug}`}
                                state={{ reviewData: review }}
                            >
                                <div className="bg-white hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 h-[170px] sm:h-[300px] sm:h-auto">
                                        <img
                                            src={review.image || reviewImg}
                                            alt={review.name}
                                            className="w-full h-full object-cover object-left-top"
                                        />

                                        {/* Rating Badge */}
                                        <div
                                            className="absolute top-0 right-0 text-white font-bold p-2 text-lg"
                                            style={{ backgroundColor: `${color}a6` }}
                                        >
                                            {finalRating.toFixed(1)}
                                        </div>

                                        {/* Bottom Rating Bar Overlay */}
                                        <div className="absolute bottom-0 w-full bg-[#0580A5]/60 h-8 flex items-center px-2 backdrop-blur-[1px]">
                                            <span
                                                className="text-sm font-bold mr-2"
                                                style={{ color: color }}
                                            >
                                                {finalRating.toFixed(1)}
                                            </span>
                                            <div className="h-2 w-full bg-white/40 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${(finalRating / 10) * 100}%`, backgroundColor: color }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="sm:text-lg text-sm text-gray-800 font-medium mt-2 leading-tight line-clamp-2 p-1">
                                        {review.name || "No Title"}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    emptyMessage && <div className="col-span-full p-4 text-center text-gray-500">{emptyMessage}</div>
                )}
            </div>

            {(!limit || reviews.length > limit) && (
                <div className="mt-10">
                    <Link to={showMoreLink || "/reviews"} className="w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                        <span className="bg-white border-2 rounded-full border-[#0580A5] sm:px-14 px-6 sm:py-1 py-1 z-10 hover:cursor-pointer sm:text-xl text-base hover:bg-[#0580A5] hover:text-white transition-colors">Show More &gt;&gt;</span>
                        <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default LatestReviews
