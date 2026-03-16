import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import LatestProducts from '../components/LatestProducts'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import LatestNews from '../components/LatestNews'
import LatestReviews from '../components/LatestReviews'
import HeroBanner from '../components/Layout/HeroBanner'
import watchImg from '../assets/watchImg.png'
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
import { useData } from '../context/DataContext';
import homeBanner3 from '../assets/homeBanner3.png';
import homeBannerSM3 from '../assets/homeBannerSM3.png';

const END_POINT = '/api/v1/products/watchesComingsoon';
const Smartwatches = () => {
    const location = useLocation();
    const { allProducts: cachedProducts, allBanners } = useData();

    // Filter for Smartwatches from cached data
    const allProducts = React.useMemo(() => {
        return filterProductsByCategory(cachedProducts, 'Smartwatches');
    }, [cachedProducts]);

    // Apply search filter if query exists
    const params = new URLSearchParams(location.search);
    const searchQuery = (params.get('q') || '').toLowerCase();

    const displayedProducts = searchQuery
        ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery))
        : allProducts;

    const [pageBanners, setPageBanners] = useState({});
    const smartwatchesBannerFallback = {
        title: 'Smartwatches Banner',
        image: homeBanner3,
    };
    const smartwatchesBannerMobileFallback = {
        title: 'Smartwatches Banner Mobile',
        image: homeBannerSM3,
    };

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['smartwatches_banner_1', 'smartwatches_banner_2'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b) map[loc] = b;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    return (
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
                        <LatestProducts
                            title={searchQuery ? `Search Results for "${searchQuery}"` : "Latest Smartwatches"}
                            products={displayedProducts}
                            itemImage={watchImg}
                            enablePagination
                            itemsPerPage={48}
                        />
                    </div>
                    <div className='mt-7'>
                        <div className="sm:hidden">
                            <BannerAd banner={pageBanners['smartwatches_banner_1'] || smartwatchesBannerMobileFallback} className='w-full' />
                        </div>
                        <div className="hidden sm:block">
                            <BannerAd banner={pageBanners['smartwatches_banner_1'] || smartwatchesBannerFallback} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-10'>
                        <LatestNews
                            title="Latest News"
                            gridCols="sm:grid-cols-2"
                            limit={4}
                        />
                    </div>
                    <div className='mt-10'>
                        <LatestReviews
                            title="Latest Reviews"
                            gridCols="sm:grid-cols-3"
                            limit={6}
                        />
                    </div>
                </div>
            </div>

            <div className="md:col-span-3 mb-6 overflow-hidden">
                <div className="sm:hidden">
                    <BannerAd banner={pageBanners['smartwatches_banner_2'] || smartwatchesBannerMobileFallback} className="mt-7 w-full" />
                </div>
                <div className="hidden sm:block">
                    <BannerAd banner={pageBanners['smartwatches_banner_2'] || smartwatchesBannerFallback} className="mt-7 w-full" />
                </div>
            </div>

            <ComingSoonMobiles title="Coming Soon Smartwatches" itemImage={watchImg} endpoint={END_POINT} />

        </div>
    )
}

export default Smartwatches
