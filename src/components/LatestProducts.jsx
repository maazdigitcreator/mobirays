import React from 'react'
import { useNavigate } from 'react-router-dom'
import MobileImg from '../assets/mobileImg.jpg'
import { useData } from '../context/useData';
import Pagination from './Pagination';
import { getProductDetailPath } from '../utils/productRoutes';

const LatestProducts = ({ title, products, itemImage, limit, useDummyData = false, category, enablePagination = false, itemsPerPage = 24}) => {
    const navigate = useNavigate();
    const { allProducts: cachedProducts } = useData();
    const [apiProducts, setApiProducts] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);

    // Dummy data for tabs and smartwatches (fallback)
    const dummyProducts = [
        { id: 1, name: "Product 1", isComingSoon: true },
        { id: 2, name: "Product 2", isComingSoon: false },
        { id: 3, name: "Product 3", isComingSoon: false },
        { id: 4, name: "Product 4", isComingSoon: false },
        { id: 5, name: "Product 5", isComingSoon: true },
        { id: 6, name: "Product 6", isComingSoon: false },
        { id: 7, name: "Product 7", isComingSoon: false },
        { id: 8, name: "Product 8", isComingSoon: false },
        { id: 9, name: "Product 9", isComingSoon: false },
        { id: 10, name: "Product 10", isComingSoon: false },
        { id: 11, name: "Product 11", isComingSoon: false },
        { id: 12, name: "Product 12", isComingSoon: false },
    ];

    // Use cached products from context
    React.useEffect(() => {
        // If no products prop provided and we need real data
        if (!products && (!useDummyData || category)) {
            let filteredProducts = [...cachedProducts];

            // Filter by category if provided
            if (category) {
                filteredProducts = filteredProducts.filter(product => {
                    const prodCat = product.product_category ? product.product_category.toLowerCase() : '';
                    const targetCat = category.toLowerCase();

                    // Flexible matching
                    if (targetCat === 'smartwatches' || targetCat === 'watch' || targetCat === 'watches') {
                        return prodCat.includes('watch');
                    }
                    if (targetCat === 'tablets' || targetCat === 'tabs' || targetCat === 'tablet') {
                        return prodCat.includes('tab') || prodCat.includes('pad');
                    }
                    if (targetCat === 'mobile phones' || targetCat === 'mobiles' || targetCat === 'phones') {
                        return prodCat.includes('mobile') || prodCat.includes('phone');
                    }

                    return prodCat.includes(targetCat);
                });
            }

            setApiProducts(filteredProducts);
        }
    }, [cachedProducts, category, products, useDummyData]);

    // Determine which products to display
    // If category is provided, we prefer apiProducts (which are filtered).
    // Otherwise fallback to existing logic.
    const displayProducts = products || ((category || !useDummyData) ? apiProducts : dummyProducts);

    // Apply limit if specified
    const limitedProducts = limit ? displayProducts.slice(0, limit) : displayProducts;
    const shouldPaginate = enablePagination && !limit;
    const totalPages = shouldPaginate
        ? Math.ceil(limitedProducts.length / itemsPerPage)
        : 1;
    const paginatedProducts = shouldPaginate
        ? limitedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : limitedProducts;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [title, category, limitedProducts.length]);

    const handleProductClick = (product) => {
        // Get the actual image being displayed (product.image or itemImage or MobileImg)
        const productImage = product.image || itemImage || MobileImg;

        navigate(getProductDetailPath(product), {
            state: {
                product: {
                    ...product, // Pass all product data including specifications, price, etc.
                    image: productImage
                }
            }
        });
    };

    // If we have a category but no products found, optionally show a message or empty state
    if (category && limitedProducts.length === 0) {
        // You might want to return null to hide the section, or show a 'No products found' message.
        // For now, let's keep rendering the structure so the layout doesn't break, maybe with a message.
        // Or just return null if you want to hide empty sections.
        // return null; 
    }

    return (
        <div className="w-full container">
            <div className="relative w-full flex items-end">
                {/* Horizontal Line Background */}
                <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                {/* Title Box */}
                <div
                    className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10"
                >
                    <h2 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">{title}</h2>
                </div>
            </div>
            <div>
                {limitedProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No products found in this category.</div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-2 px-2 sm:gap-y-10 gap-y-12 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
                        {paginatedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col group cursor-pointer gap-y-4 sm:gap-y-0"
                                onClick={() => handleProductClick(product)}
                            >
                                <div className="relative mb-3 flex justify-center items-center p-2 bg-blue-50/50 rounded-lg h-48 transition-transform group-hover:scale-105">
                                    {(product.is_coming_soon || product.isComingSoon) ? (
                                        <div className="absolute -top-2 sm:-top-4.5 right-0 z-10 scale-90 sm:scale-100">
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
                                    ) : (product.is_new || product.isNew) && (
                                        <div className="absolute -top-2 sm:-top-4.5 right-0 z-10 scale-90 sm:scale-100">
                                            <div className="bg-[#FF0008] text-white text-[14px] font-semibold px-4 py-0.5 rounded-md relative shadow-lg whitespace-nowrap">
                                                New
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
                                <h3 className="text-[18px] leading-tight uppercase text-[#1E1E1E] line-clamp-2 overflow-hidden text-center">
                                    {product.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                )}

                {shouldPaginate && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
};

export default LatestProducts;
