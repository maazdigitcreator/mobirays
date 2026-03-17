import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom'

const BrandsGrid = () => {
    const { allBrands, loading: dataLoading } = useData();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!dataLoading) {
            setBrands(allBrands);
            setLoading(false);
        }
    }, [allBrands, dataLoading]);

    if (loading) {
        return <div className="text-center py-10">Loading brands...</div>;
    }

    return (
        <div className="mt-3 w-full">
            <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:grid-cols-4">
                {brands.map((brand) => {
                    const brandSlug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-');

                    return (
                        <Link
                            key={brand.id}
                            to={`/brand/${brandSlug}`}
                            className="flex min-h-[72px] items-center justify-center border-2 border-[#0580A5] bg-white px-3 py-4 transition-all hover:opacity-90 sm:min-h-[96px] sm:px-4 sm:py-5"
                        >
                            {brand.image ? (
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    className="max-h-[38px] w-auto max-w-full object-contain sm:max-h-[56px]"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span className={`${brand.image ? 'hidden' : 'block'} text-center text-[12px] font-semibold text-gray-700 sm:text-base`}>
                                {brand.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BrandsGrid;
