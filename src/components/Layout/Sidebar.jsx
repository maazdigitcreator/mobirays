import React from 'react';
import SidebarIntro from '../SidebarSections/SidebarIntro';
import SidebarBrands from '../SidebarSections/SidebarBrands';
import SidebarFilters from '../SidebarSections/SidebarFilters';
import SidebarStats from '../SidebarSections/SidebarStats';
import SidebarLatestModels from '../SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../SidebarSections/SidebarBanner2';
import SidebarBanner3 from '../SidebarSections/SidebarBanner3';

const Sidebar = ({ bottomImage }) => {
    return (
        <div className="flex flex-col gap-2">

            {/* Intro Section (Banners) */}
            <SidebarIntro />

            {/* Search by Brands Section */}
            <SidebarBrands />

            {/* Search Filters Section */}
            <SidebarFilters />

            {/* Banner 1 */}
            <SidebarBanner1 />

            <div className="flex flex-col gap-6">
                {/* Stats Sections (Visitors & Likes) */}
                <SidebarStats />

                {/* Banner 2 */}
                <SidebarBanner2 />

                {/* Latest Mobile Phone Models */}
                <SidebarLatestModels />

                {/* Bottom Banner */}
                {bottomImage ? (
                    <div>
                        <img className='w-full' src={bottomImage} alt="" />
                    </div>
                ) : (
                    <SidebarBanner3 />
                )}
            </div>

        </div>
    );
};

export default Sidebar;