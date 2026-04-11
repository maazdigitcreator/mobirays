import React, { useState, useEffect } from 'react';

// Helper to format text so long words break with a visible dash at line end
// Uses \u00AD soft-hyphen (renders as "-" only at break point)
const formatText = (text) => {
    if (typeof text !== 'string') return text;
    // Insert soft hyphen every 5 chars inside long words to help with breaking
    return text.split(' ').map(word => {
        if (word.length > 5) {
            let out = '';
            for (let i = 0; i < word.length; i++) {
                out += word[i];
                // Insert soft hyphen after every 5th char (not at last char)
                if ((i + 1) % 5 === 0 && i + 1 < word.length) {
                    out += '\u00AD';
                }
            }
            return out;
        }
        return word;
    }).join(' ');
};


const ComparisonTable = ({ devices }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    if (!devices || devices.length === 0) {
        return (
            <div className="w-full text-center py-10">
                <p className="text-gray-500">No devices selected for comparison</p>
            </div>
        );
    }

    // Responsive columns layout
    const getGridCols = "grid grid-cols-2 lg:grid-cols-3 gap-1";

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
                    <>
                        {categories.map((category, sectionIndex) => (
                            <div key={sectionIndex} className="flex gap-1">
                                {/* Category Column */}
                                <div className="w-[20%] flex-shrink-0 border-2 border-[#0580A5] flex items-center justify-center overflow-hidden">
                                    <span className="text-black font-semibold text-xs sm:text-xl text-center px-1 w-full block break-words" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>
                                        {formatText(category)}
                                    </span>
                                </div>

                                {/* Specs Rows */}
                                <div className="flex-1 flex flex-col gap-1">
                                    {groupedSpecs[category].map((specItem, specIndex) => (
                                        <div key={specIndex} className="flex gap-1">
                                            {/* Label Cell */}
                                            <div className="w-[100px] sm:w-[130px] flex-shrink-0 text-black px-1 sm:px-2 py-1.5 flex items-center border-2 border-[#0580A5] overflow-hidden">
                                                <span className="text-xs sm:text-base font-semibold w-full block break-words" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>{formatText(specItem.label)}</span>
                                            </div>

                                            {/* Sloped Connector */}
                                            <div className="w-[20px] sm:w-[40px] flex-shrink-0 relative mt-1.5 -mb-1.5">
                                                <div className="border-none flex h-full">
                                                    <div
                                                        className="w-full h-full border border-[#0580A5] border-2"
                                                        style={{ transform: `skewY(${isMobile ? '28deg' : '16deg'})` }}
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
                                                            className={`border-2 border-[#0580A5] px-1 sm:px-3 py-0 flex items-center mt-3 h-[100%] w-full overflow-hidden ${slotIndex === 2 ? 'hidden lg:flex' : 'flex'}`}
                                                        >
                                                            <span className="text-black text-xs sm:text-sm w-full block break-words" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>
                                                                {formatText(value)}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Pricing Rows */}
                        <div id="pricing-section" className="flex gap-1 mt-1">
                            {/* Category Column */}
                            <div className="w-[20%] flex-shrink-0 border-2 border-[#0580A5] flex items-center justify-center overflow-hidden">
                                <span className="text-black font-semibold text-xs sm:text-xl text-center px-1 w-full block break-words" style={{ hyphens: 'auto', wordWrap: 'break-word' }}>
                                    Price
                                </span>
                            </div>

                            {/* Specs Rows */}
                            <div className="flex-1 flex flex-col gap-1">
                                {[
                                    { label: 'USA', key: 'usd', prefix: '$' },
                                    { label: 'EU', key: 'eu', prefix: '€' },
                                    { label: 'Indian', key: 'inr', prefix: '₹' },
                                    { label: 'PKR', key: 'pkr', prefix: 'Rs. ' },
                                    { label: 'BD', key: 'taka', prefix: '৳' }
                                ].map((currency, currencyIdx) => (
                                    <div key={currencyIdx} className="flex gap-1">
                                        {/* Label Cell */}
                                        <div className="w-[100px] sm:w-[130px] flex-shrink-0 text-black px-1 sm:px-2 py-1.5 flex items-center border-2 border-[#0580A5] overflow-hidden">
                                            <span className="text-xs sm:text-base font-semibold w-full block break-words" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>{formatText(currency.label)}</span>
                                        </div>

                                        {/* Sloped Connector */}
                                        <div className="w-[20px] sm:w-[40px] flex-shrink-0 relative mt-1.5 -mb-1.5">
                                            <div className="border-none flex h-full">
                                                <div
                                                    className="w-full h-full border border-[#0580A5] border-2"
                                                    style={{ transform: `skewY(${isMobile ? '28deg' : '16deg'})` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Value Cells for Each Device */}
                                        <div className={`flex-1 ${getGridCols}`}>
                                            {[0, 1, 2].map((slotIndex) => {
                                                const device = devices[slotIndex];
                                                let value = "";
                                                if (device && device.originalData && device.originalData.price && device.originalData.price[currency.key]) {
                                                    value = `Official Price: ${currency.prefix}${device.originalData.price[currency.key]}`;
                                                } else if (device) {
                                                    value = "N/A";
                                                }

                                                return (
                                                    <div
                                                        key={slotIndex}
                                                        className={`border-2 border-[#0580A5] px-1 sm:px-3 py-0 flex items-center mt-3 h-[100%] w-full overflow-hidden ${slotIndex === 2 ? 'hidden lg:flex' : 'flex'}`}
                                                    >
                                                        <span className="text-black text-xs sm:text-sm w-full block break-words" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>
                                                            {formatText(value)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
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
