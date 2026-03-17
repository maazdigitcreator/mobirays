import { FaApple, FaFacebook, FaInstagram, FaRss, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import { socialLinks, storeLinks } from '../../constants/siteLinks';

const primaryLinks = [
    { to: '/', label: 'Home' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/news', label: 'News' },
    { to: '/videos', label: 'Videos' },
    { to: '/whats-new', label: "What's New" },
    { to: '/dictionary', label: 'Dictionary' },
];

const secondaryLinks = [
    { to: '/terms', label: 'Terms of Use' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/about', label: 'Advertise' },
    { to: '/contact', label: 'Contact us' },
];

const socialIconMap = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    youtube: FaYoutube,
    rss: FaRss,
};

const GooglePlayBadgeIcon = ({ className = '' }) => (
    <svg
        viewBox="0 0 512 512"
        aria-hidden="true"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M48 43.5V468.5C48 482.7 62.9 491.8 75.4 485.7L313.4 268.7L75.4 26.3C62.9 20.2 48 29.3 48 43.5Z" fill="#00A0FF" />
        <path d="M313.4 268.7L389.6 199.4L75.4 26.3C71.4 24.3 67.1 23.4 63 23.5L313.4 268.7Z" fill="#EA4335" />
        <path d="M313.4 268.7L63 488.5C67.1 488.6 71.4 487.7 75.4 485.7L389.6 312.6L313.4 268.7Z" fill="#34A853" />
        <path d="M389.6 199.4L313.4 268.7L389.6 312.6L454.7 276.7C469.8 268.3 469.8 243.7 454.7 235.3L389.6 199.4Z" fill="#FBBC04" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="overflow-x-hidden bg-white px-4 pb-6 pt-5">
            <div className="mx-auto flex max-w-[1337px] flex-col items-center gap-6">
                <p className="max-w-[1337px] text-center text-[13px] leading-[1.35] text-[#676767] sm:text-[18px] lg:text-[24px]">
                    Disclaimer. Mobile Prices are updated daily from local Pakistani Mobile shops &amp; Mobile dealers in Pakistan but we can not guarantee that the information (Prices) on this page is 100% correct (Human error is possible). Always visit your local shop for exact mobile prices. &quot;Above mobile prices and rates are only valid in Pakistan&quot;
                </p>

                <img src={Logo} alt="mobirays.com" className="w-[220px] sm:w-[320px] lg:w-[713px]" />

                <div className="flex flex-wrap items-center justify-center gap-5 text-[#4f4f4f] sm:gap-8">
                    {socialLinks.map((link) => {
                        const Icon = socialIconMap[link.key];

                        if (!link.href) {
                            return (
                                <span
                                    key={link.key}
                                    aria-label={`${link.label} link unavailable`}
                                    className="transition-colors"
                                >
                                    <Icon size={22} />
                                </span>
                            );
                        }

                        return (
                            <a
                                key={link.key}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className="transition-colors hover:text-[#0580A5]"
                            >
                                <Icon size={22} />
                            </a>
                        );
                    })}
                </div>

                <div className="grid w-full max-w-[648px] grid-cols-[minmax(0,1fr)_110px] gap-2 sm:grid-cols-[minmax(0,1fr)_140px] lg:grid-cols-[408px_222px] sm:justify-center">
                    <input
                        type="email"
                        placeholder="Enter your email here"
                        className="h-[44px] min-w-0 border border-[#0580A5] bg-[#ECEBED] px-3 text-[12px] text-[#4f4f4f] outline-none placeholder:text-[#4f4f4f] sm:h-[52px] sm:px-4 sm:text-[16px] lg:h-[62px] lg:text-[28px]"
                    />
                    <button className="h-[44px] bg-[#0580A5] px-3 text-[12px] font-medium text-white transition-colors hover:bg-[#046f8f] sm:h-[52px] sm:px-4 sm:text-[16px] lg:h-[62px] lg:px-6 lg:text-[28px]">
                        Subscribe
                    </button>
                </div>

                <div className="max-w-[952px] text-center text-[11px] leading-[1.45] text-[#4f4f4f] sm:text-[16px] lg:text-[24px]">
                    <div className="flex flex-wrap justify-center gap-x-1">
                        {primaryLinks.map((link, index) => (
                            <span key={link.label} className="whitespace-nowrap">
                                <Link to={link.to} className="hover:text-[#0580A5]">{link.label}</Link>
                                {index < primaryLinks.length - 1 ? ' |' : ''}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-1">
                        {secondaryLinks.map((link, index) => (
                            <span key={link.label} className="whitespace-nowrap">
                                <Link to={link.to} className="hover:text-[#0580A5]">{link.label}</Link>
                                {index < secondaryLinks.length - 1 ? ' |' : ''}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-center text-[11px] text-[#4f4f4f] sm:text-[14px] lg:text-[18px]">
                    Copyright © 2020 www.mobicraze.com.pk. All Rights Reserved.
                </p>

                <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3">
                    {storeLinks.googlePlay ? (
                        <a
                            href={storeLinks.googlePlay}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-[34px] w-[104px] shrink-0 items-center gap-1 rounded-[6px] border border-[#a6a6a6] bg-black px-2 text-white sm:h-[44px] sm:w-[132px] sm:gap-2 sm:px-2.5 lg:h-[61px] lg:w-[183px] lg:gap-3 lg:rounded-[9px] lg:px-3"
                        >
                            <GooglePlayBadgeIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-[30px] lg:w-[30px]" />
                            <div className="text-left">
                                <div className="text-[7px] uppercase leading-none sm:text-[8px] lg:text-[12px]">Get it on</div>
                                <div className="text-[11px] leading-none sm:text-[13px] lg:text-[20px]">Google Play</div>
                            </div>
                        </a>
                    ) : (
                        <span className="flex h-[34px] w-[104px] shrink-0 items-center gap-1 rounded-[6px] border border-[#a6a6a6] bg-black px-2 text-white sm:h-[44px] sm:w-[132px] sm:gap-2 sm:px-2.5 lg:h-[61px] lg:w-[183px] lg:gap-3 lg:rounded-[9px] lg:px-3">
                            <GooglePlayBadgeIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-[30px] lg:w-[30px]" />
                            <div className="text-left">
                                <div className="text-[7px] uppercase leading-none sm:text-[8px] lg:text-[12px]">Get it on</div>
                                <div className="text-[11px] leading-none sm:text-[13px] lg:text-[20px]">Google Play</div>
                            </div>
                        </span>
                    )}
                    {storeLinks.appStore ? (
                        <a
                            href={storeLinks.appStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-[34px] w-[104px] shrink-0 items-center gap-1 rounded-[6px] border border-[#a6a6a6] bg-black px-2 text-white sm:h-[44px] sm:w-[132px] sm:gap-2 sm:px-2.5 lg:h-[61px] lg:w-[183px] lg:gap-3 lg:rounded-[9px] lg:px-3"
                        >
                            <FaApple className="shrink-0" size={16} />
                            <div className="text-left">
                                <div className="text-[7px] leading-none sm:text-[8px] lg:text-[12px]">Download on the</div>
                                <div className="text-[11px] leading-none sm:text-[13px] lg:text-[20px]">App Store</div>
                            </div>
                        </a>
                    ) : (
                        <span className="flex h-[34px] w-[104px] shrink-0 items-center gap-1 rounded-[6px] border border-[#a6a6a6] bg-black px-2 text-white sm:h-[44px] sm:w-[132px] sm:gap-2 sm:px-2.5 lg:h-[61px] lg:w-[183px] lg:gap-3 lg:rounded-[9px] lg:px-3">
                            <FaApple className="shrink-0" size={16} />
                            <div className="text-left">
                                <div className="text-[7px] leading-none sm:text-[8px] lg:text-[12px]">Download on the</div>
                                <div className="text-[11px] leading-none sm:text-[13px] lg:text-[20px]">App Store</div>
                            </div>
                        </span>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
