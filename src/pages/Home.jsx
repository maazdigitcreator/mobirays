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
import homeBanner3 from '../assets/homeBanner3.png';
import homeBannerSM3 from '../assets/homeBannerSM3.png';

const Home = () => {
    const { allBanners } = useData();
    const [homeBanners, setHomeBanners] = useState({});
    const homeBanner3Fallback = {
        title: 'Home Banner 3',
        image: homeBanner3,
    };
    const homeBanner3MobileFallback = {
        title: 'Home Banner 3 Mobile',
        image: homeBannerSM3,
    };

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


                <div className="grid gap-2 lg:grid-cols-[401px_minmax(0,1fr)] lg:items-start">
                    {/* Sidebar Column */}
                    <div className="hidden lg:block">
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
                    <div className="min-w-0">

                        <HeroBanner />


                        <div>
                            <LatestProducts title="Latest Phones" itemImage={mobileImg} category="Mobile Phones" limit={24} />
                            <ProductsSectionButton showMoreLink="/phones" comingSoonLink="/coming-soon" />
                        </div>

                        {homeBanners['home_banner_1'] && <div className='mt-7 hidden sm:block'><BannerAd banner={homeBanners['home_banner_1']} className='h-[200px] sm:w-full' /></div>}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Tabs" itemImage={tabImg} category="Tablets" limit={24} />
                            <ProductsSectionButton showMoreLink="/tablets" comingSoonLink="/coming-soon" />
                        </div>

                        {homeBanners['home_banner_2'] && <div className='mt-7 hidden sm:block'><BannerAd banner={homeBanners['home_banner_2']} className='h-[200px] sm:w-full' /></div>}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Smartwatches" itemImage={watchImg} category="Smartwatches" limit={24} />
                            <ProductsSectionButton showMoreLink="/smartwatches" comingSoonLink="/coming-soon" />
                        </div>

                    </div>
                </div>
                <div className='mt-7'>
                    <div className="sm:hidden">
                        <BannerAd
                            banner={homeBanners['home_banner_3'] || homeBanner3MobileFallback}
                            className='w-full'
                        />
                    </div>
                    <div className="hidden sm:block">
                        <BannerAd
                            banner={homeBanners['home_banner_3'] || homeBanner3Fallback}
                            className='w-full'
                        />
                    </div>
                </div>
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
