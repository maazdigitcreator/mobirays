import { NavLink } from 'react-router-dom';

const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Phones', to: '/phones' },
    { label: 'Tabs', to: '/tablets' },
    { label: 'Smartwatches', to: '/smartwatches' },
    { label: 'Reviews', to: '/reviews' },
    { label: 'News', to: '/news' },
    { label: 'Discovery', to: '/dictionary' },
    { label: 'Videos', to: '/videos' },
    { label: 'ADV. Search', to: '/advanced-search' },
    { label: 'Coming Soon', to: '/coming-soon' },
    { label: 'Misc', to: '/whats-new' },
    { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
    return (
        <nav className="hidden bg-[#0580A5] text-white lg:block">
            <div className="mx-auto max-w-[1440px] px-4">
                <ul className="flex min-h-[67px] items-center justify-between gap-2 text-[13px]">
                    {navItems.map((item) => (
                        <li key={item.label} className="flex h-full items-center">
                            <NavLink
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    [
                                        'flex min-h-[49px] items-center justify-center px-2 text-center transition-colors',
                                        item.label === 'Home' ? 'min-w-[116px]' : '',
                                        isActive ? 'bg-[#03708F] text-white' : 'text-white hover:text-[#d9f3fb]',
                                    ].join(' ')
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
