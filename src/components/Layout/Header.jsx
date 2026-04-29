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
    MoreVertical,
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
            <div className="hidden md:block">
                <div className="mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex-shrink-1">
                            <Link to="/" className="flex items-baseline">
                                <img className="w-64 xl:w-100" src={Logo} alt="mobirays" />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="search-container relative flex items-center w-full md:w-auto flex-1 md:flex-initial max-w-md">
                            <div className="flex items-center w-full border border-[#0891b2] border-2 overflow-hidden">
                                <div className="flex items-center px-3 w-72 py-2 flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Phone | Tabs | Smart Watches"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsSearchModalOpen(true);
                                        }}
                                        onFocus={() => setIsSearchModalOpen(true)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 outline-none text-sm placeholder-[#1E1E1E] pr-6"
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
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] hover:bg-[#0e7490] text-white text-base transition-colors cursor-pointer"
                                >
                                    <Search size={18} className="scale-x-[-1] text-white" />
                                    Search
                                </button>
                            </div>

                            {/* Search Modal - Positioned below search bar */}
                            {isSearchModalOpen && !isMobileMenuOpen && (
                                <SearchModal
                                    isOpen={isSearchModalOpen}
                                    onClose={(clear = false) => {
                                        setIsSearchModalOpen(false);
                                        if (clear) setSearchQuery("");
                                    }}
                                    searchQuery={searchQuery}
                                />
                            )}
                        </div>

                        <div>
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
                        <div className="flex items-center gap-1">
                            <a href="#" className="p-2 bg-[#fff] border-2 border-[#0580A5] text-[#0580A5]">
                                <Facebook size={25} />
                            </a>
                            <a href="#" className="p-2 bg-[#fff] border-2 border-[#0580A5] text-[#0580A5]">
                                <Twitter size={25} />
                            </a>
                            <a href="#" className="p-2 bg-[#fff] border-2 border-[#0580A5] text-[#0580A5]">
                                <Instagram size={25} />
                            </a>
                            <a href="#" className="p-2 bg-[#fff] border-2 border-[#0580A5] text-[#0580A5]">
                                <Youtube size={25} />
                            </a>
                            <a href="#" className="p-2 bg-[#fff] border-2 border-[#0580A5] text-[#0580A5]">
                                <Rss size={25} />
                            </a>
                            {user ? (
                                <div className="ml-2 flex items-center gap-3 p-2 bg-[#fff] border-2 border-[#0580A5]">
                                    <User size={22} className="text-[#0580A5]" />
                                    <Link className="text-[#0580A5] text-sm font-medium max-w-[100px] truncate" to="/wishlist">
                                        Dashboard
                                    </Link>
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
            <div className="md:hidden">
                {/* Top Row: Hamburger | Logo | Login/Account */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 relative z-[60] bg-white">
                    {/* Hamburger Menu */}
                    <button
                        id="mobile-sidebar-toggle"
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        className="p-0 text-[#087FA5] hover:text-gray-900"
                    >
                        <Menu size={28} />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex-1 flex justify-center">
                        <img src={Logo} alt="mobirays" className="h-8" />
                    </Link>

                    {/* Login/Account Icons */}
                    {user ? (
                        <div className="flex items-center gap-2 border-2 border-[#0580A5] px-2 py-1">
                            <User size={22} className="text-[#0580A5]" />
                            <Link className="text-[#0580A5] text-xs font-medium max-w-[70px] truncate" to="/wishlist">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-[#0580A5] hover:text-red-500 transition-colors cursor-pointer"
                                title="Logout"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 border-2 border-[#0580A5]">
                            <Link to="/login" className="p-1 text-[#0580A5] rounded">
                                <LogIn size={25} />
                            </Link>
                            <Link to="/signup" className="p-1 text-[#0580A5] rounded">
                                <UserPlus size={25} />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="px-4 py-3 sm:bg-white search-container bg-[#0891b2] max-w-100vw">
                    <div className="flex gap-2 sm:gap-4 items-center justify-between">
                        {/* Search Input - Same as Desktop */}
                        <div className="relative flex-1">
                            <div className="flex items-center border bg-white border-[#0891b2] overflow-hidden sm:w-full">
                                <div className="flex items-center px-3 py-1 flex-1 relative">

                                    <input
                                        type="text"
                                        placeholder="Phone | Tabs | Smart Watches"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsSearchModalOpen(true);
                                        }}
                                        onFocus={() => setIsSearchModalOpen(true)}
                                        className="flex-1 outline-none text-sm placeholder-[#1E1E1E]"
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
                                    className="flex gap-2 sm:px-4 cursor-pointer px-2 border-2  border-[#fff] py-1 bg-[#0891b2] hover:bg-[#0e7490] text-white  text-base items-center transition-colors"
                                >
                                    <Search size={18} className="text-white scale-x-[-1]" />

                                </button>
                            </div>

                            {/* Search Modal - Same as Desktop */}
                            {isSearchModalOpen && !isMobileMenuOpen && (
                                <SearchModal
                                    isOpen={isSearchModalOpen}
                                    onClose={(clear = false) => {
                                        setIsSearchModalOpen(false);
                                        if (clear) setSearchQuery("");
                                    }}
                                    searchQuery={searchQuery}
                                />
                            )}
                        </div>

                        {/* Three-dot Menu */}
                        <div className="relative pr-2">
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
