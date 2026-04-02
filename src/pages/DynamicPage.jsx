import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useData } from "../context/useData";
import { createSlug } from "../utils/urlHelper";

// Reusing Home's Sidebar components
import SidebarIntro from "../components/SidebarSections/SidebarIntro";
import SidebarBrands from "../components/SidebarSections/SidebarBrands";
import SidebarFilters from "../components/SidebarSections/SidebarFilters";
import SidebarStats from "../components/SidebarSections/SidebarStats";
import SidebarLatestModels from "../components/SidebarSections/SidebarLatestModels";
import SidebarBanner1 from "../components/SidebarSections/SidebarBanner1";
import SidebarBanner2 from "../components/SidebarSections/SidebarBanner2";
import SidebarBanner3 from "../components/SidebarSections/SidebarBanner3";
import HeroBanner from "../components/Layout/HeroBanner";

const DynamicPage = () => {
  const { pageSlug } = useParams();
  const { dynamicPages, loading } = useData();

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-gray-500 text-lg">
        Loading page content...
      </div>
    );
  }

  // Find the matching page by generating a slug from the name
  const page = dynamicPages.find((p) => createSlug(p.name) === pageSlug);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Sidebar Column - Same as Home.jsx */}
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
        {/* Title Header matches About.jsx style to keep consistency across standard pages */}
        <div className="relative w-full flex items-end justify-center lg:justify-start mb-6 mt-1">
          <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>
          <div
            className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-14 flex items-center justify-center relative z-10"
            style={{
              clipPath:
                "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
              paddingLeft: "20px",
              paddingRight: "80px",
            }}
          >
            <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4 uppercase tracking-wide">
              {page.name}
            </h2>
          </div>
        </div>

        {/* Dynamic HTML Injection from API */}
        <div className="bg-white px-2 py-4 sm:px-4 sm:py-6">
          <div
            className="prose max-w-none text-[#1E1E1E]"
            dangerouslySetInnerHTML={{ __html: page.content || "" }}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
