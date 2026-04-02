import { useState, useEffect } from 'react';
import { useData } from '../../context/useData';
import BannerAd from '../BannerAd';

const SidebarBanner1 = () => {
    const { allBanners } = useData();
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        if (allBanners.length > 0) {
            const b = allBanners.find(b => b.location === 'sidebar_banner_3');
            if (b) setBanner(b);
        }
    }, [allBanners]);

    if (!banner) return null;

    return (
        <div>
            <BannerAd banner={banner} />
        </div>
    );
};

export default SidebarBanner1;
