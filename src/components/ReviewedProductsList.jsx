import React from 'react';
import { Edit, Search, Trash2 } from 'lucide-react';
import MobileImg from '../assets/mobileImg.jpg';
import Pagination from './Pagination';
import { useReviewedProducts } from '../hooks/useReviewedProducts';

const sectionTitleClassName = 'relative inline-flex h-7 items-center bg-[#0580A5] pl-3 pr-7 text-[11px] text-white sm:h-10 sm:pl-4 sm:pr-9 sm:text-base';

const ReviewedProductsList = ({ title = 'Reviewed Products', products, itemImage }) => {
    const {
        status,
        totalPages,
        currentPage,
        searchQuery,
        currentReviews,
        setCurrentPage,
        handleSearchChange,
    } = useReviewedProducts(products);

    return (
        <div className="w-full">
            <div className="relative mb-2 w-full overflow-hidden">
                <div className="absolute bottom-0 left-0 h-[8px] w-full bg-[#0580A5] sm:h-[10px]" />
                <div
                    className={sectionTitleClassName}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)' }}
                >
                    <h2>{title}</h2>
                </div>
            </div>

            <div className="mb-4 flex w-full items-stretch border border-[#0580A5]">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="min-w-0 flex-1 px-2 py-1 text-[11px] text-black outline-none placeholder:text-[#6f6f6f] sm:px-3 sm:py-2 sm:text-sm"
                />
                <button
                    type="button"
                    className="flex w-8 items-center justify-center border-l border-[#0580A5] bg-white text-[#0580A5] sm:w-10"
                    aria-label="Search reviewed products"
                >
                    <Search size={16} />
                </button>
            </div>

            {status.error && (
                <div className="mb-4 border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
                    {status.error}
                </div>
            )}

            {status.loading ? (
                <div className="py-10 text-center text-sm text-gray-500">Loading reviewed products...</div>
            ) : currentReviews.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">
                    {searchQuery ? `No reviewed products found for "${searchQuery}".` : 'No reviewed products found.'}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {currentReviews.map((review) => (
                        <div key={review.id} className="grid grid-cols-[78px_minmax(0,1fr)] gap-2 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-4">
                            <div className="flex min-w-0 flex-col items-center">
                                <div className="flex h-[92px] w-[68px] items-center justify-center overflow-hidden bg-white p-1 sm:h-[136px] sm:w-[108px]">
                                    <img
                                        src={review.productImage || itemImage || MobileImg}
                                        alt={review.productName}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <p className="mt-2 w-[68px] line-clamp-2 text-left text-[10px] uppercase leading-[1.3] text-[#3a3a3a] sm:w-[108px] sm:text-[12px]">
                                    {review.productName}
                                </p>
                            </div>

                            <div className="min-w-0 border border-[#b8b8b8] bg-white px-2 py-2 sm:px-4 sm:py-3">
                                <div className="mb-1 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="line-clamp-1 text-[11px] font-medium text-black sm:text-[20px]">
                                            {review.title}
                                        </h3>
                                        <p className="mt-1 text-[9px] text-[#525252] sm:text-[12px]">
                                            {review.author}
                                        </p>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <div className="text-[10px] leading-none text-[#ffb400] sm:text-[14px]">
                                            {'★'.repeat(Math.max(0, Math.min(5, review.rating || 0)))}
                                            {'☆'.repeat(Math.max(0, 5 - Math.min(5, review.rating || 0)))}
                                        </div>
                                        <p className="mt-1 text-[8px] text-[#6f6f6f] sm:text-[11px]">{review.date}</p>
                                    </div>
                                </div>

                                <p className="line-clamp-4 text-[9px] leading-[1.4] text-[#363636] sm:text-[12px]">
                                    {review.reviewText}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] text-[#0580A5] sm:text-[12px]">
                                    <button type="button" className="flex items-center gap-1 font-medium">
                                        <Edit size={12} />
                                        Edit Review
                                    </button>
                                    <button type="button" className="flex items-center gap-1 font-medium">
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default ReviewedProductsList;
