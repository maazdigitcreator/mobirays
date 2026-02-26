import React, { useState } from 'react'
import compareIcon from "../assets/compareIcon.png"
import commentsIcon from "../assets/commentsIcon.png"
import picturesIcon from "../assets/picturesIcon.png"
import allBrandsBanner from "../assets/allBrandsBanner.png"
import shareIcon from "../assets/shareIcon.png"

const SubNewsBanner = ({ heading, bannerImage, date, commentsCount }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Add search logic here
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="relative w-full mb-3 overflow-hidden">
                {/* Background bar */}
                <div className="w-full h-10 sm:h-14 flex items-center justify-between">
                    {/* Left side - Device name with slanted edge */}
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    <div className="relative w-full flex items-end">
                        {/* Title Box */}
                        <div
                            className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10"
                        >
                            <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">{heading}</h1>
                        </div>
                    </div>

                    {/* Right side - Share Icon */}
                    <div className="h-full flex gap-20 justify-between">
                        <button className="hover:cursor-pointer flex items-center transition-colors w-fit pb-7 ">
                            <img src={shareIcon} width={25} alt="" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section with Background Image */}
            <div
                className="w-full sm:h-[63vh] relative bg-cover bg-top mb-2"
                style={{ backgroundImage: `url(${bannerImage})` }}
            >
                {/* Bottom Section - Search Bar and Icons */}
                <div className="absolute bg-[#0580A58A]/54 bottom-0 left-0 right-0 grid grid-cols-12 items-center justify-between gap-4 p-4 sm:px-10 sm:py-5 ">

                    <div className='col-span-5  text-white text-2xl w-full'>
                        {date}
                    </div>


                    {/* Icons Row - Right Side */}
                    <div className="col-span-7 grid grid-cols-2 gap-0 items-center">
                        <button className="flex items-center gap-3 cursor-pointer">
                            <img src={commentsIcon} alt="Comments" className="w-8 h-8 sm:w-10 sm:h-10 " />
                            <p className="text-white text-xl font-light">Comments ({commentsCount})</p>
                        </button>
                        <button className="flex items-center gap-3 cursor-pointer">
                            <img src={commentsIcon} alt="Comments" className="w-8 h-8 sm:w-10 sm:h-10 " />
                            <p className="text-white text-xl font-light">Post your comment</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubNewsBanner;
