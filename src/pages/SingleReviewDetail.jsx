import Sidebar4 from "../components/Layout/Sidebar4";
import SubNewsBanner from "../components/SubNewsBanner";
import BannerAd from "../components/BannerAd";
import contactBanner from "../assets/contactBanner.png";
import LatestNews from "../components/LatestNews";
import ComingSoonMobiles from "../components/ComingSoonMobiles";
import cartIcon from "../assets/cartIcon.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LatestReviews from "../components/LatestReviews";
import SidebarFilters from "../components/SidebarSections/SidebarFilters";
import SidebarBanner1 from "../components/SidebarSections/SidebarBanner1";
import RelatedReviews from "../components/SidebarSections/RelatedReviews";
import RelatedNews from "../components/SidebarSections/RelatedNews";
import SidebarStats from "../components/SidebarSections/SidebarStats";
import SidebarBanner2 from "../components/SidebarSections/SidebarBanner2";
import SidebarLatestModels from "../components/SidebarSections/SidebarLatestModels";
import SidebarBrands from "../components/SidebarSections/SidebarBrands";
import React, { useMemo, useRef, useState } from "react";
import { useData } from "../context/useData";
import { useAuth } from "../context/useAuth";
import { reviewDiscussionService } from "../services/reviewDiscussionService";
import { useReviewDiscussions } from "../hooks/useReviewDiscussions";

