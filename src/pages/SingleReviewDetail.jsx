import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import SubNewsBanner from '../components/SubNewsBanner';
import LatestReviews from '../components/LatestReviews';
import ComingSoonMobiles from '../components/ComingSoonMobiles';
import SidebarIntro from '../components/SidebarSections/SidebarIntro';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import RelatedReviews from '../components/SidebarSections/RelatedReviews';
import RelatedNews from '../components/SidebarSections/RelatedNews';
import SidebarStats from '../components/SidebarSections/SidebarStats';
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2';
import SidebarLatestModels from '../components/SidebarSections/SidebarLatestModels';
import SidebarBanner3 from '../components/SidebarSections/SidebarBanner3';
import BannerAd from '../components/BannerAd';
import contactBanner from '../assets/contactBanner.png';
import cartIcon from '../assets/cartIcon.png';
import homeBanner3 from '../assets/homeBanner3.png';
import homeBannerSM3 from '../assets/homeBannerSM3.png';
import mobileImg from '../assets/mobileImg.jpg';
import { useData } from '../context/DataContext';
import { createSlug } from '../utils/urlHelper';

const SingleReviewDetail = () => {
    const { reviewSlug } = useParams();
    const location = useLocation();
    const { allBanners, allReviews } = useData();
    const [reviewData, setReviewData] = useState(location.state?.reviewData || null);
    const [pageBanners, setPageBanners] = useState({});

    const subReviewsBannerFallback = {
        title: 'Sub Reviews Banner',
        image: homeBanner3,
    };
    const subReviewsBannerMobileFallback = {
        title: 'Sub Reviews Banner Mobile',
        image: homeBannerSM3,
    };

    useEffect(() => {
        if (location.state?.reviewData) {
            setReviewData(location.state.reviewData);
            return;
        }

        if (allReviews.length > 0) {
            const found = allReviews.find((review) => review.slug === reviewSlug);
            if (found) {
                setReviewData(found);
            }
        }
    }, [allReviews, reviewSlug, location.state]);

    useEffect(() => {
        if (allBanners.length > 0) {
            const map = {};
            ['subreviews_banner_1', 'subreviews_banner_2'].forEach((loc) => {
                const banner = allBanners.find((item) => item.location === loc);
                if (banner) map[loc] = banner;
            });
            setPageBanners(map);
        }
    }, [allBanners]);

    const productData = reviewData?.productData;
    const productName = reviewData?.productName ?? '';
    const reviewTitle = reviewData?.title ?? '';
    const image = reviewData?.productImage ?? '';
    const reviewText = reviewData?.reviewText ?? '';
    const date = reviewData?.date ?? '';
    const displayRating = Number.isFinite(reviewData?.displayRating) ? reviewData.displayRating : null;

    const shopLinks = productData?.shopBy_links || reviewData?.product_links || [];
    const midPoint = Math.ceil(shopLinks.length / 2);
    const leftColumn = shopLinks.slice(0, midPoint);
    const rightColumn = shopLinks.slice(midPoint);

    const discussionItems = [
        {
            title: 'Great Phone!',
            author: 'John Doe (9 July 20) on Amazon',
            date: '2 days ago',
            rating: 5,
            text: 'I have been using Samsung products for many years and this device feels polished, balanced, and dependable in daily use.',
        },
        {
            title: 'Value for Money',
            author: 'Jane Smith (10 July 20) on Flipkart',
            date: '3 days ago',
            rating: 4,
            text: 'Good features for the price point. The display, battery, and overall performance feel strong for regular everyday work.',
        },
    ];

    const getImageUrl = (img) => {
        if (!img) return '';
        if (img.startsWith('http')) return img;
        return `https://mobirays.voucherndeals.com/storage/${img}`;
    };

    return (
        <div>
            <div className="grid gap-2 lg:grid-cols-[401px_minmax(0,1fr)] lg:items-start">
                <div className="hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <SidebarIntro />
                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <RelatedReviews />
                        <RelatedNews />
                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                            <SidebarBanner3 />
                        </div>
                    </div>
                </div>

                <div className="min-w-0">
                    <SubNewsBanner heading={`Review | ${productName || reviewTitle || 'Review'}`} bannerImage={image || contactBanner} date={date} commentsCount={60} />

                    <div className="bg-gradient-to-r from-[#1fa3b8] via-[#8fd0de] to-white p-3">
                        <h1 className="text-[16px] leading-tight text-black sm:text-3xl">{productName || reviewTitle}</h1>
                    </div>

                    <div className="my-3 px-3 text-[11px] leading-relaxed text-black sm:my-4 sm:px-4 sm:text-2xl">
                        {reviewText}
                    </div>

                    <div className="relative mb-8 mt-3 flex w-full items-end justify-start">
                        <div className="absolute bottom-0 left-0 h-[10px] w-full bg-[#0580A5] sm:h-[16px]" />
                        <div
                            className="latest-news-clip lg:latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-12"
                            style={{
                                clipPath: 'polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)',
                                paddingLeft: '10px',
                                paddingRight: '60px',
                            }}
                        >
                            <img src={cartIcon} width={30} alt="" />
                            <h2 className="pl-2 text-[14px] sm:pl-4 sm:text-2xl">Shop by</h2>
                        </div>
                    </div>

                    <div className="mt-4 px-0 sm:px-4">
                        {shopLinks.length === 0 ? (
                            <div className="my-4 text-center text-gray-500">No shop links available.</div>
                        ) : (
                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-10">
                                <div className="space-y-3">
                                    {leftColumn.map((item, index) => (
                                        <div key={index} className="flex items-stretch justify-center gap-1.5 lg:justify-end">
                                            <div className="flex min-w-[72px] items-center justify-center rounded-l-full border-2 border-[#0580A5] px-3 py-1 text-[11px] sm:min-w-[100px] sm:px-5 sm:py-2">
                                                <span className="font-semibold text-black">{item.price ? `$${item.price}` : 'N/A'}</span>
                                            </div>
                                            <div className="flex min-w-[96px] items-center justify-center border-2 border-[#0580A5] bg-white px-3 py-1 sm:min-w-[140px] sm:px-6 sm:py-2">
                                                <img src={getImageUrl(item.image || item.logo)} alt={item.name || 'Shop'} className="h-5 object-contain sm:h-8" />
                                            </div>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center rounded-r-full bg-[#0580A5] px-3 py-1 text-[10px] text-white transition-colors hover:bg-[#046a8a] sm:px-6 sm:py-2 sm:text-sm"
                                            >
                                                GO TO BUYING
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    {rightColumn.map((item, index) => (
                                        <div key={index} className="flex items-stretch justify-center gap-1.5 lg:justify-start">
                                            <div className="flex min-w-[72px] items-center justify-center rounded-l-full border-2 border-[#0580A5] px-3 py-1 text-[11px] sm:min-w-[100px] sm:px-5 sm:py-2">
                                                <span className="font-semibold text-gray-800">{item.price ? `$${item.price}` : 'N/A'}</span>
                                            </div>
                                            <div className="flex min-w-[96px] items-center justify-center border-2 border-[#0580A5] bg-white px-3 py-1 sm:min-w-[140px] sm:px-6 sm:py-2">
                                                <img src={getImageUrl(item.image || item.logo)} alt={item.name || 'Shop'} className="h-5 object-contain sm:h-8" />
                                            </div>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center rounded-r-full bg-[#0580A5] px-3 py-1 text-[10px] text-white transition-colors hover:bg-[#046a8a] sm:px-6 sm:py-2 sm:text-sm"
                                            >
                                                GO TO BUYING
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mx-auto mt-6 max-w-4xl text-center">
                            <p className="text-[10px] font-medium leading-relaxed text-black sm:text-[17px]">
                                <span className="font-semibold">Disclaimer.</span> Prices are updated daily from local shops and dealers but we cannot guarantee 100% accuracy. Always visit your local shop for exact rates.
                            </p>
                        </div>
                    </div>

                    <div className="relative mb-5 mt-3 flex w-full items-start justify-between gap-2">
                        <div className="absolute bottom-0 left-0 h-[10px] w-full bg-[#0580A5] sm:h-[16px]" />
                        <div
                            className="latest-news-clip lg:latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-12"
                            style={{
                                clipPath: 'polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)',
                                paddingLeft: '10px',
                                paddingRight: '60px',
                            }}
                        >
                            <h2 className="pl-2 text-[14px] sm:pl-4 sm:text-2xl">User Reviews</h2>
                        </div>
                        <div>
                            <Link to="/reviews" className="cursor-pointer text-[10px] text-[#0060FF] underline sm:text-xl">
                                Read All User Reviews
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 px-0 sm:grid-cols-3 sm:px-4">
                        <div className="flex flex-col items-center justify-center border-2 border-[#0580A5] p-1.5 text-center sm:p-6">
                            <h3 className="mb-1 text-[9px] font-semibold text-black sm:mb-2 sm:text-lg">OVERALL RATING</h3>
                            <div className="text-[20px] font-bold text-black sm:text-6xl">
                                {(displayRating ?? 0).toFixed(1)}<span className="text-[11px] sm:text-4xl">/10</span>
                            </div>
                            <p className="mt-1 text-[7px] leading-tight text-black sm:mt-2 sm:text-sm">BASED ON MEMBER REVIEW DATA</p>
                        </div>

                        <div className="border-2 border-[#0580A5] p-1.5 sm:p-6">
                            <h3 className="mb-1.5 text-center text-[8px] font-semibold text-black sm:mb-4 sm:text-lg">RATING BREAKDOWN</h3>
                            <div className="space-y-1 text-black sm:space-y-2">
                                {[
                                    ['5 stars', '70%', '4,645'],
                                    ['4 stars', '25%', '1,777'],
                                    ['3 stars', '7%', '485'],
                                    ['2 stars', '3%', '183'],
                                    ['1 star', '7%', '477'],
                                ].map(([label, width, count]) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <span className="w-7 text-[7px] sm:w-14 sm:text-sm">{label}</span>
                                        <div className="h-2 flex-1 bg-gray-200 sm:h-4">
                                            <div className="h-2 bg-[#0580A5] sm:h-4" style={{ width }} />
                                        </div>
                                        <span className="w-6 text-right text-[7px] sm:w-12 sm:text-sm">{count}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-1.5 text-center text-[7px] leading-tight text-black sm:mt-4 sm:text-xs">2,492 USER REVIEW(S)</p>
                        </div>

                        <div className="flex flex-col items-center justify-between border-2 border-[#0580A5] p-1.5 text-center sm:p-6">
                            <h3 className="mb-2 text-[8px] font-semibold leading-tight text-black sm:mb-6 sm:text-lg">SHARE YOUR THOUGHTS</h3>
                            <button className="cursor-pointer bg-[#0580A5] px-2 py-1.5 text-[8px] text-white transition-colors hover:bg-[#046a8a] sm:px-8 sm:py-3 sm:text-sm">
                                WRITE A REVIEW
                            </button>
                        </div>
                    </div>

                    <div className="my-3 px-3 text-[11px] leading-relaxed text-black sm:my-4 sm:px-4 sm:text-2xl">
                        {reviewText}
                    </div>

                    <div className="mt-7 sm:hidden">
                        <BannerAd banner={pageBanners['subreviews_banner_1'] || subReviewsBannerMobileFallback} className="w-full" />
                    </div>
                    <div className="mt-7 hidden sm:block">
                        <BannerAd banner={pageBanners['subreviews_banner_1'] || subReviewsBannerFallback} className="w-full" />
                    </div>

                    <div className="relative mb-5 mt-10 flex w-full items-end justify-start">
                        <div className="absolute bottom-0 left-0 h-[10px] w-full bg-[#0580A5] sm:h-[16px]" />
                        <div
                        className="latest-news-clip lg:latest-products-clip relative z-10 flex h-10 max-w-full items-center bg-[#0580A5] text-white sm:h-12"
                            style={{
                                clipPath: 'polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)',
                                paddingLeft: '0px',
                                paddingRight: '60px',
                            }}
                        >
                            <h2 className="pl-2 text-[12px] leading-none sm:pl-4 sm:text-2xl">{productName} User Discussions</h2>
                        </div>
                    </div>

                    <div className="space-y-2 px-0">
                        {discussionItems.map((item, index) => (
                            <div key={index} className="border-2 border-[#0580A5] px-2 py-2 sm:px-4">
                                <div className="mb-1 flex items-start justify-between gap-2">
                                    <h3 className="text-[10px] font-medium leading-tight sm:text-2xl">{item.title}</h3>
                                    <div className="flex flex-col items-end gap-0">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(item.rating)].map((_, i) => (
                                                <span key={i} className="text-[12px] text-yellow-400 sm:text-xl">★</span>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-black">{item.date}</span>
                                    </div>
                                </div>
                                <p className="mb-2 text-[10px] font-bold text-black sm:text-sm">{item.author}</p>
                                <p className="mb-3 text-[10px] leading-tight text-black sm:text-sm">{item.text}</p>
                                <div className="flex items-center gap-3 pb-1 text-[10px] sm:text-sm">
                                    <span className="text-[10px] font-semibold text-black sm:text-sm">Is this review helpful?</span>
                                    <button className="flex cursor-pointer items-center gap-1 text-[#0580A5] hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ))}

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
                                />
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
                <BannerAd banner={pageBanners['subreviews_banner_2'] || subReviewsBannerMobileFallback} className="w-full" />
            </div>
            <div className="mt-7 hidden sm:block">
                <BannerAd banner={pageBanners['subreviews_banner_2'] || subReviewsBannerFallback} className="w-full" />
            </div>

            <div className="mt-10">
                <LatestReviews
                    title="Latest Reviews"
                    gridCols="sm:grid-cols-3"
                    limit={6}
                    reviewsData={
                        reviewData
                            ? allReviews.filter((item) => createSlug(item.title || item.productName || item.name) !== reviewSlug)
                            : undefined
                    }
                />
            </div>

            <div className="mt-7">
                <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />
            </div>
        </div>
    );
};

export default SingleReviewDetail;
