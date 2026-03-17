import React, { useState } from 'react';
import PageBanner from '../components/PageBanner';
import SidebarBrands from '../components/SidebarSections/SidebarBrands';
import SidebarFilters from '../components/SidebarSections/SidebarFilters';
import SidebarBanner1 from '../components/SidebarSections/SidebarBanner1';
import { contactService } from '../services/contactService';
import contactBanner from '../assets/contactBanner.png';

const Contact = () => {
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const getErrorMessage = (error) => {
        const apiError = error?.data || error;
        if (apiError?.errors) {
            const firstError = Object.values(apiError.errors).flat()[0];
            if (firstError) return firstError;
        }
        return apiError?.message || 'Failed to submit contact form. Please try again.';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
                <PageBanner heading="Contact Us" bannerImage={contactBanner} />

                <div className="space-y-4 px-1 pb-2 pt-1 text-[12px] leading-[1.3] text-black sm:px-2 sm:text-[16px] lg:text-[24px]">
                    <div>
                        <p>We do appreciate your feedback</p>
                        <p>We will be glad to hear from you if:</p>
                    </div>

                    <div className="space-y-0.5">
                        <p>- You have found a mistake in our phone specifications.</p>
                        <p>- You have info about a phone which we don't have in our database.</p>
                        <p>- You have found a broken link.</p>
                        <p>- You have a suggestion for improving MobiCraze.com or you want to request a feature.</p>
                    </div>

                    <div className="space-y-0.5">
                        <p>Before sending us an email, please keep in mind:</p>
                        <p>- We do not sell mobile phones.</p>
                        <p>- We do not know the price of any mobile phone in your country.</p>
                        <p>- We don't answer any "unlocking" related questions.</p>
                        <p>- We don't answer any "Which mobile should I buy?" questions.</p>
                    </div>

                    <p className="font-bold">support@mobicraze.com</p>
                </div>

                <div className="mt-4 bg-[#ECEBED] px-3 py-4 sm:px-5 sm:py-6">
                    <h2 className="mb-3 text-[20px] font-bold text-black sm:text-[26px] lg:text-[32px]">
                        Contact Form
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
                                Name
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
                            <label htmlFor="phone" className="mb-1 block text-[12px] text-black sm:text-[16px] lg:text-[24px]">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="h-[33px] w-full border border-[#9ad3e5] bg-white px-3 outline-none focus:border-[#0580A5] sm:h-[44px] lg:h-[57px]"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="mb-1 block text-[12px] text-black sm:text-[16px] lg:text-[24px]">
                                Your Message
                            </label>
                            <textarea
                                id="content"
                                rows="6"
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                required
                                className="h-[119px] w-full resize-none border border-[#9ad3e5] bg-white px-3 py-2 outline-none focus:border-[#0580A5] sm:h-[180px] lg:h-[286px]"
                            />
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                disabled={status.loading}
                                className="min-w-[82px] bg-[#0580A5] px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#046a8a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed sm:min-w-[120px] sm:text-[16px] lg:min-w-[192px] lg:py-3 lg:text-[26px]"
                            >
                                {status.loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Contact;
