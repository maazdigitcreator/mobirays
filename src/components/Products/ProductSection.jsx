import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ title, products }) => {
    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-gray-800 uppercase border-b-2 border-blue-600 -mb-[9px] pb-2 inline-block">
                    {title}
                </h2>
                <a href="#" className="text-sm text-blue-600 hover:underline">View All</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductSection;
