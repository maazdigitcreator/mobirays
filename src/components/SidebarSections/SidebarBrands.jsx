import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mobileBrandLogo from '../../assets/mobileBrandLogo.webp';
import { useData } from '../../context/DataContext';

const SidebarBrands = () => {
    const { allBrands } = useData();

    // Use cached brands data, limit to 16
    const brands = allBrands.slice(0, 16);

    return (
        <div className="text-center overflow-hidden">
            <div className="bg-[#0580A5] text-white px-4 py-3 text-2xl text-start">
                Search by Brands
            </div>
            <div className="p-0 mt-3 mb-3">
                <div className="grid grid-cols-4 sm:gap-[10px] gap-1">
                    {brands.map((brand, idx) => {
                        // Use slug from API or generate one
                        const brandSlug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-');

                        return (
                            <Link
                                key={brand.id || idx}
                                to={`/brand/${brandSlug}`}
                                className="bg-white hover:bg-[#0580A533] transition-colors duration-300 ease-in-out aspect-square flex items-center justify-center p-1 hover:shadow-inner cursor-pointer border border-[#0580A5]"
                            >
                                {brand.image ? (
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="w-full h-full object-contain p-3"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                ) : null}
                                <span className={`${brand.image ? 'hidden' : 'block'} text-center text-[10px] font-bold text-gray-700 break-all`}>
                                    {brand.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className="mt-5">
                <Link to="/all-brands" className="w-full text-[#0580A5] rounded-full py-1 text-sm font-medium transition-colors relative flex items-center justify-center">
                    <span className="bg-white border-2 rounded-full border-[#0580A5] px-10 py-2 z-10 hover:cursor-pointer">Show All Brands</span>
                    <div className="absolute w-full h-[2px] bg-[#0580A5] top-1/2 left-0 -z-0"></div>
                </Link>
            </div>
        </div>
    );
};

export default SidebarBrands;
