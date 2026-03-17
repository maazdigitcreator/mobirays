import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import BannerAd from '../BannerAd';

const SidebarIntro = () => {
    const { allBanners } = useData();
    const [banner1, setBanner1] = useState(null);
    const [banner2, setBanner2] = useState(null);

    useEffect(() => {
        if (allBanners.length > 0) {
            const b1 = allBanners.find(b => b.location === 'sidebar_banner_1');
            const b2 = allBanners.find(b => b.location === 'sidebar_banner_2');
            if (b1) setBanner1(b1);
            if (b2) setBanner2(b2);
        }
    }, [allBanners]);

    return (
        <div className='flex flex-col gap-2 h-auto'>
            {/* Sidebar Banner 1 */}
            <div className="overflow-hidden shadow-sm hover:shadow-md transition-shadow lg:h-[236px]">
                {banner1 && <BannerAd banner={banner1} className="h-full object-cover" />}
            </div>

            {/* Sidebar Banner 2 */}
            <div className="overflow-hidden shadow-sm hover:shadow-md transition-shadow lg:h-[236px]">
                {banner2 && <BannerAd banner={banner2} className="h-full object-cover" />}
            </div>
        </div>
    );
};

export default SidebarIntro;
