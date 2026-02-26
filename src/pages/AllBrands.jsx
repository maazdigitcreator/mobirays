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
import RelatedReviews from '../components/SidebarSections/RelatedReviews';
import RelatedNews from '../components/SidebarSections/RelatedNews';

const AllBrands = () => {
    const { allBanners } = useData();
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['allbrands_banner_1', 'allbrands_banner_2'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b?.image) map[loc] = b.image;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-2'>
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <RelatedReviews />
                        <RelatedNews />
                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">
                    {/* Hero Section with Background Image */}
                    <AllBrandsHero backgroundImage={pageBanners['allbrands_banner_1']} />

                    {/* Brands Grid */}
                    <BrandsGrid />


                </div>

            </div>
            {/* Bottom banner */}
            {pageBanners['allbrands_banner_2'] && <img className='mt-7 w-auto sm:w-full h-[200px] sm:h-auto' src={pageBanners['allbrands_banner_2']} alt="All Brands Banner 2" />}
        </div>
    )
}

export default AllBrands
