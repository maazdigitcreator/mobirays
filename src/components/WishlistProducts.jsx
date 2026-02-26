import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileImg from '../assets/mobileImg.jpg'
import { createSlug } from '../utils/urlHelper'
import { Search } from 'lucide-react'
import Pagination from './Pagination'

const WishlistProducts = ({ title, products, itemImage }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Dummy Data for Logic - Replace with API Call
    const dummyProducts = [
        { id: 1, name: "iPhone 16 Series Concept 1", isComingSoon: true },
        { id: 2, name: "iPhone 16 Series Concept 2", isComingSoon: false },
        { id: 3, name: "iPhone 16 Series Concept 3", isComingSoon: false },
        { id: 4, name: "iPhone 16 Series Concept 4", isComingSoon: false },
        { id: 5, name: "iPhone 16 Series Concept 5", isComingSoon: true },
        { id: 6, name: "iPhone 16 Series Concept 6", isComingSoon: false },
        { id: 7, name: "iPhone 16 Series Concept 7", isComingSoon: false },
        { id: 8, name: "iPhone 16 Series Concept 8", isComingSoon: false },
        { id: 9, name: "iPhone 16 Series Concept 9", isComingSoon: false },
        { id: 10, name: "iPhone 16 Series Concept 10", isComingSoon: false },
        { id: 11, name: "iPhone 16 Series Concept 11", isComingSoon: false },
        { id: 12, name: "iPhone 16 Series Concept 12", isComingSoon: false },
        { id: 13, name: "iPhone 16 Series Concept 13", isComingSoon: false },
    ];

    const allProducts = products || dummyProducts;

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);

    const handleProductClick = (product) => {
        // Get the actual image being displayed (product.image or itemImage or MobileImg)
        const productImage = product.image || itemImage || MobileImg;

        // Create URL slug from product name
        const slug = createSlug(product.name);

        // Navigate to product page with slug in URL (direct slug, no /product prefix)
        navigate(`/${slug}`, {
            state: {
                product: {
                    ...product,
                    image: productImage
                }
            }
        });
    };

    return (
        <div className="w-full container">
            <div>
                <div className="relative w-full mb-9 overflow-hidden">
                    {/* Background bar */}
                    <div className="w-full h-10 sm:h-14 flex items-center justify-between">
                        {/* Left side - Device name with slanted edge */}
                        <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                        <div className="relative w-full flex items-end">
                            {/* Title Box */}
                            <div
                                className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10"
                            >
                                <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">Product Wishlist</h1>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex gap-20 mb-4 justify-start items-start ">
                            {/* Search Bar */}
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-[400px] border-2 border-[#0580A5] py-1 px-2 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                                />
                                <button className=" right-0 top-0 min-h-full px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center">
                                    <Search className="text-white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div>
                {/* 
                        API TODO: 
                        1. Fetch product data from backend endpoint (e.g., /api/latest-phones).
                        2. Replace 'dummyProducts' with state variable 'products'.
                        3. Ensure API response includes: id, name, image_url, is_coming_soon status.
                    */}
                <div className="grid grid-cols-3 sm:grid-cols-2 px-2 sm:gap-y-10 gap-y-12 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
                    {currentProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col group cursor-pointer gap-y-4 sm:gap-y-0"
                            onClick={() => handleProductClick(product)}
                        >
                            <div className="relative mb-3 flex justify-center items-center p-2 bg-blue-50/50 rounded-lg h-48 transition-transform group-hover:scale-105">
                                {product.isComingSoon && (
                                    <div className="absolute -top-2 sm:-top-7 right-0 z-10 scale-90 sm:scale-100">
                                        <div className="bg-[#FF0008] text-white text-[14px] font-semibold px-1.5 py-0.5 rounded-md relative shadow-lg whitespace-nowrap">
                                            Coming Soon
                                            {/* Speech Bubble Tail */}
                                            <div
                                                className="absolute -bottom-3 right-4 w-0 h-0 
                                                border-l-[0px] border-l-transparent 
                                                border-r-[10px] border-r-transparent 
                                                border-t-[12px] border-t-[#FF0008]"
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                {/* Replace with actual <img> tag from API data */}
                                <div className="w-full h-full flex items-center justify-center text-6xl text-blue-200">
                                    {/* Placeholder for actual image: <img src={product.image || itemImage || MobileImg} alt={product.name} /> */}
                                    <img src={product.image || itemImage || MobileImg} alt="" />
                                </div>
                            </div>
                            <h3 className="text-[18px] leading-tight uppercase text-[#1E1E1E] line-clamp-2 overflow-hidden">
                                {product.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default WishlistProducts;
