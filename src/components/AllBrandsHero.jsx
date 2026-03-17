import React, { useState } from 'react'
import compareIcon from "../assets/compareIcon.png"
import commentsIcon from "../assets/commentsIcon.png"
import picturesIcon from "../assets/picturesIcon.png"
import allBrandsBanner from "../assets/allBrandsBanner.png"
import shareIcon from "../assets/shareIcon.png"

const AllBrandsHero = ({ title = "All Brands", backgroundImage }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="relative w-full mb-2 overflow-hidden">
                {/* Background bar */}
                <div className="w-full h-10 sm:h-14 flex items-center justify-between">
                    {/* Left side - Device name with slanted edge */}
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    <div className="relative w-full flex items-end">
                        {/* Title Box */}
                        <div
                            className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10"
                        >
                            <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">{title}</h1>
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

            {/* Hero Section with (Optional) Background Image */}
            <div
                className={`w-full sm:h-[55vh] relative bg-cover bg-top ${!backgroundImage ? 'bg-[#f3f4f6]' : ''}`}
                style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
            >
                {/* Bottom Section - Search Bar and Icons */}
                <div className="absolute bg-white/60 bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:px-4 sm:py-5 ">
                    {/* Search Bar - Left Side */}
                    <form onSubmit={handleSearch} className="flex gap-1 shadow-lg backdrop-blur-sm relative">
                        {/* Google Logo inside input */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                            <span className="font-semibold text-lg">
                                <span className="text-[#4285F4]">G</span>
                                <span className="text-[#EA4335]">o</span>
                                <span className="text-[#FBBC05]">o</span>
                                <span className="text-[#4285F4]">g</span>
                                <span className="text-[#34A853]">l</span>
                                <span className="text-[#EA4335]">e</span>
                            </span>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Custom Search"
                            className="flex-1 pl-20 pr-4 text-lg w-70 py-1 border-2 rounded-none focus:outline-none border-[#41403E] bg-white placeholder:text-[#959190]"
                        />
                        <button
                            type="submit"
                            className="bg-[#0580A5] text-white px-8 py-2.5 hover:bg-[#046a8a] border-[#41403E] border-2 transition-colors font-semibold"
                        >
                            Search
                        </button>
                    </form>

                    {/* Icons Row - Right Side */}
                    <div className="flex w-full justify-evenly gap-5 items-center">
                        <button className="">
                            <img src={compareIcon} alt="Compare" className="w-8 h-8 sm:w-10 sm:h-10 invert cursor-pointer" />
                        </button>
                        <button className="">
                            <img src={commentsIcon} alt="Comments" className="w-8 h-8 sm:w-10 sm:h-10 invert cursor-pointer" />
                        </button>
                        <button className="">
                            <img src={picturesIcon} alt="Pictures" className="w-8 h-8 sm:w-10 sm:h-10 invert cursor-pointer" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllBrandsHero;
