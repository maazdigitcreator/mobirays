import React from 'react';
import useMetadata from '../hooks/useMetadata';
import aboutBanner from '../assets/aboutBanner.jpg';

const PrivacyPolicy = () => {
    useMetadata(
        "Privacy Policy | Mobirays",
        "Read the privacy policy for the Mobirays platform."
    );
    return (
        <div className="w-full">
            {/* Privacy Policy Banner */}
            <div className="relative w-full flex items-end justify-start lg:justify-start mb-2 mt-1">
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

                    <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">Privacy Policy</h2>
                </div>
            </div>
            <div className="w-full mb-12">
                <img src={aboutBanner} alt="Privacy Policy" className="w-full h-[250px] sm:h-[65vh] object-cover object-top" />
            </div>
            <div className="w-full flex justify-center px-4 md:px-8 mb-4 lg:px-0">
                <div className="text-black leading-relaxed space-y-6 sm:text-[24px] text-base">

                    <p>
                        At Mobirays, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>

                    <p className="font-bold">
                        1. Information We Collect
                    </p>

                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes personal data, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.
                    </p>

                    <p className="font-bold">
                        2. Use of Your Information
                    </p>

                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to create and manage your account, email you regarding your account or order, fulfill and manage purchases, orders, payments, and other transactions related to the Site.
                    </p>

                    <p className="font-bold">
                        3. Disclosure of Your Information
                    </p>

                    <p>
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows: by law or to protect rights, if we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
                    </p>

                    <p className="font-bold">
                        4. Security of Your Information
                    </p>

                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                    </p>

                    <p className="font-bold">
                        5. Cookies and Tracking Technologies
                    </p>

                    <p>
                        We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.
                    </p>

                    <p className="font-bold">
                        6. Changes to This Privacy Policy
                    </p>

                    <p>
                        We may update this Privacy Policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>

                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at support@mobirays.com
                    </p>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
