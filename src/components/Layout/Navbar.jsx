import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/useData';
import { createSlug } from '../../utils/urlHelper';

const Navbar = () => {
    const { dynamicPages } = useData();

    return (
        <nav className="hidden md:block bg-[#0580A5] text-white shadow-md py-0 font-medium">
            <div className="container mx-auto px-4 flex justify-between w-full">
                <ul className="flex w-full items-center mx-auto justify-between text-md font-medium">
                    <li><Link to="/" className="px-5 py-4 ">Home</Link></li>
                    <li><Link to="/phones" className="px-5 py-4 ">Phones</Link></li>
                    <li><Link to="/tablets" className="px-5 py-4 ">Tabs</Link></li>
                    <li><Link to="/smartwatches" className="px-5 py-4 ">Smartwatches</Link></li>
                    <li><Link to="/reviews" className="px-5 py-4 ">Reviews</Link></li>
                    <li><Link to="/news" className="px-5 py-4 ">News</Link></li>
                    <li><Link to="/videos" className="px-5 py-4 ">Videos</Link></li>
                    <li><Link to="/advanced-search" className="px-5 py-4 ">ADV. Search</Link></li>
                    <li><Link to="/coming-soon" className="px-5 py-4">Coming Soon</Link></li>
                    <li className="relative group">
                        <button className="flex items-center px-5 py-4 cursor-pointer focus:outline-none">
                            Misc <ChevronDown size={14} className="ml-1" />
                        </button>
                        {/* Dropdown Menu */}
                        <ul className="absolute left-[-80px] top-14 mt-0 w-64 bg-white border border-[#0891b2] rounded-none shadow-lg opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50 p-0">
                            <li><Link to="/dictionary" className="block px-6 py-4 text-xl font-bold text-black hover:bg-gray-300">Dictionary</Link></li>
                            <li><Link to="/whats-new" className="block px-6 py-4 text-xl font-bold text-black hover:bg-gray-300">What's New</Link></li>
                            <li><Link to="/about" className="block px-6 py-4 text-xl font-bold text-black hover:bg-gray-300">About</Link></li>
                            {dynamicPages?.map((page) => (
                                <li key={page.id}>
                                    <Link to={`/p/${createSlug(page.name)}`} className="block px-6 py-4 text-xl font-bold text-black hover:bg-gray-300">
                                        {page.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li><Link to="/contact" className="px-5 py-4">Contact</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
