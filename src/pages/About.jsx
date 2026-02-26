import React, { useState, useEffect } from 'react';
import aboutBanner from '../assets/aboutBanner.jpg';
import mobileImg from '../assets/mobileImg.jpg';

const About = () => {
    const [pageBanners, setPageBanners] = useState({});

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mobirays.voucherndeals.com';
                const response = await fetch(`${apiBaseUrl}/api/v1/banner?per_page=100`);
                const result = await response.json();
                const allBanners = Array.isArray(result.data) ? result.data : [];
                const map = {};
                ['about_banner_1'].forEach(loc => {
                    const b = allBanners.find(b => b.location === loc);
                    if (b?.image) map[loc] = b.image;
                });
                setPageBanners(map);
            } catch (error) {
                console.error("Error fetching about banners:", error);
            }
        };
        fetchBanners();
    }, []);

    return (
        <div className="w-full">
            {/* About Banner */}
            <div className="relative w-full flex items-end justify-center lg:justify-start mb-2 mt-1">
                {/* Horizontal Line Background */}
                <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                {/* Title Box */}
                <div
                    className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-12 flex items-center justify-center relative z-10"
                    style={{
                        clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                        paddingLeft: "20px",
                        paddingRight: "80px"
                    }}
                >

                    <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">About</h2>
                </div>
            </div>
            {pageBanners['about_banner_1'] && (
                <div className="w-full mb-12">
                    <img src={pageBanners['about_banner_1']} alt="About Mobirays" className="w-full h-[65vh] object-cover object-top" />
                </div>
            )}
            <div className="w-full flex justify-center px-4 md:px-8 mb-4 lg:px-0">
                <div className="text-black leading-relaxed space-y-6 text-[24px]">

                    <p>
                        Mobirays has always been about more than just phones. Our blog is a side project born from the same passion that fuels everything we do — a love for technology, innovation, and the little gadgets that make life exciting.
                    </p>

                    <p>
                        Think of it as our personal space where we share opinions, insights, and discoveries. Whether it’s the latest smartphones, smartwatches, laptops, gaming gear, or even the occasional dive into entertainment and futuristic tech — we cover it not because we have to, but because we genuinely enjoy it.
                    </p>

                    <p>
                        At Mobirays, our curiosity stretches far beyond mobile phones. Naturally, we thought it only makes sense to share that side with you. From breaking news and product launches to reviews, experiments, and random finds, this blog is where we'll put it all down in writing.
                    </p>

                    <p>
                        This also gives us room to talk about the cool stuff that doesn't always fit into the main Mobirays platform. Expect to see reviews of accessories, explorations into new tech trends, and maybe even some behind-the-scenes thoughts from the team.
                    </p>

                    <p>
                        And it won't all be serious. Tech has a fun side too, and we're not afraid to share a meme, a quirk, or a lighthearted take on the industry. If you've followed Mobirays for mobile news, we're sure you'll enjoy this peek into everything else that excites us.
                    </p>

                    <p>
                        That's pretty much it — welcome to the Mobirays blog. Stick around, and let's geek out together.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default About;
