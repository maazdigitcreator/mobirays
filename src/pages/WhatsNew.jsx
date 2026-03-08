import React, { useState, useEffect } from 'react';
import LatestProducts from '../components/LatestProducts';
import Sidebar from '../components/Layout/Sidebar';
import Pagination from '../components/Pagination';
import LatestNews from '../components/LatestNews';
import LatestReviews from '../components/LatestReviews';
import HeroBanner from '../components/Layout/HeroBanner';
import BannerAd from '../components/BannerAd';
import { useData } from '../context/DataContext';
import mobileImg from '../assets/mobileImg.jpg';
import tabImg from '../assets/tabImg.jpg';
import watchImg from '../assets/watchImg.png';

const WhatsNew = () => {
    // State for data
    const [phones, setPhones] = useState([]);
    const [tablets, setTablets] = useState([]);
    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageBanners, setPageBanners] = useState({});

    // State for pagination (kept for UI consistency, though API might not support it yet without params)
    const [phonesPage, setPhonesPage] = useState(1);
    const [tabletsPage, setTabletsPage] = useState(1);
    const [watchesPage, setWatchesPage] = useState(1);

    const itemsPerPage = 24; // 4 rows * 6 columns

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';

    useEffect(() => {
        const fetchItems = async (url, setter) => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                if (data?.data) setter(mapProducts(data.data));
            } catch (e) {
                console.error(`Error fetching ${url}:`, e);
            }
        };

        const fetchBanners = async () => {
            try {
                const res = await fetch(`${apiBaseUrl}/api/v1/banner`);
                const data = await res.json();
                const allBanners = Array.isArray(data.data) ? data.data : [];
                const bannerMap = {};
                ['whatsnew_banner_1', 'whatsnew_banner_2', 'whatsnew_banner_3'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b?.image) bannerMap[loc] = b.image;
                });
                setPageBanners(bannerMap);
            } catch (e) {
                console.error("Error fetching banners:", e);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchItems(`${apiBaseUrl}/api/v1/products/phoneWhatsNew`, setPhones),
                fetchItems(`${apiBaseUrl}/api/v1/products/tabletWhatsNew`, setTablets),
                fetchItems(`${apiBaseUrl}/api/v1/products/watchesWhatsNew`, setWatches),
                fetchBanners()
            ]);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Helper to map API data to component expectation
    const mapProducts = (data) => {
        return data.map(product => ({
            id: product.id,
            name: product.name,
            image: product.image || null,
            slug: product.slug,
            isComingSoon: product.is_coming_soon || false,
            isNew: true, // Mark as new for this page
            specifications: product.specifications,
            more_specifications: product.more_specifications,
            price: product.price,
            release_date: product.release_date,
            views: product.views,
            background_color: product.background_color,
            shopBy_links: product.shopBy_links,
        }));
    };

    // Helper to slice data for pagination
    const getPaginatedData = (data, page) => {
        const startIndex = (page - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <div >
            <div>

                <div className='flex flex-col lg:flex-row gap-2'>
                    {/* Sidebar Column */}
                    <div className="w-full lg:w-1/3 hidden lg:block">
                        <Sidebar />
                    </div>

                    {/* Main Content Column */}
                    <div className="w-full lg:w-3/4">

                        <HeroBanner />

                        {/* Phones Section */}
                        <div>
                            <LatestProducts title="Latest Phones" products={getPaginatedData(phones, phonesPage)} itemImage={mobileImg} />
                            {/* Pagination (Optional: Verify if API supports pagination, keeping simplistic for now) */}
                            {phones.length > itemsPerPage && <Pagination
                                currentPage={phonesPage}
                                totalPages={Math.ceil(phones.length / itemsPerPage)} // Dummy total for now as API might not return pagination meta
                                onPageChange={setPhonesPage}
                            />}
                        </div>

                        {pageBanners['whatsnew_banner_1'] && <div className='mt-7 hidden sm:block'><BannerAd banner={pageBanners['whatsnew_banner_1']} className='h-[200px] sm:w-full' /></div>}

                        {/* Tablets Section */}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Tabs" products={getPaginatedData(tablets, tabletsPage)} itemImage={tabImg} />
                            {tablets.length > itemsPerPage && <Pagination
                                currentPage={tabletsPage}
                                totalPages={Math.ceil(tablets.length / itemsPerPage)}
                                onPageChange={setTabletsPage}
                            />}
                        </div>

                        {pageBanners['whatsnew_banner_2'] && <div className='mt-7 hidden sm:block'><BannerAd banner={pageBanners['whatsnew_banner_2']} className='h-[200px] sm:w-full' /></div>}

                        {/* Smartwatches Section */}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Smartwatches" products={getPaginatedData(watches, watchesPage)} itemImage={watchImg} />
                            {watches.length > itemsPerPage && <Pagination
                                currentPage={watchesPage}
                                totalPages={Math.ceil(watches.length / itemsPerPage)}
                                onPageChange={setWatchesPage}
                            />}
                        </div>

                    </div>
                </div>
                {pageBanners['whatsnew_banner_3'] && <div className='mt-7'><BannerAd banner={pageBanners['whatsnew_banner_3']} className='h-[200px] sm:h-auto sm:w-full' /></div>}
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

export default WhatsNew;
