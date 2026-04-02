import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
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

const Login = () => {
    const [pageBanners, setPageBanners] = useState({});
    const [form, setForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ error: '', loading: false });

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || '/wishlist';

    useEffect(() => {
        if (user) navigate(redirectPath, { replace: true });
    }, [user, navigate, redirectPath]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ error: '', loading: true });
        try {
            await login(form.email, form.password);
            navigate(redirectPath, { replace: true });
        } catch (err) {
            setStatus({ error: err?.message || 'Invalid email or password. Please try again.', loading: false });
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
                    <PageBanner heading="Login" banner={pageBanners['signup_banner_1']} />
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

                                {status.error && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm">
                                        {status.error}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-black text-[24px] mb-2">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
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
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={status.loading}
                                            className="bg-[#0580A5] text-white px-12 py-3 text-lg font-semibold hover:bg-[#046a8a] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {status.loading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-base text-black">
                                    No account yet? No worries.{" "}
                                    <Link
                                        to="/signup"
                                        className="font-semibold text-[#0580A5] hover:text-[#046a8a] underline underline-offset-2"
                                    >
                                        Go to Sign Up
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

export default Login
