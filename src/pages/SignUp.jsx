import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import { useAuth } from '../context/useAuth'

const SignUp = () => {
    const [pageBanners, setPageBanners] = useState({});
    const [form, setForm] = useState({ name: '', email: '', password: '', agreeStoreDetail: false, agreeAge: false });
    const [status, setStatus] = useState({ error: '', success: '', loading: false });

    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', success: '', loading: true });
        try {
            await register(form);
            setStatus({ error: '', success: 'Account created successfully! Redirecting to login...', loading: false });
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            const msg = err?.message || (err?.errors ? Object.values(err.errors).flat().join(' ') : 'Registration failed. Please try again.');
            setStatus({ error: msg, success: '', loading: false });
        }
    };

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
                    if (b) map[loc] = b;
                });
                setPageBanners(map);
            } catch (error) {
                console.error("Error fetching signup banners:", error);
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
                    <PageBanner heading="Sign Up" banner={pageBanners['signup_banner_1']} />
                    <div>
                        <div className="w-full flex pt-5 md:px-8 lg:px-0">
                            <div className="text-black sm:text-[24px] text-base leading-tight space-y-2 px-3">

                                <div className="space-y-2">
                                    <p>Why register</p>
                                </div>

                                <ul className="list-disc space-y-1 pl-10">
                                    <li>Your nickname will be reserved for you only and you will be able to use an avatar</li>
                                    <li>Your comments and opinions will be posted immediately</li>
                                    <li>You will get additional features like reply notification and device bookmarks</li>
                                    <li>We care about protecting your privacy. We won't share your data</li>
                                </ul>

                            </div>
                        </div>

                        <div className="w-full flex mt-8">
                            <div className="w-full bg-[#F0F0F0] p-8">
                                <h2 className="sm:text-[32px] text-[20px] font-bold text-black mb-6">Create account</h2>

                                {status.error && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm">
                                        {status.error}
                                    </div>
                                )}
                                {status.success && (
                                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 text-sm">
                                        {status.success}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-black mb-2 sm:text-[24px] text-base">
                                            Your Nickname
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 sm:py-3 py-2 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-black sm:text-[24px] text-base mb-2">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 sm:py-3 py-2 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-black sm:text-[24px] text-base mb-2">
                                            Password (6 to 20 characters)
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 sm:py-3 py-2 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                            minLength="6"
                                            maxLength="20"
                                        />
                                    </div>

                                    {/* Toggle Buttons */}
                                    <div className="space-y-4">
                                        {/* First Toggle */}
                                        <div className="flex items-center gap-3">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="agreeStoreDetail"
                                                    className="sr-only peer"
                                                    checked={form.agreeStoreDetail}
                                                    onChange={handleChange}
                                                />
                                                <div className="w-11 h-6 bg-[#BEBEBF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0580A5]"></div>
                                            </label>
                                            <span className="sm:text-[20px] text-sm text-black ">
                                                I agree for MobiRays to store my email address, nickname and password
                                            </span>
                                        </div>

                                        {/* Second Toggle */}
                                        <div className="flex items-center gap-3">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="agreeAge"
                                                    className="sr-only peer"
                                                    checked={form.agreeAge}
                                                    onChange={handleChange}
                                                />
                                                <div className="w-11 h-6 bg-[#BEBEBF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0580A5]"></div>
                                            </label>
                                            <span className="sm:text-[20px] text-sm text-black ">
                                                I am at least 16 years old
                                            </span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={status.loading}
                                            className="bg-[#0580A5] text-white px-7 sm:px-12 py-1.5 sm:py-3 text-sm sm:text-lg font-semibold hover:bg-[#046a8a] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {status.loading ? 'Creating account...' : 'Submit'}
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-base text-black">
                                    Already signed up?{" "}
                                    <Link
                                        to="/login"
                                        className="font-semibold text-[#0580A5] hover:text-[#046a8a] underline underline-offset-2"
                                    >
                                        Go to Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
