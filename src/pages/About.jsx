import React from 'react';
import PageBanner from '../components/PageBanner';
import contactBanner from '../assets/contactBanner.png';

const About = () => {
    return (
        <div className="w-full">
            <PageBanner heading="About Us" bannerImage={contactBanner} />

            <div className="space-y-4 px-1 py-3 text-[12px] leading-[1.35] text-black sm:px-2 sm:text-[15px] lg:text-[24px]">
                <p>
                    Mobicraze has always been about more than just phones. Our blog is a side project born from the same passion that fuels everything we do, a love for technology, innovation, and the little gadgets that make life exciting.
                </p>

                <p>
                    Think of it as our personal space where we share opinions, insights, and discoveries. Whether it's the latest smartphones, smartwatches, laptops, gaming gear, or even the occasional dive into entertainment and futuristic tech, we cover it not because we have to, but because we genuinely enjoy it.
                </p>

                <p>
                    At Mobicraze, our curiosity stretches far beyond mobile phones. Naturally, we thought it only makes sense to share that side with you. From breaking news and product launches to reviews, experiments, and random finds, this blog is where we'll put it all down in writing.
                </p>

                <p>
                    This also gives us room to talk about the cool stuff that doesn't always fit into the main Mobicraze platform. Expect to see reviews of accessories, explorations into new tech trends, and maybe even some behind-the-scenes thoughts from the team.
                </p>

                <p>
                    And it won't all be serious. Tech has a fun side too, and we're not afraid to share a meme, a quirk, or a lighthearted take on the industry. If you've followed Mobicraze for mobile news, we're sure you'll enjoy this peek into everything else that excites us.
                </p>

                <p>
                    That's pretty much it, welcome to the Mobicraze blog. Stick around, and let's geek out together.
                </p>
            </div>
        </div>
    );
};

export default About;
