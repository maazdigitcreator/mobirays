import React from 'react';
import { useNavigate } from 'react-router-dom';
import comparisonImg from '../assets/comparisonImg.jpg';

const DeviceComparisonCard = ({ device }) => {
    const navigate = useNavigate();

    if (!device) return null;

    const handleSpecsClick = () => {
        if (device.slug && device.originalData) {
            navigate(`/${device.slug}`, {
                state: {
                    product: device.originalData
                }
            });
        }
    };

    return (
        <div>
            {/* Device Header with Name */}
            <div className="px-4 py-3">
                <h3 className="text-xl text-black ">{device.name}</h3>
            </div>

            {/* Device Content */}
            <div className="p-4">
                {/* Device Image and Specs */}
                <div className=" mb-4 grid gap-1 grid-cols-12">
                    {/* Left: Device Image */}
                    <div className="col-span-6 flex-shrink-0">
                        <img
                            src={device.image}
                            alt={device.name}
                            className="w-full h-auto object-contain"
                        />
                    </div>


                    <div className="flex flex-col gap-1 col-span-6">
                        <button className="w-full bg-[#0580A5] text-white py-2 px-2 text-start text-xs hover:bg-[#046a8a] transition-colors cursor-pointer">
                            REVIEW
                        </button>
                        <button
                            onClick={handleSpecsClick}
                            className="w-full bg-[#EEEEEE] text-[#0580A5] py-2 px-2 text-start text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            SPECIFICATIONS
                        </button>
                        <button className="w-full bg-[#EEEEEE] text-[#0580A5] py-2 px-2 text-start text-xs hover:bg-gray-200 transition-colors cursor-pointer">
                            READ OPINIONS
                        </button>
                    </div>

                    {/* Right: Device Specs */}

                </div>

                {/* Action Buttons */}
                <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="text-sm">
                        <span className=" text-black">{device.storage} {device.ram} RAM</span>
                    </div>

                    <div className="text-sm flex items-center gap-2 justify-between">
                        <span className="font-bold text-[#0580A5]">{device.price}</span>
                        <div className="text-xs text-[#0580A5] uppercase font-bold cursor-pointer">
                            ALL PRICES
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DeviceComparisonCard;
