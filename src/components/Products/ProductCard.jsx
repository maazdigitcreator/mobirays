import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-sm hover:shadow-xl transition-all duration-300 group relative">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {product.isNew && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">New</span>
                )}
                {product.discount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">-{product.discount}%</span>
                )}
            </div>

            {/* Image Area */}
            <div className="relative p-4 h-48 flex items-center justify-center bg-gray-50 overflow-hidden">
                <div className="text-6xl transition-transform duration-500 group-hover:scale-110 opacity-80">
                    📱
                </div>
                {/* Quick Actions Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center space-x-2 translate-y-2 group-hover:translate-y-0">
                    <button className="bg-white shadow text-gray-600 hover:bg-blue-600 hover:text-white p-2 rounded-full transition-colors" title="Add to Wishlist">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                    <button className="bg-white shadow text-gray-600 hover:bg-blue-600 hover:text-white p-2 rounded-full transition-colors" title="Quick View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 text-left">
                <h4 className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Mobiles</h4>
                <h3 className="text-sm font-medium text-gray-800 mb-1 leading-snug group-hover:text-blue-600 line-clamp-2 h-[38px]">
                    <a href="#">{product.name}</a>
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    ))}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-lg font-bold text-gray-900">${product.price}</div>
                        {product.oldPrice > 0 && (
                            <div className="text-xs text-gray-400 line-through">${product.oldPrice}</div>
                        )}
                    </div>
                </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 text-sm font-bold uppercase hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
