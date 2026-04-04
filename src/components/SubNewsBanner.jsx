import React, { useState } from 'react'
import compareIcon from "../assets/compareIcon.png"
import commentsIcon from "../assets/commentsIcon.png"
import picturesIcon from "../assets/picturesIcon.png"
import allBrandsBanner from "../assets/allBrandsBanner.png"
import shareIcon from "../assets/shareIcon.png"

const SubNewsBanner = ({ heading, bannerImage, date, commentsCount, onCommentsClick, onPostCommentClick }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="relative w-full mb-3 overflow-hidden">
                {/* Background bar */}
                <div className="w-full h-10 sm:h-14 flex items-center justify-between">
                    {/* Left side - Device name with slanted edge */}
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    <div className="relative w-full flex items-end h-full">
                        {/* Title Box */}
                        <div
                            className="latest-products-clip bg-[#0580A5] text-white w-fit max-w-[80%] sm:max-w-none sm:h-14 h-10 flex items-center relative z-10"
                        >
                            <h1 className="sm:text-[26px] text-[13px] pl-2 sm:pl-4 truncate whitespace-nowrap">{heading}</h1>
                        </div>
                    </div>

                    {/* Right side - Share Icon */}
                    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-20 pb-5 sm:pb-8">
                        <button className="hover:cursor-pointer flex items-center transition-colors">
                            <img src={shareIcon} className="w-[18px] sm:w-[25px]" alt="Share" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section with Background Image */}
            <div
                className="w-full h-[200px] sm:h-[63vh] relative bg-cover bg-top mb-2"
                style={{ backgroundImage: `url(${bannerImage})` }}
            >
                {/* Bottom Section - Search Bar and Icons */}
                <div className="absolute bg-[#0580A58A] bottom-0 left-0 right-0 flex flex-row items-center justify-between gap-3 p-2 sm:px-10 sm:py-5">

                    <div className='text-white text-xs sm:text-2xl whitespace-nowrap'>
                        {date}
                    </div>

                    {/* Icons Row - Right Side */}
                    <div className="flex flex-row items-center justify-end gap-3 sm:gap-8">
                        <button onClick={onCommentsClick} className="flex items-center sm:gap-3 gap-2 cursor-pointer">
                            <img src={commentsIcon} alt="Comments" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" />
                            <p className="text-white text-xs sm:text-xl font-light whitespace-nowrap">Comments ({commentsCount || 0})</p>
                        </button>
                        <button onClick={onPostCommentClick} className="flex items-center sm:gap-3 gap-2 cursor-pointer">
                            <img src={commentsIcon} alt="Comments" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" />
                            <p className="text-white text-xs sm:text-xl font-light whitespace-nowrap">Post your comment</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubNewsBanner;
