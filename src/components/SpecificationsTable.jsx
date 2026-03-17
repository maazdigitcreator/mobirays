import React, { useMemo } from 'react';

const SpecificationsTable = ({ productData }) => {
    const specifications = useMemo(() => {
        const moreSpecs = Array.isArray(productData?.more_specifications) ? productData.more_specifications : [];

        const groupedSpecs = moreSpecs.reduce((accumulator, spec) => {
            const attribute = spec.attribute || 'General';
            if (!accumulator[attribute]) {
                accumulator[attribute] = [];
            }
            accumulator[attribute].push({
                label: spec.value,
                value: spec.description,
            });
            return accumulator;
        }, {});

        const sections = Object.entries(groupedSpecs).map(([category, specs]) => ({
            category,
            specs,
        }));

        if (productData?.price) {
            const priceSpecs = [];
            if (productData.price.usd) priceSpecs.push({ label: 'USA', value: `Official Price: $${productData.price.usd}` });
            if (productData.price.eu) priceSpecs.push({ label: 'EU', value: `Official Price: EUR ${productData.price.eu}` });
            if (productData.price.inr) priceSpecs.push({ label: 'INR', value: `Official Price: INR ${productData.price.inr}` });
            if (productData.price.pkr) priceSpecs.push({ label: 'PKR', value: `Official Price: PKR ${productData.price.pkr}` });

            if (priceSpecs.length > 0) {
                sections.push({
                    category: 'Price',
                    specs: priceSpecs,
                });
            }
        }

        return sections;
    }, [productData?.more_specifications, productData?.price]);

    if (specifications.length === 0) {
        return (
            <div className="w-full">
                <div className="relative mb-0 w-full overflow-hidden">
                    <div className="flex h-10 items-center justify-between sm:h-14">
                        <div className="absolute -bottom-1 left-0 h-[10px] w-full bg-[#0580A5] sm:h-[16px]" />
                        <div className="relative flex w-full items-end">
                            <div className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-14">
                                <h1 className="pl-2 text-[12px] leading-none sm:pl-4 sm:text-[26px]">
                                    {productData?.name || 'Product'} Specifications
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-10 text-center text-gray-500">No specifications available</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="relative mb-0 w-full overflow-hidden">
                <div className="flex h-10 items-center justify-between sm:h-14">
                    <div className="absolute -bottom-1 left-0 h-[10px] w-full bg-[#0580A5] sm:h-[16px]" />
                    <div className="relative flex w-full items-end">
                        <div className="latest-products-clip relative z-10 flex h-10 w-fit items-center bg-[#0580A5] text-white sm:h-14">
                            <h1 className="pl-2 text-[12px] leading-none sm:pl-4 sm:text-[26px]">
                                {productData?.name || 'Product'} Specifications
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1 pt-2">
                {specifications.map((section) => (
                    <div key={section.category} className="grid grid-cols-[78px_minmax(0,1fr)] gap-1 sm:grid-cols-[120px_minmax(0,1fr)]">
                        <div className="flex items-center justify-center border border-[#0580A5] bg-[#E7F4F8] px-2 py-3">
                            <span className="text-center text-[10px] font-semibold uppercase text-black sm:text-[16px]">
                                {section.category}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            {section.specs.map((spec, specIndex) => (
                                <div key={`${section.category}-${spec.label}-${specIndex}`} className="grid grid-cols-[82px_18px_minmax(0,1fr)] gap-1 sm:grid-cols-[128px_28px_minmax(0,1fr)]">
                                    <div className="flex items-center border border-[#0580A5] px-2 py-2 text-[10px] font-semibold text-black sm:text-[14px]">
                                        {spec.label}
                                    </div>
                                    <div className="relative overflow-hidden">
                                        <div
                                            className="h-full w-full border border-[#0580A5] bg-white"
                                            style={{ transform: 'skewY(14deg)' }}
                                        />
                                    </div>
                                    <div className="flex items-center border border-[#0580A5] px-2 py-2 text-[10px] leading-[1.35] text-black sm:text-[14px]">
                                        {spec.value}
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
