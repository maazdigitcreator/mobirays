import React from 'react';

const Hero = () => {
    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 h-[400px]">
            {/* Main Slider */}
            <div className="lg:col-span-3 bg-gray-100 rounded-md relative overflow-hidden group">
                {/* Placeholder Image/Content */}
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://placehold.co/800x400/2563eb/ffffff?text=New+Arrivals)' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center pl-12">
                        <div className="text-white max-w-md">
                            <span className="bg-orange-500 text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase">New Collection</span>
                            <h2 className="text-5xl font-bold mb-4 leading-tight">iPhone 14 Pro <br />Max Series</h2>
                            <h4 className="text-lg mb-6 opacity-90">Experience the dynamic island and 48MP camera.</h4>
                            <button className="bg-white text-blue-900 px-8 py-3 rounded font-bold hover:bg-blue-50 transition-colors shadow-lg">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Banners */}
            <div className="hidden lg:flex flex-col gap-4 h-full">
                <div className="flex-1 bg-gray-100 rounded-md relative overflow-hidden flex items-center p-6 bg-blue-50">
                    <div className="z-10 relative">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Super Sale</h4>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Watches</h3>
                        <a href="#" className="text-blue-600 text-xs font-bold hover:underline">Shop Now</a>
                    </div>
                    <div className="absolute right-2 bottom-2 text-6xl opacity-20">⌚</div>
                </div>

                <div className="flex-1 bg-gray-100 rounded-md relative overflow-hidden flex items-center p-6 bg-orange-50">
                    <div className="z-10 relative">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">New Season</h4>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Headphones</h3>
                        <a href="#" className="text-orange-600 text-xs font-bold hover:underline">Shop Now</a>
                    </div>
                    <div className="absolute right-2 bottom-2 text-6xl opacity-20">🎧</div>
                </div>

                <div className="flex-1 bg-gray-100 rounded-md relative overflow-hidden flex items-center p-6 bg-green-50">
                    <div className="z-10 relative">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-1">Best Seller</h4>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Laptops</h3>
                        <a href="#" className="text-green-600 text-xs font-bold hover:underline">Shop Now</a>
                    </div>
                    <div className="absolute right-2 bottom-2 text-6xl opacity-20">💻</div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
