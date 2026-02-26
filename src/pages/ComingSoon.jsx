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

const ComingSoon = () => {
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

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Phones
                const phonesRes = await fetch(`${apiBaseUrl}/api/v1/products/phoneComingsoon`);
                const phonesData = await phonesRes.json();
                if (phonesData && phonesData.data) {
                    setPhones(mapProducts(phonesData.data));
                }

                // Fetch Tablets
                const tabletsRes = await fetch(`${apiBaseUrl}/api/v1/products/tabletComingsoon`);
                const tabletsData = await tabletsRes.json();
                if (tabletsData && tabletsData.data) {
                    setTablets(mapProducts(tabletsData.data));
                }

                // Fetch Smartwatches
                const watchesRes = await fetch(`${apiBaseUrl}/api/v1/products/watchesComingsoon`);
                const watchesData = await watchesRes.json();
                if (watchesData && watchesData.data) {
                    setWatches(mapProducts(watchesData.data));
                }

            } catch (error) {
                console.error("Error fetching Coming Soon data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/v1/banner`)
            .then(res => res.json())
            .then(data => {
                const allBanners = Array.isArray(data.data) ? data.data : [];
                const map = {};
                ['comingsoon_banner_1', 'comingsoon_banner_2', 'comingsoon_banner_3'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b?.image) map[loc] = b.image;
                });
                setPageBanners(map);
            })
            .catch(() => { });
    }, []);

    // Helper to map API data to component expectation
    const mapProducts = (data) => {
        return data.map(product => ({
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
                            <LatestProducts title="Latest Phones" products={getPaginatedData(phones, phonesPage)} itemImage={mobileImg} />
                            {phones.length > itemsPerPage && (
                                <Pagination
                                    currentPage={phonesPage}
                                    totalPages={Math.ceil(phones.length / itemsPerPage)}
                                    onPageChange={setPhonesPage}
                                />
                            )}
                        </div>

                        {pageBanners['comingsoon_banner_1'] && <img className='mt-7 h-[200px] w-auto sm:w-full hidden sm:block' src={pageBanners['comingsoon_banner_1']} alt="Coming Soon Banner 1" />}

                        {/* Tablets Section */}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Tabs" products={getPaginatedData(tablets, tabletsPage)} itemImage={tabImg} />
                            {tablets.length > itemsPerPage && (
                                <Pagination
                                    currentPage={tabletsPage}
                                    totalPages={Math.ceil(tablets.length / itemsPerPage)}
                                    onPageChange={setTabletsPage}
                                />
                            )}
                        </div>

                        {pageBanners['comingsoon_banner_2'] && <img className='mt-7 h-[200px] w-auto sm:w-full hidden sm:block' src={pageBanners['comingsoon_banner_2']} alt="Coming Soon Banner 2" />}

                        {/* Smartwatches Section */}
                        <div className='mt-10'>
                            <LatestProducts title="Latest Smartwatches" products={getPaginatedData(watches, watchesPage)} itemImage={watchImg} />
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
                {pageBanners['comingsoon_banner_3'] && <img className='mt-7 h-[200px] w-auto sm:w-full h-[200px] sm:h-auto' src={pageBanners['comingsoon_banner_3']} alt="Coming Soon Banner 3" />}
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
