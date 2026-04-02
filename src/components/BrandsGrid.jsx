import { useState, useEffect } from 'react'
import { useData } from '../context/useData';
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
        <div className="w-full mt-3">
            {/* Brands Grid - 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {brands.map((brand) => {
                    const brandSlug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-');

                    return (
                        <Link
                            key={brand.id}
                            to={`/brand/${brandSlug}`}
                            className="border border-2 p-4 flex items-center justify-center border-[#0580A5] hover:shadow-lg transition-all cursor-pointer bg-white h-56"
                        >
                            {brand.image ? (
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span className={`${brand.image ? 'hidden' : 'block'} text-center font-bold text-gray-700`}>
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
