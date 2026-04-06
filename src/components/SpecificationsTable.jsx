import React from 'react'
import specsTableHeading from '../assets/specsTableHead.png'

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


const SpecificationsTable = ({ productData }) => {
    // Get more_specifications from API
    const moreSpecs = productData?.more_specifications || [];

    // Group specifications by attribute (Build, Frequency, Processor, etc.)
    const groupedSpecs = moreSpecs.reduce((acc, spec) => {
        const attribute = spec.attribute;
        if (!acc[attribute]) {
            acc[attribute] = [];
        }
        acc[attribute].push({
            label: spec.value,
            value: spec.description
        });
        return acc;
    }, {});

    // Convert to array format for rendering
    const specifications = Object.keys(groupedSpecs).map(category => ({
        category: category,
        specs: groupedSpecs[category]
    }));

    // Add Price section from productData.price if available
    if (productData?.price) {
        const p = productData.price;
        const priceSpecs = [];
        if (p.usd) priceSpecs.push({ label: 'USA', value: `Official Price: $${p.usd}` });
        if (p.eu) priceSpecs.push({ label: 'EU', value: `Official Price: €${p.eu}` });
        if (p.inr) priceSpecs.push({ label: 'Indian', value: `Official Price: ₹${p.inr}` });
        if (p.pkr) priceSpecs.push({ label: 'PKR', value: `Official Price: Rs. ${p.pkr}` });
        if (p.taka) priceSpecs.push({ label: 'BD', value: `Official Price: ৳${p.taka}` });

        if (priceSpecs.length > 0) {
            specifications.push({
                category: 'Price',
                specs: priceSpecs
            });
        }
    }

    // If no specifications available, show fallback message
    if (specifications.length === 0) {
        return (
            <div className="w-full">
                <div className="relative w-full mb-0 overflow-hidden">
                    <div className="w-full h-auto sm:h-14 flex items-center justify-between">
                        <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>
                        <div className="relative w-full flex items-end">
                            <div className="latest-products-clip bg-[#0580A5] text-white w-fit flex items-center relative z-10">
                                <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">
                                    {productData?.name || "Product"} Specifications
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full pt-2 text-center py-10">
                    <p className="text-gray-500">No specifications available</p>
                </div>
            </div>
        );
    }



    return (
        <div className="w-full">
            {/* Header */}
            <div className="relative w-full mb-0 overflow-hidden">
                <div className="w-full h-auto sm:h-14 flex items-center justify-between">
                    <div className="absolute -bottom-1 left-0 w-full h-[10px] sm:h-[16px] bg-[#0580A5]"></div>
                    <div className="relative w-full flex items-end">

                        <div className="latest-products-clip bg-[#0580A5] text-white w-fit sm:h-14 h-auto flex items-center relative z-10">
                            <h1 className="sm:text-[26px] text-[18px] pl-2 sm:pl-4">
                                {productData?.name || "Samsung Galaxy Note 20"} Specifications
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications Table */}
            <div className="w-full pt-2 flex flex-col gap-1">
                {specifications.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="flex gap-1">
                        {/* Category Column - Left side (spans all rows) */}
                        <div className="w-[20%] flex-shrink-0  border-2 border-[#0580A5] flex items-center justify-center overflow-hidden">
                            <span className="text-black font-semibold text-sm sm:text-xl text-center px-1 break-words w-full block" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>
                                {formatText(section.category)}
                            </span>
                        </div>

                        {/* Right Side - Contains all spec rows */}
                        <div className="flex-1 flex flex-col gap-1">
                            {section.specs.map((spec, specIndex) => (
                                <div
                                    key={specIndex}
                                    className="flex gap-1 relative"
                                >
                                    {/* Label Cell - White background with border */}
                                    <div className="w-[100px] sm:w-[130px] flex-shrink-0 text-black px-2 py-1.5 flex items-center border-2 border-[#0580A5] overflow-hidden">
                                        <span className="text-xs sm:text-lg font-semibold break-words w-full block" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>{formatText(spec.label)}</span>
                                    </div>

                                    {/* Sloped Connector - Diagonal line connecting label to value */}
                                    <div className="w-[30px] sm:w-[40px] flex-shrink-0 relative mt-1.5 -mb-1.5">
                                        {/* Diagonal border line from top-left to bottom-right */}



                                        <div className="border-none flex  h-full ">

                                            <div
                                                className="w-full h-full border border-[#0580A5] border-2"
                                                style={{
                                                    transform: 'skewY(14deg)'
                                                }}
                                            >
                                                <div
                                                    className="p-4 text-white"
                                                    style={{
                                                        transform: 'skewY(14deg)'
                                                    }}
                                                >

                                                </div>
                                            </div>

                                        </div>



                                    </div>

                                    {/* Value Cell - White background */}
                                    <div className="flex border border-2 border-[#0580A5] px-3 py-0 flex items-center mt-3 h-[100%] w-[100%] left-44.5 overflow-hidden">
                                        <span className="text-black text-xs sm:text-base font-medium break-words w-full block" style={{ hyphens: 'manual', wordWrap: 'break-word' }}>{formatText(spec.value)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecificationsTable;
