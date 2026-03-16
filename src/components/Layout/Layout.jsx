import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import BannerAd from '../BannerAd';
import { useData } from '../../context/DataContext';

const Layout = ({ children }) => {
    const { allBanners } = useData();
    const mainBanner = allBanners.find(b => b.location === 'main_banner_home');

    return (
        <div className="flex min-h-screen flex-col overflow-x-clip font-sans">
            <Header />
            <Navbar />
            {mainBanner && (
                <div className="flex w-full justify-center bg-white px-2 py-1 sm:p-0">
                    <div className="mx-auto w-full max-w-[1440px] overflow-hidden sm:px-5">
                        <BannerAd banner={mainBanner} className="w-full" />
                    </div>
                </div>
            )}
            <main className="flex-grow overflow-x-clip bg-white">
                <div className="mx-auto w-full max-w-[1440px] overflow-x-clip px-2 py-2 sm:px-5">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
