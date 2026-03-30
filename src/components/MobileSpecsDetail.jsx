import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GalleryModal from "./GalleryModal";
import { FaFacebookF } from "react-icons/fa";
import displayIcon from "../assets/Icons/displayIcon.png";
import cameraIcon from "../assets/Icons/cameraIcon.png";
import batteryIcon from "../assets/Icons/batteryIcon.png";
import ramIcon from "../assets/Icons/ramIcon.png";
import osIcon from "../assets/Icons/releaseDateIcon.png";
import usFlag from "../assets/usFlag.png";
import europeFlag from "../assets/europeFlag.png";
import indiaFlag from "../assets/indiaFlag.png";
import pakistanFlag from "../assets/pakistanFlag.png";
import storageIcon from "../assets/Icons/storageIcon.png";
import phoneSizeIcon from "../assets/Icons/phoneSizeIcon.png";
import specsIcon from "../assets/Icons/specsIcon.png";
import compareIcon from "../assets/compareIcon.png";
import commentsIcon from "../assets/commentsIcon.png";
import picturesIcon from "../assets/picturesIcon.png";
import shareIcon from "../assets/shareIcon.png";
import viewsIcon from "../assets/viewsIcon.png";
import likesIcon from "../assets/likeIcon.png";
import { useProductLike } from "../hooks/useProductLike";
import { useData } from "../context/useData";

