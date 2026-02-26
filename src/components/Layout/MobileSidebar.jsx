import React, { useEffect, useRef } from 'react';

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

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('#mobile-sidebar-toggle')) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
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
