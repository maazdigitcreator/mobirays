import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/useData";
import LatestProducts from "../components/LatestProducts";
import Pagination from "../components/Pagination";

import ProductsSectionButton from "../components/ProductsSectionButton";
import LatestNews from "../components/LatestNews";
import LatestReviews from "../components/LatestReviews";

import mobileImg from "../assets/mobileImg.jpg";
import tabImg from "../assets/tabImg.jpg";
import SidebarIntro from "../components/SidebarSections/SidebarIntro";
import SidebarBrands from "../components/SidebarSections/SidebarBrands";
import SidebarFilters from "../components/SidebarSections/SidebarFilters";
import SidebarStats from "../components/SidebarSections/SidebarStats";
import SidebarLatestModels from "../components/SidebarSections/SidebarLatestModels";
import SidebarBanner1 from "../components/SidebarSections/SidebarBanner1";
import SidebarBanner2 from "../components/SidebarSections/SidebarBanner2";
import SidebarBanner3 from "../components/SidebarSections/SidebarBanner3";
import watchImg from "../assets/watchImg.png";
import HeroBanner from "../components/Layout/HeroBanner";
import BannerAd from "../components/BannerAd";
import { filterService } from "../services/filterService";
import { decodeSidebarFilterQuery } from "../utils/sidebarFilters";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allBanners } = useData();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredProductsMeta, setFilteredProductsMeta] = useState(null);
  const [filteredProductsStatus, setFilteredProductsStatus] = useState({
    loading: false,
    error: "",
  });

  const searchParams = new URLSearchParams(location.search);
  const filtersParam = searchParams.get("filters");
  const filteredPageParam = Number(searchParams.get("page"));
  const filteredPage =
    Number.isInteger(filteredPageParam) && filteredPageParam > 0
      ? filteredPageParam
      : 1;
  const appliedFilters = React.useMemo(() => {
    return decodeSidebarFilterQuery(filtersParam);
  }, [filtersParam]);

  const homeBanners = React.useMemo(() => {
    const map = {};
    ["home_banner_1", "home_banner_2", "home_banner_3"].forEach((loc) => {
      const banner = allBanners.find((item) => item.location === loc);
      if (banner) map[loc] = banner;
    });
    return map;
  }, [allBanners]);

  useEffect(() => {
    if (appliedFilters.length === 0) {
      return;
    }

    const controller = new AbortController();

    const fetchFilteredProducts = async () => {
      setFilteredProductsStatus({
        loading: true,
        error: "",
      });

      try {
        const response = await filterService.applyFilters({
          categories: appliedFilters,
          page: filteredPage,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setFilteredProducts(response.data);
        setFilteredProductsMeta(response.meta);
        setFilteredProductsStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setFilteredProducts([]);
        setFilteredProductsMeta(null);
        setFilteredProductsStatus({
          loading: false,
          error:
            error?.data?.message ||
            error?.message ||
            "Failed to load filtered products.",
        });
      }
    };

    void fetchFilteredProducts();

    return () => {
      controller.abort();
    };
  }, [appliedFilters, filteredPage]);

  const handleFilteredPageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(page));
    navigate(`/?${params.toString()}`);
  };

  return (
    <div>
      <div>
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Sidebar Column */}
          <div className="w-full lg:w-1/3 hidden lg:block">
            <div className="flex flex-col gap-2">
              <SidebarIntro />
              <SidebarBrands />
              <SidebarFilters />
              <SidebarBanner1 />
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
            <HeroBanner />

            {appliedFilters.length > 0 ? (
              <div className="mt-6">
                {filteredProductsStatus.error && (
                  <div className="border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                    {filteredProductsStatus.error}
                  </div>
                )}

                {filteredProductsStatus.loading ? (
                  <div className="py-10 text-center text-gray-500">
                    Loading filtered products...
                  </div>
                ) : (
                  <>
                    <LatestProducts
                      title="Filtered Products"
                      products={filteredProducts}
                      itemImage={mobileImg}
                    />

                    {filteredProductsMeta?.last_page > 1 && (
                      <Pagination
                        currentPage={filteredProductsMeta.current_page}
                        totalPages={filteredProductsMeta.last_page}
                        onPageChange={handleFilteredPageChange}
                      />
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                <div>
                  <LatestProducts
                    title="Latest Phones"
                    itemImage={mobileImg}
                    category="Mobile Phones"
                    limit={24}
                  />
                  <ProductsSectionButton
                    showMoreLink="/phones"
                    comingSoonLink="/coming-soon"
                  />
                </div>

                {homeBanners["home_banner_1"] && (
                  <div className="mt-7 hidden sm:block">
                    <BannerAd
                      banner={homeBanners["home_banner_1"]}
                      className="h-[200px] sm:w-full"
                    />
                  </div>
                )}
                <div className="mt-10">
                  <LatestProducts
                    title="Latest Tabs"
                    itemImage={tabImg}
                    category="Tablets"
                    limit={24}
                  />
                  <ProductsSectionButton
                    showMoreLink="/tablets"
                    comingSoonLink="/coming-soon"
                  />
                </div>

                {homeBanners["home_banner_2"] && (
                  <div className="mt-7 hidden sm:block">
                    <BannerAd
                      banner={homeBanners["home_banner_2"]}
                      className="h-[200px] sm:w-full"
                    />
                  </div>
                )}
                <div className="mt-10">
                  <LatestProducts
                    title="Latest Smartwatches"
                    itemImage={watchImg}
                    category="Smartwatches"
                    limit={24}
                  />
                  <ProductsSectionButton
                    showMoreLink="/smartwatches"
                    comingSoonLink="/coming-soon"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {homeBanners["home_banner_3"] && (
          <div className="mt-7">
            <BannerAd
              banner={homeBanners["home_banner_3"]}
              className="h-[200px] sm:h-auto sm:w-full"
            />
          </div>
        )}
        <div className="mt-10">
          <LatestNews title="Latest News" gridCols="sm:grid-cols-3" limit={6} />
        </div>
        <div className="mt-10">
          <LatestReviews
            title="Latest Reviews"
            gridCols="sm:grid-cols-4"
            limit={8}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
