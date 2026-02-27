import React, { useState, useEffect } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import Sidebar4 from '../components/Layout/Sidebar4'
import LatestProducts from '../components/LatestProducts'
import Pagination from '../components/Pagination'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import ProductsSectionButton from '../components/ProductsSectionButton'
import homeBanner3 from '../assets/homeBanner3.png'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg'
import LatestNews from '../components/LatestNews'
import LatestReviews from '../components/LatestReviews'
import HeroBanner from '../components/Layout/HeroBanner'
import homeBannerSM2 from '../assets/homeBannerSM2.png'
import mobileImg from '../assets/mobileImg.jpg'
import MobileSpecsDetail from '../components/MobileSpecsDetail'
import SpecificationsTable from '../components/SpecificationsTable'
import cartIcon from '../assets/cartIcon.png'
import amazonLogo from '../assets/amazon.png'
import samsungLogo from '../assets/samsung.png'
import ebayLogo from '../assets/ebay.png'
import flipkartLogo from '../assets/flipkart.png'
import SidebarBrands from '../components/SidebarSections/SidebarBrands'
import SidebarFilters from '../components/SidebarSections/SidebarFilters'
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1'
import SidebarStats from '../components/SidebarSections/SidebarStats'
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2'
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels'
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3'
import RelatedReviews from '../components/SidebarSections/RelatedReviews'
import RelatedNews from '../components/SidebarSections/RelatedNews'