const MobileSpecsDetail = ({ productData, onCommentsClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productVisitorTotals } = useData();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareMenuRef = useRef(null);
  const {
    isLiked,
    likesCount,
    likesLoading,
    likesReady,
    toggleLike,
    authRequiredCode,
  } = useProductLike({
    productId: productData?.id,
    initialLikesCount: productData?.likes,
  });
  // Get background color from API or use default
  const backgroundColor = productData?.background_color || "rgb(200, 155, 123)";

  // Get specifications from nested object or use productData directly
  const specs = productData?.specifications || {};
  const prices = productData?.price || {};
  const productViews = useMemo(() => {
    const apiViews = Number(productData?.views);

    if (Number.isFinite(apiViews) && apiViews >= 0) {
      return apiViews;
    }

    const matchedVisitor = productVisitorTotals.find(
      (product) => Number(product.id) === Number(productData?.id),
    );
    const fallbackViews = Number(matchedVisitor?.visited_count);

    return Number.isFinite(fallbackViews) && fallbackViews >= 0
      ? fallbackViews
      : 0;
  }, [productData?.id, productData?.views, productVisitorTotals]);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}${location.pathname}${location.search}`;
  }, [location.pathname, location.search]);
  const shareText = productData?.name || "Check out this product";

  // Use API data or fallback to defaults
  const device = {
    name: productData?.name || "Product Name",
    image:
      productData?.image ||
      "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-note20-5g.jpg",
    views: productViews.toLocaleString(),
    likes: likesCount,
    releaseDate:
      specs?.released ||
      productData?.released ||
      productData?.release_date ||
      "Coming Soon",
    specs: {
      display: specs?.display_size
        ? specs.display_size.replace(/\s*Inches?/i, "")
        : "6.9",
      displayResolution: specs?.display_resolution || "1440×3088 pixels",
      camera: specs?.camera || "108MP",
      cameraVideo: specs?.video || "4320p",
      ram: specs?.ram || "6-12GB RAM",
      chipset: specs?.chipset || "Exynos 990",
      battery: specs?.battery || "4500mAh",
      batteryType: specs?.battery_type || "Li-Po",
      os: specs?.os || "Android 10",
      storage: specs?.storage || "128GB/256GB/512GB",
      dimensions: specs?.body || specs?.dimensions || "208g, 8.1mm thickness",
    },
    prices: [
      {
        country: "US",
        flag: usFlag,
        amount:
          prices?.usd !== null && prices?.usd !== undefined
            ? `$${prices.usd}`
            : null,
      },
      {
        country: "EU",
        flag: europeFlag,
        amount:
          prices?.eu !== null && prices?.eu !== undefined
            ? `€${prices.eu}`
            : null,
      },
      {
        country: "IN",
        flag: indiaFlag,
        amount:
          prices?.inr !== null && prices?.inr !== undefined
            ? `₹${prices.inr}`
            : null,
      },
      {
        country: "PK",
        flag: pakistanFlag,
        amount:
          prices?.pkr !== null && prices?.pkr !== undefined
            ? `PKR ${prices.pkr}`
            : null,
      },
    ],
  };

  const handleToggleLike = async () => {
    try {
      await toggleLike();
    } catch (error) {
      if (error?.code === authRequiredCode) {
        navigate("/login", {
          state: {
            from: location,
          },
        });
      }
    }
  };

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const shareTargets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    };

    const targetUrl = shareTargets[platform];

    if (!targetUrl) {
      return;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setIsShareMenuOpen(false);
  };

  useEffect(() => {
    if (!isShareMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (shareMenuRef.current?.contains(event.target)) {
        return;
      }

      setIsShareMenuOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsShareMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isShareMenuOpen]);

  return (
    <div className="w-full">
      {/* Header Section with Device Name and Stats */}
      <div className="relative z-10 w-full mb-2 overflow-visible">
        {/* Background bar */}
        <div className="w-full h-10 sm:h-14 flex items-center justify-between">
          {/* Left side - Device name with slanted edge */}
          <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

          <div className="relative w-full flex items-end">
            {/* Horizontal Line Background */}

            {/* Title Box */}
            <div className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10">
              <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">
                {device.name}
              </h1>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="relative z-20 h-full flex gap-20 justify-between overflow-visible">
            <div className="h-fit flex items-center gap-1.5 text-[#0580A5]">
              <img src={viewsIcon} alt="" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-lg leading-none">
                  {device.views}
                </span>
                <span className="text-[10px] leading-none  sm:text-xs ">
                  Views
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={likesLoading || !likesReady}
              className={`h-fit flex items-center gap-1.5 ${isLiked ? "text-[#046a8a]" : "text-[#0580A5]"} disabled:opacity-70 hover:cursor-pointer transition-colors`}
            >
              <img src={likesIcon} alt="" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-lg  leading-none">
                  {device.likes}
                </span>
                <span className="text-[10px] sm:text-xs leading-none">
                  Likes
                </span>
              </div>
            </button>
            <div ref={shareMenuRef} className="flex items-center gap-2 pb-7">
              {isShareMenuOpen && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => handleShare("facebook")}
                    className="text-[#1877F2] hover:opacity-70 cursor-pointer"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare("x")}
                    className="text-black hover:opacity-70 cursor-pointer text-base font-bold leading-none"
                    aria-label="Share on X"
                  >
                    𝕏
                  </button>
                </div>
              )}

              <button
                type="button"
                aria-expanded={isShareMenuOpen}
                aria-haspopup="true"
                onClick={() => setIsShareMenuOpen((current) => !current)}
                className="hover:cursor-pointer flex items-center w-fit"
              >
                <img
                  src={shareIcon}
                  width={70}
                  alt="Share"
                  className="pointer-events-none"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div
        className="w-full overflow-hidden pt-3 pb-7"
        style={{
          background: `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 5%, ${backgroundColor} 100%)`,
        }}
      >
        <div className="flex flex-col justify-between items-center md:flex-row gap-6 mx-2">
          {/* Left Side - Device Image */}
          <div className="grid grid-cols-1 relative">
            <img
              width={400}
              src={device.image}
              alt={device.name}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Right Side - Specifications Grid */}
          <div className="flex flex-col w-full items-end justify-between gap-12 ">
            <div className="grid gap-2 w-[80%]">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid grid-cols-2 gap-2 justify-center ">
                  <div className="bg-[#0580A5] text-white py-2 flex flex-col gap-2 justify-center items-center">
                    <div className="flex items-center gap-2 justify-center ">
                      <img src={displayIcon} width={23} height={37} alt="" />
                      <div className="">
                        <div className="font-semibold text-base sm:text-4xl">
                          {device.specs.display}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-center leading-none mx-auto text-xs opacity-90">
                        {device.specs.displayResolution}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0580A5] flex flex-col gap-2 text-white py-2 justify-center items-center">
                    <div className="flex items-center gap-2 justify-center">
                      <img src={cameraIcon} alt="" />
                      <div className="">
                        <div className="font-semibold text-base sm:text-2xl">
                          {device.specs.camera}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-center mx-auto text-xs opacity-90">
                        {device.specs.cameraVideo}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0580A5] text-white py-2">
                    <div className="flex justify-center mx-auto items-center flex-col gap-1 h-full">
                      <img src={ramIcon} width={30} alt="" />
                      <div className="">
                        <div className="text-base sm:text-[14px] leading-none text-center">
                          {device.specs.ram}
                        </div>
                        <div className="text-center mx-auto text-[9px] opacity-90">
                          {device.specs.chipset}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0580A5] text-white py-2">
                    <div className="flex flex-col items-center justify-center gap-2 h-full">
                      <img src={batteryIcon} width={33} alt="" />
                      <div className="flex flex-col gap-0 ">
                        <div className="text-base leading-none sm:text-[14px] text-center">
                          {device.specs.battery}
                        </div>
                        <div className="text-center mx-auto text-sm opacity-90">
                          {device.specs.batteryType}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div
                    className="flex items-center gap-2 text-white"
                    style={{
                      background:
                        "linear-gradient(to right, #0580A5, transparent)",
                    }}
                  >
                    <div className="bg-[#03708F] px-2 py-2 h-full flex items-center">
                      <img src={osIcon} alt="" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className=" sm:text-[10px] ">
                        Released {device.releaseDate}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 text-white"
                    style={{
                      background:
                        "linear-gradient(to right, #0580A5, transparent)",
                    }}
                  >
                    <div className="bg-[#03708F] px-2 py-2  h-full flex items-center">
                      <img src={phoneSizeIcon} alt="" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className=" sm:text-[10px] ">
                        {device.specs.dimensions}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 text-white"
                    style={{
                      background:
                        "linear-gradient(to right, #0580A5, transparent)",
                    }}
                  >
                    <div className="bg-[#03708F] px-2 py-2  h-full flex items-center">
                      <img src={specsIcon} alt="" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className=" sm:text-[10px] ">{device.specs.os}</div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 text-white"
                    style={{
                      background:
                        "linear-gradient(to right, #0580A5, transparent)",
                    }}
                  >
                    <div className="bg-[#03708F] px-2 py-2  h-full flex items-center">
                      <img src={storageIcon} alt="" />
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className=" sm:text-[10px] ">
                        {device.specs.storage}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {device.prices.map((price, index) => (
                  <div
                    key={index}
                    className="bg-[#0580A5] text-white items-center justify-between gap-2 px-2 py-2 text-center flex"
                  >
                    <img
                      src={price.flag}
                      alt={price.country}
                      className="w-10 h-auto object-cover"
                    />
                    <div className="text-xs sm:text-sm ">{price.amount}</div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="flex w-full  gap-0"
              style={{
                background: "linear-gradient(to right, #0580A5, transparent)",
              }}
            >
              <div
                className="flex items-center gap-0 text-white px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() =>
                  navigate("/comparison", {
                    state: {
                      deviceToCompare: device,
                      rawDeviceData: productData,
                    },
                  })
                }
              >
                <div className="p-2 flex items-center">
                  <img src={compareIcon} alt="Compare" className="" />
                </div>
                <div className="flex-1 flex items-center">
                  <div className="text-sm sm:text-[18px] ">Compare</div>
                </div>
              </div>
              <button
                type="button"
                onClick={onCommentsClick}
                className="flex items-center gap-0 text-white px-4 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="p-2 flex items-center">
                  <img src={commentsIcon} alt="Comments" className="" />
                </div>
                <div className="flex-1 flex items-center">
                  <div className="text-sm sm:text-[18px] ">Comments</div>
                </div>
              </button>
              <div
                className="flex items-center gap-0 text-white  px-4 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsGalleryOpen(true)}
              >
                <div className="p-2 flex items-center">
                  <img src={picturesIcon} alt="Pictures" className="" />
                </div>
                <div className="flex-1 flex items-center">
                  <div className="text-sm sm:text-[18px] ">Pictures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={productData?.gallery}
        productName={productData?.name}
      />
    </div>
  );
};

export default MobileSpecsDetail;
