import React, { useState, useEffect, useRef } from "react";
import { useData } from "../context/useData";
import { useAuth } from "../context/useAuth";
import { useNewsDiscussions } from "../hooks/useNewsDiscussions";
import { newsDiscussionService } from "../services/newsDiscussionService";
import Sidebar4 from "../components/Layout/Sidebar4";
import sidebarBanner2 from "../assets/sidebarBanner2.jpg";
import SubNewsBanner from "../components/SubNewsBanner";
import contactBanner from "../assets/contactBanner.png";
import LatestNews from "../components/LatestNews";
import ComingSoonMobiles from "../components/ComingSoonMobiles";
import mobileImg from "../assets/mobileImg.jpg";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { Link as LucideLink } from "lucide-react";
import SidebarFilters from "../components/SidebarSections/SidebarFilters";
import SidebarBanner1 from "../components/SidebarSections/SidebarBanner1";
import RelatedReviews from "../components/SidebarSections/RelatedReviews";
import RelatedNews from "../components/SidebarSections/RelatedNews";
import SidebarStats from "../components/SidebarSections/SidebarStats";
import SidebarBanner2 from "../components/SidebarSections/SidebarBanner2";
import SidebarLatestModels from "../components/SidebarSections/SidebarLatestModels";
import SidebarBrands from "../components/SidebarSections/SidebarBrands";
import BannerAd from "../components/BannerAd";
import useMetadata from "../hooks/useMetadata";

