import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext';
import Sidebar4 from '../components/Layout/Sidebar4'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg'
import SubNewsBanner from '../components/SubNewsBanner'
import contactBanner from '../assets/contactBanner.png'
import LatestNews from '../components/LatestNews'
import ComingSoonMobiles from '../components/ComingSoonMobiles'
import mobileImg from '../assets/mobileImg.jpg'
import { useLocation, Link, useParams } from 'react-router-dom'
import { Link as LucideLink } from 'lucide-react'
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import RelatedReviews from '../components/SidebarSections/RelatedReviews';
import RelatedNews from '../components/SidebarSections/RelatedNews';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import BannerAd from '../components/BannerAd';
import homeBanner3 from '../assets/homeBanner3.png';
import homeBannerSM3 from '../assets/homeBannerSM3.png';

const SingleNewsDetail = () => {
    const { newsSlug } = useParams();
    const location = useLocation();
    const { allBanners, allNews } = useData();
    const [newsData, setNewsData] = useState(location.state?.newsData || null);
    const [pageBanners, setPageBanners] = useState({});
    const subNewsBannerFallback = {
        title: 'Sub News Banner',
        image: homeBanner3,
    };
    const subNewsBannerMobileFallback = {
        title: 'Sub News Banner Mobile',
        image: homeBannerSM3,
    };

    // Sync newsData with URL slug
    useEffect(() => {
        if (location.state?.newsData && location.state.newsData.slug === newsSlug) {
            setNewsData(location.state.newsData);
        } else if (allNews.length > 0) {
            const found = allNews.find(n => n.slug === newsSlug);
            if (found) setNewsData(found);
        }
    }, [allNews, newsSlug, location.state]);

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['subnews_banner_1', 'subnews_banner_2', 'subnews_banner_3'].forEach(loc => {
                const b = allBanners.find(b => b.location === loc);
                if (b) map[loc] = b;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    // Format date if newsData exists
    const formattedDate = newsData ? new Date(newsData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }) : '';
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
                    <SubNewsBanner
                        heading={newsData ? `News | ${newsData.name}` : "News | Samsung Galaxy"}
                        bannerImage={newsData?.image || contactBanner}
                        date={formattedDate || "06-Sep-2025"}
                        commentsCount={60}
                    />
                    {/* Content will be added here dynamically */}
                    <div>
                        <div>

                            <div>
                                <div className="bg-gradient-to-r from-[#1fa3b8] via-[#8fd0de] to-white p-3">
                                    <h1 className="text-3xl text-black">
                                        {newsData?.name || "Galaxy S20 FE (Fan Edition) Review, The price champion"}
                                    </h1>
                                </div>

                                <p className="my-3 text-2xl px-4 pt-2">
                                    {newsData?.description || "Just a day after the One UI 3.0 beta for the original Galaxy $20 trio went public in South Korea, Samsung started rolling it out to users in the US as well. Soon, the update should also reach Europe (Germany, Poland, the UK), India and China."}
                                </p>
                                {/* <p className="my-3 text-2xl px-4">
                                    Going back to the US, only T-Mobile users seem to be getting the update right now, but that's likely due to the
                                    staged nature of the rollout. You can use the Samsung Members app to subscribe to the beta channel and get this
                                    update. You will be trying out Android 11 + One UI 3.0 ahead of other users, the changelog is pretty extensive
                                    so there is a lot to see.
                                </p> */}
                                {/* <p className="my-3 text-2xl px-4">
                                    Note that the beta is not free of bugs, but you have the option to roll back if the issues prove too bothersome.
                                    Just make sure to back up your data first.
                                </p> */}
                                {/* <p className="my-3 text-2xl px-4 pb-3">
                                    Here's a screenshot from one Samsung Galaxy S20 Ultra 5G user that lists the changelog in full. This update
                                    weighs almost 3 GB and also includes the October 1 security patch. Galaxy S20 5G and Galaxy S20+ 5G users can
                                    join the beta testing as well.
                                </p> */}
                            </div>

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
                            {pageBanners['subnews_banner_1'] && (
                                <div className="md:col-span-3 mb-6 overflow-hidden">
                                    <BannerAd banner={pageBanners['subnews_banner_1']} className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto" />
                                </div>
                            )}


                            <div>
                                <div>
                                    <div className="relative w-full flex items-end justify-center lg:justify-start mb-5 mt-10">
                                        {/* Horizontal Line Background */}
                                        <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                                        {/* Title Box */}
                                        <div
                                            className="latest-news-clip lg:latest-products-clip relative z-10 flex h-10 max-w-full items-center bg-[#0580A5] text-white sm:h-12"
                                            style={{
                                                clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                                                paddingLeft: "0px",
                                                paddingRight: "60px"
                                            }}
                                        >

                                            <h2 className="pl-2 text-[11px] leading-none sm:pl-4 sm:text-2xl">
                                                {newsData?.name || 'Galaxy S20 FE'} Price Discussions, Opinions and Reviews
                                            </h2>
                                        </div>
                                    </div>



                                    <div className="space-y-3 px-2 sm:px-0">
                                        {/* Review Cards - Array Mapping */}
                                        {(() => {
                                            const reviewsData = [
                                                {
                                                    title: "Galaxy S20 FE",
                                                    author: "John Doe ( 9 July 20) on Amazon",
                                                    date: "2 days ago",
                                                    rating: 5,
                                                    text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                                },
                                                {
                                                    title: "Galaxy S20 FE",
                                                    author: "John Doe ( 9 July 20) on Amazon",
                                                    date: "2 days ago",
                                                    rating: 5,
                                                    text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                                },
                                                {
                                                    title: "Galaxy S20 FE",
                                                    author: "John Doe ( 9 July 20) on Amazon",
                                                    date: "2 days ago",
                                                    rating: 5,
                                                    text: "I have been using SAMSUNG products nearly for 14 -15 years and above. None of them gave any issues. Bought Samsung A51 this phone in 9th of July 2020 near my residence in 6 lightly monthly installment scheme. Few of the application was installed and put working on it had to updated to the latest version. Saw the configuration and seems to be very interesting. Hope this product should suffice my current need and fulfill my expectations. Thank & Regards, John Doe."
                                                },
                                                {
                                                    title: "Galaxy S20 FE",
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
                                        <div className="mt-2 border-2 border-[#0580A5] bg-gray-50 p-2">
                                            <div className="mb-3 flex items-center gap-2 sm:gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Add Title"
                                                    className="border-1 min-w-0 flex-1 border-[#0580A5] bg-white px-3 py-1 text-black placeholder:text-[12px] placeholder:font-semibold placeholder:text-black focus:outline-none sm:w-[300px] sm:flex-none sm:placeholder:text-lg"
                                                />
                                                <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className="cursor-pointer text-[16px] text-[#0580A5] hover:text-yellow-400 sm:text-xl">☆</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-1">
                                                <textarea
                                                    className="border-1 w-full border-[#0580A5] bg-white p-3 text-black placeholder-black focus:outline-none"
                                                    rows="3"
                                                    placeholder="Content"
                                                ></textarea>
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                <button className="cursor-pointer bg-[#0580A5] px-6 py-2 text-[11px] font-medium text-white transition-colors hover:bg-[#046a8a] sm:px-8 sm:text-base">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex w-full items-center gap-2 sm:gap-4">
                                            <Link to="/reviews" className="flex flex-1 items-center justify-center rounded-full border-2 border-[#0580A5] px-3 py-1.5 text-[9px] text-black transition-colors hover:bg-[#0580A5] hover:text-white cursor-pointer sm:px-6 sm:py-2 sm:text-base">
                                                Read All Reviews&gt;&gt;
                                            </Link>
                                            <button className="flex-1 rounded-full border-2 border-[#0580A5] px-3 py-1.5 text-[9px] text-black transition-colors hover:bg-[#0580A5] hover:text-white cursor-pointer sm:px-6 sm:py-2 sm:text-base">
                                                Post a Suggestion&gt;&gt;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7 sm:hidden">
                                <BannerAd banner={pageBanners['subnews_banner_2'] || subNewsBannerMobileFallback} className="w-full" />
                            </div>
                            <div className="mt-7 hidden sm:block">
                                <BannerAd banner={pageBanners['subnews_banner_2'] || subNewsBannerFallback} className="w-full" />
                            </div>

                        </div>


                    </div>

                </div>

            </div>
            <div>
                <LatestNews title="Latest News" gridCols="sm:grid-cols-3" limit={6} />
            </div>
            <div className="mt-7 sm:hidden">
                <BannerAd banner={pageBanners['subnews_banner_3'] || subNewsBannerMobileFallback} className="w-full" />
            </div>
            <div className="mt-7 hidden sm:block">
                <BannerAd banner={pageBanners['subnews_banner_3'] || subNewsBannerFallback} className="w-full" />
            </div>
            <div>
                <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />
            </div>
        </div>
    )
}

export default SingleNewsDetail
