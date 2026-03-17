import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext';

import AllBrandsHero from '../components/AllBrandsHero'
import BrandsGrid from '../components/BrandsGrid'
import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3';
import BannerAd from '../components/BannerAd';
import homeBanner3 from '../assets/homeBanner3.png';
import homeBannerSM3 from '../assets/homeBannerSM3.png';

const AllBrands = () => {
    const { allBanners } = useData();
    const [pageBanners, setPageBanners] = useState({});
    const allBrandsBannerFallback = {
        title: 'All Brands Banner',
        image: homeBanner3,
    };
    const allBrandsBannerMobileFallback = {
        title: 'All Brands Banner Mobile',
        image: homeBannerSM3,
    };

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['allbrands_banner_1', 'allbrands_banner_2'].forEach(loc => {
                const b = allBanners.find((banner) => banner.location === loc);
                if (b) map[loc] = b;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    return (
        <div>
            <div className="grid gap-2 lg:grid-cols-[401px_minmax(0,1fr)] lg:items-start">
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

                <div className="min-w-0">
                    <AllBrandsHero backgroundImage={pageBanners['allbrands_banner_1']?.image} />

                    <BrandsGrid />
                </div>
            </div>

            <div className="mt-7 sm:hidden">
                <BannerAd banner={pageBanners['allbrands_banner_2'] || allBrandsBannerMobileFallback} className="w-full" />
            </div>
            <div className="mt-7 hidden sm:block">
                <BannerAd banner={pageBanners['allbrands_banner_2'] || allBrandsBannerFallback} className="w-full" />
            </div>
        </div>
    )
}

export default AllBrands
