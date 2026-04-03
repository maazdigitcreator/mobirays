import React, { useEffect, useState } from "react";
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
import { filterProductsByCategory } from "../utils/filterHelpers";

const ITEMS_PER_PAGE = 24;
const HOME_SECTIONS = [
  {
    id: "phones",
    title: "Latest Phones",
    category: "Mobile Phones",
    itemImage: mobileImg,
    showMoreLink: "/phones",
    bannerLocation: "home_banner_1",
  },
  {
    id: "tablets",
    title: "Latest Tabs",
    category: "Tablets",
    itemImage: tabImg,
    showMoreLink: "/tablets",
    bannerLocation: "home_banner_2",
  },
  {
    id: "watches",
    title: "Latest Smartwatches",
    category: "Smartwatches",
    itemImage: watchImg,
    showMoreLink: "/smartwatches",
  },
];

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts, allBanners } = useData();

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

  const appliedFilters = React.useMemo(
    () => decodeSidebarFilterQuery(filtersParam),
    [filtersParam],
  );
  const isFilteredView = appliedFilters.length > 0;

  const homeBanners = React.useMemo(() => {
    const map = {};
    ["home_banner_1", "home_banner_2", "home_banner_3"].forEach((loc) => {
      const banner = allBanners.find((item) => item.location === loc);
      if (banner) map[loc] = banner;
    });
    return map;
  }, [allBanners]);

  const categorizedProducts = React.useMemo(() => {
    const sourceProducts = isFilteredView ? filteredProducts : allProducts;

    return HOME_SECTIONS.reduce((acc, section) => {
      acc[section.id] = filterProductsByCategory(
        sourceProducts,
        section.category,
      );
      return acc;
    }, {});
  }, [allProducts, filteredProducts, isFilteredView]);

  // Filtered view — call filter API with body when filters are applied
  useEffect(() => {
    if (!isFilteredView) return;

    const controller = new AbortController();

    const fetchFiltered = async () => {
      setFilteredProductsStatus({ loading: true, error: "" });
      try {
        const response = await filterService.applyFilters({
          categories: appliedFilters,
          page: filteredPage,
          perPage: ITEMS_PER_PAGE,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setFilteredProducts(Array.isArray(response?.data) ? response.data : []);
        setFilteredProductsMeta(response?.meta ?? null);
        setFilteredProductsStatus({ loading: false, error: "" });
      } catch (err) {
        if (controller.signal.aborted) return;
        setFilteredProducts([]);
        setFilteredProductsMeta(null);
        setFilteredProductsStatus({
          loading: false,
          error:
            err?.data?.message ||
            err?.message ||
            "Failed to load filtered products.",
        });
      }
    };

    void fetchFiltered();
    return () => controller.abort();
  }, [appliedFilters, filteredPage, isFilteredView]);

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

            {isFilteredView && filteredProductsStatus.error && (
              <div className="mt-6 border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                {filteredProductsStatus.error}
              </div>
            )}

            {isFilteredView && filteredProductsStatus.loading ? (
              <div className="py-10 text-center text-gray-500">
                Loading filtered products...
              </div>
            ) : (
              <>
                {HOME_SECTIONS.map((section, index) => {
                  const sectionProducts = categorizedProducts[section.id] || [];

                  // In filtered view: hide section if empty
                  if (isFilteredView && sectionProducts.length === 0) return null;

                  // In normal view: always show all 3 sections (original behaviour)
                  const displayProducts = isFilteredView
                    ? sectionProducts
                    : sectionProducts.slice(0, ITEMS_PER_PAGE);

                  return (
                    <React.Fragment key={section.id}>
                      <div className={index === 0 ? "" : "mt-10"}>
                        <LatestProducts
                          title={section.title}
                          products={displayProducts}
                          itemImage={section.itemImage}
                        />
                        {/* Normal view: Show More + Coming Soon buttons */}
                        {!isFilteredView && (
                          <ProductsSectionButton
                            showMoreLink={section.showMoreLink}
                            comingSoonLink="/coming-soon"
                          />
                        )}
                      </div>

                      {section.bannerLocation &&
                        homeBanners[section.bannerLocation] && (
                          <div className="mt-7 hidden sm:block">
                            <BannerAd
                              banner={homeBanners[section.bannerLocation]}
                              className="h-[200px] sm:w-full"
                            />
                          </div>
                        )}
                    </React.Fragment>
                  );
                })}

                {isFilteredView && filteredProductsMeta?.last_page > 1 && (
                  <Pagination
                    currentPage={filteredProductsMeta.current_page}
                    totalPages={filteredProductsMeta.last_page}
                    onPageChange={handleFilteredPageChange}
                  />
                )}
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
