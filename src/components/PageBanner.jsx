import BannerAd from './BannerAd';

const PageBanner = ({ heading, banner }) => {
    return (
        <div className="w-full mb-2">
            {/* Heading Section */}
            <div className="relative w-full flex items-end justify-center lg:justify-start mb-2">
                {/* Horizontal Line Background */}
                <div className="absolute bottom-0 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

                {/* Title Box */}
                <div
                    className="latest-news-clip lg:latest-products-clip bg-[#0580A5] text-white w-fit h-10 sm:h-14 flex items-center justify-center relative z-10"
                    style={{
                        clipPath: "polygon(0% 100%, 0px 0%, calc(100% - 60px) 0%, 100% 100%)",
                        paddingLeft: "20px",
                        paddingRight: "80px"
                    }}
                >
                    <h2 className="sm:text-2xl text-[18px] lg:pl-2 sm:lg:pl-4">{heading}</h2>
                </div>
            </div>

            {/* Banner Ad */}
            <div className="w-full">
                <BannerAd banner={banner} className="h-[65vh]" />
            </div>
        </div>
    );
};

export default PageBanner;
