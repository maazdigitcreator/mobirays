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
            <div className="relative w-full mb-2 overflow-hidden">
                <div className="flex h-10 items-center justify-between sm:h-14">
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    <div className="relative flex w-full items-end">
                        <div className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-14">
                            <h1 className="pl-2 text-[14px] sm:pl-4 sm:text-[26px]">{title}</h1>
                        </div>
                    </div>

                    <div className="flex h-full shrink-0 items-start pt-1 text-[#0580A5]">
                        <button type="button" className="flex items-center">
                            <img src={shareIcon} width={18} alt="" className="sm:w-[25px]" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="relative w-full overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage || allBrandsBanner})` }}
            >
                <div className="aspect-[2.55/1] min-h-[128px] w-full sm:min-h-[260px] lg:min-h-[320px]" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-white/65 px-2 py-2 backdrop-blur-[2px] sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-4">
                    <form onSubmit={handleSearch} className="relative flex w-full max-w-[520px] gap-1">
                        <div className="pointer-events-none absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center">
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
                            className="min-w-0 flex-1 border-2 border-[#41403E] bg-white py-1 pl-[72px] pr-3 text-[12px] text-black placeholder:text-[11px] placeholder:text-[#959190] focus:outline-none sm:py-2 sm:pl-20 sm:pr-4 sm:text-lg"
                        />
                        <button
                            type="submit"
                            className="border-2 border-[#41403E] bg-[#0580A5] px-4 py-1 text-[12px] font-semibold text-white transition-colors hover:bg-[#046a8a] sm:px-8 sm:py-2.5"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex w-full items-center justify-around gap-3 sm:w-auto sm:justify-end sm:gap-5">
                        <button type="button">
                            <img src={compareIcon} alt="Compare" className="h-6 w-6 cursor-pointer invert sm:h-10 sm:w-10" />
                        </button>
                        <button type="button">
                            <img src={commentsIcon} alt="Comments" className="h-6 w-6 cursor-pointer invert sm:h-10 sm:w-10" />
                        </button>
                        <button type="button">
                            <img src={picturesIcon} alt="Pictures" className="h-6 w-6 cursor-pointer invert sm:h-10 sm:w-10" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllBrandsHero;