const SingleNewsDetail = () => {
  const { newsSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allBanners, allNews } = useData();
  const [newsData, setNewsData] = useState(location.state?.newsData || null);
  const [pageBanners, setPageBanners] = useState({});
  const reviewFormRef = useRef(null);
  const commentsSectionRef = useRef(null);


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

  const {
    visibleDiscussions,
    status: discussionStatus,
    stats: discussionStats,
    refreshDiscussions,
  } = useNewsDiscussions(newsData?.id);

  useMetadata(
    newsData?.name ? `${newsData.name} | News | Mobirays` : null,
    newsData?.description?.substring(0, 160) || null
  );

  // Sync newsData with URL slug
  useEffect(() => {
    if (location.state?.newsData && location.state.newsData.slug === newsSlug) {
      setNewsData(location.state.newsData);
    } else if (allNews.length > 0) {
      const found = allNews.find((n) => n.slug === newsSlug);
      if (found) setNewsData(found);
    }
  }, [allNews, newsSlug, location.state]);

  useEffect(() => {
    if (allBanners.length > 0) {
      const map = {};
      ["subnews_banner_1", "subnews_banner_2", "subnews_banner_3"].forEach(
        (loc) => {
          const b = allBanners.find((b) => b.location === loc);
          if (b) map[loc] = b;
        },
      );
      setPageBanners(map);
    }
  }, [allBanners]);

  // Format date if newsData exists
  const formattedDate = newsData
    ? new Date(newsData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "";

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

    if (!newsData?.id) {
      setReviewStatus({
        loading: false,
        error: "News information is missing. Please refresh and try again.",
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
      await newsDiscussionService.store({
        newsId: newsData.id,
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
            heading={
              newsData ? `News | ${newsData.name}` : "News | Samsung Galaxy"
            }
            bannerImage={newsData?.image || contactBanner}
            date={formattedDate || "06-Sep-2025"}
            commentsCount={discussionStats.totalDiscussions}
            onCommentsClick={() =>
              commentsSectionRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            onPostCommentClick={() =>
              reviewFormRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          />
          {/* Content will be added here dynamically */}
          <div>
            <div>
              <div>
                <div className="bg-gradient-to-r from-[#1fa3b8] via-[#8fd0de] to-white p-3">
                  <h1 className="sm:text-3xl text-[22px] text-black">
                    {newsData?.name ||
                      "Galaxy S20 FE (Fan Edition) Review, The price champion"}
                  </h1>
                </div>

                <p className="my-3 text-base sm:text-2xl sm:px-4 px-2 pt-2">
                  {newsData?.description ||
                    "Just a day after the One UI 3.0 beta for the original Galaxy $20 trio went public in South Korea, Samsung started rolling it out to users in the US as well. Soon, the update should also reach Europe (Germany, Poland, the UK), India and China."}
                </p>

                {newsData?.content && (
                  <div 
                    className="news-content-body sm:px-4 px-2 py-4 text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: newsData.content }}
                  />
                )}
              </div>

              {pageBanners["subnews_banner_1"] && (
                <div className="md:col-span-3 mb-6 overflow-hidden">
                  <BannerAd
                    banner={pageBanners["subnews_banner_1"]}
                    className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto"
                  />
                </div>
              )}

              <div>
                <div>
                  <div
                    ref={commentsSectionRef}
                    className="relative w-full flex items-end justify-center lg:justify-start mb-5 mt-10"
                  >
                    {/* Horizontal Line Background */}
                    <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                    {/* Title Box */}
                    <div
                      className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-auto py-2 flex items-center justify-center relative z-10"
                      style={{
                        clipPath:
                          "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                        paddingLeft: "5px",
                        paddingRight: "60px",
                      }}
                    >
                      <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">
                        {newsData?.name || "Galaxy S20 FE"} Price Discussions,
                        Opinions and Reviews
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-4 mt-8">
                    {/* Box 1: Overall Rating */}
                    <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-evenly">
                      <h3 className="text-lg font-semibold mb-2 text-black text-center">
                        OVERALL RATING
                      </h3>
                      <div className="text-6xl font-bold text-black">
                        {discussionStats.averageRating}
                        <span className="text-4xl text-black">/5</span>
                      </div>
                      <p className="text-base text-black mt-2 text-sm text-center uppercase">
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
                            <div key={star} className="flex items-center gap-2">
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
                      <p className="text-xs text-center mt-4 text-black uppercase">
                        {discussionStats.totalDiscussions.toLocaleString()}{" "}
                        USER REVIEW(S)
                      </p>
                    </div>

                    {/* Box 3: Share Your Thoughts */}
                    <div className="border-2 border-[#0580A5] p-6 flex flex-col items-center justify-start gap-10">
                      <h3 className="text-lg font-semibold mb-6 text-black text-center">
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
                        className="bg-[#0580A5] text-white px-8 py-3 hover:bg-[#046a8a] transition-colors  text-sm cursor-pointer uppercase"
                      >
                        WRITE A REVIEW
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 px-2 sm:px-0 mt-8">
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
                        No user discussions found for this news yet.
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
                          className="bg-[#0580A5] text-white px-8 py-2 hover:bg-[#046a8a] transition-colors font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 uppercase"
                        >
                          {reviewStatus.loading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </form>

                    <div className="flex flex-row gap-3 justify-between sm:justify-end items-center mt-2 mb-10 sm:mb-0">
                      <Link
                        to="/reviews"
                        className="flex items-center justify-center border-2 border-[#0580A5] text-black sm:px-6 px-3 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors text-sm sm:text-base cursor-pointer whitespace-nowrap"
                      >
                        Read All Reviews&gt;&gt;
                      </Link>
                      <button className="border-2 border-[#0580A5] text-black sm:px-6 px-3 py-2 rounded-full hover:bg-[#0580A5] hover:text-white transition-colors text-sm sm:text-base cursor-pointer whitespace-nowrap">
                        Post a Suggestion&gt;&gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {pageBanners["subnews_banner_2"] && (
                <div className="md:col-span-3 mb-6 overflow-hidden">
                  <BannerAd
                    banner={pageBanners["subnews_banner_2"]}
                    className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <LatestNews title="Latest News" gridCols="sm:grid-cols-3" limit={6} />
      </div>
      {pageBanners["subnews_banner_3"] && (
        <div className="md:col-span-3 mb-6 overflow-hidden">
          <BannerAd
            banner={pageBanners["subnews_banner_3"]}
            className="mt-7 w-auto sm:w-full h-[200px] sm:h-auto"
          />
        </div>
      )}
      <div>
        <ComingSoonMobiles title="Coming Soon Mobiles" itemImage={mobileImg} />
      </div>
    </div>
  );
};

export default SingleNewsDetail;
