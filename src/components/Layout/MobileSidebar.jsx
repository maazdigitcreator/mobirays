import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import SidebarIntro from '../SidebarSections/SidebarIntro';
import SidebarBrands from '../SidebarSections/SidebarBrands';
import SidebarFilters from '../SidebarSections/SidebarFilters';
import SidebarStats from '../SidebarSections/SidebarStats';
import SidebarLatestModels from '../SidebarSections/SidebarLatestModels';
import SidebarBanner1 from '../SidebarSections/SidebarBanner1';
import SidebarBanner2 from '../SidebarSections/SidebarBanner2';
import SidebarBanner3 from '../SidebarSections/SidebarBanner3';

const MobileSidebar = ({ isOpen, onClose }) => {
    const sidebarRef = useRef(null);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [location.pathname, location.search]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('#mobile-sidebar-toggle')) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent background scroll - save scroll position and lock body
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 top-[57px] bg-[#00000087] z-40 transition-opacity duration-300 opacity-100 starting:opacity-0" />

            <div
                ref={sidebarRef}
                className="fixed top-[57px] left-0 h-[calc(100vh-57px)] w-full max-w-[70%] bg-white z-50 overflow-y-auto shadow-2xl transition-transform duration-300 translate-x-0 starting:-translate-x-full"
            >
                {/* Complete Sidebar Content */}
                <div className="p-4">
                    <div className="flex flex-col gap-2">
                        <SidebarIntro />
                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                        <div className="flex flex-col gap-6">
                            <SidebarStats />
                            <SidebarBanner2 />
                            <SidebarLatestModels />
                            <SidebarBanner3 />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileSidebar;
