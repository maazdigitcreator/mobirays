import React, { useState } from 'react'
import compareIcon from "../assets/compareIcon.png"
import commentsIcon from "../assets/commentsIcon.png"
import picturesIcon from "../assets/picturesIcon.png"
import allBrandsBanner from "../assets/allBrandsBanner.png"
import shareIcon from "../assets/shareIcon.png"
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useRef, useEffect } from "react";

const SubNewsBanner = ({ heading, bannerImage, date, commentsCount, onCommentsClick, onPostCommentClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const shareMenuRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleShare = (platform) => {
        const shareUrl = window.location.href;
        const shareText = heading || "Check out this news";
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);

        const shareTargets = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        };

        const targetUrl = shareTargets[platform];
        if (targetUrl) {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
            setIsShareMenuOpen(false);
        }
    };

    useEffect(() => {
        if (!isShareMenuOpen) return;
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setIsShareMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isShareMenuOpen]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="relative w-full mb-3">
                {/* Background bar */}
                <div className="w-full h-10 sm:h-13 flex items-center justify-between">
                    {/* Left side - Device name with slanted edge */}
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[12px] bg-[#0580A5]"></div>

                    <div className="relative w-full flex items-end">
                        {/* Title Box */}
                        <div
                            className="latest-products-clip bg-[#0580A5] text-white w-fit max-w-[calc(100%-40px)] sm:max-w-[calc(100%-80px)] sm:h-13 h-10 flex items-center relative z-10"
                        >
                            <h1 className="sm:text-[26px] text-[13px] pl-2 sm:pl-4 truncate whitespace-nowrap pr-2">{heading}</h1>
                        </div>
                    </div>

                    {/* Right side - Share Icon */}
                    <div ref={shareMenuRef} className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-20 pb-5">
                        <div className="relative">
                            <button
                                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                                className="hover:cursor-pointer flex items-center transition-colors py-1"
                            >
                                <img src={shareIcon} className="w-[18px] sm:w-[32px]" alt="Share" />
                            </button>

                            {isShareMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 flex gap-3 animate-fade-in bg-white/95 p-3 shadow-xl rounded-xl border border-[#0580A5]/20 backdrop-blur-sm z-30 ring-1 ring-black/5 min-w-[100px] justify-center">
                                    <button
                                        onClick={() => handleShare("facebook")}
                                        className="text-[#1877F2] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                    >
                                        <FaFacebookF className="text-xl sm:text-2xl" />
                                    </button>
                                    <button
                                        onClick={() => handleShare("x")}
                                        className="text-black hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                    >
                                        <FaXTwitter className="text-xl sm:text-2xl" />
                                    </button>
                                </div>
                            )}
                        </div>
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
