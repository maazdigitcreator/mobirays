import React, { useState, useEffect } from 'react';
import LatestProducts from '../components/LatestProducts';
import Sidebar from '../components/Layout/Sidebar';
import Pagination from '../components/Pagination';
import LatestNews from '../components/LatestNews';
import LatestReviews from '../components/LatestReviews';
import HeroBanner from '../components/Layout/HeroBanner';
import mobileImg from '../assets/mobileImg.jpg';
import tabImg from '../assets/tabImg.jpg';
import watchImg from '../assets/watchImg.png';
import BannerAd from '../components/BannerAd';
import useMetadata from '../hooks/useMetadata';

let cachedData = null;

const ComingSoon = () => {
    useMetadata(
        "Coming Soon Products | Mobirays",
        "Stay updated with upcoming phones, tablets, and smartwatches on Mobirays."
    );
    // State for data
    const [phones, setPhones] = useState([]);
    const [tablets, setTablets] = useState([]);
    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageBanners, setPageBanners] = useState({});

    // State for pagination
    const [phonesPage, setPhonesPage] = useState(1);
    const [tabletsPage, setTabletsPage] = useState(1);
    const [watchesPage, setWatchesPage] = useState(1);

    const itemsPerPage = 24; // 4 rows * 6 columns

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'https://mobirays.voucherndeals.com';

    useEffect(() => {
        if (cachedData) {
            setPhones(cachedData.phones);
            setTablets(cachedData.tablets);
            setWatches(cachedData.watches);
            setPageBanners(cachedData.banners);
            setLoading(false);
            return;
        }

        const fetchItems = async (url) => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                return data?.data ? mapProducts(data.data) : [];
            } catch (e) {
                console.error(`Error fetching ${url}:`, e);
                return [];
            }
        };

        const fetchBanners = async () => {
            try {
                const res = await fetch(`${apiBaseUrl}/api/v1/banner`);
                const data = await res.json();
                const allBanners = Array.isArray(data.data) ? data.data : [];
                const bannerMap = {};
                ['comingsoon_banner_1', 'comingsoon_banner_2', 'comingsoon_banner_3'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b) bannerMap[loc] = b;
                });
                return bannerMap;
            } catch (e) {
                console.error("Error fetching banners:", e);
                return {};
            }
        };

        const fetchData = async () => {
            setLoading(true);
            const [fetchedPhones, fetchedTablets, fetchedWatches, fetchedBanners] = await Promise.all([
                fetchItems(`${apiBaseUrl}/api/v1/products/phoneComingsoon`),
                fetchItems(`${apiBaseUrl}/api/v1/products/tabletComingsoon`),
                fetchItems(`${apiBaseUrl}/api/v1/products/watchesComingsoon`),
                fetchBanners()
            ]);
            
            cachedData = {
                phones: fetchedPhones,
                tablets: fetchedTablets,
                watches: fetchedWatches,
                banners: fetchedBanners
            };

            setPhones(fetchedPhones);
            setTablets(fetchedTablets);
            setWatches(fetchedWatches);
            setPageBanners(fetchedBanners);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Helper to map API data to component expectation
    const mapProducts = (data) => {
        return data
            .filter(product => {
                const s = typeof product.status === 'object' ? String(product.status?.value || '') : String(product.status || '');
                const statusStr = s.trim().toLowerCase();
                return statusStr !== 'draft' && statusStr !== 'pending' && statusStr !== 'drafts';
            })
            .map(product => ({
                id: product.id,
                name: product.name,
                image: product.image || null,
                slug: product.slug,
                isComingSoon: true, // Force true for Coming Soon page items
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
                            <LatestProducts title="Coming Soon Phones" products={getPaginatedData(phones, phonesPage)} itemImage={mobileImg} />
                            {phones.length > itemsPerPage && (
                                <Pagination
                                    currentPage={phonesPage}
                                    totalPages={Math.ceil(phones.length / itemsPerPage)}
                                    onPageChange={setPhonesPage}
                                />
                            )}
                        </div>

                        {pageBanners['comingsoon_banner_1'] && <BannerAd banner={pageBanners['comingsoon_banner_1']} className='mt-7 h-[200px] w-auto sm:w-full hidden sm:block' />}

                        {/* Tablets Section */}
                        <div className='mt-10'>
                            <LatestProducts title="Coming Soon Tabs" products={getPaginatedData(tablets, tabletsPage)} itemImage={tabImg} />
                            {tablets.length > itemsPerPage && (
                                <Pagination
                                    currentPage={tabletsPage}
                                    totalPages={Math.ceil(tablets.length / itemsPerPage)}
                                    onPageChange={setTabletsPage}
                                />
                            )}
                        </div>

                        {pageBanners['comingsoon_banner_2'] && <BannerAd banner={pageBanners['comingsoon_banner_2']} className='mt-7 h-[200px] w-auto sm:w-full hidden sm:block' />}

                        {/* Smartwatches Section */}
                        <div className='mt-10'>
                            <LatestProducts title="Coming Soon Smartwatches" products={getPaginatedData(watches, watchesPage)} itemImage={watchImg} />
                            {watches.length > itemsPerPage && (
                                <Pagination
                                    currentPage={watchesPage}
                                    totalPages={Math.ceil(watches.length / itemsPerPage)}
                                    onPageChange={setWatchesPage}
                                />
                            )}
                        </div>

                    </div>
                </div>
                {pageBanners['comingsoon_banner_3'] && <BannerAd banner={pageBanners['comingsoon_banner_3']} className='mt-7 h-[200px] w-auto sm:w-full h-[200px] sm:h-auto' />}
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

export default ComingSoon;
