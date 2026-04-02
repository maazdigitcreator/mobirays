const DashboardReviewPlaceholder = ({ title, description }) => {
  return (
    <div className="w-full container">
      <div className="relative w-full mb-9 overflow-hidden">
        <div className="w-full h-10 sm:h-14 flex items-center justify-between">
          <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>

          <div className="relative w-full flex items-end">
            <div className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-10 flex items-center relative z-10">
              <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-[#0580A5] bg-[#F8FCFD] px-6 py-8 text-black">
        <p className="text-lg font-semibold">Coming Soon</p>
        <p className="mt-3 text-base leading-relaxed">{description}</p>
        <p className="mt-4 text-sm text-gray-600">
          This section is currently in progress.
        </p>
      </div>
    </div>
  );
};

export default DashboardReviewPlaceholder;
