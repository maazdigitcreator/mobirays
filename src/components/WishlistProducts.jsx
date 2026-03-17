import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import MobileImg from '../assets/mobileImg.jpg';
import tabImg from '../assets/tabImg.jpg';
import watchImg from '../assets/watchImg.png';
import { createSlug } from '../utils/urlHelper';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 9;

const sampleProducts = [
    { id: 1, name: 'Xiaomi Poco F2 Pro', image: MobileImg },
    { id: 2, name: 'Xiaomi Poco F2 Pro+', image: MobileImg },
    { id: 3, name: 'Xiaomi Poco F2 Pro Max', image: MobileImg },
    { id: 4, name: 'Xiaomi Poco F2 Pro Lite', image: tabImg },
    { id: 5, name: 'Xiaomi Poco F2 Pro SE', image: tabImg },
    { id: 6, name: 'Xiaomi Poco F2 Pro Neo', image: MobileImg },
    { id: 7, name: 'Xiaomi Poco Watch', image: watchImg },
    { id: 8, name: 'Xiaomi Poco Watch Pro', image: watchImg },
    { id: 9, name: 'Xiaomi Poco Watch Max', image: watchImg },
    { id: 10, name: 'Xiaomi Poco F2 Edge', image: MobileImg },
    { id: 11, name: 'Xiaomi Poco F2 Ultra', image: MobileImg },
    { id: 12, name: 'Xiaomi Poco Watch Fit', image: watchImg },
];

const sectionTitleClassName = 'relative inline-flex h-7 items-center bg-[#0580A5] pl-3 pr-7 text-[11px] text-white sm:h-10 sm:pl-4 sm:pr-9 sm:text-base';

const WishlistProducts = ({ title = 'Product Wishlist', products, itemImage }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const allProducts = Array.isArray(products) && products.length > 0 ? products : sampleProducts;

    const filteredProducts = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return allProducts;
        }

        return allProducts.filter((product) => product.name.toLowerCase().includes(normalizedQuery));
    }, [allProducts, searchQuery]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const resolvedCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
    const indexOfLastItem = resolvedCurrentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handleProductClick = (product) => {
        const productImage = product.image || itemImage || MobileImg;
        const slug = createSlug(product.name);

        navigate(`/${slug}`, {
            state: {
                product: {
                    ...product,
                    image: productImage,
                },
            },
        });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="w-full">
            <div className="relative mb-2 w-full overflow-hidden">
                <div className="absolute bottom-0 left-0 h-[8px] w-full bg-[#0580A5] sm:h-[10px]" />
                <div
                    className={sectionTitleClassName}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)' }}
                >
                    <h2>{title}</h2>
                </div>
            </div>

            <div className="mb-4 flex w-full items-stretch border border-[#0580A5]">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="min-w-0 flex-1 px-2 py-1 text-[11px] text-black outline-none placeholder:text-[#6f6f6f] sm:px-3 sm:py-2 sm:text-sm"
                />
                <button
                    type="button"
                    className="flex w-8 items-center justify-center border-l border-[#0580A5] bg-white text-[#0580A5] sm:w-10"
                    aria-label="Search wishlist"
                >
                    <Search size={16} />
                </button>
            </div>

            {currentProducts.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">No products found.</div>
            ) : (
                <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-7 lg:grid-cols-4 xl:grid-cols-5">
                    {currentProducts.map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => handleProductClick(product)}
                            className="flex min-w-0 flex-col items-start text-left"
                        >
                            <div className="flex h-[88px] w-full items-center justify-center overflow-hidden bg-white p-2 sm:h-[140px]">
                                <img
                                    src={product.image || itemImage || MobileImg}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <p className="mt-2 line-clamp-2 text-[10px] uppercase leading-[1.3] text-[#3a3a3a] sm:text-[12px]">
                                {product.name}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={resolvedCurrentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default WishlistProducts;
