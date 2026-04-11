import React from 'react';
import { useNavigate } from 'react-router-dom';
import comparisonImg from '../assets/comparisonImg.jpg';

const DeviceComparisonCard = ({ device }) => {
    const navigate = useNavigate();

    if (!device) return null;

    const handleSpecsClick = () => {
        if (device.id && device.slug && device.originalData) {
            navigate(`/product/${device.id}/${device.slug}`, {
                state: {
                    product: device.originalData
                }
            });
        }
    };

    const handleOpinionsClick = () => {
        if (device.id && device.slug && device.originalData) {
            navigate(`/product/${device.id}/${device.slug}`, {
                state: {
                    product: device.originalData,
                    scrollTo: 'comments'
                }
            });
        }
    };


    return (
        <div>
            {/* Device Header with Name */}
            <div className="px-0  sm:px-4 py-0 sm:py-3">
                <h3 className="text-base sm:text-xl text-black ">{device.name}</h3>
            </div>

            {/* Device Content */}
            <div className="p-1 sm:p-4">
                {/* Device Image and Specs */}
                <div className=" mb-4 grid gap-1 grid-cols-12 w-full">
                    {/* Left: Device Image */}
                    <div className="col-span-6 flex-shrink-0">
                        <img
                            src={device.image}
                            alt={device.name}
                            className="w-full h-auto object-contain"
                        />
                    </div>


                    <div className="flex flex-col gap-1 col-span-6">
                        <button
                            onClick={handleOpinionsClick}
                            className="w-full bg-[#0580A5] text-white py-1 sm:py-2 px-2 text-start text-[8px] sm:text-xs hover:bg-[#046a8a] transition-colors cursor-pointer "
                        >
                            REVIEW
                        </button>
                        <button
                            onClick={handleSpecsClick}
                            className="w-full bg-[#EEEEEE] text-[#0580A5] py-1 sm:py-2 px-2 text-start text-[8px] sm:text-xs hover:bg-gray-200 transition-colors cursor-pointer "
                        >
                            SPECIFICATIONS
                        </button>
                        <button
                            onClick={handleOpinionsClick}
                            className="w-full bg-[#EEEEEE] text-[#0580A5] py-1 sm:py-2 px-2 text-start text-[8px] sm:text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            READ OPINIONS
                        </button>
                    </div>

                    {/* Right: Device Specs */}

                </div>

                {/* Action Buttons */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="text-[10px] sm:text-sm">
                        <span className=" text-black">{device.storage} {device.ram} RAM</span>
                    </div>

                    <div className="text-sm flex items-center gap-2 justify-between">
                        <span className="font-bold text-xs sm:text-sm text-[#0580A5]">{device.price}</span>
                        <div 
                            onClick={() => {
                                document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-[10px] sm:text-xs text-[#0580A5] uppercase font-bold cursor-pointer hover:text-[#046a8a] transition-colors"
                        >
                            ALL PRICES
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DeviceComparisonCard;