const SingleReviewDetail = () => {
  const { reviewSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { allBanners, allReviews, loading: isDataLoading } = useData();
  const reviewFormRef = useRef(null);
  const commentsListRef = useRef(null);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    rating: 0,
    content: "",
  });
  const [reviewStatus, setReviewStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const reviewData = useMemo(() => {
    const reviewFromNavigation = location.state?.reviewData;

    if (reviewFromNavigation?.slug === reviewSlug) {
      return reviewFromNavigation;
    }

    return allReviews.find((review) => review.slug === reviewSlug) || null;
  }, [allReviews, reviewSlug, location.state]);

  const title = reviewData?.name;
  const image = reviewData?.image;
  const description = reviewData?.description;
  const date = reviewData
    ? new Date(reviewData.updated_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    : "";
  const pageBanners = useMemo(() => {
    const banners = {};

    ["subreviews_banner_1", "subreviews_banner_2"].forEach((locationKey) => {
      const banner = allBanners.find(
        ({ location }) => location === locationKey,
      );

      if (banner) { banners[locationKey] = banner; }
    });

    return banners;
  }, [allBanners]);
  const isReviewLoading = isDataLoading && !reviewData;
  const isReviewMissing = !isDataLoading && !reviewData;

  const {
    visibleDiscussions,
    status: discussionStatus,
    stats: discussionStats,
    refreshDiscussions,
  } = useReviewDiscussions(reviewData?.id);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingSelect = (rating) => {
    setReviewForm((prev) => ({
      ...prev,
      rating,
    }));
  };

  const getReviewErrorMessage = (error) => {
    const apiError = error?.data || error;
    if (apiError?.errors) {
      const firstError = Object.values(apiError.errors).flat()[0];
      if (firstError) return firstError;
    }

    if ((apiError?.message || "").includes("SQLSTATE")) {
      return "No reviews available right now.";
    }

    return apiError?.message || "Failed to submit review. Please try again.";
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", {
        state: {
          from: location,
        },
      });
      return;
    }

    if (!reviewData?.id) {
      setReviewStatus({
        loading: false,
        error: "Review information is missing. Please refresh and try again.",
        success: "",
      });
      return;
    }

    if (!reviewForm.rating) {
      setReviewStatus({
        loading: false,
        error: "Please select a rating before submitting your review.",
        success: "",
      });
      return;
    }

    setReviewStatus({
      loading: true,
      error: "",
      success: "",
    });

    try {
      await reviewDiscussionService.store({
        reviewId: reviewData.id,
        title: reviewForm.title.trim(),
        content: reviewForm.content.trim(),
        rating: reviewForm.rating,
      });

      setReviewStatus({
        loading: false,
        error: "",
        success: "Your review has been submitted successfully.",
      });
      setReviewForm({
        title: "",
        rating: 0,
        content: "",
      });
      refreshDiscussions();
    } catch (error) {
      if (error?.status === 401) {
        navigate("/login", {
          state: {
            from: location,
          },
        });
        return;
      }

      setReviewStatus({
        loading: false,
        error: getReviewErrorMessage(error),
        success: "",
      });
    }
  };

  if (isReviewLoading || isReviewMissing) {
    return (
      <div>
        <div className="flex flex-col lg:flex-row gap-2">
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

          <div className="w-full lg:w-3/4">
            <SubNewsBanner
              heading="Review"
              bannerImage={contactBanner}
              date=""
              commentsCount={0}
            />
            <div className="border-2 border-[#0580A5] px-6 py-12 text-center text-black">
              {isReviewLoading
                ? "Loading review..."
                : "No reviews available right now."}
            </div>
          </div>
        </div>

        <div className="my-10">
          <LatestNews />
          <LatestReviews />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-2">
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
            heading={`Review | ${title}`}
            bannerImage={image}
            date={date}
            commentsCount={discussionStats?.totalDiscussions || 0}
            onCommentsClick={() => {
              commentsListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            onPostCommentClick={() => {
              reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
          {/* Content */}
          <div>
            <div>
              <div>
                <div className="bg-gradient-to-r from-[#1fa3b8] via-[#8fd0de] to-white p-3">
                  <h1 className="sm:text-3xl text-[22px] text-black">{title}</h1>
                </div>

                {/* Dynamic Description */}
                {/* <div className="my-4 px-4 text-2xl text-black space-y-4" dangerouslySetInnerHTML={{ __html: description }} /> */}

                {/* Video Section */}
                {reviewData?.video_url &&
                  (() => {
                    const getYouTubeId = (url) => {
                      if (!url) return null;
                      const regExp =
                        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                      const match = url.match(regExp);
                      return match && match[2].length === 11 ? match[2] : null;
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
                <div
                  className="my-4 sm:px-4 px-2 text-base sm:text-2xl text-black space-y-4"
                  dangerouslySetInnerHTML={{ __html: description }}
                />

                <div>
                  <div className="relative w-full flex items-end lg:justify-start mb-8 mt-3">
                    {/* Horizontal Line Background */}
                    <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    {/* Title Box */}
                    <div
                      className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center gap-4 sm:gap-0 justify-center relative z-10"
                      style={{
                        clipPath:
                          "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                        paddingLeft: "10px",
                        paddingRight: "60px",
                      }}
                    >
                      <img src={cartIcon} width={30} alt="" />
                      <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">
                        Shop by
                      </h2>
                    </div>
                  </div>

                  {/* Shop Section */}
                  <div className="mt-5 px-2 sm:px-4">
                    {/* Shop Data */}
                    {(() => {
                      const apiBase = "https://mobirays.voucherndeals.com";
                      const shopData = reviewData?.product_links || [];

                      const getImageUrl = (img) => {
                        if (!img) return "";
                        if (img.startsWith("http")) return img;
                        return `${apiBase}/storage/${img}`;
                      };

                      // Determine split point (halfway)
                      const midPoint = Math.ceil(shopData.length / 2);
                      const leftColumn = shopData.slice(0, midPoint);
                      const rightColumn = shopData.slice(midPoint);

                      if (shopData.length === 0) {
                        return (
                          <div className="text-center text-gray-500 my-4">
                            No shop links available.
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-15 max-w-5xl mx-auto">
                          {/* Left Column */}
                          <div className="space-y-3">
                            {leftColumn.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-stretch justify-center lg:justify-end gap-2"
                              >
                                <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center min-w-[100px]">
                                  <span className="font-semibold text-black">
                                    {item.price ? `$${item.price}` : "N/A"}
                                  </span>
                                </div>
                                <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                  <img
                                    src={getImageUrl(item.image || item.logo)}
                                    alt={item.name || "Shop"}
                                    className="h-8 object-contain"
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
                              <div
                                key={index}
                                className="flex items-stretch gap-2 sm:justify-start justify-center lg:justify-start"
                              >
                                <div className="border-2 border-[#0580A5] rounded-l-full px-5 py-2 flex items-center justify-center min-w-[100px]">
                                  <span className="font-semibold text-gray-800">
                                    {item.price ? `$${item.price}` : "N/A"}
                                  </span>
                                </div>
                                <div className="border-2 border-[#0580A5] bg-white px-6 py-2 min-w-[140px] flex items-center justify-center">
                                  <img
                                    src={getImageUrl(item.image || item.logo)}
                                    alt={item.name || "Shop"}
                                    className="h-8 object-contain"
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
                    <div className="mt-6 text-center max-w-4xl mx-auto px-2 sm:px-0">
                      <p className="text-sm sm:font-medium text-black leading-relaxed sm:text-[17px]">
                        <span className="font-semibold">Disclaimer.</span>{" "}
                        Prices are updated daily from local shops and dealers
                        but we cannot guarantee 100% accuracy. Always visit your
                        local shop for exact rates.
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
                          clipPath:
                            "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                          paddingLeft: "10px",
                          paddingRight: "60px",
                        }}
                      >
                        <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">
                          User Reviews
                        </h2>
                      </div>
                      <div>
                        <Link
                          to="/reviews"
                          className="text-[#0060FF] sm:text-xl underline cursor-pointer text-sm"
                        >
                          Read All User Reviews
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-4">
                      {/* Box 1: Overall Rating */}
                      <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-evenly">
                        <h3 className="text-lg font-semibold mb-2 text-black text-center">
                          OVERALL RATING
                        </h3>
                        <div className="text-6xl font-bold text-black">
                          {discussionStats.averageRating}
                          <span className="text-4xl">/5</span>
                        </div>
                        <p className="text-base text-black mt-2 text-sm text-center">
                          BASED ON{" "}
                          {discussionStats.totalDiscussions.toLocaleString()}{" "}
                          USER REVIEW(S)
                        </p>
                      </div>

                      {/* Box 2: Rating Breakdown */}
                      <div className="border-2 border-[#0580A5] p-6">
                        <h3 className="text-lg font-semibold mb-4 text-black text-center">
                          OVERALL RATING
                        </h3>
                        <div className="space-y-2 text-black">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = discussionStats.counts[star];
                            const width =
                              discussionStats.totalDiscussions > 0
                                ? `${(count / discussionStats.totalDiscussions) * 100}%`
                                : "0%";

                            return (
                              <div
                                key={star}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm w-14">
                                  {star} star{star === 1 ? "" : "s"}
                                </span>
                                <div className="flex-1 bg-gray-200 h-4 ">
                                  <div
                                    className="bg-[#0580A5] h-4 "
                                    style={{ width }}
                                  ></div>
                                </div>
                                <span className="text-sm w-12 text-right">
                                  {count.toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-center mt-4 text-black">
                          {discussionStats.totalDiscussions.toLocaleString()}{" "}
                          USER REVIEW(S)
                        </p>
                      </div>

                      {/* Box 3: Share Your Thoughts */}
                      <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-start gap-10">
                        <h3 className="text-lg font-semibold mb-6 text-black">
                          SHARE YOUR THOUGHTS
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            reviewFormRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            })
                          }
                          className="bg-[#0580A5] text-white px-8 py-3 hover:bg-[#046a8a] transition-colors  text-sm cursor-pointer"
                        >
                          WRITE A REVIEW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="my-4 px-4 text-base sm:text-2xl text-black space-y-4"
                  dangerouslySetInnerHTML={{ __html: description }}
                />

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
                {pageBanners["subreviews_banner_1"] && (
                  <div className="md:col-span-3 mb-6 overflow-hidden">
                    <BannerAd banner={pageBanners["subreviews_banner_1"]} className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto" />
                  </div>
                )}

                <div>
                  <div ref={commentsListRef}>
                    <div className="relative w-full flex items-end justify-start lg:justify-start mb-5 mt-10">
                      {/* Horizontal Line Background */}
                      <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                      {/* Title Box */}
                      <div
                        className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10"
                        style={{
                          clipPath:
                            "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                          paddingLeft: "5px",
                          paddingRight: "60px",
                        }}
                      >
                        <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">
                          User Discussions
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-3 px-2 sm:px-0">
                      {discussionStatus.error && (
                        <div className="border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                          {discussionStatus.error}
                        </div>
                      )}

                      {discussionStatus.loading ? (
                        <div className="border-2 border-[#0580A5] px-4 py-8 text-center text-gray-500">
                          Loading user discussions...
                        </div>
                      ) : visibleDiscussions.length > 0 ? (
                        visibleDiscussions.map((review) => (
                          <div
                            key={review.id}
                            className="border-2 border-[#0580A5] px-4 py-2"
                          >
                            <div className="flex justify-between items-start mb-1 gap-4">
                              <h3 className="text-2xl">{review.title}</h3>
                              <div className="flex flex-col items-end gap-0 flex-shrink-0">
                                <div className="flex items-center gap-0.5">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <span
                                      key={i}
                                      className="text-yellow-400 text-xl"
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-[10px] text-black">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-black font-bold mb-2">
                              {review.author}
                            </p>
                            <p className="text-sm text-black leading-tight mb-3">
                              {review.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-[#0580A5] px-4 py-8 text-center text-gray-500">
                          No user discussions found for this review yet.
                        </div>
                      )}

                      {/* Add Review Form */}
                      <form
                        ref={reviewFormRef}
                        className="border-2 border-[#0580A5] bg-gray-50 p-2 mt-2"
                        onSubmit={handleReviewSubmit}
                      >
                        {reviewStatus.error && (
                          <div className="mb-3 border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                            {reviewStatus.error}
                          </div>
                        )}

                        {reviewStatus.success && (
                          <div className="mb-3 border border-green-300 bg-green-100 px-3 py-2 text-sm text-green-700">
                            {reviewStatus.success}
                          </div>
                        )}

                        {/* Title and Stars Row */}
                        <div className="flex items-center gap-4 mb-3">
                          <input
                            type="text"
                            name="title"
                            value={reviewForm.title}
                            onChange={handleReviewChange}
                            placeholder="Add Title"
                            required
                            className="border-1 px-3 py-1 focus:outline-none bg-white border-[#0580A5] flex-shrink-0 placeholder-black text-black placeholder:font-semibold placeholder:text-lg w-[170px] sm:w-[250px]"
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleRatingSelect(i + 1)}
                                className={`text-xl cursor-pointer ${i < reviewForm.rating ? "text-yellow-400" : "text-[#0580A5]"}`}
                                aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}
                              >
                                {i < reviewForm.rating ? "★" : "☆"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment Section */}
                        <div className="mb-1">
                          <textarea
                            name="content"
                            value={reviewForm.content}
                            onChange={handleReviewChange}
                            className="w-full border-1  p-3 focus:outline-none border-[#0580A5] bg-white text-black placeholder-black"
                            rows="3"
                            placeholder="Content"
                            required
                          ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                          <button
                            type="submit"
                            disabled={reviewStatus.loading}
                            className="bg-[#0580A5] text-white px-8 py-2 hover:bg-[#046a8a] transition-colors font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reviewStatus.loading ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      </form>

                      <div className="flex sm:flex-row gap-4 justify-between sm:justify-end items-center mt-2 mb-10 sm:mb-0">
                        <Link
                          to="/reviews"
                          className="flex items-center justify-center border-2 border-[#0580A5] text-black sm:px-6 px-4 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors text-base cursor-pointer"
                        >
                          Read All Reviews&gt;&gt;
                        </Link>
                        <button className="border-2 border-[#0580A5] text-black sm:px-6 px-4 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors text-base cursor-pointer">
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

      {pageBanners["subreviews_banner_2"] && (
        <div className="md:col-span-3 mb-6 overflow-hidden">
          <BannerAd banner={pageBanners["subreviews_banner_2"]} className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto" />
        </div>
      )}
      <div className="mt-10">
        <LatestReviews
          title="Latest Reviews"
          gridCols="sm:grid-cols-4"
          limit={8}
        />
      </div>
    </div>
  );
};

export default SingleReviewDetail;
