import React from 'react'
import reviewImg from '../assets/reviewsImg.png'

const SingleReview = ({ title, rating, image, customHeight }) => {
    const getRatingColor = (rating) => {
        if (rating >= 8.0) return '#66C208'; // Green
        if (rating >= 5.0) return '#FFB700'; // Orange/Yellow
        return '#FF2D2D'; // Red
    };

    const finalRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    const color = getRatingColor(finalRating);

    return (
        <div className="cursor-pointer">
            <div className="p-0 transition-shadow hover:shadow-lg">
                <div
                    className={`relative w-full aspect-square overflow-hidden bg-gray-100 ${customHeight || 'h-[148px] sm:h-[300px]'}`}
                >
                    <img
                        src={image || reviewImg}
                        alt={title}
                        className="w-full h-full object-cover object-left-top"
                    />

                    {/* Rating Badge */}
                    <div
                        className="absolute right-0 top-0 p-1.5 text-sm font-bold text-white sm:p-2 sm:text-lg"
                        style={{ backgroundColor: `${color}a6` }}
                    >
                        {finalRating.toFixed(1)}
                    </div>

                    {/* Bottom Rating Bar Overlay */}
                    <div className="absolute bottom-0 flex h-6 w-full items-center bg-[#0580A5]/60 px-2 backdrop-blur-[1px] sm:h-8">
                        <span
                            className="mr-2 text-[10px] font-bold sm:text-sm"
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
            </div>
            <h3 className="mt-1 px-0.5 text-[10px] font-medium leading-tight text-gray-800 line-clamp-2 sm:mt-2 sm:p-1 sm:text-lg">
                {title || "No Title"}
            </h3>
        </div>
    )
}

export default SingleReview
