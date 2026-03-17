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
        <div className="cursor-pointer border border-2 border-[#0580A5]">
            <div className=" p-1 hover:shadow-lg transition-shadow">
                <div
                    className={`relative w-full aspect-square overflow-hidden bg-gray-100 ${customHeight || 'h-[170px] sm:h-[300px]'}`}
                >
                    <img
                        src={image || reviewImg}
                        alt={title}
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
            </div>
            <h3 className="sm:text-lg text-sm text-gray-800 font-medium mt-2 leading-tight line-clamp-2 p-1">
                {title || "No Title"}
            </h3>
        </div>
    )
}

export default SingleReview
