import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import BannerAd from '../BannerAd';
import { useData } from '../../context/useData';

const Layout = ({ children }) => {
    const { allBanners } = useData();
    const mainBanner = allBanners.find(b => b.location === 'main_banner_home');

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header />
            <Navbar />
            {mainBanner && (
                <div className="w-full bg-white flex justify-center px-2 py-1 sm:p-0">
                    <BannerAd banner={mainBanner} className="w-full h-50 sm:h-auto" />
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
