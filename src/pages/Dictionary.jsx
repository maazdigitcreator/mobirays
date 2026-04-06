import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Layout/Sidebar'
import sidebarBanner1 from '../assets/sidebarBanner1.png'
import HeroBanner from '../components/Layout/HeroBanner'
import AllBrandsHero from '../components/AllBrandsHero'
import reviewsBanner from '../assets/reviewsBanner.png'
import DictionaryContent from '../components/DictionaryContent'
import shareIcon from '../assets/shareIcon.png'
import compareIcon from '../assets/compareIcon.png'
import commentsIcon from '../assets/commentsIcon.png'
import picturesIcon from '../assets/picturesIcon.png'
import homeBanner3 from '../assets/homeBanner3.png'
import BannerAd from '../components/BannerAd'

const Dictionary = () => {
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/banner?per_page=100`);
                const result = await response.json();
                const allBanners = Array.isArray(result.data) ? result.data : [];
                const map = {};
                ['dictionary_banner_1', 'dictionary_banner_2'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b) map[loc] = b;
                });
                setPageBanners(map);
            } catch (error) {
                console.error("Error fetching dictionary banners:", error);
            }
        };
        fetchBanners();
    }, []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-2">
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <Sidebar bottomImage={sidebarBanner1} />
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">

                    <HeroBanner />
                    {/* Heading Section */}

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
                                        <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">Mobile Phones Terms Dictionary</h1>
                                    </div>
                                </div>

                                {/* Right side - Share Icon */}
                                {/* <div className="h-full flex gap-20 justify-between">
                                    <button className="hover:cursor-pointer flex items-center transition-colors w-fit sm:pb-7 pb-5  ">
                                        <img src={shareIcon} width={25} alt="" />
                                    </button>
                                </div> */}
                            </div>
                        </div>

                        {/* Hero Section with Background Image */}
                        <div
                            className="w-full h-[300px] sm:h-[55vh] relative overflow-hidden bg-gray-100"
                        >
                            {pageBanners['dictionary_banner_1'] && (
                                <div className="absolute inset-0 w-full h-full">
                                    {(() => {
                                        const getImgUrl = (img) => {
                                            if (!img) return "";
                                            if (img.startsWith("http")) return img;
                                            const apiBase = "https://mobirays.voucherndeals.com";
                                            const cleanPath = img.replace(/^\/?storage\//, '');
                                            return `${apiBase}/storage/${cleanPath}`;
                                        };
                                        const b = pageBanners['dictionary_banner_1'];
                                        const desktopImg = getImgUrl(b.image);
                                        const mobileImg = getImgUrl(b.mobile_image) || desktopImg;
                                        const tabletImg = getImgUrl(b.tablet_image) || desktopImg;

                                        return (
                                            <picture className="block w-full h-full">
                                                <source
                                                    media="(max-width: 640px)"
                                                    srcSet={mobileImg}
                                                />
                                                <source
                                                    media="(min-width: 641px) and (max-width: 1024px)"
                                                    srcSet={tabletImg}
                                                />
                                                <img
                                                    src={desktopImg}
                                                    className="w-full h-full object-cover object-top"
                                                    alt=""
                                                />
                                            </picture>
                                        );
                                    })()}
                                </div>
                            )}
                            {/* Bottom Section - Search Bar and Icons */}
                            <div className="absolute bg-white/60 bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:px-6 sm:py-5">

                                {/* Icons Row - Right Side */}
                                <div className="flex w-full gap-5 items-center justify-end">
                                    <Link to="/comparison" className="">
                                        <img src={compareIcon} alt="Compare" className="w-8 h-8 sm:w-10 sm:h-10 invert cursor-pointer" />
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Content Area - User will add content here */}
                    <div className='pt-2'>
                        <DictionaryContent />
                    </div>

                </div>

            </div>
            {/* Banner */}
            {pageBanners['dictionary_banner_2'] && (
                <div className='mt-8 mb-8'>
                    <BannerAd banner={pageBanners['dictionary_banner_2']} className='w-full h-auto' />
                </div>
            )}
        </div>
    )
}

export default Dictionary
