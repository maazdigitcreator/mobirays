import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import LatestProducts from '../components/LatestProducts';

import ProductsSectionButton from '../components/ProductsSectionButton';
import LatestNews from '../components/LatestNews';
import LatestReviews from '../components/LatestReviews';

import mobileImg from '../assets/mobileImg.jpg';
import tabImg from '../assets/tabImg.jpg';
import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3';
import watchImg from '../assets/watchImg.png';
import HeroBanner from '../components/Layout/HeroBanner';
import BannerAd from '../components/BannerAd';

const Home = () => {
    const { allBanners } = useData();
    const [homeBanners, setHomeBanners] = useState({});

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['home_banner_1', 'home_banner_2', 'home_banner_3'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b) map[loc] = b;
            });
            setHomeBanners(map);
        }
    }, [allBanners]);

    return (
        <div >
            <div>


                <div className='flex flex-col lg:flex-row gap-2'>
                    {/* Sidebar Column */}
                    <div className="w-full lg:w-1/3 hidden lg:block">
                        <div className="flex flex-col gap-2">
                            <SidebarIntro />
                            <SidebarBrands />
                            <SidebarFilters />
                            <SidebarBanner1 />
                            <div className="flex flex-col gap-6">
                                <SidebarStats />
                                <SidebarBanner2 />
                                <SidebarLatestModels />
                                <SidebarBanner3 />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Column */}
                    <div className="w-full lg:w-3/4">

                        <HeroBanner />


                        <div>
                            <LatestProducts title="Latest Phones" itemImage={mobileImg} category="Mobile Phones" />
                            <ProductsSectionButton showMoreLink="/phones" comingSoonLink="/coming-soon" />
                        </div>

                        {homeBanners['home_banner_1'] && <div className='mt-7 hidden sm:block'><BannerAd banner={homeBanners['home_banner_1']} className='h-[200px] sm:w-full' /></div>}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Tabs" itemImage={tabImg} category="Tablets" />
                            <ProductsSectionButton showMoreLink="/tablets" comingSoonLink="/coming-soon" />
                        </div>

                        {homeBanners['home_banner_2'] && <div className='mt-7 hidden sm:block'><BannerAd banner={homeBanners['home_banner_2']} className='h-[200px] sm:w-full' /></div>}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Smartwatches" itemImage={watchImg} category="Smartwatches" />
                            <ProductsSectionButton showMoreLink="/smartwatches" comingSoonLink="/coming-soon" />
                        </div>

                    </div>
                </div>
                {homeBanners['home_banner_3'] && <div className='mt-7'><BannerAd banner={homeBanners['home_banner_3']} className='h-[200px] sm:h-auto sm:w-full' /></div>}
                <div className='mt-10'>
                    <LatestNews title="Latest News" gridCols="sm:grid-cols-3" limit={6} />
                </div>
                <div className='mt-10'>
                    <LatestReviews title="Latest Reviews" gridCols="sm:grid-cols-4" limit={8} />
                </div>
            </div>
        </div>
    );
};

export default Home;
