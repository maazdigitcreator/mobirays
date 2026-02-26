import React, { useState, useEffect } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [bannerImg, setBannerImg] = useState(null);

    useEffect(() => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
        fetch(`${apiBaseUrl}/api/v1/banner`)
            .then(res => res.json())
            .then(data => {
                const allBanners = Array.isArray(data.data) ? data.data : [];
                const mainBanner = allBanners.find(b => b.location === 'main_banner_home' && b.image);
                if (mainBanner) setBannerImg(mainBanner.image);
            })
            .catch(() => { });
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />
            <Navbar />
            {bannerImg && (
                <div className="w-full bg-white flex justify-center px-2 py-1 sm:p-0">
                    <img src={bannerImg} alt="Main Banner" className="w-full h-auto" />
                </div>
            )}
            <main className="flex-grow bg-white">
                <div className="mx-auto px-2 sm:px-5 py-2">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
