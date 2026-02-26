import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Liked Products', path: '/liked-products' },
        { name: 'Reviewed Products', path: '/reviewed-products' },
    ];

    return (
        <div className='col-span-3 bg-[#0580A8] min-h-screen'>
            <ul className='flex flex-col gap-2 text-white font-medium items-center py-4 px-2'>
                {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link to={item.path} key={item.path} className={`w-full text-center py-3 transition-all duration-300 ease-in-out cursor-pointer ${isActive
                                ? 'bg-white text-[#0580A8]'
                                : 'hover:bg-white hover:text-[#0580A8]'
                            }`}>
                            <li>{item.name}</li>
                        </Link>
                    );
                })}
            </ul>
        </div>
    );
};

export default DashboardSidebar;
