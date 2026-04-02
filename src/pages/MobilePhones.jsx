import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import LatestProducts from '../components/LatestProducts'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import LatestNews from '../components/LatestNews'
import LatestReviews from '../components/LatestReviews'
import HeroBanner from '../components/Layout/HeroBanner';
import mobileImg from '../assets/mobileImg.jpg'
import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3';
import BannerAd from '../components/BannerAd';
import { filterProductsByCategory } from '../utils/filterHelpers';
import { useData } from '../context/useData';
const END_POINT = '/api/v1/products/phoneComingsoon';

const MobilePhones = () => {
    const location = useLocation();
    const { allProducts: cachedProducts, allBanners } = useData();

    // Filter for Mobile Phones from cached data
    const allProducts = React.useMemo(() => {
        return filterProductsByCategory(cachedProducts, 'Mobile Phones');
    }, [cachedProducts]);

    // Apply search filter if query exists
    const params = new URLSearchParams(location.search);
    const searchQuery = (params.get('q') || '').toLowerCase();

    const displayedProducts = searchQuery
        ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery))
        : allProducts;

    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['phones_banner_1', 'phones_banner_2'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b) map[loc] = b;
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
                        <LatestProducts
                            title={searchQuery ? `Search Results for "${searchQuery}"` : "Latest Phones"}
                            products={displayedProducts}
                            itemImage={mobileImg}
                            enablePagination
                            itemsPerPage={48}
                        />
                    </div>
                    {pageBanners['phones_banner_1'] && <div className='mt-7'><BannerAd banner={pageBanners['phones_banner_1']} className='h-[200px] sm:w-full' /></div>}
                    <div className='mt-10'>
                        <LatestNews
                            title="News"
                            gridCols="sm:grid-cols-2"
                            titleAlign="start"
                            clipPath="polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)"
                            paddingLeft="40px"
                            paddingRight="100px"
                            limit={4}
                        />
                    </div>
                    <div className='mt-10'>
                        <LatestReviews
                            title="Reviews"
                            gridCols="sm:grid-cols-3"
                            titleAlign="start"
                            clipPath="polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)"
                            paddingLeft="40px"
                            paddingRight="100px"
                            limit={6}
                        />
                    </div>




                </div>
            </div>


            <div className="md:col-span-3 mb-6 overflow-hidden">
                {pageBanners['phones_banner_2'] && <BannerAd banner={pageBanners['phones_banner_2']} className="mt-7 h-[200px] sm:h-auto sm:w-full" />}
            </div>

            <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} endpoint={END_POINT} />

        </div>
    )
}

export default MobilePhones
