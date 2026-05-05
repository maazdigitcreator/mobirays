import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Watch, Headphones, Camera, Gamepad2, Plug, Home, Paperclip, Wifi, Cpu, Monitor, HardDrive, Settings, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { FaRegCommentDots } from 'react-icons/fa';
import mobileBrandLogo from '../../assets/mobileBrandLogo.webp';
import sidebarBanner1 from '../../assets/sidebarBanner1.png';
import sidebarBanner2 from '../../assets/sidebarBanner2.jpg';
import sidebarBanner3 from '../../assets/sidebarBanner3.jpg';
import Banner1 from '../../assets/homeBannerSM1.png';
import Banner2 from '../../assets/homeBannerSM2.png';
import SingleReview from '../SingleReview';
import SingleNews from '../SingleNews';
import LatestNewsImg from '../../assets/LatestNewsImg.png';
import mobileImg from '../../assets/mobileImg.jpg';

const Sidebar4 = ({ bottomImage }) => {
    const [news, setNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const brands = [
        "Samsung", "Oppo", "Vivo", "Infinix",
        "Apple", "Xiaomi", "Huawei", "Tecno",
        "Itel", "QMobile", "VGOTEL", "Nokia",
        "Motorola", "Sony", "Realme", "GFive"
    ];

    // Hover State
    const [openSections, setOpenSections] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});

    // Fetch news data
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/posts`);
                const data = await response.json();
                if (data && data.data) {
                    setNews(data.data.slice(0, 4)); // Get first 4 news items
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoadingNews(false);
            }
        };

        fetchNews();
    }, []);

    const toggleSection = (sectionId) => {
        setOpenSections(sectionId ? { [sectionId]: true } : {});
    };

    const toggleFilter = (categoryId, groupTitle, option) => {
        const selectionId = `${categoryId}-${groupTitle}`;
        setSelectedFilters(prev => {
            const categoryFilters = prev[selectionId] || [];
            if (categoryFilters.includes(option)) {
                return {
                    ...prev,
                    [selectionId]: categoryFilters.filter(item => item !== option)
                };
            } else {
                return {
                    ...prev,
                    [selectionId]: [...categoryFilters, option]
                };
            }
        });
    };

    const resetFilters = () => {
        setSelectedFilters({});
    };

    const handleApplyFilters = () => {
        // You can add logic here to filter data
    };

    const ramOptions = ['2GB', '3GB', '4GB', '6GB', '8GB', '12 GB', '16GB', '32GB'];
    const storageOptions = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
    const networkOptions = ['2G', '3G', '4G', '5G'];
    const screenOptions = ['AMOLED', 'OLED', 'Super AMOLED', 'IPS LCD', 'LTPO', 'Retina'];
    const cameraOptions = ['8MP', '12MP', '16MP', '32MP', '48MP', '50MP', '64MP', '108MP'];
    const osOptions = ['Android', 'iOS', 'HarmonyOS', 'Windows'];
    const priceOptions = ['Under 20k', '20k-40k', '40k-60k', '60k-100k', 'Above 100k'];

    const renderFilterContent = (categoryId, options) => (
        <div className="p-1 bg-[#EDF6F9] flex flex-col gap-2">
            {[
                { title: 'Phones', opts: options },
                { title: 'Tabs', opts: options },
                { title: 'Watches', opts: options }
            ].map((group, idx) => (
                <div key={idx} className="overflow-hidden">
                    <div className="relative flex items-end">
                        {/* Horizontal Support Line */}
                        <div className="absolute bottom-0 left-0 w-full h-[8px] bg-[#0580A5]"></div>
                        {/* Clipped Header Box */}
                        <div
                            className="border border-[#0580A5] bg-[#0580A5] text-white text-[13px] font-semibold px-2 pr-7 py-0.5 w-fit relative z-10"
                            style={{ clipPath: 'polygon(0% 0%, calc(100% - 25px) 0%, 100% 100%, 0% 100%)' }}
                        >
                            {group.title}
                        </div>
                    </div>
                    <div className="border border-[#0580A5] px-3 py-3 flex flex-wrap gap-x-2 gap-y-1">
                        {group.opts.map((opt, i) => {
                            const selectionId = `${categoryId}-${group.title}`;
                            const isSelected = selectedFilters[selectionId]?.includes(opt);
                            return (
                                <span
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFilter(categoryId, group.title, opt);
                                    }}
                                    className={`text-md cursor-pointer font-normal whitespace-nowrap px-2 py-0.5 rounded transition-colors ${isSelected
                                        ? 'bg-[#0580A5] text-white'
                                        : 'text-black hover:text-white hover:bg-[#0580A5]'
                                        }`}
                                >
                                    {opt}
                                </span>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    const filters = [
        { id: 'network', label: 'Search by Network', icon: <Wifi size={20} />, content: renderFilterContent('network', networkOptions) },
        { id: 'ram', label: 'Search by RAM', icon: <Cpu size={20} />, content: renderFilterContent('ram', ramOptions) },
        { id: 'screen', label: 'Search by Screen', icon: <Monitor size={20} />, content: renderFilterContent('screen', screenOptions) },
        { id: 'camera', label: 'Search by Camera', icon: <Camera size={20} />, content: renderFilterContent('camera', cameraOptions) },
        { id: 'storage', label: 'Search by Storage', icon: <HardDrive size={20} />, content: renderFilterContent('storage', storageOptions) },
        { id: 'os', label: 'Search by OS', icon: <Settings size={20} />, content: renderFilterContent('os', osOptions) },
        { id: 'price', label: 'Search by Price', icon: <DollarSign size={20} />, content: renderFilterContent('price', priceOptions) },
    ];

    const totalSelected = Object.values(selectedFilters).flat().length;

    return (
        <div className="flex flex-col gap-2">

            {/* Search by Brands Section */}
            <div className="text-center overflow-hidden">
                <div className="bg-[#0580A5] text-white px-4 py-3 text-2xl text-start">
                    Search by Brands
                </div>
                <div className="p-0 mt-3 mb-3">
                    <div className="grid grid-cols-4 sm:gap-[10px] gap-1">
                        {brands.map((brand, idx) => (
                            <div key={idx} className="bg-white hover:bg-[#0580A533] transition-colors duration-300 ease-in-out aspect-square flex items-center justify-center p-1 hover:shadow-inner cursor-pointer border border-[#0580A5]">
                                {/* Dummy Image */}
                                <img
                                    src={mobileBrandLogo}
                                    alt={brand}
                                    className="w-full h-auto object-contain p-1"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-5">
                    <Link to="/all-brands" className="w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                        <span className="bg-white border-2 rounded-full border-[#0580A5] px-10 py-2 z-10 hover:cursor-pointer">Show All Brands</span>
                        <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                    </Link>
                </div>
            </div>

            {/* Search Filters Section */}
            <div className="flex flex-col gap-1">
                {filters.map((filter) => (
                    <div
                        key={filter.id}
                        className="w-full group"
                        onMouseEnter={() => {
                            if (window.innerWidth >= 768) toggleSection(filter.id);
                        }}
                        onMouseLeave={() => {
                            if (window.innerWidth >= 768) toggleSection(null);
                        }}
                        onClick={() => {
                            if (window.innerWidth < 768) {
                                toggleSection(openSections[filter.id] ? null : filter.id);
                            }
                        }}
                    >
                        <button
                            className={`w-full flex hover:cursor-pointer items-center justify-between px-4 py-3 text-white transition-colors bg-[#0580A5] border-b border-[#0891b2]/30 hover:bg-[#0891b2]`}
                        >
                            <div className="flex items-center gap-3 ">
                                {filter.icon}
                                <span className="font-medium text-lg">{filter.label}</span>
                                {(() => {
                                    const groupCount = ['Phones', 'Tabs', 'Watches'].reduce((sum, title) => {
                                        return sum + (selectedFilters[`${filter.id}-${title}`]?.length || 0);
                                    }, 0);
                                    return groupCount > 0 ? (
                                        <span className="bg-white text-[#0580A5] text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                                            {groupCount}
                                        </span>
                                    ) : null;
                                })()}
                            </div>
                            <ChevronDown
                                size={20}
                                className={`transform transition-transform duration-500 ${openSections[filter.id] ? 'rotate-180' : 'rotate-0'}`}
                            />
                        </button>

                        {/* Expanded Content with Smooth Animation */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections[filter.id]
                                ? 'max-h-[1000px] opacity-100'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            {filter.content}
                        </div>
                    </div>
                ))}

                {/* Filter Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                        onClick={handleApplyFilters}
                        className="hover:cursor-pointer bg-[#0580A5] text-white font-medium py-3 hover:bg-[#0891b2] transition-colors flex items-center justify-center gap-2"
                    >
                        Apply Filters {totalSelected > 0 && `(${totalSelected})`}
                    </button>
                    <button
                        onClick={resetFilters}
                        className="hover:cursor-pointer bg-[#0580A5] text-white font-medium py-3 hover:bg-[#0891b2] transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div>
                <img className='w-full' src={sidebarBanner1} alt="" />
            </div>
            <div>
                <div className="bg-[#0580A5] text-white px-4 py-3 text-2xl text-start">
                    Related Reviews
                </div>
                <div>
                    <div className='grid grid-cols-2 gap-2 mt-2'>
                        <Link to="/review/samsung-galaxy-s21-review">
                            <SingleReview customHeight="h-[25vh]" />
                        </Link>
                        <Link to="/review/iphone-13-pro-review">
                            <SingleReview customHeight="h-[25vh]" />
                        </Link>
                        <Link to="/review/xiaomi-mi-11-review">
                            <SingleReview customHeight="h-[25vh]" />
                        </Link>
                        <Link to="/review/oneplus-9-pro-review">
                            <SingleReview customHeight="h-[25vh]" />
                        </Link>
                    </div>
                    <button className="mt-2 mb-3 w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                        <span className="bg-white border-2 rounded-full border-[#0580A5] sm:px-14 px-6 sm:py-2 py-1 z-10 hover:cursor-pointer sm:text-2xl text-base">Show More &gt;&gt;</span>
                        <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                    </button>
                </div>
            </div>
            <div>
                <div className="bg-[#0580A5] text-white px-4 py-3 text-2xl text-start">
                    Related News
                </div>
                <div>
                    {loadingNews ? (
                        <div className="text-center py-4">Loading news...</div>
                    ) : (
                        <div className='flex flex-col gap-4 mt-2'>
                            {news.map((newsItem) => (
                                <Link key={newsItem.id} to={`/news/${newsItem.slug}`} state={{ newsData: newsItem }}>
                                    <div className="grid grid-cols-12   justify-between items-start group cursor-pointer">
                                        <div className="col-span-8 h-full flex flex-col justify-between">
                                            <h3 className="text-black font-semibold text-base leading-snug mb-2 group-hover:text-[#0580A5] transition-colors line-clamp-3">
                                                {newsItem.name}
                                            </h3>
                                            <div className="flex text-[#1E1E1E] flex-wrap items-center gap-5 text-[10px]">
                                                <span>{new Date(newsItem.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}, by Noor</span>
                                                <div className="flex items-center gap-1">
                                                    <span className='pr-1'>Comments</span>
                                                    <FaRegCommentDots className="text-xs " />
                                                    <span>12</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-4 flex-shrink-0 overflow-hidden bg-gray-100">
                                            <img
                                                src={newsItem.image || LatestNewsImg}
                                                alt="news"
                                                className="w-full h-full object-cover mix-blend-multiply"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <button className="mt-2 mb-3 w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                        <span className="bg-white border-2 rounded-full border-[#0580A5] sm:px-14 px-6 sm:py-2 py-1 z-10 hover:cursor-pointer sm:text-2xl text-base">Show More &gt;&gt;</span>
                        <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                    </button>
                </div>
            </div>

            {/* Stats Sections */}
            <div className="flex flex-col gap-6">
                {/* Devices | Visitors */}
                <div>
                    <div className="bg-[#0580A5] text-white px-4 py-2 flex justify-between items-center text-lg">
                        <span>Devices</span>
                        <div className="h-4 w-[1px] bg-white/50 mx-2"></div>
                        <span>Visitors</span>
                    </div>
                    <div className="text-sm">
                        {Array(8).fill({ name: "Xiaomi Poco X3", count: "64,853" }).map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center px-4 py-2 ${idx % 2 === 0 ? 'bg-[#67afc5]' : 'bg-white'}`}>
                                <div className="flex gap-2">
                                    <span className="text-gray-600">1.</span>
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-600">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Devices | Likes */}
                <div>
                    <div className="bg-[#0580A5] text-white px-4 py-2 flex justify-between items-center text-lg">
                        <span>Devices</span>
                        <div className="h-4 w-[1px] bg-white/50 mx-2"></div>
                        <span>Likes</span>
                    </div>
                    <div className="text-sm">
                        {Array(8).fill({ name: "Xiaomi Poco X3", count: "64,853" }).map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center px-4 py-2 ${idx % 2 === 0 ? 'bg-[#67afc5]' : 'bg-white'}`}>
                                <div className="flex gap-2">
                                    <span className="text-gray-600">1.</span>
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-600">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <img className='w-full' src={sidebarBanner2} alt="" />
                </div>

                {/* Devices | Likes */}
                <div>
                    <div className="bg-[#0580A5] text-white px-4 py-2 flex justify-between items-center text-lg">
                        <span>Latest Mobile Phone Models</span>

                    </div>
                    <div className="text-sm">
                        {Array(8).fill({ name: "Xiaomi Poco X3", count: "64,853" }).map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center px-4 py-2 ${idx % 2 === 0 ? 'bg-[#67afc5]' : 'bg-white'}`}>
                                <div className="flex gap-2">
                                    <span className="text-gray-600">1.</span>
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                </div>
                                {/* <span className="text-gray-600">{item.count}</span> */}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="bg-[#0580A5] text-white px-4 py-3 text-2xl text-start">
                        Related Mobiles
                    </div>
                    <div>
                        <div className='grid grid-cols-3 gap-2 mt-2'>
                            {Array(9).fill({
                                name: "XIAOMI POCO F2 PRO...",
                                image: mobileImg
                            }).map((mobile, index) => (
                                <div key={index} className="cursor-pointer group">
                                    <div className="p-2">
                                        <div className="w-full aspect-[3/4] overflow-hidden bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={mobile.image}
                                                alt={mobile.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <h3 className="text-black  text-sm mt-2 line-clamp-2">
                                            {mobile.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-2 mb-3 w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                            <span className="bg-white border-2 rounded-full border-[#0580A5] sm:px-14 px-6 sm:py-2 py-1 z-10 hover:cursor-pointer sm:text-2xl text-base">Show More &gt;&gt;</span>
                            <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                        </button>
                    </div>
                </div>



                <div>

                    <img className='w-full' src={sidebarBanner1} alt="" />
                </div>

            </div>
        </div>
    );
};

export default Sidebar4;
