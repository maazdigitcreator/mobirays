import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' // Added useNavigate
import MobileImg from '../assets/mobileImg.jpg'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProductDetailPath } from '../utils/productRoutes'
const END_POINT = '/api/v1/products/phoneComingsoon';
const ComingSoonMobiles = ({ title, itemImage, endpoint = END_POINT}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(6);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${apiBaseUrl}${endpoint}`);
                const data = await response.json();
                if (data && data.data) {
                    const published = data.data.filter(p => {
                        const s = typeof p.status === 'object' ? String(p.status?.value || '') : String(p.status || '');
                        const statusStr = s.trim().toLowerCase();
                        return statusStr !== 'draft' && statusStr !== 'pending' && statusStr !== 'drafts';
                    });
                    setProducts(published);
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
            setIsMobile(width < 640);
            if (width >= 1024) {
                setItemsToShow(6);
                setIsDesktop(true);
            } else if (width >= 768) {
                setItemsToShow(4);
                setIsDesktop(false);
            } else {
                setItemsToShow(3);
                setIsDesktop(false);
            }
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
                    <h2 className="sm:text-2xl text-[18px]">{title}</h2>
                </div>
            </div>

            {/* Carousel Section - Parent should NOT have group class */}
            <div className="relative flex items-center px-4 sm:px-0">
                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className={`absolute sm:-left-4 left-0 z-10 p-1 rounded-full border border-[#0580A5] bg-white text-[#0580A5] hover:bg-[#0580A5] hover:text-white transition-colors hidden sm:flex ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Items Container */}
                <div className={`w-full sm:px-7 scrollbar-hide snap-x snap-mandatory ${isMobile ? 'overflow-x-auto' : 'overflow-hidden'}`}>
                    <div
                        className="flex sm:transition-transform sm:duration-300 sm:ease-out gap-4"
                        style={!isMobile ? { transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` } : {}}
                    >
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                to={getProductDetailPath(product)}
                                state={{
                                    product: {
                                        ...product,
                                        image: product.image || itemImage || MobileImg
                                    }
                                }}
                                className="w-[calc(100%/3-11px)] shrink-0 md:w-[calc(100%/4-12px)] lg:w-[calc(100%/6-14px)] flex flex-col group cursor-pointer mt-12 snap-center"
                            >
                                <div className="relative mb-3 flex justify-center items-center p-2 bg-blue-50/50 rounded-lg h-48 transition-transform group-hover:scale-105">
                                    {/* Coming Soon Badge */}
                                    <div className="absolute top-0 sm:-top-7 right-0 sm:right-6 z-10 scale-90 sm:scale-100">
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

                                    <div className="w-full h-full flex items-center justify-center">
                                        <img src={product.image || itemImage || MobileImg} alt={product.name} className="max-h-full object-contain" />
                                    </div>
                                </div>
                                <h3 className="text-sm text-gray-700 font-medium leading-tight group-hover:text-[#0580A5] text-center uppercase line-clamp-2 overflow-hidden px-2">
                                    {product.name}
                                </h3>
                            </Link>
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
