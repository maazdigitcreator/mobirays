import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaRss } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.png';

const Footer = () => {
    return (
        <footer className="bg-[#FFF] pt-8 pb-6">
            {/* Disclaimer Section */}
             <div className="text-center px-4 mb-6">
                <p className="text-gray-700 sm:text-[24px] text-[13px] max-w-[90%] mx-auto leading-relaxed">
                    Disclaimer. Mobile Prices are updated daily from local Pakistani Mobile shops & Mobile dealers in Pakistan but we
                    can not guarantee that the information (Prices) on this page is 100% correct (Human error is possible). Always visit
                    your local shop for exact mobile prices. *Above mobile prices and rates are only valid in Pakistan
                </p>
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-6">
                <img src={Logo} alt="mobirays.com" className="h-16" />
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center gap-6 mb-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                    <FaFacebook size={28} />
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                    <FaTwitter size={28} />
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                    <FaInstagram size={28} />
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                    <FaYoutube size={28} />
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                    <FaRss size={28} />
                </a>
            </div>

            {/* Newsletter Subscription */}
            <div className="flex justify-center mb-6 px-4">
                <div className="flex gap-2 max-w-md w-full">
                    <input
                        type="email"
                        placeholder="Enter your email here"
                        className="flex-1 px-4 py-2.5 border border-gray-400 rounded text-sm focus:outline-none focus:border-cyan-600"
                    />
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded font-medium transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>

            {/* Main Navigation Links */}
            <div className="text-center mb-3 px-4">
                <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm text-gray-700">
                    <Link to="/" className="hover:text-gray-900">Home</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/reviews" className="hover:text-gray-900">Reviews</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/news" className="hover:text-gray-900">News</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/videos" className="hover:text-gray-900">Videos</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/whats-new" className="hover:text-gray-900">What's New</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/dictionary" className="hover:text-gray-900">Dictionary</Link>
                </div>
            </div>

            {/* Footer Links */}
            <div className="text-center mb-3 px-4">
                <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm text-gray-700">
                    <Link to="/terms" className="hover:text-gray-900">Terms of Use</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/privacy" className="hover:text-gray-900">Privacy</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/about" className="hover:text-gray-900">About</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/contact" className="hover:text-gray-900">Contact us</Link>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center mb-4 px-4">
                <p className="text-gray-600 text-xs">
                    Copyright © 2026 www.mobirays.com. All Rights Reserved.
                </p>
            </div>

            {/* App Store Badges */}
            {/* <div className="flex justify-center gap-3 px-4">
                <a href="#" className="block">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Get it on Google Play"
                        className="h-10"
                    />
                </a>
                <a href="#" className="block">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                        alt="Download on the App Store"
                        className="h-10"
                    />
                </a>
            </div> */}
        </footer>
    );
};

export default Footer;
