import { useState } from "react";
import {
    Search,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Rss,
    LogIn,
    LogOut,
    UserPlus,
    User,
    Menu,
    MoreHorizontal,
    X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Logo from "../../assets/Logo.png";
import WhatsNewImg from "../../assets/whatsnew.png";
import SearchModal from "./SearchModal";
import MobileSidebar from "./MobileSidebar";
import MobileMenu from "./MobileMenu";
import { socialLinks } from "../../constants/siteLinks";

const socialIconMap = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    rss: Rss,
};

const Header = () => {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setIsSearchModalOpen(false);
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        } else {
            setIsSearchModalOpen(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="w-full border-b border-gray-200 bg-white">
            {/* Desktop Header */}
            <div className="hidden lg:block">
                <div className="mx-auto max-w-[1440px] px-[30px] py-3">
                    <div className="flex items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="min-w-0 shrink-0">
                            <Link to="/" className="flex items-baseline">
                                <img className="w-[300px] xl:w-[420px]" src={Logo} alt="mobirays" />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="search-container relative w-full max-w-[441px] shrink-0">
                            <div className="flex h-[42px] items-center overflow-hidden border-2 border-[#0891b2]">
                                <div className="relative flex flex-1 items-center px-3 py-2">
                                    <input
                                        type="text"
                                        placeholder="Phones | Tabs | Smartwatches"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsSearchModalOpen(true);
                                        }}
                                        onFocus={() => setIsSearchModalOpen(true)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 pr-6 text-sm outline-none placeholder-[#1E1E1E]"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setIsSearchModalOpen(false);
                                            }}
                                            className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Clear search"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="flex h-full min-w-[108px] items-center justify-center gap-2 bg-[#0891b2] px-3 text-base text-white transition-colors hover:bg-[#0e7490] cursor-pointer"
                                >
                                    <Search size={18} className="scale-x-[-1] text-white" />
                                    Search
                                </button>
                            </div>

                            {/* Search Modal - Positioned below search bar */}
                            {isSearchModalOpen && !isMobileMenuOpen && (
                                <SearchModal
                                    isOpen={isSearchModalOpen}
                                    onClose={() => setIsSearchModalOpen(false)}
                                    searchQuery={searchQuery}
                                />
                            )}
                        </div>

                        <div className="shrink-0">
                            <Link to="/whats-new">
                                <div
                                    className="hover:cursor-pointer"
                                    style={{
                                        animation: 'blinkToggle 2s steps(1, end) infinite',
                                    }}
                                >
                                    <style>{`
                                        @keyframes blinkToggle {
                                            0%, 49.99% { opacity: 1; }
                                            50%, 100% { opacity: 0; }
                                        }
                                    `}</style>
                                    <img src={WhatsNewImg} alt="Whats New?" className="h-14 w-auto" />
                                </div>
                            </Link>
                        </div>

                        {/* Social Icons */}
                        <div className="flex shrink-0 items-center gap-1">
                            {socialLinks.map((link) => {
                                const Icon = socialIconMap[link.key];
                                const commonClassName = "p-2 bg-[#fff] border-2 border-[#0580A5] text-[#0580A5]";

                                if (!link.href) {
                                    return (
                                        <span
                                            key={link.key}
                                            aria-label={`${link.label} link unavailable`}
                                            className={commonClassName}
                                        >
                                            <Icon size={25} />
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
                                        className={commonClassName}
                                    >
                                        <Icon size={25} />
                                    </a>
                                );
                            })}
                            {user ? (
                                <div className="ml-2 flex items-center gap-3 p-2 bg-[#fff] border-2 border-[#0580A5]">
                                    <User size={22} className="text-[#0580A5]" />
                                    <span className="text-[#0580A5] text-sm font-medium max-w-[100px] truncate">
                                        {user.name || user.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[#0580A5] hover:text-red-500 transition-colors cursor-pointer"
                                        title="Logout"
                                    >
                                        <LogOut size={22} />
                                    </button>
                                </div>
                            ) : (
                                <div className="ml-2 flex gap-3 p-2 bg-[#fff] border-2 border-[#0580A5]">
                                    <Link to="/login" className="p-0 bg-[#fff] text-[#0580A5]">
                                        <LogIn size={25} />
                                    </Link>
                                    <Link to="/signup" className="p-0 bg-[#fff] text-[#0580A5]">
                                        <UserPlus size={25} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden">
                {/* Top Row: Hamburger | Logo | Login/Account */}
                <div className="relative z-[60] flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-3">
                    {/* Hamburger Menu */}
                    <button
                        id="mobile-sidebar-toggle"
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        className="p-0 text-[#087FA5] hover:text-gray-900"
                    >
                        <Menu size={28} />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex min-w-0 flex-1 justify-center px-2">
                        <img src={Logo} alt="mobirays" className="h-8" />
                    </Link>

                    {/* Login/Account Icons */}
                    {user ? (
                        <div className="flex max-w-[42%] shrink-0 items-center gap-2 border-2 border-[#0580A5] px-2 py-1">
                            <User size={22} className="text-[#0580A5]" />
                            <span className="text-[#0580A5] text-xs font-medium max-w-[70px] truncate">
                                {user.name || user.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-[#0580A5] hover:text-red-500 transition-colors cursor-pointer"
                                title="Logout"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex shrink-0 items-center gap-2 border-2 border-[#0580A5]">
                            <Link to="/login" className="p-1 text-[#0580A5] rounded">
                                <LogIn size={25} />
                            </Link>
                            <Link to="/signup" className="p-1 text-[#0580A5] rounded">
                                <UserPlus size={25} />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="search-container bg-[#0891b2] px-4 py-3 sm:bg-white">
                    <div className="flex items-center justify-between gap-2">
                        {/* Search Input - Same as Desktop */}
                        <div className="relative min-w-0 flex-1">
                            <div className="flex min-w-0 items-center overflow-hidden border border-[#0891b2] bg-white">
                                <div className="relative flex min-w-0 flex-1 items-center px-3 py-1">

                                    <input
                                        type="text"
                                        placeholder="Phone | Tabs | Smart Watches"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsSearchModalOpen(true);
                                        }}
                                        onFocus={() => setIsSearchModalOpen(true)}
                                        className="min-w-0 flex-1 pr-6 text-sm outline-none placeholder-[#1E1E1E]"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setIsSearchModalOpen(false);
                                            }}
                                            className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Clear search"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="flex shrink-0 items-center gap-2 border-2 border-[#fff] bg-[#0891b2] px-2 py-1 text-base text-white transition-colors hover:bg-[#0e7490] cursor-pointer sm:px-4"
                                >
                                    <Search size={18} className="text-white scale-x-[-1]" />
                                    <span className="hidden sm:inline">Search</span>
                                </button>
                            </div>

                            {/* Search Modal - Same as Desktop */}
                            {isSearchModalOpen && !isMobileMenuOpen && (
                                <SearchModal
                                    isOpen={isSearchModalOpen}
                                    onClose={() => setIsSearchModalOpen(false)}
                                    searchQuery={searchQuery}
                                />
                            )}
                        </div>

                        {/* Three-dot Menu */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="py-1 px-1 border-2 border-[#fff] text-[#fff] rounded-full"
                                aria-label="mobile-menu"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menus */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearchModalOpen={isSearchModalOpen}
                setIsSearchModalOpen={setIsSearchModalOpen}
                handleSearch={handleSearch}
            />

            {/* Mobile Sidebar Drawer */}
            <MobileSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />
        </header>
    );
};

export default Header;
