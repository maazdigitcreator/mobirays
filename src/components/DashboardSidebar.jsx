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
        <aside className="w-full overflow-hidden bg-[#0580A5] text-white lg:min-h-[540px]">
            <nav className="flex flex-col gap-3 px-4 py-3">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path;

                    return (
                        <Link
                            to={item.path}
                            key={item.path}
                            className={[
                                'block border px-4 py-3 text-center text-[18px] leading-none transition-colors',
                                isActive
                                    ? 'border-white bg-white font-medium text-[#0580A5]'
                                    : 'border-transparent bg-transparent text-white hover:border-white/65 hover:bg-white hover:text-[#0580A5]',
                            ].join(' ')}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default DashboardSidebar;
