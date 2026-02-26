import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import LatestProducts from '../components/LatestProducts'
import Pagination from '../components/Pagination'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import ProductsSectionButton from '../components/ProductsSectionButton'
import homeBanner3 from '../assets/homeBanner3.png'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg';
import LatestNews from '../components/LatestNews'
import LatestReviews from '../components/LatestReviews'
import HeroBanner from '../components/Layout/HeroBanner'
import homeBannerSM2 from '../assets/homeBannerSM2.png'
import tabImg from '../assets/tabImg.jpg'
import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import { filterProductsByCategory } from '../utils/filterHelpers';
import { useData } from '../context/DataContext';

const Tablets = () => {
    const location = useLocation();
    const { allProducts: cachedProducts, allBanners, loading } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 48; // 8 rows * 6 columns

    // Filter for Tablets from cached data
    const allProducts = React.useMemo(() => {
        return filterProductsByCategory(cachedProducts, 'Tablets');
    }, [cachedProducts]);

    // Apply search filter if query exists
    const params = new URLSearchParams(location.search);
    const searchQuery = (params.get('q') || '').toLowerCase();

    const displayedProducts = searchQuery
        ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery))
        : allProducts;

    const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = displayedProducts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['tablets_banner_1', 'tablets_banner_2'].forEach(loc => {
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
                        <SidebarIntro />
                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                            <SidebarBanner2 />
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">

                    <HeroBanner />


                    <div>
                        <LatestProducts title={searchQuery ? `Search Results for "${searchQuery}"` : "Latest Tabs"} products={currentProducts} itemImage={tabImg} />
                        {displayedProducts.length > itemsPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                    {pageBanners['tablets_banner_1'] && <img className='mt-7 h-[200px] w-auto sm:w-full' src={pageBanners['tablets_banner_1']} alt="Tablets Banner 1" />}
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
                {pageBanners['tablets_banner_2'] && <img className='mt-7 w-auto sm:w-full h-[200px] sm:h-auto' src={pageBanners['tablets_banner_2']} alt="Tablets Banner 2" />}
            </div>

            <ComingSoonMobiles title="Coming Soon Tablets" itemImage={tabImg} />

        </div>
    )
}

export default Tablets