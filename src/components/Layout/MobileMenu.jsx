import React, { useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import { useData } from '../../context/useData';
import { createSlug } from '../../utils/urlHelper';

const MobileMenu = ({
    isOpen,
    onClose,
}) => {
    const menuRef = useRef(null);
    const location = useLocation();
    const [miscOpen, setMiscOpen] = React.useState(false);
    const { dynamicPages } = useData();

    if (!isOpen) return null;

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Phones', path: '/phones' },
        { name: 'Tabs', path: '/tablets' },
        { name: 'Smartwatches', path: '/smartwatches' },
        { name: 'Reviews', path: '/reviews' },
        { name: 'News', path: '/news' },
        { name: 'Videos', path: '/videos' },
        { name: 'Adv. Search', path: '/advanced-search' },
        { name: 'Coming Soon', path: '/coming-soon' },
        {
            name: 'Misc',
            path: null,
            hasDropdown: true,
            subItems: [
                { name: 'Dictionary', path: '/dictionary' },
                { name: "What's New", path: '/whats-new' },
                { name: 'About', path: '/about' },
                ...(dynamicPages?.map(page => ({ name: page.name, path: `/p/${createSlug(page.name)}` })) || []),
            ],
        },
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

                {/* Navigation Items */}
                <nav className="flex flex-col">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;

                        if (item.hasDropdown) {
                            return (
                                <div key={index}>
                                    {/* Misc Toggle Button */}
                                    <button
                                        onClick={() => setMiscOpen(!miscOpen)}
                                        className="w-full flex items-center justify-between px-4 py-4 text-sm border-b border-gray-100 text-black hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <span>{item.name}</span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-[#0580A5] transition-transform duration-200 ${miscOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {/* Sub Items Accordion */}
                                    {miscOpen && (
                                        <div className="bg-gray-50 border-b border-gray-100">
                                            {item.subItems.map((sub, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    to={sub.path}
                                                    onClick={onClose}
                                                    className={`flex items-center px-8 py-3 text-sm border-b border-gray-100 transition-colors ${
                                                        location.pathname === sub.path
                                                            ? 'text-[#0580A5] font-semibold'
                                                            : 'text-black hover:text-[#0580A5] hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0580A5] mr-3 flex-shrink-0"></span>
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center justify-between px-4 py-4 text-sm border-b border-gray-100 transition-colors ${
                                    isActive
                                        ? 'text-[#0580A5] font-semibold bg-blue-50'
                                        : 'text-black hover:bg-gray-50'
                                }`}
                            >
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;
