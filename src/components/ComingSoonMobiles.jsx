import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Added useNavigate
import MobileImg from '../assets/mobileImg.jpg'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createSlug } from '../utils/urlHelper' // Import createSlug
const END_POINT = '/api/v1/products/phoneComingsoon';
const ComingSoonMobiles = ({ title, itemImage, endpoint = END_POINT}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${apiBaseUrl}${endpoint}`);
                const data = await response.json();
                if (data && data.data) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error('Error fetching coming soon mobiles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [endpoint]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setItemsToShow(3);
            setIsMobile(width < 640);
            setIsDesktop(width >= 1024);
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const maxIndex = Math.max(0, products.length - itemsToShow);
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [itemsToShow, products.length, currentIndex]);

    const maxIndex = Math.max(0, products.length - itemsToShow);

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleProductClick = (product) => {
        const slug = product.slug || createSlug(product.name);
        navigate(`/${slug}`, {
            state: {
                product: {
                    ...product,
                    image: product.image || itemImage || MobileImg
                }
            }
        });
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="w-full mt-10">
            <div className="relative w-full flex items-end justify-center mb-0">
                {/* Horizontal Line Background */}
                <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                {/* Header Section - Isolated and Static */}
                <div
                    className="latest-news-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10 transition-none"
                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)', paddingLeft: isDesktop ? '70px' : '60px', paddingRight: isDesktop ? '70px' : '60px' }}
                >
                    <h2 className="text-[15px] sm:text-[18px] lg:text-2xl">{title}</h2>
                </div>
            </div>

            {/* Carousel Section - Parent should NOT have group class */}
            <div className="relative flex items-center px-2 sm:px-0">
                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className={`absolute sm:-left-4 left-0 z-10 p-1 rounded-full border border-[#0580A5] bg-white text-[#0580A5] hover:bg-[#0580A5] hover:text-white transition-colors hidden sm:flex ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Items Container */}
                <div className="w-full overflow-x-auto px-1 scrollbar-hide snap-x snap-mandatory sm:overflow-hidden">
                    <div
                        className="flex sm:transition-transform sm:duration-300 sm:ease-out"
                        style={!isMobile ? { transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` } : undefined}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="mt-8 min-w-[33.3333%] px-1.5 flex flex-col group cursor-pointer snap-center sm:mt-12 sm:px-2"
                                onClick={() => handleProductClick(product)}
                            >
                                <div className="relative mb-2 flex h-[108px] items-center justify-center p-1 transition-transform group-hover:scale-105 sm:mb-3 sm:h-48 sm:p-2">
                                    <div className="flex h-full w-full items-center justify-center">
                                        <img
                                            src={product.image || itemImage || MobileImg}
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                </div>
                                <h3 className="px-1 text-left text-[10px] font-medium uppercase leading-[1.25] text-gray-700 line-clamp-2 group-hover:text-[#0580A5] sm:px-2 sm:text-sm">
                                    {product.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className={`absolute sm:-right-1 right-0 z-10 p-1 rounded-full border border-[#0580A5] bg-white text-[#0580A5] hover:bg-[#0580A5] hover:text-white transition-colors hidden sm:flex ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Show More Button */}

            <div className="mt-10">
                <Link to="/coming-soon" className="w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                    <span className="bg-white border-2 rounded-full border-[#0580A5] sm:px-26 px-6 sm:py-2 py-1 z-10 hover:cursor-pointer sm:text-3xl text-base hover:bg-[#0580A5] hover:text-white transition-colors">Show More &gt;&gt;</span>
                    <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                </Link>
            </div>
        </div>
    )
}

export default ComingSoonMobiles
