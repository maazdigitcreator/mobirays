import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const SidebarIntro = () => {
    const { allBanners } = useData();
    const [banner1Src, setBanner1Src] = useState(null);
    const [banner2Src, setBanner2Src] = useState(null);

    useEffect(() => {
        if (allBanners.length > 0) {
            const b1 = allBanners.find(b => b.location === 'sidebar_banner_1');
            const b2 = allBanners.find(b => b.location === 'sidebar_banner_2');
            if (b1?.image) setBanner1Src(b1.image);
            if (b2?.image) setBanner2Src(b2.image);
        }
    }, [allBanners]);

    return (
        <div className='flex flex-col gap-2 sm:h-120 h-auto'>
            {/* Sidebar Banner 1 */}
            <div className="md:col-span-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {banner1Src && (
                    <img src={banner1Src} alt="Sidebar Banner 1" className="w-full h-full object-cover" />
                )}
            </div>

            {/* Sidebar Banner 2 */}
            <div className="md:col-span-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {banner2Src && (
                    <img src={banner2Src} alt="Sidebar Banner 2" className="w-full h-full object-cover" />
                )}
            </div>
        </div>
    );
};

export default SidebarIntro;
