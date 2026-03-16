import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import { useAuth } from '../context/useAuth';
import contactBanner from '../assets/contactBanner.png';

const SignUp = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', agreeStoreDetail: false, agreeAge: false });
    const [status, setStatus] = useState({ error: '', success: '', loading: false });

    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ error: '', success: '', loading: true });

        try {
            await register(form);
            setStatus({ error: '', success: 'Account created successfully! Redirecting to login...', loading: false });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            const message = error?.message || (error?.errors ? Object.values(error.errors).flat().join(' ') : 'Registration failed. Please try again.');
            setStatus({ error: message, success: '', loading: false });
        }
    };

    return (
        <div className="grid gap-2 lg:grid-cols-[401px_minmax(0,1fr)] lg:items-start">
            <aside className="hidden lg:block">
                <div className="flex flex-col gap-2">
                    <SidebarBrands />
                    <SidebarFilters />
                    <SidebarBanner1 />
                </div>
            </aside>

            <section className="min-w-0">
                <PageBanner heading="Sign Up" bannerImage={contactBanner} />

                <div className="space-y-3 px-1 py-3 text-[12px] leading-[1.3] text-black sm:px-2 sm:text-[15px] lg:text-[24px]">
                    <p>Why register</p>
                    <div className="space-y-0.5">
                        <p>- Your nickname will be reserved for you only and you will be able to use an avatar</p>
                        <p>- Your comments and opinions will be posted immediately</p>
                        <p>- You will get additional features like reply notification and device bookmarks</p>
                        <p>- We care about protecting your privacy. We won't share your data</p>
                    </div>
                </div>

                <div className="mt-4 bg-[#ECEBED] px-3 py-4 sm:px-5 sm:py-6">
                    <h2 className="mb-3 text-[20px] font-bold text-black sm:text-[26px] lg:text-[32px]">
                        Create account
                    </h2>

                    {status.error && (
                        <div className="mb-4 border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                            {status.error}
                        </div>
                    )}

                    {status.success && (
                        <div className="mb-4 border border-green-300 bg-green-100 px-3 py-2 text-sm text-green-700">
                            {status.success}
                        </div>
                    )}

                    <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="mb-1 block text-[12px] text-black sm:text-[16px] lg:text-[24px]">
                                Your Nickname
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="h-[33px] w-full border border-[#9ad3e5] bg-white px-3 outline-none focus:border-[#0580A5] sm:h-[44px] lg:h-[57px]"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-1 block text-[12px] text-black sm:text-[16px] lg:text-[24px]">
                                Your Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="h-[33px] w-full border border-[#9ad3e5] bg-white px-3 outline-none focus:border-[#0580A5] sm:h-[44px] lg:h-[57px]"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1 block text-[12px] text-black sm:text-[16px] lg:text-[24px]">
                                Password (6 to 20 characters)
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                maxLength="20"
                                className="h-[33px] w-full border border-[#9ad3e5] bg-white px-3 outline-none focus:border-[#0580A5] sm:h-[44px] lg:h-[57px]"
                            />
                        </div>

                        <div className="space-y-2 pt-1">
                            <label className="flex items-center gap-2 text-[9px] text-black sm:text-[12px] lg:text-[20px]">
                                <input
                                    type="checkbox"
                                    name="agreeStoreDetail"
                                    checked={form.agreeStoreDetail}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-[#0580A5] lg:h-5 lg:w-5"
                                />
                                <span>I agree for MobiCraze to store my email address, nickname and password</span>
                            </label>

                            <label className="flex items-center gap-2 text-[9px] text-black sm:text-[12px] lg:text-[20px]">
                                <input
                                    type="checkbox"
                                    name="agreeAge"
                                    checked={form.agreeAge}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-[#0580A5] lg:h-5 lg:w-5"
                                />
                                <span>I am at least 16 years old</span>
                            </label>
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                disabled={status.loading}
                                className="min-w-[82px] bg-[#0580A5] px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#046a8a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed sm:min-w-[120px] sm:text-[16px] lg:min-w-[192px] lg:py-3 lg:text-[26px]"
                            >
                                {status.loading ? 'Creating...' : 'Submit'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-[12px] text-black sm:text-[14px] lg:text-base">
                        Already signed up?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-[#0580A5] underline underline-offset-2 hover:text-[#046a8a]"
                        >
                            Go to Sign In
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default SignUp;
