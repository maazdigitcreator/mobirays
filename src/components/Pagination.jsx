import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxVisible = isMobile ? 3 : 9;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    // Logic to show a subset of pages if there are many
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible);

    if (endPage - startPage < maxVisible && totalPages > maxVisible) {
        startPage = Math.max(1, endPage - maxVisible);
    }

    const visiblePages = pages.slice(startPage - 1, endPage);

    return (
        <div className="w-full sm:w-fit m-auto mt-10 p-1 border border-2 border-[#0580A5] bg-white overflow-hidden">
            <div className="flex gap-4 sm:gap-20 items-center justify-between px-2 sm:px-3 py-1">
                <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
                    <span className="text-[#333] font-medium text-base sm:text-lg mr-1 sm:mr-2 flex-shrink-0">Pages:</span>
                    <div className="flex gap-1 sm:gap-1.5 overflow-hidden">
                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white text-base sm:text-lg font-bold transition-colors cursor-pointer flex-shrink-0 ${currentPage === page
                                    ? 'bg-[#4B4B4B]'
                                    : 'bg-[#0084A9] hover:bg-[#007090]'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white transition-colors cursor-pointer ${currentPage === 1
                            ? 'bg-[#B4D1D8] cursor-not-allowed'
                            : 'bg-[#0084A9] hover:bg-[#007090]'
                            }`}
                    >
                        <ChevronLeft size={isMobile ? 20 : 28} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white transition-colors cursor-pointer ${currentPage === totalPages
                            ? 'bg-[#B4D1D8] cursor-not-allowed'
                            : 'bg-[#0084A9] hover:bg-[#007090]'
                            }`}
                    >
                        <ChevronRight size={isMobile ? 20 : 28} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
