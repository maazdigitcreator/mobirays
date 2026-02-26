import React from 'react';

const ComparisonTable = ({ devices }) => {
    if (!devices || devices.length === 0) {
        return (
            <div className="w-full text-center py-10">
                <p className="text-gray-500">No devices selected for comparison</p>
            </div>
        );
    }

    // Always use 3 columns layout
    const getGridCols = "grid grid-cols-3 gap-1";

    // Use the first device's specs to define the table structure
    // If different devices have different spec structures, this might need logic to merge them
    // For now, we assume the first device (or the one initiated from) has the master structure
    const masterDevice = devices[0];
    const groupedSpecs = masterDevice.groupedSpecs || {};
    const categories = Object.keys(groupedSpecs);

    return (
        <div className="w-full mt-6 mb-8">
            {/* Specifications Rows */}
            <div className="w-full flex flex-col gap-1">
                {categories.length > 0 ? (
                    categories.map((category, sectionIndex) => (
                        <div key={sectionIndex} className="flex gap-1">
                            {/* Category Column */}
                            <div className="w-[20%] flex-shrink-0 border-2 border-[#0580A5] flex items-center justify-center">
                                <span className="text-black font-semibold text-base sm:text-xl text-center px-2">
                                    {category}
                                </span>
                            </div>

                            {/* Specs Rows */}
                            <div className="flex-1 flex flex-col gap-1">
                                {groupedSpecs[category].map((specItem, specIndex) => (
                                    <div key={specIndex} className="flex gap-1">
                                        {/* Label Cell */}
                                        <div className="w-[100px] sm:w-[130px] flex-shrink-0 text-black px-2 py-1.5 flex items-center border-2 border-[#0580A5]">
                                            <span className="text-xs sm:text-base font-semibold">{specItem.label}</span>
                                        </div>

                                        {/* Sloped Connector */}
                                        <div className="w-[30px] sm:w-[40px] flex-shrink-0 relative mt-1.5 -mb-1.5">
                                            <div className="border-none flex h-full">
                                                <div
                                                    className="w-full h-full border border-[#0580A5] border-2"
                                                    style={{ transform: 'skewY(14deg)' }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Value Cells for Each Device - Fixed 3 Slots */}
                                        <div className={`flex-1 ${getGridCols}`}>
                                            {[0, 1, 2].map((slotIndex) => {
                                                const device = devices[slotIndex];
                                                let value = "";

                                                if (device && device.groupedSpecs && device.groupedSpecs[category]) {
                                                    // Find the matching spec label in this device's data
                                                    const matchingSpec = device.groupedSpecs[category].find(
                                                        s => s.label === specItem.label
                                                    );
                                                    value = matchingSpec ? matchingSpec.value : "N/A";
                                                } else if (device) {
                                                    value = "N/A";
                                                }

                                                return (
                                                    <div
                                                        key={slotIndex}
                                                        className="flex border-2 border-[#0580A5] px-3 py-0 flex items-center mt-3 h-[100%] w-full"
                                                    >
                                                        <span className="text-black text-xs sm:text-sm">
                                                            {value}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    // Fallback if no groupedSpecs (e.g. mock data or old processing)
                    <div className="w-full text-center py-4">
                        <p className="text-gray-500">No detailed specifications available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonTable;
