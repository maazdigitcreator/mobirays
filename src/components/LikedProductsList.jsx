import React from 'react'
import { useNavigate } from 'react-router-dom'
import MobileImg from '../assets/mobileImg.jpg'
import { Search } from 'lucide-react'
import Pagination from './Pagination'
import { useLikedProducts } from '../hooks/useLikedProducts'
import { getProductDetailPath } from '../utils/productRoutes'

const LikedProductsList = ({ title = "Liked Products", products, itemImage }) => {
    const navigate = useNavigate();
    const {
        currentProducts,
        currentPage,
        totalPages,
        status,
        searchQuery,
        setCurrentPage,
        handleSearchChange,
    } = useLikedProducts(products);

    const handleProductClick = (product) => {
        // Get the actual image being displayed (product.image or itemImage or MobileImg)
        const productImage = product.image || itemImage || MobileImg;
        const normalizedProduct = product.product || product;

        navigate(getProductDetailPath(normalizedProduct), {
            state: {
                product: {
                    ...normalizedProduct,
                    image: productImage
                }
            }
        });
    };

    return (
        <div className="w-full container">
            <div>
            {/* Desktop & Mobile Responsive Header */}
            <div className="w-full mb-9">
                {/* DESKTOP LAYOUT */}
                <div className="hidden sm:flex relative w-full h-14 items-center justify-between overflow-hidden">
                    {/* Full width blue line */}
                    <div className="absolute -bottom-1 left-0 w-full h-[16px] bg-[#0580A5]"></div>

                    <div className="relative flex items-end">
                        <div className="latest-products-clip bg-[#0580A5] text-white w-fit h-14 flex items-center relative z-10">
                            <h1 className="text-[26px] pl-4 pr-6">{title}</h1>
                        </div>
                    </div>

                    <div className="flex z-10 mb-4 items-start pr-0">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-[350px] border-2 border-[#0580A5] py-1 px-3 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                            />
                            <button
                                type="button"
                                className="px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center"
                            >
                                <Search className="text-white" size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE LAYOUT */}
                <div className="flex sm:hidden flex-col-reverse gap-4">
                    <div className="relative w-full h-10 overflow-hidden">
                        {/* Mobile full width blue line */}
                        <div className="absolute -bottom-1 left-0 w-full h-[12px] bg-[#0580A5]"></div>

                        <div className="latest-products-clip bg-[#0580A5] text-white w-fit h-10 flex items-center relative z-10">
                            <h1 className="text-[18px] pl-2 pr-6">{title}</h1>
                        </div>
                    </div>

                    <div className="flex w-full z-10">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="flex-1 w-full border-2 border-[#0580A5] py-1.5 px-3 focus:outline-none focus:border-[#046a8a] text-black placeholder-gray-500"
                        />
                        <button
                            type="button"
                            className="px-4 bg-[#0580A5] hover:bg-[#046a8a] transition-colors flex items-center justify-center"
                        >
                            <Search className="text-white" size={20} />
                        </button>
                    </div>
                </div>
            </div>


            </div>
            <div>
                {status.loading ? (
                    <div className="text-center py-10 text-gray-500">Loading liked products...</div>
                ) : status.error ? (
                    <div className="text-center py-10 text-red-500">{status.error}</div>
                ) : currentProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No liked products found.</div>
                ) : (
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
                                                <div
                                                    className="absolute -bottom-3 right-4 w-0 h-0 
                                                    border-l-[0px] border-l-transparent 
                                                    border-r-[10px] border-r-transparent 
                                                    border-t-[12px] border-t-[#FF0008]"
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="w-full h-full flex items-center justify-center text-6xl text-blue-200">
                                        <img src={product.image || itemImage || MobileImg} alt="" />
                                    </div>
                                </div>
                                <h3 className="text-[18px] leading-tight uppercase text-[#1E1E1E] line-clamp-2 overflow-hidden">
                                    {product.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                )}
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

export default LikedProductsList;
