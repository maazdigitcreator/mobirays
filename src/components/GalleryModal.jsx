import React, { useState } from 'react';

const GalleryModal = ({ isOpen, onClose, images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isOpen) return null;

    const handleNext = () => {
        if (images && images.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }
    };

    const handlePrev = () => {
        if (images && images.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl p-4 sm:p-6 h-[70vh] sm:h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b-2 border-[#0580A5] pb-3 bg-white z-10 shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-lg sm:text-2xl font-bold text-[#0580A5] uppercase">
                            {productName} Gallery
                        </h2>
                        {images && images.length > 0 && (
                            <span className="text-xs sm:text-sm text-gray-500 font-medium">
                                Image {currentIndex + 1} of {images.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-[#0580A5] transition-colors p-2 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Content (Slider) */}
                <div className="flex-1 relative flex items-center justify-center min-h-0 overflow-hidden">
                    {images && images.length > 0 ? (
                        <>
                            {/* Previous Button */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 z-20 bg-[#0580A5]/10 hover:bg-[#0580A5] text-[#0580A5] hover:text-white p-2 sm:p-3 rounded-full transition-all cursor-pointer group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Image Display */}
                            <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 overflow-hidden">
                                <div className="w-full h-full max-w-[90%] max-h-[90%] flex items-center justify-center bg-white/50 rounded-xl">
                                    <img
                                        src={images[currentIndex]}
                                        alt={`${productName} - ${currentIndex + 1}`}
                                        className="w-full h-full object-contain transition-all duration-500 transform scale-95 hover:scale-100"
                                    />
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={handleNext}
                                className="absolute right-2 z-20 bg-[#0580A5]/10 hover:bg-[#0580A5] text-[#0580A5] hover:text-white p-2 sm:p-3 rounded-full transition-all cursor-pointer group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-20 text-gray-400 text-lg italic">
                            No gallery images available.
                        </div>
                    )}
                </div>

                {/* Indicators */}
                {images && images.length > 1 && (
                    <div className="mt-4 flex justify-center gap-2 shrink-0">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all cursor-pointer ${index === currentIndex ? 'bg-[#0580A5] w-6 sm:w-8' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryModal;
