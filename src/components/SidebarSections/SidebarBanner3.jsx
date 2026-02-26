import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const SidebarBanner3 = () => {
    const { allBanners } = useData();
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        if (allBanners.length > 0) {
            const b = allBanners.find(b => b.location === 'sidebar_banner_5');
            if (b?.image) setImgSrc(b.image);
        }
    }, [allBanners]);

    if (!imgSrc) return null;

    return (
        <div>
            <img className='w-full' src={imgSrc} alt="Sidebar Banner" />
        </div>
    );
};

export default SidebarBanner3;