const MobileSpecs = () => {
    const { productSlug } = useParams();
    const location = useLocation();
    const { allProducts, allNews, allReviews, allBanners, loading: contextLoading } = useData();
    const [pageBanners, setPageBanners] = useState({});
    const [productData, setProductData] = useState(location.state?.product || null);

    // If product data is missing (e.g. on direct navigation/refresh), find it in allProducts
    useEffect(() => {
        if (!productData && allProducts.length > 0) {
            const found = allProducts.find(p => p.slug === productSlug);
            if (found) setProductData(found);
        }
    }, [allProducts, productSlug, productData]);

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['mobilespecifications_banner_1', 'mobilespecifications_banner_2', 'mobilespecifications_banner_3'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b?.image) map[loc] = b.image;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    // Define related news and reviews with unique names to avoid shadowing components
    const filteredRelatedNews = React.useMemo(() => {
        if (!productData?.name) return [];
        const pName = productData.name.toLowerCase().trim();
        return allNews.filter(n =>
            (n.is_products === 1 && n.products && n.products.toLowerCase().trim() === pName) ||
            (n.name && n.name.toLowerCase().includes(pName)) ||
            (n.title && n.title.toLowerCase().includes(pName))
        );
    }, [allNews, productData]);

    const filteredRelatedReviews = React.useMemo(() => {
        if (!productData?.name) return [];
        const pName = productData.name.toLowerCase().trim();
        return allReviews.filter(r =>
            (r.is_products === 1 && r.products && r.products.toLowerCase().trim() === pName) ||
            (r.name && r.name.toLowerCase().includes(pName)) ||
            (r.subtitle && r.subtitle.toLowerCase().includes(pName))
        );
    }, [allReviews, productData]);

    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-2'>
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">

                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <RelatedReviews productName={productData?.name} />
                        <RelatedNews productName={productData?.name} />
                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                            <SidebarBanner3 />
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">
                    {/* Mobile Specs Detail Component */}
                    <MobileSpecsDetail productData={productData} />

                    {/* Specifications Table */}
                    <div className="mt-4">
                        <SpecificationsTable productData={productData} />
                    </div>


                    {pageBanners['mobilespecifications_banner_1'] && <img className='mt-7 h-[200px] w-auto sm:w-full' src={pageBanners['mobilespecifications_banner_1']} alt="Mobile Specs Banner 1" />}


                    <div>
                        <div className="relative w-full flex items-end justify-center lg:justify-start mb-8 mt-3">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "10px",
                                    paddingRight: "60px"
                                }}
                            >
                                <img src={cartIcon} width={30} alt="" />
                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">Shop by</h2>
                            </div>
                        </div>


                        {/* Shop Section */}
                        <div className="mt-5 px-2 sm:px-4">
                            {/* Shop Data */}
                            {(() => {
                                // Use API data from productData.shopBy_links or fallback to empty array
                                const shopLinks = productData?.shopBy_links || [];

                                // Debug logging
                                console.log('MobileSpecs - Shop By Links:', shopLinks);
                                if (shopLinks.length > 0) {
                                    console.log('MobileSpecs - First shop link:', shopLinks[0]);
                                    console.log('MobileSpecs - Image URL:', `https://mobirays.voucherndeals.com/storage/${shopLinks[0].image}`);
                                }

                                // If no API data, show message
                                if (shopLinks.length === 0) {
                                    return (
                                        <div className="text-center py-10">
                                            <p className="text-gray-500">No shopping links available</p>
                                        </div>
                                    );
                                }

                                const leftColumn = shopLinks.slice(0, 3);
                                const rightColumn = shopLinks.slice(3, 6);

                                return (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 max-w-5xl mx-auto">
                                        {/* Left Column */}
                                        <div className="space-y-3">
                                            {leftColumn.map((item, index) => (
                                                <div key={index} className="flex items-stretch justify-center lg:justify-end gap-2">
                                                    <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center">
                                                        <span className="font-semibold text-black">${item.price}</span>
                                                    </div>
                                                    <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                                        <img
                                                            src={item.image}
                                                            alt="Store logo"
                                                            className="h-6 object-contain"
                                                        />
                                                    </div>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-[#0580A5] text-white px-6 py-2 hover:bg-[#046a8a] transition-colors cursor-pointer text-sm rounded-r-full flex items-center justify-center"
                                                    >
                                                        GO TO BUYING
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-3">
                                            {rightColumn.map((item, index) => (
                                                <div key={index} className="flex items-stretch gap-2 justify-start lg:justify-start">
                                                    <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center">
                                                        <span className="font-semibold text-gray-800">${item.price}</span>
                                                    </div>
                                                    <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                                        <img
                                                            src={item.image}
                                                            alt="Store logo"
                                                            className="h-6 object-contain"
                                                        />
                                                    </div>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-[#0580A5] text-white px-6 py-2 hover:bg-[#046a8a] transition-colors cursor-pointer text-sm rounded-r-full flex items-center justify-center"
                                                    >
                                                        GO TO BUYING
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Disclaimer Text */}
                            <div className="mt-6 text-center max-w-4xl mx-auto">
                                <p className="text-sm font-medium text-black leading-relaxed  text-[17px]">
                                    <span className="font-semibold">Disclaimer.</span> Samsung Galaxy Note 20 price in Pakistan is updated daily from the price list provided by local shops and dealers but we can not guarantee that the information/price/Samsung Galaxy Note 20 Prices on this page is 100% correct (Human error is possible), always visit your local shop for exact cell phone cost & rate. Samsung Galaxy Note 20 price Pakistan.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div className="relative w-full flex items-start justify-between lg:justify-between mb-5 mt-3">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "10px",
                                    paddingRight: "60px"
                                }}
                            >
                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">User Reviews</h2>
                            </div>
                            <div>
                                <Link to="/reviews" className='text-[#0060FF] text-xl underline cursor-pointer '>Read All User Reviews</Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-4">
                            {/* Box 1: Overall Rating */}
                            <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-evenly">
                                <h3 className="text-lg font-semibold mb-2 text-black">OVERALL RATING</h3>
                                <div className="text-6xl font-bold text-black">
                                    4.3<span className="text-4xl">/5</span>
                                </div>
                                <p className="text-base text-black mt-2 text-sm">BASED ON 7,373 RATING(S)</p>
                            </div>

                            {/* Box 2: Rating Breakdown */}
                            <div className="border-2 border-[#0580A5] p-6">
                                <h3 className="text-lg font-semibold mb-4 text-black text-center">OVERALL RATING</h3>
                                <div className="space-y-2 text-black">
                                    {/* 5 stars */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-14">5 stars</span>
                                        <div className="flex-1 bg-gray-200 h-4 ">
                                            <div className="bg-[#0580A5] h-4 " style={{ width: '70%' }}></div>
                                        </div>
                                        <span className="text-sm w-12 text-right">4,645</span>
                                    </div>
                                    {/* 4 stars */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-14">4 stars</span>
                                        <div className="flex-1 bg-gray-200 h-4 ">
                                            <div className="bg-[#0580A5] h-4 " style={{ width: '25%' }}></div>
                                        </div>
                                        <span className="text-sm w-12 text-right">1,777</span>
                                    </div>
                                    {/* 3 stars */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-14">3 stars</span>
                                        <div className="flex-1 bg-gray-200 h-4 ">
                                            <div className="bg-[#0580A5] h-4 " style={{ width: '7%' }}></div>
                                        </div>
                                        <span className="text-sm w-12 text-right">485</span>
                                    </div>
                                    {/* 2 stars */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-14">2 stars</span>
                                        <div className="flex-1 bg-gray-200 h-4 ">
                                            <div className="bg-[#0580A5] h-4 " style={{ width: '3%' }}></div>
                                        </div>
                                        <span className="text-sm w-12 text-right">183</span>
                                    </div>
                                    {/* 1 star */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-14">1 star</span>
                                        <div className="flex-1 bg-gray-200 h-4 ">
                                            <div className="bg-[#0580A5] h-4 " style={{ width: '7%' }}></div>
                                        </div>
                                        <span className="text-sm w-12 text-right">477</span>
                                    </div>
                                </div>
                                <p className="text-xs text-center mt-4 text-black">2,492 USER REVIEW(S)</p>
                            </div>

                            {/* Box 3: Share Your Thoughts */}
                            <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-start gap-10">
                                <h3 className="text-lg font-semibold mb-6 text-black">SHARE YOUR THOUGHTS</h3>
                                <button className="bg-[#0580A5] text-white px-8 py-3 hover:bg-[#046a8a] transition-colors  text-sm cursor-pointer">
                                    WRITE A REVIEW
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="relative w-full flex items-end justify-center lg:justify-start mb-5 mt-6">
                            {/* Horizontal Line Background */}
                            <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                            {/* Title Box */}
                            <div
                                className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10"
                                style={{
                                    clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                    paddingLeft: "0px",
                                    paddingRight: "60px"
                                }}
                            >

                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">{productData?.name || "Mobile"} Price Discussions, Opinions and Reviews</h2>
                            </div>
                        </div>



                        <div className="space-y-3 px-2 sm:px-0">
                            {/* Review Cards - Array Mapping */}
                            {(() => {
                                const reviewsData = [
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    },
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    },
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    },
                                    {
                                        title: productData?.name || "Mobile",
                                        author: "John Doe ( 9 July 20) on Amazon",
                                        date: "2 days ago",
                                        rating: 5,
                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                    }
                                ];

                                return reviewsData.map((review, index) => (
                                    <div key={index} className="border-2 border-[#0580A5] px-4 py-2">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-2xl">{review.title}</h3>
                                            <div className="flex flex-col items-end gap-0">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <span key={i} className="text-yellow-400 text-xl">★</span>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-black">{review.date}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-black font-bold mb-2">{review.author}</p>
                                        <p className="text-sm text-black leading-tight mb-3">
                                            {review.text}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm pb-1">
                                            <span className="text-black font-semibold text-sm">Is this review helpful?</span>
                                            <button className="text-[#0580A5] hover:underline flex items-center gap-1 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                ));
                            })()}

                            {/* Add Review Form */}
                            <div className="border-2 border-[#0580A5] bg-gray-50 p-2 mt-2">
                                {/* Title and Stars Row */}
                                <div className="flex items-center gap-4 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Add Title"
                                        className="border-1 px-3 py-1 focus:outline-none bg-white border-[#0580A5] flex-shrink-0 placeholder-black text-black placeholder:font-semibold placeholder:text-lg"
                                        style={{ width: '300px' }}
                                    />
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-[#0580A5] text-xl cursor-pointer hover:text-yellow-400">☆</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment Section */}
                                <div className="mb-1">

                                    <textarea
                                        className="w-full border-1  p-3 focus:outline-none border-[#0580A5] bg-white text-black placeholder-black"
                                        rows="3"
                                        placeholder="Content"
                                    ></textarea>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3">
                                    <button className="bg-[#0580A5] text-white px-8 py-2 hover:bg-[#046a8a] transition-colors font-medium cursor-pointer">
                                        Submit
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-end items-center mt-2">
                                <Link to="/reviews" className="flex items-center justify-center border-2 border-[#0580A5] text-black px-6 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors text-base cursor-pointer">
                                    Read All Reviews&gt;&gt;
                                </Link>
                                <button className="border-2 border-[#0580A5] text-black px-6 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors  text-base cursor-pointer ">
                                    Post a Suggestion&gt;&gt;
                                </button>
                            </div>
                        </div>
                    </div>

                    {pageBanners['mobilespecifications_banner_2'] && <img className='mt-7 h-[200px] w-auto sm:w-full' src={pageBanners['mobilespecifications_banner_2']} alt="Mobile Specs Banner 2" />}



                    <div className='mt-10'>
                        <LatestNews
                            title="Related News"
                            gridCols="sm:grid-cols-2"
                            titleAlign="start"
                            clipPath="polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)"
                            paddingLeft="0px"
                            paddingRight="60px"
                            limit={4}
                            newsData={filteredRelatedNews}
                            emptyMessage="This product has no related news yet."
                        />
                    </div>
                    <div className='mt-10'>
                        <LatestReviews
                            title="Related Reviews"
                            gridCols="sm:grid-cols-3"
                            titleAlign="start"
                            clipPath="polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)"
                            paddingLeft="0px"
                            paddingRight="60px"
                            limit={6}
                            reviewsData={filteredRelatedReviews}
                            emptyMessage="This product has no reviews yet."
                        />
                    </div>




                </div>
            </div>


            {pageBanners['mobilespecifications_banner_3'] && <img className='mt-7 w-auto sm:w-full h-[200px] sm:h-auto' src={pageBanners['mobilespecifications_banner_3']} alt="Mobile Specs Banner 3" />}

            <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />

        </div>
    )
}

export default MobileSpecs