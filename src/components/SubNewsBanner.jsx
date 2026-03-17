import React, { useState } from 'react'
import commentsIcon from "../assets/commentsIcon.png"
import allBrandsBanner from "../assets/allBrandsBanner.png"
import shareIcon from "../assets/shareIcon.png"

const SubNewsBanner = ({ heading, bannerImage, date, commentsCount }) => {
    return (
        <div className="w-full">
            <div className="relative w-full mb-3 overflow-hidden">
                <div className="flex h-10 items-center justify-between sm:h-14">
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    <div className="relative flex w-full items-end">
                        <div className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-14">
                            <h1 className="pl-2 text-[12px] leading-none sm:pl-4 sm:text-[26px]">{heading}</h1>
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
                className="relative mb-2 w-full overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerImage || allBrandsBanner})` }}
            >
                <div className="aspect-[2.4/1] min-h-[138px] w-full sm:min-h-[280px]" />

                <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 items-center gap-2 bg-[#0580A5]/50 px-2 py-2 backdrop-blur-[2px] sm:px-8 sm:py-4">
                    <div className="text-center whitespace-nowrap text-[10px] text-white sm:text-2xl">
                        {date}
                    </div>

                    <button type="button" className="flex items-center justify-center gap-2">
                            <img src={commentsIcon} alt="Comments" className="h-5 w-5 sm:h-10 sm:w-10" />
                            <p className="whitespace-nowrap text-[9px] font-light text-white sm:text-xl">Comments ({commentsCount})</p>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2">
                        <img src={commentsIcon} alt="Comments" className="h-5 w-5 sm:h-10 sm:w-10" />
                        <p className="whitespace-nowrap text-[9px] font-light text-white sm:text-xl">Post your comment</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubNewsBanner;
