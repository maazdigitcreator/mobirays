import React from 'react';
import aboutBanner from '../assets/aboutBanner.jpg';

const TermsAndConditions = () => {
    return (
        <div className="w-full">
            {/* Terms Banner */}
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

                    <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">Terms and Conditions</h2>
                </div>
            </div>
            <div className="w-full mb-12">
                <img src={aboutBanner} alt="Terms and Conditions" className="w-full h-[250px] sm:h-[65vh] object-cover object-top" />
            </div>
            <div className="w-full flex justify-center px-4 md:px-8 mb-4 lg:px-0">
                <div className="text-black leading-relaxed space-y-6 sm:text-[24px] text-base">

                    <p>
                        Welcome to Mobirays. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>

                    <p className="font-bold">
                        1. Use of Website
                    </p>

                    <p>
                        The content of the pages of this website is for your general information and use only. It is subject to change without notice. This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, personal information may be stored by us for use by third parties.
                    </p>

                    <p className="font-bold">
                        2. Intellectual Property
                    </p>

                    <p>
                        This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                    </p>

                    <p className="font-bold">
                        3. User Content
                    </p>

                    <p>
                        Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense. From time to time, this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s).
                    </p>

                    <p className="font-bold">
                        4. Limitation of Liability
                    </p>

                    <p>
                        Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
                    </p>

                    <p className="font-bold">
                        5. Changes to Terms
                    </p>

                    <p>
                        We reserve the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the site. Your decision to continue to visit and make use of the site after such changes have been made constitutes your formal acceptance of the new Terms and Conditions.
                    </p>

                    <p>
                        If you have any questions about these Terms and Conditions, please contact us at support@mobirays.com
                    </p>

                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
