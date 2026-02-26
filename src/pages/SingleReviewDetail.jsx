import Sidebar4 from '../components/Layout/Sidebar4'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg'
import SubNewsBanner from '../components/SubNewsBanner'
import contactBanner from '../assets/contactBanner.png'
import subNewsImg1 from '../assets/subNewsImg1.webp'
import subNewsImg2 from '../assets/subNewsImg2.webp'
import subNewsImg3 from '../assets/subNewsImg3.webp'
import homeBanner3 from '../assets/homeBanner3.png'
import LatestNews from '../components/LatestNews'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import mobileImg from '../assets/mobileImg.jpg'
import cartIcon from '../assets/cartIcon.png'
import amazonLogo from '../assets/amazon.png'
import samsungLogo from '../assets/samsung.png'
import ebayLogo from '../assets/ebay.png'
import flipkartLogo from '../assets/flipkart.png'
import { Link, useLocation } from 'react-router-dom'
import LatestReviews from '../components/LatestReviews'
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import RelatedReviews from '../components/SidebarSections/RelatedReviews';
import RelatedNews from '../components/SidebarSections/RelatedNews';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';


const SingleReviewDetail = () => {
    const location = useLocation();
    const reviewData = location.state?.reviewData;

    // Use API data or fallback
    const title = reviewData?.name || "Review Article: Comprehensive Analysis";
    const image = reviewData?.image || contactBanner;
    const description = reviewData?.description || "No description available.";
    const date = reviewData?.updated_at ? new Date(reviewData.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }) : "06-Sep-2025";

    const { allBanners } = useData();
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['subreviews_banner_1', 'subreviews_banner_2'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b?.image) map[loc] = b.image;
            });
            setPageBanners(map);
        }
    }, [allBanners]);


    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-2'>
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <RelatedReviews />
                        <RelatedNews />
                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">
                    <SubNewsBanner heading={`Review | ${title}`} bannerImage={image} date={date} commentsCount={60} />
                    {/* Content */}
                    <div>
                        <div>

                            <div>
                                <div className="bg-gradient-to-r from-[#1fa3b8] via-[#8fd0de] to-white p-3">
                                    <h1 className="text-3xl text-black">
                                        {title}
                                    </h1>
                                </div>

                                {/* Dynamic Description */}
                                {/* <div className="my-4 px-4 text-2xl text-black space-y-4" dangerouslySetInnerHTML={{ __html: description }} /> */}

                                {/* Video Section */}
                                {reviewData?.video_url && (() => {
                                    const getYouTubeId = (url) => {
                                        if (!url) return null;
                                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                        const match = url.match(regExp);
                                        return (match && match[2].length === 11) ? match[2] : null;
                                    };
                                    const videoId = getYouTubeId(reviewData.video_url);

                                    return videoId ? (
                                        <div className="w-full mt-4 mb-6">
                                            <div className="relative pt-[56.25%] w-full">
                                                <iframe
                                                    className="absolute top-0 left-0 w-full h-full"
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    title="Review Video"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                    ) : null;
                                })()}

                                {/* Description content (moved here if it was commented out, or just ensure flow) */}
                                <div className="my-4 px-4 text-2xl text-black space-y-4" dangerouslySetInnerHTML={{ __html: description }} />

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
                                            const apiBase = 'https://mobirays.voucherndeals.com';
                                            const shopData = reviewData?.product_links || [];

                                            const getImageUrl = (img) => {
                                                if (!img) return '';
                                                if (img.startsWith('http')) return img;
                                                return `${apiBase}/storage/${img}`;
                                            };

                                            // Determine split point (halfway)
                                            const midPoint = Math.ceil(shopData.length / 2);
                                            const leftColumn = shopData.slice(0, midPoint);
                                            const rightColumn = shopData.slice(midPoint);

                                            if (shopData.length === 0) {
                                                return <div className="text-center text-gray-500 my-4">No shop links available.</div>;
                                            }

                                            return (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 max-w-5xl mx-auto">
                                                    {/* Left Column */}
                                                    <div className="space-y-3">
                                                        {leftColumn.map((item, index) => (
                                                            <div key={index} className="flex items-stretch justify-center lg:justify-end gap-2">
                                                                <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center min-w-[100px]">
                                                                    <span className="font-semibold text-black">{item.price ? `$${item.price}` : 'N/A'}</span>
                                                                </div>
                                                                <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                                                    <img src={getImageUrl(item.image || item.logo)} alt={item.name || "Shop"} className="h-8 object-contain" />
                                                                </div>
                                                                <a
                                                                    href={item.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-[#0580A5] text-white px-6 py-2 hover:bg-[#046a8a] transition-colors cursor-pointer text-sm rounded-r-full flex items-center"
                                                                >
                                                                    GO TO BUYING
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Right Column */}
                                                    <div className="space-y-3">
                                                        {rightColumn.map((item, index) => (
                                                            <div key={index} className="flex items-stretch gap-2 justify-center lg:justify-start">
                                                                <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center min-w-[100px]">
                                                                    <span className="font-semibold text-gray-800">{item.price ? `$${item.price}` : 'N/A'}</span>
                                                                </div>
                                                                <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                                                    <img src={getImageUrl(item.image || item.logo)} alt={item.name || "Shop"} className="h-8 object-contain" />
                                                                </div>
                                                                <a
                                                                    href={item.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-[#0580A5] text-white px-6 py-2 hover:bg-[#046a8a] transition-colors cursor-pointer text-sm rounded-r-full flex items-center"
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
                                            <p className="text-sm text-black leading-relaxed font-medium text-[17px]">
                                                <span className="font-semibold">Disclaimer.</span> Prices are updated daily from local shops and dealers but we cannot guarantee 100% accuracy. Always visit your local shop for exact rates.
                                            </p>
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
                                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-2">User Reviews</h2>
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
                                                    8.6<span className="text-4xl">/10</span>
                                                </div>
                                                <p className="text-base text-black mt-2 text-sm">BASED ON 2,492 USER REVIEWS</p>
                                            </div>

                                            {/* Box 2: Rating Breakdown - Keeping dummy for now as API doesn't provide breakdown */}
                                            <div className="border-2 border-[#0580A5] p-6">
                                                <h3 className="text-lg font-semibold mb-4 text-black text-center">RATING BREAKDOWN</h3>
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


                                </div>

                                <div className="my-4 px-4 text-2xl text-black space-y-4" dangerouslySetInnerHTML={{ __html: description }} />

                                {/* <div className="">
                                    <img src={subNewsImg1} alt="Phone" className="" width={1003} height={827} />
                                    <p className="my-7 px-4 text-2xl">
                                        The Samsung Galaxy M31 Prime has the same high-res 64MP main camera with a big f1.8 aperture, a 5MP macro and
                                        depth duo, and a true 8MP ultra-wide-angle 123° lens. The front camera is 32MP, supports 4K video, slo-mo, and
                                        AR features.
                                    </p>
                                </div> */}

                                {/* <div className="">
                                    <img src={subNewsImg2} alt="Phone" className="" width={1003} height={825} />
                                    <p className="my-7 px-4 text-2xl">
                                        This Samsung A31 prime setup is arranged in an identical boxy camera plate, next to a capacitive fingerprint
                                        scanner on a plastic back. On the front, we find a teardrop notch carved into the display surrounded in minimal
                                        bezels all around - in typical M-series fashion, all in all, a nice addition to the Samsung price list.

                                    </p>
                                </div> */}

                                {/* <div className="">
                                    <img src={subNewsImg3} alt="Phone" className="" width={1003} height={826} />
                                    <p className="my-7 px-4 text-2xl">
                                        It's a similar story with the internal hardware. Samsung's Exynos 9611 processor is at the heart of the Galaxy
                                        M31 Prime, coupled with 128GB/64GB of storage and 6GB of memory (unlike the base version that also has an 8GB
                                        variant). A high-capacity 6000 mAh battery powers the phone, with support for 15W fast charging over USB Type-C.
                                    </p>
                                </div> */}
                                {/* <a href="" className="block mx-4 text-center mt-5 border-b border-blue-500 text-blue-600 ">
                                    <div className="py-3 px-4">
                                        <div className="text-2xl tracking-[0.35em] text-black uppercase">
                                            Click Here To See
                                        </div>
                                        <div className="text-sm sm:text-2xl font-medium text-[#0060FF]">
                                            Samsung Galaxy M31 Prime Price in Pakistan & Specs
                                        </div>
                                    </div>

                                </a> */}
                                {/* <div>
                                    <p className="my-7 px-4 text-2xl">
                                        An official launch date hasn't been announced yet, but the Samsung Galaxy M31 Prime might make its debut in India before October ends. That being said, it remains to be seen why Samsung is introducing two phones identical phones in the same market under different names.
                                    </p>
                                </div> */}
                                {pageBanners['subreviews_banner_1'] && (
                                    <div className="md:col-span-3 mb-6 overflow-hidden">
                                        <img className='mt-7 w-auto sm:w-full h-[200px] sm:h-auto' src={pageBanners['subreviews_banner_1']} alt="" />
                                    </div>
                                )}


                                <div>
                                    <div>
                                        <div className="relative w-full flex items-end justify-center lg:justify-start mb-5 mt-10">
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

                                                <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">User Discussions</h2>
                                            </div>
                                        </div>

                                        <div className="space-y-3 px-2 sm:px-0">
                                            {/* Review Cards - Array Mapping */}
                                            {/* 
                                              Keeping dummy user comments for now as the API currently fetches "reviews" (which look like articles/news) 
                                              and not "user comments" on those reviews. 
                                              If the API `allReviews` returns `data` that IS comments, then I should map that. 
                                              But based on the sample, `allReviews` returns articles with `description`. 
                                              The "User Reviews" section usually means comments on the article. 
                                              I will assume these are comments on the article, but I don't have an API for *comments on a review*.
                                              So I will keep the dummy comments structure but maybe comment out or just leave as is.
                                            */}
                                            {(() => {
                                                const reviewsData = [
                                                    {
                                                        title: "Great Phone!",
                                                        author: "John Doe ( 9 July 20) on Amazon",
                                                        date: "2 days ago",
                                                        rating: 5,
                                                        text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues."
                                                    },
                                                    {
                                                        title: "Value for Money",
                                                        author: "Jane Smith ( 10 July 20) on Flipkart",
                                                        date: "3 days ago",
                                                        rating: 4,
                                                        text: "Good features for the price point. Battery life is amazing."
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
                                </div>


                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {pageBanners['subreviews_banner_2'] && (
                <div className="md:col-span-3 mb-6 overflow-hidden">
                    <img className='mt-7 w-auto sm:w-full h-[200px] sm:h-auto' src={pageBanners['subreviews_banner_2']} alt="" />
                </div>
            )}
            <div className='mt-10'>
                <LatestReviews title="Latest Reviews" gridCols="sm:grid-cols-4" limit={8} />
            </div>
        </div>
    )
}

export default SingleReviewDetail
