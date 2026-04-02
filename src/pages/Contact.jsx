import React, { useState, useEffect } from 'react'
import PageBanner from '../components/PageBanner'
import SidebarBrands from '../components/SidebarSections/SidebarBrands'
import SidebarFilters from '../components/SidebarSections/SidebarFilters'
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1'
import { contactService } from '../services/contactService'

const Contact = () => {
    const [pageBanners, setPageBanners] = useState({});
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        content: '',
    });
    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const getErrorMessage = (error) => {
        const apiError = error?.data || error;
        if (apiError?.errors) {
            const firstError = Object.values(apiError.errors).flat()[0];
            if (firstError) return firstError;
        }
        return apiError?.message || 'Failed to submit contact form. Please try again.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        try {
            await contactService.store(form);
            setStatus({
                loading: false,
                error: '',
                success: 'Thanks for contacting us. We received your message.',
            });
            setForm({
                name: '',
                email: '',
                phone: '',
                content: '',
            });
        } catch (error) {
            setStatus({
                loading: false,
                error: getErrorMessage(error),
                success: '',
            });
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
                ['contactus_banner_1'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b) map[loc] = b;
                });
                setPageBanners(map);
            } catch (error) {
                console.error("Error fetching contact banners:", error);
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
                    <PageBanner heading="Contact Us" banner={pageBanners['contactus_banner_1']} />
                    <div>
                        <div className="w-full flex justify-center px-4 md:px-8 lg:px-0">
                            <div className="text-black text-[24px] leading-tight space-y-2 px-3">

                                <div className="space-y-2">
                                    <p>We do appreciate your feedback</p>
                                    <p>We will be glad to hear from you if:</p>
                                </div>

                                <ul className="space-y-1 pl-4">
                                    <li>- You have found a mistake in our phone specifications.</li>
                                    <li>- You have info about a phone which we don't have in our database.</li>
                                    <li>- You have found a broken link.</li>
                                    <li>- You have a suggestion for improving mobirays.com or you want to request a feature.</li>
                                </ul>

                                <div className="space-y-2 mt-10">
                                    <p>Before sending us an email, please keep in mind:</p>
                                </div>

                                <ul className="space-y-1 pl-4">
                                    <li>- We do not sell mobile phones.</li>
                                    <li>- We do not know the price of any mobile phone in your country.</li>
                                    <li>- We don't answer any "unlocking" related questions.</li>
                                    <li>- We don't answer any "Which mobile should I buy?" questions.</li>
                                </ul>

                                <p className="font-bold text-black pt-4">
                                    support@mobirays.com
                                </p>

                            </div>
                        </div>

                        <div className="w-full flex mt-8">
                            <div className="w-full bg-[#F0F0F0] p-8">
                                <h2 className="text-[32px] font-bold text-black mb-6">Contact Form</h2>

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
                                        <label className="block text-black mb-2 text-[24px]">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                        />
                                    </div>

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

                                    {/* Phone Number Field */}
                                    <div>
                                        <label className="block text-black text-[24px]  mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5]"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div>
                                        <label className="block text-black mb-2 text-[24px]">
                                            Your Message
                                        </label>
                                        <textarea
                                            rows="6"
                                            name="content"
                                            value={form.content}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-1 border-[#0580A5] bg-white focus:outline-none focus:border-[#0580A5] resize-none"
                                            placeholder=""
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={status.loading}
                                            className="bg-[#0580A5] text-white px-12 py-3 text-lg font-semibold hover:bg-[#046a8a] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {status.loading ? 'Submitting...' : 'Submit'}
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

export default Contact
