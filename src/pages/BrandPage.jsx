import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import LatestProducts from '../components/LatestProducts';
import Sidebar from '../components/Layout/Sidebar';
import Pagination from '../components/Pagination';
import homeBanner3 from '../assets/homeBanner3.png';
import LatestNews from '../components/LatestNews';
import LatestReviews from '../components/LatestReviews';
import HeroBanner from '../components/Layout/HeroBanner';
import mobileImg from '../assets/mobileImg.jpg';
import tabImg from '../assets/tabImg.jpg';
import watchImg from '../assets/watchImg.png';
import { useData } from '../context/DataContext';
import { filterProductsByCategory } from '../utils/filterHelpers';

const BrandPage = () => {
    const { brandSlug } = useParams();
    const { allProducts, allBrands, allBanners, loading } = useData();
    const [phonesPage, setPhonesPage] = useState(1);
    const [tabletsPage, setTabletsPage] = useState(1);
    const [watchesPage, setWatchesPage] = useState(1);
    const itemsPerPage = 48;

    const bannerMap = useMemo(() => {
        const map = {};
        ['home_banner_1', 'home_banner_2', 'home_banner_3'].forEach(loc => {
            const b = allBanners.find(b => b.location === loc);
            if (b?.image) map[loc] = b.image;
        });
        return map;
    }, [allBanners]);

    // Derive the display brand name from allBrands or from the slug
    const brandInfo = useMemo(() => {
        // Try to find the brand in allBrands by matching slug
        const found = allBrands.find(b => {
            const bSlug = b.slug || b.name.toLowerCase().replace(/\s+/g, '-');
            return bSlug === brandSlug;
        });
        return found || null;
    }, [allBrands, brandSlug]);

    const brandName = brandInfo
        ? brandInfo.name
        : brandSlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

    // Filter all products belonging to this brand using the `brand` field
    const brandProducts = useMemo(() => {
        if (!allProducts.length) return [];

        const slug = brandSlug.toLowerCase().replace(/-/g, ' ');

        return allProducts.filter(p => {
            const productBrand = p.brand ? p.brand.toLowerCase() : '';

            // Match product.brand against brandSlug
            // e.g., brand: "Oppo", brandSlug: "oppo"
            if (productBrand === slug) return true;

            // Also match against the resolved brand name (handles multi-word brands)
            if (productBrand === brandName.toLowerCase()) return true;

            return false;
        });
    }, [allProducts, brandSlug, brandName]);

    // Split brand products into categories
    const phones = useMemo(() => filterProductsByCategory(brandProducts, 'Mobile Phones'), [brandProducts]);
    const tablets = useMemo(() => filterProductsByCategory(brandProducts, 'Tablets'), [brandProducts]);
    const watches = useMemo(() => filterProductsByCategory(brandProducts, 'Smartwatches'), [brandProducts]);

    // Uncategorized products (don't match any known category) — show them in phones section
    const categorizedIds = useMemo(() => {
        const ids = new Set([...phones, ...tablets, ...watches].map(p => p.id));
        return ids;
    }, [phones, tablets, watches]);

    const uncategorized = useMemo(() => {
        return brandProducts.filter(p => !categorizedIds.has(p.id));
    }, [brandProducts, categorizedIds]);

    const allPhones = useMemo(() => [...phones, ...uncategorized], [phones, uncategorized]);

    // Pagination calculations
    const phonePages = Math.ceil(allPhones.length / itemsPerPage);
    const tabletPages = Math.ceil(tablets.length / itemsPerPage);
    const watchPages = Math.ceil(watches.length / itemsPerPage);

    const currentPhones = allPhones.slice((phonesPage - 1) * itemsPerPage, phonesPage * itemsPerPage);
    const currentTablets = tablets.slice((tabletsPage - 1) * itemsPerPage, tabletsPage * itemsPerPage);
    const currentWatches = watches.slice((watchesPage - 1) * itemsPerPage, watchesPage * itemsPerPage);

    if (loading) {
        return <div className="text-center py-20">Loading {brandName} products...</div>;
    }

    const hasAnyProducts = allPhones.length > 0 || tablets.length > 0 || watches.length > 0;

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

                        {!hasAnyProducts && (
                            <div className="text-center py-10 text-gray-500">
                                No products found for {brandName}.
                            </div>
                        )}

                        {/* Phones Section */}
                        {allPhones.length > 0 && (
                            <div>
                                <LatestProducts
                                    title={`${brandName} Phones`}
                                    itemImage={mobileImg}
                                    products={currentPhones}
                                />
                                {phonePages > 1 && (
                                    <Pagination
                                        currentPage={phonesPage}
                                        totalPages={phonePages}
                                        onPageChange={setPhonesPage}
                                    />
                                )}
                            </div>
                        )}

                        {allPhones.length > 0 && bannerMap['home_banner_1'] && <img className='mt-7 h-[200px] w-auto sm:w-full hidden sm:block' src={bannerMap['home_banner_1']} alt="" />}

                        {/* Tablets Section */}
                        {tablets.length > 0 && (
                            <div className='mt-10'>
                                <LatestProducts
                                    title={`${brandName} Tabs`}
                                    itemImage={tabImg}
                                    products={currentTablets}
                                />
                                {tabletPages > 1 && (
                                    <Pagination
                                        currentPage={tabletsPage}
                                        totalPages={tabletPages}
                                        onPageChange={setTabletsPage}
                                    />
                                )}
                            </div>
                        )}

                        {tablets.length > 0 && bannerMap['home_banner_2'] && <img className='mt-7 h-[200px] w-auto sm:w-full hidden sm:block' src={bannerMap['home_banner_2']} alt="" />}

                        {/* Smartwatches Section */}
                        {watches.length > 0 && (
                            <div className='mt-10'>
                                <LatestProducts
                                    title={`${brandName} Smartwatches`}
                                    itemImage={watchImg}
                                    products={currentWatches}
                                />
                                {watchPages > 1 && (
                                    <Pagination
                                        currentPage={watchesPage}
                                        totalPages={watchPages}
                                        onPageChange={setWatchesPage}
                                    />
                                )}
                            </div>
                        )}

                    </div>
                </div>
                {bannerMap['home_banner_3'] && <img className='mt-7 h-[200px] w-auto sm:w-full h-[200px] sm:h-auto' src={bannerMap['home_banner_3']} alt="" />}
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

export default BrandPage;
