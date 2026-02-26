import React, { useState, useEffect } from 'react'
import Sidebar3 from '../components/Layout/Sidebar3'
import AllBrandsHero from '../components/AllBrandsHero'
import BrandsGrid from '../components/BrandsGrid'
import sidebarBanner2 from '../assets/sidebarBanner2.jpg'
import PageBanner from '../components/PageBanner'
import contactBanner from '../assets/contactBanner.png'
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1'
import SidebarBanner2 from '../components/SidebarSections/SidebarBanner2'
import SidebarIntro from '../components/SidebarSections/SidebarIntro'
import SidebarBrands from '../components/SidebarSections/SidebarBrands'
import SidebarFilters from '../components/SidebarSections/SidebarFilters'
import SidebarStats from '../components/SidebarSections/SidebarStats'

const Login = () => {
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/banner?per_page=100`);
                const result = await response.json();
                const allBanners = Array.isArray(result.data) ? result.data : [];
                const map = {};
                ['signup_banner_1'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b?.image) map[loc] = b.image;
                });
                setPageBanners(map);
            } catch (error) {
                console.error("Error fetching login banners:", error);
            }
        };
        fetchBanners();
    }, []);

    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-2'>
                {/* Sidebar Column */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <div className="flex flex-col gap-2">
                        <SidebarBrands />
                        <SidebarFilters />
                        <SidebarBanner1 />
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="w-full lg:w-3/4">
                    <PageBanner heading="Login" bannerImage={pageBanners['signup_banner_1']} />
                    <div>
                        <div className="w-full flex px-4 pt-5 md:px-8 lg:px-0">
                            <div className="text-black text-[24px] leading-tight space-y-2 px-3">

                                <div className="space-y-2">
                                    <p>Welcome back!</p>
                                </div>

                                <p>Please enter your details to login.</p>

                            </div>
                        </div>

                        <div className="w-full flex mt-8">
                            <div className="w-full bg-[#F0F0F0] p-8">
                                <h2 className="text-[32px] font-bold text-black mb-6">Login</h2>

                                <form className="space-y-6">
                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-black text-[24px] mb-2">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-black text-[24px] mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-[#0580A5] text-white px-12 py-3 text-lg font-semibold hover:bg-[#046a8a] cursor-pointer transition-colors"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
