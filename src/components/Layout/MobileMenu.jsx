import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../assets/Logo.png';

const MobileMenu = ({
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    isSearchModalOpen,
    setIsSearchModalOpen,
    handleSearch
}) => {
    const menuRef = useRef(null);
    const location = useLocation();

    // Handle click outside to close
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (menuRef.current && !menuRef.current.contains(event.target)) {
    //             onClose();
    //         }
    //     };

    //     if (isOpen) {
    //         document.addEventListener('click', handleClickOutside);
    //         document.body.style.overflow = 'hidden'; // Prevent background scroll
    //     }

    //     return () => {
    //         document.removeEventListener('click', handleClickOutside);
    //         document.body.style.overflow = 'unset';
    //         setIsSearchModalOpen(false); // Close search modal when menu closes
    //     };
    // }, [isOpen, onClose, setIsSearchModalOpen]);

    if (!isOpen) return null;

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Phones', path: '/phones' },
        { name: 'Tabs', path: '/tablets' },
        { name: 'Smartwatches', path: '/smartwatches' },
        { name: 'All Brands', path: '/all-brands' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'News', path: '/news' },
        { name: 'Discovery', path: '/dictionary' },
        { name: 'Videos', path: '/videos' },
        { name: 'Compare', path: '/comparison' },
        { name: 'ADV. Search', path: '/advanced-search' },
        { name: 'Coming Soon', path: '/coming-soon' },
        { name: 'Misc', path: '/whats-new' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-[#00000087] z-[60] transition-opacity duration-300 opacity-100 starting:opacity-0" />

            {/* Sidebar Drawer from Right */}
            <div
                ref={menuRef}
                className="fixed top-0 right-0 h-full w-full max-w-[70%] bg-white z-[70] overflow-y-auto shadow-2xl transition-transform duration-300 translate-x-0 starting:translate-x-full"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                    <img src={Logo} alt="mobirays" className="h-7" />
                    <button
                        onClick={onClose}
                        className="bg-[#0580A5] text-white p-1 rounded-full hover:bg-[#0e7490] transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search Bar Area */}


                {/* <div className="px-4 py-4 search-container">
                    <div className="relative">
                        <div className="flex items-center border border-[#0891b2] rounded overflow-hidden">
                            <div className="flex items-center px-2 py-2 flex-1">
                                <Search size={18} className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Realme"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setIsSearchModalOpen(true);
                                    }}
                                    onFocus={(e) => {
                                        setIsSearchModalOpen(true);
                                        e.stopPropagation();
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="flex-1 outline-none text-sm"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-2 py-2 bg-[#0891b2] hover:bg-[#0e7490] text-white text-sm font-medium transition-colors"
                            >
                                Search
                            </button>
                        </div>

                  
                        {isSearchModalOpen && (
                            <SearchModal
                                isOpen={isSearchModalOpen}
                                onClose={() => setIsSearchModalOpen(false)}
                                searchQuery={searchQuery}
                            />
                        )}
                    </div>
                </div> */}

                {/* Navigation Items */}
                <nav className="flex flex-col">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                [
                                    'flex items-center justify-between border-b border-gray-100 px-4 py-4 text-sm transition-colors',
                                    isActive ? 'bg-[#0580A5] font-semibold text-white' : 'text-black hover:bg-gray-50',
                                ].join(' ')
                            }
                        >
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;
